import { FaPlay } from "react-icons/fa";
import { type Release } from "../data/artist";
import { catalogCode, releaseNumber, releaseYear } from "../lib/catalog";

type CoverProps = {
  release: Release;
  variant?: "default" | "mini";
  big?: boolean;
};

export function Cover({ release, variant = "default", big = false }: CoverProps) {
  const isMini = variant === "mini";

  const num = String(releaseNumber(release)).padStart(2, "0");

  const numClass = big
    ? "text-[clamp(64px,18vw,120px)] bottom-14 min-[700px]:text-[clamp(80px,14vw,200px)] min-[700px]:bottom-20"
    : "text-[clamp(48px,16vw,80px)] bottom-[38px] min-[700px]:text-[clamp(60px,9vw,140px)] min-[700px]:bottom-14";

  const titleClass = isMini
    ? "bottom-1 left-1 right-1 text-[8px] tracking-normal"
    : big
      ? "bottom-3.5 left-3.5 right-3.5 text-[clamp(22px,6vw,32px)] tracking-[-0.015em] min-[700px]:text-[clamp(28px,3vw,44px)]"
      : "left-2.5 right-2.5 bottom-2.5 text-[13px] tracking-[-0.015em] min-[700px]:left-3.5 min-[700px]:right-3.5 min-[700px]:bottom-3.5 min-[700px]:text-[clamp(15px,1.5vw,22px)]";

  return (
    <div className="group relative h-full w-full overflow-hidden bg-ink-800">
      <img
        src={release.coverArt}
        alt={`${release.name} cover`}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(5,5,7,0.85) 0%, transparent 60%)",
        }}
      />

      {!isMini && (
        <>
          <span className="absolute left-2.5 top-2 z-[2] font-mono text-[8px] uppercase tracking-[0.2em] text-white/80 min-[700px]:left-3.5 min-[700px]:top-3 min-[700px]:text-[10px] min-[700px]:tracking-[0.25em]">
            {catalogCode(release)}
          </span>
          <span className="absolute right-2.5 top-2 z-[2] font-mono text-[8px] tracking-[0.2em] text-white/80 min-[700px]:right-3.5 min-[700px]:top-3 min-[700px]:text-[10px] min-[700px]:tracking-[0.25em]">
            {releaseYear(release)}
          </span>

          <span
            aria-hidden
            className={`pointer-events-none absolute left-2.5 z-[1] mix-blend-overlay font-display font-bold leading-[0.85] tracking-[-0.05em] text-white/[0.16] min-[700px]:left-3.5 ${numClass}`}
          >
            {num}
          </span>

          <span
            aria-hidden
            className="absolute bottom-2.5 right-2.5 z-[3] inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/20 bg-ink-950/60 text-white backdrop-blur-md transition-all duration-200 group-hover:scale-[1.08] group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950 min-[700px]:bottom-3.5 min-[700px]:right-3.5 min-[700px]:h-9 min-[700px]:w-9"
          >
            <FaPlay size={11} />
          </span>
        </>
      )}

      <span
        className={`absolute z-[2] font-display font-semibold leading-[1.05] text-white ${titleClass}`}
        style={{
          textShadow: isMini ? undefined : "0 2px 16px rgba(0,0,0,0.5)",
        }}
      >
        {release.name}
      </span>
    </div>
  );
}
