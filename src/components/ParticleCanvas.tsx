import { useEffect, useRef } from "react";

export type ParticlePalette = "fire" | "embers";

type Props = {
  palette: ParticlePalette;
  intensityRef: React.MutableRefObject<number>;
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  seed: number;
};

const POOL_SIZE = 260;

export function ParticleCanvas({ palette, intensityRef, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paletteRef = useRef<ParticlePalette>(palette);
  paletteRef.current = palette;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const pool: Particle[] = Array.from({ length: POOL_SIZE }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      size: 1,
      hue: 0,
      seed: Math.random() * Math.PI * 2,
    }));

    const spawn = (p: Particle) => {
      const cx = width / 2;
      const cy = height / 2;
      // Radio del aro de spawn: alineado con el aro de energía del artwork.
      // Con canvas extendido al 120% del avatar, 0.36 deja el spawn en ~85% del
      // radio del avatar.
      const radius = Math.min(width, height) * 0.36;
      const angle = Math.random() * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * radius * 0.18;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      p.x = cx + dx * (radius + jitter);
      p.y = cy + dy * (radius + jitter);
      p.seed = Math.random() * Math.PI * 2;

      if (paletteRef.current === "fire") {
        // Llamas: suben con turbulencia, vida corta.
        const speed = 0.6 + Math.random() * 1.4;
        p.vx = (Math.random() - 0.5) * 0.6;
        p.vy = -speed;
        p.maxLife = 50 + Math.random() * 50;
        p.size = 2 + Math.random() * 3.5;
        p.hue = 8 + Math.random() * 38; // rojo → naranja → amarillo
      } else {
        // Embers verdes: rayos radiales hacia afuera + sesgo hacia arriba,
        // como llamas de energía escapando del aro.
        const speed = 0.5 + Math.random() * 0.7;
        p.vx = dx * speed + (Math.random() - 0.5) * 0.18;
        p.vy = dy * speed - 0.18;
        p.maxLife = 90 + Math.random() * 80;
        p.size = 1.5 + Math.random() * 2.5;
        p.hue = 80 + Math.random() * 35; // lima → verde puro
      }
      p.life = p.maxLife;
    };

    pool.forEach(spawn);

    let raf = 0;
    let running = true;

    // Pause cuando el canvas no es visible.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) running = entry.isIntersecting;
        if (running && !raf) {
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(canvas);

    const tick = () => {
      raf = 0;
      if (!running) return;
      const intensity = Math.max(0, Math.min(1, intensityRef.current));
      const activeCount = Math.floor(POOL_SIZE * intensity);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < pool.length; i++) {
        const p = pool[i]!;
        if (i >= activeCount) {
          // Reduce vida rápido para vaciar el pool al bajar intensity.
          p.life -= 4;
          if (p.life <= 0) continue;
        }

        // Update.
        if (paletteRef.current === "fire") {
          p.x += p.vx + Math.sin((p.life + p.seed) * 0.08) * 0.4;
          p.y += p.vy * (0.6 + intensity * 0.8);
          p.vy -= 0.015; // acelera hacia arriba
        } else {
          // Embers radiales: motion outward escalado por intensidad +
          // turbulencia y arrastre superior leve (efecto llamas).
          const speedFactor = 0.7 + intensity * 0.6;
          p.x += p.vx * speedFactor + Math.sin((p.life + p.seed) * 0.04) * 0.28;
          p.y += p.vy * speedFactor + Math.cos((p.life + p.seed) * 0.05) * 0.18;
          p.vy -= 0.0025;
        }

        p.life -= 1;
        if (p.life <= 0 && i < activeCount) {
          spawn(p);
          continue;
        }

        const t = Math.max(0, p.life / p.maxLife);
        const alpha = paletteRef.current === "fire" ? t * 0.85 : t * 0.7;
        const lightness = paletteRef.current === "fire" ? 55 + t * 20 : 60 + t * 15;
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${lightness}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.5 + t * 0.7), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [intensityRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}
