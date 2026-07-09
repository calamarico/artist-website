import { useEffect, useMemo } from "react";
import { FaSpotify, FaSoundcloud } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { artist, type Release, type Track } from "../data/artist";
import {
  catalogCode,
  formatDay,
  formatDuration,
  isAppearsOn,
  otherArtists,
  releasePagePath,
} from "../lib/catalog";
import { useLang, useT, type Strings } from "../lib/i18n";
import { Cover } from "./Cover";

const SOUNDCLOUD =
  artist.socials.find((s) => s.label === "SoundCloud")?.url ?? "#";

const SYNTH_VARIANTS = [
  "Original Mix",
  "Extended Mix",
  "Dub Mix",
  "Radio Edit",
  "Beta-Time Edit",
];

/** Fallback when the release has no synced tracks (legacy / new data without sync). */
function synthesizeTracks(release: Release): { name: string; dur: string; artists: string[]; isCollab: boolean }[] {
  return Array.from({ length: release.trackCount }, (_, i) => {
    const name =
      release.trackCount === 1 || i === 0
        ? release.name
        : `${release.name} (${SYNTH_VARIANTS[(i - 1) % SYNTH_VARIANTS.length]})`;
    const seconds = (20 + (i * 7) % 40).toString().padStart(2, "0");
    const dur = `${4 + (i % 3)}:${seconds}`;
    return { name, dur, artists: [], isCollab: false };
  });
}

function realTracks(tracks: Track[]) {
  return tracks.map((t) => ({
    name: t.name,
    dur: formatDuration(t.durationMs),
    artists: otherArtists(t.artists),
    isCollab: t.isCollab,
  }));
}

function typeLabel(release: Release, t: Strings): string {
  switch (release.type) {
    case "APPEARS_ON":
      return t.modal.featuredAppearance;
    case "EP":
      return t.modal.epOf(release.trackCount);
    case "ALBUM":
      return t.modal.albumOf(release.trackCount);
    case "COMPILATION":
      return t.modal.compilationOf(release.trackCount);
    default:
      return t.modal.single;
  }
}

type Props = {
  release: Release | null;
  onClose: () => void;
};

export function ReleaseModal({ release, onClose }: Props) {
  const lang = useLang();
  const t = useT();

  useEffect(() => {
    if (!release) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [release, onClose]);

  const tracks = useMemo(() => {
    if (!release) return [];
    if (release.tracks && release.tracks.length > 0) {
      return realTracks(release.tracks);
    }
    return synthesizeTracks(release);
  }, [release]);

  const open = !!release;
  const pagePath = release ? releasePagePath(release, lang) : null;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={`
        fixed inset-0 z-[100] flex items-stretch justify-center
        bg-[rgba(5,5,7,0.85)] p-0 backdrop-blur-xl transition-opacity duration-300
        min-[700px]:items-center min-[700px]:p-8
        ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
      `}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {release && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            relative h-screen max-h-screen w-full max-w-full overflow-y-auto
            border-0 bg-ink-900 transition-transform duration-300
            min-[700px]:h-auto min-[700px]:max-h-[90vh] min-[700px]:max-w-[980px] min-[700px]:border min-[700px]:border-white/[0.14]
            ${
              open
                ? "translate-y-0"
                : "translate-y-10 min-[700px]:translate-y-5"
            }
          `}
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t.modal.close}
            className="absolute right-3 top-3 z-[2] inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.14] bg-ink-950/60 text-white transition-colors duration-200 hover:bg-accent hover:text-ink-950 min-[700px]:right-5 min-[700px]:top-5"
          >
            <HiXMark size={16} />
          </button>

          <div className="grid grid-cols-1 min-[800px]:[grid-template-columns:1fr_1.1fr]">
            <div className="relative aspect-[16/10] overflow-hidden min-[700px]:aspect-square">
              <Cover release={release} big />
            </div>

            <div className="flex flex-col gap-5 px-5 pb-10 pt-7 min-[700px]:gap-6 min-[700px]:p-10">
              <p className="m-0 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                {isAppearsOn(release) ? "FEAT." : catalogCode(release)}
              </p>

              <h2
                className="m-0 font-display font-semibold leading-[1.05] tracking-[-0.02em] text-white"
                style={{ fontSize: "clamp(24px, 7vw, 40px)" }}
              >
                {release.name}
              </h2>

              <div className="flex flex-wrap gap-x-5 gap-y-3.5 min-[700px]:gap-5">
                <Meta label={t.modal.type} value={typeLabel(release, t)} />
                <Meta
                  label={t.modal.released}
                  value={formatDay(release, lang)}
                />
                <Meta
                  label={t.modal.artist}
                  value={
                    release.artists && release.artists.length > 0
                      ? release.artists.map((a) => a.name).join(", ")
                      : "Kalamarico"
                  }
                />
                <Meta
                  label={t.modal.labelWord}
                  value={
                    release.label
                      ? release.label
                      : release.type === "EP" || release.type === "ALBUM"
                        ? "Beta-Time Records"
                        : "Kalamarico"
                  }
                />
              </div>

              <div>
                <p className="m-0 mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-gray-500">
                  {t.modal.tracklist}
                </p>
                <ol className="m-0 list-none border-t border-white/[0.08] p-0">
                  {tracks.map((tr, i) => (
                    <li
                      key={i}
                      className="
                        group grid items-center gap-3 border-b border-white/[0.08] py-2.5
                        transition-colors duration-150 hover:bg-white/[0.02]
                        [grid-template-columns:32px_1fr_auto]
                        min-[700px]:gap-4 min-[700px]:py-3
                      "
                    >
                      <span className="font-mono text-[11px] tracking-[0.18em] text-gray-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="font-display text-[14px] font-medium text-gray-100 transition-colors duration-200 group-hover:text-accent-soft min-[700px]:text-[15px]">
                          {tr.name}
                        </span>
                        {tr.isCollab && tr.artists.length > 0 && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent-soft min-[700px]:text-[10px] min-[700px]:tracking-[0.22em]">
                            {isAppearsOn(release)
                              ? `${t.modal.with} ${tr.artists.join(", ")}`
                              : `feat. ${tr.artists.join(", ")}`}
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-[12px] text-gray-400">
                        {tr.dur}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 min-[700px]:gap-3">
                <a
                  href={release.spotifyUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="
                    inline-flex flex-1 items-center justify-center gap-2.5 bg-accent
                    px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink-950
                    transition-colors duration-200 hover:bg-accent-soft
                    min-[700px]:flex-none min-[700px]:px-5 min-[700px]:tracking-[0.22em] min-[700px]:text-[11px]
                  "
                >
                  <FaSpotify size={14} aria-hidden /> {t.modal.openInSpotify}
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
                {pagePath && (
                  <a
                    href={pagePath}
                    className="inline-flex items-center gap-2 px-1 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400 transition-colors duration-200 hover:text-accent-soft min-[700px]:text-[11px]"
                  >
                    {t.modal.releasePage} →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-gray-500 min-[700px]:text-[9px] min-[700px]:tracking-[0.24em]">
        {label}
      </span>
      <span className="font-display text-[13px] font-medium text-gray-300 min-[700px]:text-[14px]">
        {value}
      </span>
    </div>
  );
}
