import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ParticleCanvas, type ParticlePalette } from "./ParticleCanvas";

const FIRE_SRC = "/avatars/avatar-fire.jpeg";
const GREEN_SRC = "/avatars/avatar-green.jpeg";

type Phase = "fire" | "flashpoint" | "green";

export function AvatarHero() {
  const reduceMotion = useReducedMotion();
  const intensityRef = useRef(0);
  const playRef = useRef<() => void>(() => {});
  const [palette, setPalette] = useState<ParticlePalette>("fire");
  const [phase, setPhase] = useState<Phase>("fire");
  const [fireScope, animateFire] = useAnimate();
  const [greenScope, animateGreen] = useAnimate();
  const [flashScope, animateFlash] = useAnimate();

  useEffect(() => {
    if (reduceMotion) {
      intensityRef.current = 0;
      setPalette("embers");
      setPhase("green");
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

    // Ramp de intensidad gestionado en bucle suave.
    let target = 0;
    let raf = 0;
    const tickIntensity = () => {
      const cur = intensityRef.current;
      intensityRef.current = cur + (target - cur) * 0.06;
      raf = requestAnimationFrame(tickIntensity);
    };
    raf = requestAnimationFrame(tickIntensity);

    // Una sola pasada lenta: fuego emerge → arde → flashpoint → verde emerge
    // → idle estable. ~9.7s en total. Se vuelve a disparar en hover.
    const play = () => {
      if (isPlaying || cancelled) return;
      isPlaying = true;
      clearTimeouts();

      // Fundido del verde y flash suave para enmascarar el reset (en replays
      // el verde está visible en idle; en el primer arranque, ambos están a 0).
      animateFlash(
        flashScope.current,
        { opacity: [0, 0.6, 0] },
        { duration: 0.5, ease: "easeOut" },
      );
      animateGreen(greenScope.current, { opacity: 0 }, { duration: 0.3 });

      // t=0: fuego emerge (lento, 2s).
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
        { duration: 2.0, ease: "easeOut" },
      );

      // t=6.0: ramp-up del fuego (1.5s)
      at(6000, () => {
        target = 1;
        animateFire(
          fireScope.current,
          { scale: [1, 1.05] },
          { duration: 1.5, ease: "easeIn" },
        );
      });

      // t=7.5: flashpoint (0.7s)
      at(7500, () => {
        animateFlash(
          flashScope.current,
          { opacity: [0, 0.85, 0] },
          { duration: 0.7, ease: "easeOut" },
        );
        animateFire(
          fireScope.current,
          { opacity: 0, scale: 1.12, filter: "blur(8px)" },
          { duration: 0.7, ease: "easeOut" },
        );
        setPhase("flashpoint");
      });

      // t=7.7: verde emerge (1.8s)
      at(7700, () => {
        setPalette("embers");
        target = 0.55;
        setPhase("green");
        animateGreen(
          greenScope.current,
          {
            opacity: [0, 1],
            scale: [0.95, 1],
            filter: ["blur(8px)", "blur(0px)"],
          },
          { duration: 1.8, ease: "easeOut" },
        );
      });

      // t=9.5: idle estable verde
      at(9500, () => {
        target = 0.4;
      });

      // t=9.7: animación lista para volver a dispararse en hover
      at(9700, () => {
        isPlaying = false;
      });
    };

    playRef.current = play;
    play();

    return () => {
      cancelled = true;
      clearTimeouts();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[480px] sm:max-w-[420px] lg:max-w-[480px]"
      onMouseEnter={() => playRef.current()}
    >
      {/* Glow base detrás del avatar */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-[-15%] rounded-full blur-[80px] transition-colors duration-700 ${
          phase === "green"
            ? "bg-accent/25"
            : phase === "flashpoint"
              ? "bg-accent-fire-glow/40"
              : "bg-accent-fire/30"
        }`}
      />

      {/* Partículas */}
      {!reduceMotion && (
        <ParticleCanvas
          palette={palette}
          intensityRef={intensityRef}
          className="absolute inset-0 h-full w-full"
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
        className="absolute inset-0 h-full w-full select-none object-contain"
        draggable={false}
      />

      {/* Avatar verde (estado final) */}
      <motion.img
        ref={greenScope}
        src={GREEN_SRC}
        alt="Kalamarico"
        loading="eager"
        decoding="async"
        initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.95 }}
        className="absolute inset-0 h-full w-full select-none object-contain"
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
