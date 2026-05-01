import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ParticleCanvas, type ParticlePalette } from "./ParticleCanvas";

const FIRE_SRC = "/avatars/avatar-fire.jpeg";
const GREEN_SRC = "/avatars/avatar-green.jpeg";

type Phase = "fire" | "flashpoint" | "green";
type Theme = "green" | "fire";

const IDLE_INTENSITY: Record<Theme, number> = {
  green: 0.55,
  fire: 0.5,
};

const PALETTE_FOR: Record<Theme, ParticlePalette> = {
  green: "embers",
  fire: "fire",
};

const PHASE_FOR: Record<Theme, Phase> = {
  green: "green",
  fire: "fire",
};

export function AvatarHero() {
  const reduceMotion = useReducedMotion();
  const intensityRef = useRef(0);
  const interactRef = useRef<() => void>(() => {});
  // Estado actual / destino de la última transición. Tras el intro: "green".
  const currentTargetRef = useRef<Theme>("green");
  const [palette, setPalette] = useState<ParticlePalette>("fire");
  const [phase, setPhase] = useState<Phase>("fire");
  const [fireScope, animateFire] = useAnimate();
  const [greenScope, animateGreen] = useAnimate();
  const [flashScope, animateFlash] = useAnimate();

  useEffect(() => {
    if (reduceMotion) {
      // Sin intro: arrancamos en green-idle y permitimos toggle instantáneo.
      intensityRef.current = 0;
      setPalette("embers");
      setPhase("green");
      currentTargetRef.current = "green";
      document.documentElement.dataset.theme = "green";
      interactRef.current = () => {
        const next: Theme =
          currentTargetRef.current === "green" ? "fire" : "green";
        currentTargetRef.current = next;
        setPalette(PALETTE_FOR[next]);
        setPhase(PHASE_FOR[next]);
        document.documentElement.dataset.theme = next;
      };
      return;
    }

    let cancelled = false;
    let isPlaying = false;
    const timeouts: number[] = [];

    const at = (ms: number, fn: () => void) => {
      timeouts.push(window.setTimeout(() => !cancelled && fn(), ms));
    };

    const clearTimeouts = () => {
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.length = 0;
    };

    let target = 0;
    let raf = 0;
    const tickIntensity = () => {
      const cur = intensityRef.current;
      intensityRef.current = cur + (target - cur) * 0.06;
      raf = requestAnimationFrame(tickIntensity);
    };
    raf = requestAnimationFrame(tickIntensity);

    /**
     * Reproduce la transición hacia `to`.
     *  - `isInitial=true`: intro completo (~9.7s) — el fuego emerge desde 0.
     *  - `isInitial=false`: toggle entre estados idle (~3.2s) — el avatar
     *    saliente ya es visible.
     * En ambos casos: ramp-up del saliente → flashpoint con SWAP de
     * data-theme global → emergencia del entrante → settle en idle.
     */
    const playTransition = (to: Theme, isInitial: boolean) => {
      if (isPlaying || cancelled) return;
      isPlaying = true;
      clearTimeouts();
      currentTargetRef.current = to;

      const from: Theme = to === "green" ? "fire" : "green";
      const fromScope = from === "fire" ? fireScope : greenScope;
      const toScope = to === "fire" ? fireScope : greenScope;
      const animateFrom = from === "fire" ? animateFire : animateGreen;
      const animateTo = to === "fire" ? animateFire : animateGreen;

      // Timings ~2x más rápidos que la versión "lenta cinematográfica".
      const T = isInitial
        ? {
            rampUp: 3000,
            flash: 3750,
            emerge: 3850,
            settle: 4750,
            done: 4850,
            rampDur: 0.75,
            flashDur: 0.35,
            emergeDur: 0.9,
          }
        : {
            rampUp: 0,
            flash: 500,
            emerge: 600,
            settle: 1100,
            done: 1200,
            rampDur: 0.5,
            flashDur: 0.2,
            emergeDur: 0.5,
          };

      // === SETUP ===
      if (isInitial) {
        // Ambos avatares parten invisibles. El fuego emerge despacio.
        animateGreen(greenScope.current, { opacity: 0 }, { duration: 0 });
        animateFlash(
          flashScope.current,
          { opacity: [0, 0.6, 0] },
          { duration: 0.5, ease: "easeOut" },
        );
        setPalette("fire");
        setPhase("fire");
        target = 0.7;
        animateFire(
          fireScope.current,
          {
            opacity: [0, 1],
            scale: [0.94, 1],
            filter: ["blur(8px)", "blur(0px)"],
          },
          { duration: 1.0, ease: "easeOut" },
        );
      }
      // En toggles, el estado idle del `from` ya es coherente.

      // === RAMP-UP del avatar saliente ===
      at(T.rampUp, () => {
        target = 1;
        animateFrom(
          fromScope.current,
          { scale: [1, 1.05] },
          { duration: T.rampDur, ease: "easeIn" },
        );
      });

      // === FLASHPOINT: snap de tema + flash + fade-out del saliente ===
      at(T.flash, () => {
        animateFlash(
          flashScope.current,
          { opacity: [0, 0.85, 0] },
          { duration: T.flashDur, ease: "easeOut" },
        );
        animateFrom(
          fromScope.current,
          { opacity: 0, scale: 1.12, filter: "blur(8px)" },
          { duration: T.flashDur, ease: "easeOut" },
        );
        setPhase("flashpoint");
        // BOOM: cambio de tema global de la página.
        document.documentElement.dataset.theme = to;
      });

      // === EMERGENCIA del entrante ===
      at(T.emerge, () => {
        setPalette(PALETTE_FOR[to]);
        setPhase(PHASE_FOR[to]);
        target = 0.7;
        animateTo(
          toScope.current,
          {
            opacity: [0, 1],
            scale: [0.95, 1],
            filter: ["blur(8px)", "blur(0px)"],
          },
          { duration: T.emergeDur, ease: "easeOut" },
        );
      });

      // === SETTLE en idle ===
      at(T.settle, () => {
        target = IDLE_INTENSITY[to];
      });

      at(T.done, () => {
        isPlaying = false;
      });
    };

    // Handler de interacción (hover desktop / tap móvil).
    interactRef.current = () => {
      if (isPlaying) return;
      const next: Theme =
        currentTargetRef.current === "green" ? "fire" : "green";
      playTransition(next, false);
    };

    // Intro: arranca con avatar de fuego, termina en green-idle.
    playTransition("green", true);

    return () => {
      cancelled = true;
      clearTimeouts();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  const handleInteract = () => interactRef.current();

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[480px] cursor-pointer sm:max-w-[460px] lg:max-w-[540px]"
      onMouseEnter={handleInteract}
      onClick={handleInteract}
    >
      {/* Glow base detrás del avatar. Hereda del tema activo a través de
          `bg-accent` / `bg-accent-glow`. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-[-15%] rounded-full blur-[80px] transition-colors duration-700 ${
          phase === "flashpoint" ? "bg-accent-glow/50" : "bg-accent/25"
        }`}
      />

      {/* Partículas — canvas extendido para que los rayos verdes
          puedan escapar más allá del avatar en el estado idle. */}
      {!reduceMotion && (
        <ParticleCanvas
          palette={palette}
          intensityRef={intensityRef}
          className="pointer-events-none absolute -inset-[10%] h-[120%] w-[120%]"
        />
      )}

      {/* Avatar fuego */}
      <motion.img
        ref={fireScope}
        src={FIRE_SRC}
        alt=""
        aria-hidden
        loading="eager"
        decoding="async"
        initial={{ opacity: reduceMotion ? 0 : 0, scale: 0.94 }}
        className="absolute inset-0 h-full w-full select-none rounded-[4rem] object-contain"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle at center, black 65%, transparent 100%)",
          maskImage:
            "radial-gradient(circle at center, black 65%, transparent 100%)",
        }}
        draggable={false}
      />

      {/* Avatar verde */}
      <motion.img
        ref={greenScope}
        src={GREEN_SRC}
        alt="Kalamarico"
        loading="eager"
        decoding="async"
        initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.95 }}
        className="absolute inset-0 h-full w-full select-none rounded-[4rem] object-contain"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle at center, black 65%, transparent 100%)",
          maskImage:
            "radial-gradient(circle at center, black 65%, transparent 100%)",
        }}
        draggable={false}
      />

      {/* Flashpoint overlay */}
      <motion.div
        ref={flashScope}
        aria-hidden
        initial={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 rounded-full mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(249,115,22,0.7) 35%, rgba(239,68,68,0) 70%)",
        }}
      />
    </div>
  );
}
