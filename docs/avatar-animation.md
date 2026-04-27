# Avatar bi-state + bi-theme — guía técnica

La pieza más visible y delicada del sitio: dos avatares (verde y fuego) que se intercambian cinematográficamente y arrastran consigo el tema cromático de **toda** la página. Este documento explica cómo funciona por dentro, por qué cada decisión está donde está, y dónde tocar si algo necesita afinarse.

## TL;DR

- **Dos estados perpetuos**: `green-idle` (rayos verde lima radiales) y `fire-idle` (jets de fuego verticales).
- **Una intro al cargar**: avatar de fuego emerge → flashpoint → avatar verde queda fijo. ~4.85s.
- **Toggle por hover/click**: alterna entre los dos estados. ~1.2s. El **theme global** salta sincronizado con el flashpoint del toggle.
- **Theme = CSS variables sobre `[data-theme]`** — todos los componentes del sitio heredan el cambio sin tocar JSX.

## Componentes implicados

| Archivo | Rol |
|---|---|
| [src/components/AvatarHero.tsx](../src/components/AvatarHero.tsx) | Máquina de estados, timeline, swap de tema, handlers de interacción. |
| [src/components/ParticleCanvas.tsx](../src/components/ParticleCanvas.tsx) | Render de partículas (canvas 2D), dos paletas: `fire` y `embers`. |
| [src/index.css](../src/index.css) | Variables CSS de paleta por tema, transición global de color, utilidades visuales (`bg-grid`, `glow-accent`, etc.). |
| [tailwind.config.js](../tailwind.config.js) | Mapea `bg-accent`, `text-accent-soft`, etc. a `rgb(var(--color-accent) / <alpha-value>)` para que respondan al theme. |
| [index.html](../index.html) | Inline script que fija `data-theme="green"` antes del primer paint (sin flicker). |
| `public/avatars/avatar-{fire,green}.jpeg` | Las dos imágenes. Se sirven con URL estable para preload + OG image. |

## Máquina de estados

Tres modos lógicos:

```
┌──────────────┐  hover/tap  ┌─────────────────┐
│  green-idle  │ ──────────▶ │  transitioning  │ ──────▶ fire-idle
│              │ ◀────────── │  (~1.2s)        │
└──────────────┘  hover/tap  └─────────────────┘  ◀── (mount)
                                                       intro (~4.85s)
                                                       arranca aquí
```

- **`currentTargetRef`** (ref, no state): apunta al destino de la última transición. Al terminar `playTransition("green", ...)` queda en `"green"`. Sirve para que el handler de interacción sepa hacia dónde toggle.
- **`isPlaying`** (closure local del `useEffect`): bloquea reentradas. Si llega un hover durante una transición, se ignora.
- **`setPhase`** (useState): controla el glow base detrás del avatar (cambia de color en flashpoint).
- **`setPalette`** (useState): controla qué paleta de partículas renderiza el `ParticleCanvas`.

### El intro NO swappea tema

Diseño intencional: el tema arranca en **verde** y se queda en verde durante todo el intro. El avatar de fuego visible sobre página verde es un contraste deliberado que añade dramatismo — la página "espera" al avatar para abrazarlo cuando emerge.

El swap sólo ocurre en los **toggles posteriores** (en realidad la línea `dataset.theme = to` se ejecuta también en el flashpoint del intro, pero como `to === "green"` y la página ya está en verde, es idempotente).

## Timeline detallado

### Intro (`isInitial: true`) — total ~4.85s

| t (s) | Qué pasa |
|---|---|
| **0.0** | Ambos avatares parten invisibles. Flash overlay suave (0.5s) enmascara el primer paint. Avatar de fuego empieza fade-in: `opacity 0→1`, `scale 0.94→1`, `blur(8px)→0` durante 1s. Palette → `fire`, intensity target → 0.7. |
| 0.0–3.0 | Fuego visible, ardiendo en idle alto. Las partículas suben verticalmente (palette `fire`). |
| **3.0** | Ramp-up: intensity target → 1.0 (más partículas, más rápidas), `scale 1→1.05` durante 0.75s. |
| **3.75** | **Flashpoint**: flash overlay (radial blanco/naranja) durante 0.35s, fuego sale con `opacity→0, scale→1.12, blur→8px`. `setPhase("flashpoint")`. `data-theme="green"` (no-op aquí). |
| **3.85** | Verde emerge: `opacity 0→1, scale 0.95→1, blur(8px)→0` durante 0.9s. Palette → `embers`, intensity target → 0.7. |
| **4.75** | Settle: intensity target → 0.55 (idle estable verde). |
| **4.85** | `isPlaying = false` — disponible para toggle. |

### Toggle (`isInitial: false`) — total ~1.2s

| t (s) | Qué pasa |
|---|---|
| **0.0** | Ramp-up del avatar saliente: intensity target → 1, `scale 1→1.05` durante 0.5s. |
| **0.5** | **Flashpoint**: flash overlay 0.2s + saliente `opacity→0, scale→1.12, blur→8px`. `setPhase("flashpoint")`. **`data-theme = to`** — esto dispara la transición CSS de color global de 500ms en toda la página. |
| **0.6** | Entrante emerge: `opacity 0→1, scale 0.95→1, blur(8px)→0` durante 0.5s. Palette y phase → del nuevo estado, intensity target → 0.7. |
| **1.1** | Settle: intensity target → 0.55 (verde) o 0.5 (fuego). |
| **1.2** | `isPlaying = false`. |

**Sincronización clave**: el flashpoint del toggle (t=500ms) dispara `data-theme = to`. Como el CSS tiene `transition: background-color 500ms ease-out` global, los colores acaban su tween a t=1000ms — justo antes (100ms) de que el avatar entrante termine de emerger. Sensación de "todo concluye junto".

## Sistema de partículas

[ParticleCanvas.tsx](../src/components/ParticleCanvas.tsx) renderiza un pool fijo de **260 partículas** sobre canvas 2D. Una sola instancia compartida; cambia su comportamiento mediante una `palette` y un `intensityRef`.

### `intensityRef` — control fluido de "fuerza"

- Es un `MutableRefObject<number>` compartido entre `AvatarHero` y `ParticleCanvas`.
- `AvatarHero` setea un `target` discreto (0.7, 1.0, 0.55, etc.) y un RAF independiente lo interpola hacia ese target con factor 0.06 por frame (≈ tween exponencial suave).
- `ParticleCanvas` lee el ref cada frame: el número de partículas vivas es `Math.floor(POOL_SIZE * intensity)`. Las que sobran se "matan" rápido (vida -=4 por frame).
- Resultado: subir/bajar `target` se nota como un crecer/decrecer orgánico de las partículas, sin saltos.

### Paletas

| Palette | Spawn | Velocidad | Vida | Hue | Sensación |
|---|---|---|---|---|---|
| `fire` | Aro al 0.36 del canvas | `vx≈0`, `vy=-(0.6..2.0)` (vertical hacia arriba) + turbulencia sin | 50–100 frames | 8–46 (rojo→amarillo) | Jets de llama verticales, vida corta, agresivos. |
| `embers` | Aro al 0.36 del canvas | `vx,vy` radiales hacia afuera + sesgo vertical (-0.18) | 90–170 frames | 80–115 (lima→verde) | Rayos de energía radiales, vida larga, ondulan ligeramente. |

Los dos comportamientos son **distintos a propósito**: el contraste fuego/verde no es solo cromático, es **dinámico**. El fuego tira hacia arriba, el verde se expande en todas las direcciones. Le da personalidad diferente a cada estado.

### Compositing

- `ctx.globalCompositeOperation = "lighter"` → las partículas son aditivas. Al solaparse intensifican la luz. Esto produce el "glow" sin necesidad de blur.
- Color: `hsla(hue, 100%, lightness, alpha)` con `lightness` y `alpha` proporcionales al tiempo de vida restante. Las partículas nacen brillantes y se apagan suavemente.

### Canvas extendido

El canvas se renderiza con `-inset-[10%] h-[120%] w-[120%]` — 20% más grande que el avatar. Así los rayos verdes y las llamas pueden extenderse visualmente más allá del aro del avatar antes de fundirse con el fondo. El radio de spawn (`0.36 * canvas`) compensa: spawnea cerca del aro de energía del **artwork**, no en el extremo del canvas.

### `IntersectionObserver` — pause cuando no se ve

Si el usuario hace scroll y el avatar sale del viewport, el RAF se cancela. Vuelve a iniciarse cuando reaparece. Cero CPU desperdiciada cuando estás leyendo About o Tracks.

## Sistema de temas

### Variables CSS

[src/index.css](../src/index.css) define dos sets paralelos:

```css
:root {
  /* Default (green) */
  --color-accent: 163 230 53;        /* lime — primary */
  --color-accent-soft: 190 242 100;
  --color-accent-glow: 132 204 22;
  --color-accent-fire: 249 115 22;   /* orange — complement */
  --color-accent-fire-glow: 239 68 68;
}

:root[data-theme="fire"] {
  /* Inversión: el complemento pasa a primary */
  --color-accent: 249 115 22;
  --color-accent-soft: 251 146 60;
  --color-accent-glow: 239 68 68;
  --color-accent-fire: 163 230 53;
  --color-accent-fire-glow: 132 204 22;
}
```

**Formato `R G B` (sin paréntesis ni comas)**: requerido por Tailwind para que `bg-accent/20` funcione. Tailwind compone `rgb(var(--color-accent) / 0.2)` y necesita que la variable sea sólo el triplete.

**Lógica primary + complement**: cada tema declara *ambas* paletas. La que está como `--color-accent` es la dominante; la que está como `--color-accent-fire` es la del *otro* estado (usada por ejemplo para el botón secundario "Follow on SoundCloud" en [Hero.tsx](../src/components/Hero.tsx), que siempre se pinta del color complementario para añadir contraste). Al cambiar de tema, la paleta dominante se invierte.

### Tailwind con vars

[tailwind.config.js](../tailwind.config.js):

```js
accent: {
  DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
  soft: "rgb(var(--color-accent-soft) / <alpha-value>)",
  glow: "rgb(var(--color-accent-glow) / <alpha-value>)",
},
```

Esto hace que **toda** la suite de utilidades (`bg-accent`, `text-accent-soft`, `border-accent/40`, `shadow-accent/30`, `hover:bg-accent-glow`, `from-accent`, etc.) responda al `data-theme`. Las 22+ ocurrencias de clases `accent-*` en componentes (Hero, About, Tracks, Streaming, Label, Navbar, AvatarHero) se reactualizan sin tocar JSX.

### Transición global de color

```css
body, body * {
  transition:
    background-color 500ms ease-out,
    border-color 500ms ease-out,
    color 500ms ease-out,
    box-shadow 500ms ease-out,
    fill 500ms ease-out,
    stroke 500ms ease-out;
}
```

Aplicada al `body *` (especificidad baja, sólo afecta cuando los valores cambian). Botones con `transition-colors duration-150` de Tailwind ganan por especificidad — sus hover transitions siguen snappy. Pero cuando el tema cambia, los colores de **fondo, borde y sombra** de cualquier elemento interpolan suavemente en 500ms.

**Por qué exactamente 500ms**: sincroniza con la duración total del flashpoint + emerge del toggle (500ms flashpoint, 100ms gap, 500ms emerge = 1100ms). El color empieza a moverse en el flashpoint y acaba justo cuando el nuevo avatar está totalmente visible.

### Snap del tema

```ts
document.documentElement.dataset.theme = to;
```

Una línea, en el callback del flashpoint dentro de `playTransition`. Esto es lo único que hay que hacer para que **toda la página** cambie. Todo el resto se compone vía CSS.

### Sin flicker en primer paint

[index.html](../index.html) tiene un script inline en `<head>`, antes del bundle:

```html
<script>
  document.documentElement.dataset.theme = "green";
</script>
```

Ejecuta sincronamente durante el parse del HTML, antes de que el navegador pinte. Así el primer paint ya tiene la paleta verde aplicada. Sin script, podría haber un frame con el tema por defecto antes de que JS se ejecute.

## Capas visuales del avatar

De atrás hacia adelante en el DOM:

1. **Glow base** — `<div>` con `inset-[-15%]` (extiende 15% más que el avatar), `rounded-full`, `blur-[80px]`, `bg-accent/25` (o `bg-accent-glow/50` durante flashpoint). El "halo" general detrás del avatar. Hereda del tema.
2. **ParticleCanvas** — `-inset-[10%] h-[120%] w-[120%]`, `pointer-events-none`. Las partículas.
3. **Avatar fuego** (`<motion.img>`) — `inset-0`, `rounded-[4rem]` (esquinas suaves de 64px), máscara radial: `mask-image: radial-gradient(circle at center, black 65%, transparent 100%)`. La máscara funde los bordes del JPEG con el fondo.
4. **Avatar verde** (`<motion.img>`) — mismas dimensiones y máscara.
5. **Flash overlay** (`<motion.div>`) — `inset-0`, `rounded-full`, `mix-blend-screen`, gradiente radial blanco/naranja/transparente. Cubre el avatar durante el flashpoint, animado vía Framer Motion.

### Máscara radial — por qué

Los JPEGs son cuadrados con bordes duros. El círculo + máscara radial los integra con el fondo oscuro y con el glow circular detrás. La máscara sólo desvanece el último 35% de cada lado — el **contenido principal** (cara, dragón en el verde, llamas en el fuego) queda íntegro.

## Reduced motion

`useReducedMotion()` de Framer Motion. Si está activo:

- No se ejecuta el intro.
- No se renderiza el `ParticleCanvas` (return early en el JSX).
- El avatar verde aparece estático con `opacity: 1`.
- El handler de toggle aún funciona pero hace **swap instantáneo**: cambia palette, phase, `data-theme` sin animación. Sin flashpoint, sin partículas.

El usuario con `prefers-reduced-motion: reduce` mantiene la funcionalidad bi-tema pero sin el espectáculo cinematográfico.

## Interacción

- **Cursor**: `cursor-pointer` siempre — pista visual en desktop de que el avatar es interactivo.
- **`onMouseEnter`**: dispara toggle en desktop al pasar el cursor.
- **`onClick`**: dispara toggle en touch (tap) y en click de desktop.
- **Race conditions**: ambos handlers llaman al mismo `interactRef.current()`. La guard `isPlaying` evita doble disparo. En táctil, `mouseenter` + `click` se solapan al tap — el primero gana, el segundo se ignora.

## Performance

- **Animaciones**: Framer Motion usa `requestAnimationFrame` y composita sobre `transform`/`opacity`/`filter` (propiedades aceleradas por GPU). Sin layout thrash.
- **Intensity ticker**: un único `requestAnimationFrame` global para interpolar el target de partículas. Cancelado en cleanup.
- **Particle pool**: 260 fijos, sin alloc por frame. El "matar/respawn" es solo cambiar campos en sitio.
- **Canvas DPR**: `Math.min(window.devicePixelRatio, 2)` — limita a 2x en pantallas Retina para no quemar GPU en displays 3x+.
- **IntersectionObserver**: pausa el RAF del canvas cuando el avatar no está visible.
- **CSS transitions**: limitadas a propiedades de color (no width/height/transform), evitan recalcular layout.
- **No re-renders innecesarios**: `intensityRef` y `currentTargetRef` son refs, no state. Solo `phase` y `palette` disparan re-render, y solo cuando cambian (≤ 4 cambios por intro).

## Cómo tunear

### Velocidades

[AvatarHero.tsx](../src/components/AvatarHero.tsx) — el objeto `T` dentro de `playTransition`. Dos sets: `isInitial ? {...} : {...}`.

- Tiempos absolutos (`rampUp`, `flash`, `emerge`, `settle`, `done`) en milisegundos desde el inicio de la transición.
- Duraciones (`rampDur`, `flashDur`, `emergeDur`) en segundos para Framer Motion.
- Para escalar, multiplicar todos los valores del set por el mismo factor.

### Intensidad de partículas

`IDLE_INTENSITY` constant top-level. Subir → más partículas perpetuas y más activas. Bajar → más sutil.

### Comportamiento de partículas

[ParticleCanvas.tsx](../src/components/ParticleCanvas.tsx) — función `spawn()`. Editar las ramas `fire` / `embers`:
- `speed`, `maxLife`, `size`, `hue` controlan la apariencia.
- Cambiar la fórmula de `vx`/`vy` cambia el patrón de movimiento (vertical, radial, espiral, etc.).

### Paletas de tema

[src/index.css](../src/index.css) — ajustar los hex (en formato RGB tuple) en `:root` y `:root[data-theme="fire"]`. Cambio inmediato en TODA la aplicación sin tocar componentes.

### Velocidad de transición de color

[src/index.css](../src/index.css) — el `body, body *` con `transition: ... 500ms ...`. Bajar a 300–400ms se siente más snappy; subir a 700–1000ms más cinematográfico.

### Imagen del avatar

`public/avatars/avatar-{fire,green}.jpeg`. URL estable a propósito (preload en `<head>`, OG image para SEO). Si las cambias, mantén dimensiones cuadradas y considera ajustar el radio de la máscara radial (`black 65%`) si el contenido principal queda más cerca del borde.

### Toggle deshabilitado

Si quieres que el avatar sea no-interactivo (intro y ya): quitar `onMouseEnter` + `onClick` + `cursor-pointer` del `<div>` contenedor. La intro sigue funcionando.
