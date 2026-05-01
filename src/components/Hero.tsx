import { FaSpotify, FaSoundcloud } from "react-icons/fa";
import { artist } from "../data/artist";
import { catalogCode, formatMonth } from "../lib/catalog";
import { AvatarHero } from "./AvatarHero";

const SPOTIFY = artist.socials.find((s) => s.label === "Spotify")?.url ?? "#";
const SOUNDCLOUD =
  artist.socials.find((s) => s.label === "SoundCloud")?.url ?? "#";

const TICKER = artist.releases.slice(0, 8);

export function Hero() {
  const latest = artist.releases[0];

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-14 pt-[110px] min-[700px]:pb-20 min-[700px]:pt-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%]"
        style={{
          width: "min(70vw, 900px)",
          height: "min(70vw, 900px)",
          background:
            "radial-gradient(circle, rgb(var(--color-accent) / 0.18) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      <div className="mx-auto max-w-[1280px] px-5 min-[700px]:px-8">
        <div
          className="
            relative mb-8 flex flex-wrap justify-between gap-x-4 gap-y-2 text-center font-mono
            text-[9px] uppercase tracking-[0.18em] text-gray-500
            min-[700px]:mb-16 min-[700px]:gap-6 min-[700px]:text-left min-[700px]:text-[11px] min-[700px]:tracking-[0.22em]
            max-[420px]:hidden
          "
        >
          <span className="basis-[calc(50%-8px)] min-[700px]:basis-auto">
            <b className="font-medium text-gray-200">K · 01</b> — Artist
          </span>
          <span className="basis-[calc(50%-8px)] min-[700px]:basis-auto">
            EST. 1996 — FastTracker → Now
          </span>
          <span className="basis-[calc(50%-8px)] min-[700px]:basis-auto">
            Madrid, ES · 40.4°N 3.7°W
          </span>
          <span className="basis-[calc(50%-8px)] min-[700px]:basis-auto">
            {artist.releases.length} releases · {artist.labels.length} labels
          </span>
        </div>

        <div className="relative grid grid-cols-1 items-center gap-12 min-[900px]:grid-cols-[1.4fr_minmax(0,1fr)] min-[900px]:gap-16">
          <div className="text-center min-[900px]:text-left">
            <p className="m-0 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              Electronic music · producer
            </p>

            <h1
              className="
                text-gradient-wordmark m-0 mt-6 animate-wordmark-shift font-display font-bold leading-[0.9]
                text-[clamp(48px,13vw,96px)] tracking-[-0.035em]
                min-[700px]:text-[clamp(64px,12vw,180px)] min-[700px]:tracking-[-0.04em]
              "
            >
              Kalamarico
            </h1>

            <p
              className="mx-auto mt-5 max-w-[480px] font-display font-normal leading-[1.45] tracking-[-0.005em] text-gray-300 text-[17px] min-[700px]:mt-8 min-[700px]:leading-[1.4] min-[700px]:text-[clamp(20px,1.8vw,26px)] min-[900px]:mx-0"
            >
              Sound exploration, electronic texture, and a 30-year obsession
              with rhythmic structure — built in Madrid.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2 min-[700px]:mt-12 min-[700px]:gap-3 min-[900px]:justify-start">
              <a
                href={SPOTIFY}
                target="_blank"
                rel="noreferrer noopener"
                className="
                  inline-flex flex-1 items-center justify-center gap-2.5
                  bg-accent px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink-950
                  transition-colors duration-200 hover:bg-accent-soft
                  min-[700px]:flex-none min-[700px]:px-5 min-[700px]:tracking-[0.22em] min-[700px]:text-[11px]
                "
              >
                <FaSpotify size={14} aria-hidden /> Listen on Spotify
              </a>
              <a
                href={SOUNDCLOUD}
                target="_blank"
                rel="noreferrer noopener"
                className="
                  inline-flex flex-1 items-center justify-center gap-2.5 border border-white/[0.14]
                  bg-transparent px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white
                  transition-colors duration-200 hover:border-accent hover:text-accent-soft
                  min-[700px]:flex-none min-[700px]:px-5 min-[700px]:tracking-[0.22em] min-[700px]:text-[11px]
                "
              >
                <FaSoundcloud size={14} aria-hidden /> SoundCloud
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 min-[900px]:items-stretch min-[900px]:gap-6">
            <AvatarHero />
            <div className="flex w-full max-w-[480px] items-end justify-between gap-4 border-t border-white/[0.08] pt-4">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500 min-[700px]:text-[10px] min-[700px]:tracking-[0.22em]">
                  Latest release
                </div>
                <div className="mt-1.5 font-display text-[18px] font-semibold leading-none tracking-[-0.02em] text-white min-[700px]:text-[22px]">
                  {latest.name}
                </div>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500 min-[700px]:text-[10px] min-[700px]:tracking-[0.22em]">
                {formatMonth(latest)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ticker-mask relative mt-14 overflow-hidden border-y border-white/[0.08] py-3 min-[700px]:mt-24 min-[700px]:py-4">
        <div
          className="
            flex w-max animate-ticker-scroll gap-7 whitespace-nowrap will-change-transform
            [animation-duration:90s] min-[700px]:gap-12 min-[700px]:[animation-duration:60s]
          "
        >
          {[0, 1].flatMap((i) =>
            TICKER.map((r) => (
              <span
                key={`${i}-${r.id}`}
                className="font-display text-[14px] font-semibold tracking-[-0.01em] text-gray-300 min-[700px]:text-[18px]"
              >
                <em className="not-italic mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-soft min-[700px]:mr-3 min-[700px]:text-[12px]">
                  {catalogCode(r)}
                </em>
                {r.name} — {formatMonth(r)} · {r.type}
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
