import { FaSpotify, FaSoundcloud } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { artist } from "../data/artist";

const SPOTIFY = artist.socials.find((s) => s.label === "Spotify")?.url ?? "#";
const SOUNDCLOUD =
  artist.socials.find((s) => s.label === "SoundCloud")?.url ?? "#";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 animate-pulse-glow rounded-full bg-accent/30 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[520px] w-[520px] animate-pulse-glow rounded-full bg-accent-glow/20 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-noise opacity-[0.06] mix-blend-overlay"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-32">
        <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-ink-700 bg-ink-900/60 px-3 py-1 text-xs font-medium text-gray-300 backdrop-blur">
          <HiLocationMarker className="text-accent-soft" aria-hidden />
          {artist.location}
        </span>

        <h1
          className="mt-6 animate-fade-up font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
          style={{ animationDelay: "80ms" }}
        >
          <span className="text-gradient-accent inline-block bg-[length:200%_100%] animate-gradient-shift">
            KALAMARICO
          </span>
        </h1>

        <p
          className="mt-6 max-w-2xl animate-fade-up text-lg text-gray-300 sm:text-xl"
          style={{ animationDelay: "160ms" }}
        >
          {artist.tagline}
        </p>

        <div
          className="mt-10 flex animate-fade-up flex-wrap items-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href={SPOTIFY}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-glow hover:shadow-accent/50"
          >
            <FaSpotify size={18} aria-hidden />
            Listen on Spotify
          </a>
          <a
            href={SOUNDCLOUD}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-900/70 px-5 py-3 text-sm font-semibold text-gray-100 backdrop-blur transition hover:border-accent hover:text-white"
          >
            <FaSoundcloud size={18} aria-hidden />
            Follow on SoundCloud
          </a>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-ink-600 p-1">
          <span className="block h-2 w-1 animate-pulse-glow rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
