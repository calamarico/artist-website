# Markdown for Agents

El sitio respeta el spec de [Markdown content negotiation for agents](https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md): cuando un agente o un LLM hace un GET a `https://www.kalamarico.com/` con la cabecera `Accept: text/markdown`, recibe una representación en Markdown limpia en lugar del HTML.

Los humanos con un navegador siguen recibiendo HTML normal — la negociación es transparente.

## Por qué

Agentes y LLMs ahorran tokens (y dinero) cuando consumen contenido directamente en Markdown en vez de tener que parsear HTML + descartar JS, CSS, etc. Esta web tiene info estructurada (bio, releases, plataformas) que es perfecta para servir como MD.

## Cómo funciona la negociación

```
Cliente                                 Cloudflare Pages
   │                                          │
   │  GET / con Accept: text/markdown          │
   │ ─────────────────────────────────────────▶│
   │                                          │ functions/_middleware.ts
   │                                          │  1. ¿Es GET/HEAD a "/"?     ✓
   │                                          │  2. ¿Accept incluye         ✓
   │                                          │     text/markdown?
   │                                          │  3. Fetch /index.md
   │                                          │     (emitido en build)
   │  200 OK                                  │
   │  content-type: text/markdown; charset=utf-8
   │  x-markdown-tokens: 412                  │
   │  vary: Accept                            │
   │ ◀─────────────────────────────────────────│
```

Si el `Accept` no menciona `text/markdown` (caso navegador, `Accept: text/html,...`), el middleware llama a `next()` y se sirve `index.html` como siempre.

`*/*` solo no dispara MD — lo tratamos como navegador. El cliente debe **explícitamente** pedir `text/markdown` (o `text/markdown` junto a otros tipos).

## Piezas técnicas

| Pieza | Archivo | Rol |
|---|---|---|
| Generador | [src/lib/generateMarkdown.ts](../src/lib/generateMarkdown.ts) | Función pura `(Artist) → string` que produce el MD a partir de la fuente única `src/data/artist.ts`. |
| Build hook | [vite.config.ts](../vite.config.ts) — plugin `markdownForAgents` | En `vite build` emite `dist/index.md` aplicando el generador. Sin duplicación de datos. |
| Edge function | [functions/_middleware.ts](../functions/_middleware.ts) | Cloudflare Pages Function que intercepta cada request y hace la negociación por `Accept`. |
| Discovery | [index.html](../index.html) — `<link rel="alternate" type="text/markdown" href="/index.md" />` | Agentes que descubren rutas vía alternates encuentran el MD aunque no negocien activamente. |

## Cabeceras de respuesta

| Cabecera | Valor | Por qué |
|---|---|---|
| `content-type` | `text/markdown; charset=utf-8` | Requerida por el spec. |
| `x-markdown-tokens` | número (estimado: ~chars/4) | Opcional según spec; útil para que el agente pre-cuente tokens antes de inyectar en su contexto. |
| `vary` | `Accept` | Para que CDNs intermedios cacheen las dos representaciones por separado. **Crítico**: sin esto, una caché podría servir MD a un navegador o HTML a un agente. |
| `cache-control` | `public, max-age=300, must-revalidate` | 5 min de cache en edge. Suficiente para no martillar; corto para que cambios en releases se propaguen rápido. |
| `content-signal` | `ai-train=yes, search=yes, ai-input=yes` | Indica que el contenido es OK para training/búsqueda/contexto. Mismo signal que Cloudflare emite cuando el toggle Pro está activo. |

## Cómo probarlo (cuando esté desplegado)

```bash
# Comportamiento normal (HTML)
curl -i https://www.kalamarico.com/

# Negociación a markdown
curl -i -H "Accept: text/markdown" https://www.kalamarico.com/

# Verificar headers solamente
curl -I -H "Accept: text/markdown" https://www.kalamarico.com/
```

Para validación oficial contra el spec:

```bash
curl -X POST https://isitagentready.com/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.kalamarico.com/"}'
```

Buscar en el JSON: `checks.contentAccessibility.markdownNegotiation.status === "pass"`.

## Cuando se añade un track o se cambia bio

Solo hay que editar [src/data/artist.ts](../src/data/artist.ts) — el tema visual, el JSON-LD del SEO, el listado de Tracks/Streaming/etc. Y el `index.md` se regenera automáticamente en el siguiente build. No hay duplicación.

## Portar a otro host

Cloudflare Pages Functions usan una API estándar (request/Response) muy parecida a otros runtimes. Si en el futuro migramos:

### Vercel Edge Function

`api/markdown-negotiation.ts`:

```ts
import { generateMarkdown } from "@/lib/generateMarkdown";
import { artist } from "@/data/artist";

export const config = { runtime: "edge", matcher: ["/"] };

export default async function handler(req: Request) {
  const accept = req.headers.get("accept") ?? "";
  if (!accept.toLowerCase().includes("text/markdown")) {
    return new Response(null, { status: 404 });  // fall through to next match
  }
  const md = generateMarkdown(artist);
  return new Response(md, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(Math.ceil(md.length / 4)),
      vary: "Accept",
    },
  });
}
```

(Vercel necesita configurar el matcher con `vercel.json` para que se aplique a `/`.)

### Netlify Edge Function

`netlify/edge-functions/markdown.ts`:

```ts
import { Context } from "https://edge.netlify.com";

export default async (req: Request, ctx: Context) => {
  const accept = req.headers.get("accept") ?? "";
  if (!accept.toLowerCase().includes("text/markdown")) return;
  // Fetch /index.md from the deploy
  const md = await fetch(new URL("/index.md", req.url)).then(r => r.text());
  return new Response(md, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(Math.ceil(md.length / 4)),
      vary: "Accept",
    },
  });
};

export const config = { path: "/" };
```

### Cloudflare "Markdown for Agents" (Pro plan)

Si en el futuro pasamos a plan **Pro de Cloudflare** ($20/mes), podemos delegar la conversión:

1. Dashboard → Zone → AI Crawl Control → enable "Markdown for Agents".
2. Borrar `functions/_middleware.ts` (Cloudflare hace la conversión HTML→MD on-the-fly).
3. Borrar el plugin `markdownForAgents` del [vite.config.ts](../vite.config.ts) y el `<link rel="alternate">` del HTML (opcionales).

Trade-off: Cloudflare convierte automáticamente desde el HTML renderizado, lo cual para una SPA estática implica que **no ven el contenido** (la SPA solo tiene `<div id="root">` en el HTML inicial). Por tanto la solución actual (MD pre-generado del data source) **es estrictamente mejor** para SPAs hasta que tengamos SSR.

## Limitaciones actuales

- **Sólo `/` tiene MD**. La home es la única página relevante por ahora. Si añadimos rutas adicionales (`/about`, `/tracks`, etc., que ahora son anchors), hay que ampliar `MARKDOWN_FOR_PATH` en el middleware y emitir más `.md` en el plugin Vite.
- **Cloudflare Pages compila la función separadamente** del `tsc -b` del proyecto. Si introduces errores de tipo en `functions/`, no salen en `npm run build` local — los verás en el deploy log de CF Pages. Worth keeping in mind.
- **El `x-markdown-tokens` es estimado** (chars/4). Si necesitas precisión real, usar `tiktoken` u otra librería. No es requisito del spec.
