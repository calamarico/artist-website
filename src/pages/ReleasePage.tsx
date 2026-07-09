import { FaPlay, FaSoundcloud, FaSpotify } from "react-icons/fa";
import { artist, type Release } from "../data/artist";
import {
  catalogCode,
  collaboratorLabel,
  formatDay,
  formatDuration,
  releasePagePath,
  releasesWithPages,
} from "../lib/catalog";
import { LangContext, langBase, STRINGS, type Lang } from "../lib/i18n";

const SOUNDCLOUD =
  artist.socials.find((s) => s.label === "SoundCloud")?.url ?? "#";

/**
 * Standalone static page for one release, prerendered at build time to
 * dist/releases/{slug}/ (and /es/...). Ships zero JavaScript — it's a pure
 * HTML landing page for search engines and shared links, styled with the
 * same Tailwind vocabulary as the SPA.
 */
export function ReleasePage({
  release,
  lang,
}: {
  release: Release;
  lang: Lang;
}) {
  const t = STRINGS[lang];
  const home = langBase(lang);

  const pages = releasesWithPages();
  const idx = pages.findIndex((r) => r.id === release.id);
  const prev = idx > 0 ? pages[idx - 1] : null;
  const next = idx >= 0 && idx < pages.length - 1 ? pages[idx + 1] : null;

  const formatLabel =
    release.type === "EP"
      ? `EP · ${release.trackCount} ${t.tracks.tracksWord}`
      : release.type === "ALBUM"
        ? `${t.tracks.album} · ${release.trackCount} ${t.tracks.tracksWord}`
        : release.type === "COMPILATION"
          ? `${t.tracks.compilation} · ${release.trackCount} ${t.tracks.tracksWord}`
          : t.tracks.single;

  const collab = collaboratorLabel(release, lang);
  const otherLangPath = releasePagePath(release, lang === "es" ? "en" : "es");
  const bioFirst = t.about.bio.split(/\n\s*\n/)[0] ?? "";

  return (
    <LangContext.Provider value={lang}>
      <div className="min-h-screen bg-ink-950 text-gray-100 antialiased">
        <header className="border-b border-white/[0.08]">
          <nav className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-5 py-4 min-[700px]:px-8">
            <a
              href={home}
              className="font-display text-sm font-semibold uppercase tracking-[0.04em] text-white no-underline"
            >
              ← Kalamarico
            </a>
            <div className="flex items-center gap-5">
              <a
                href={`${home}#tracks`}
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-300 no-underline transition-colors duration-200 hover:text-white"
              >
                {t.release.breadcrumbReleases}
              </a>
              {otherLangPath && (
                <a
                  href={otherLangPath}
                  hrefLang={lang === "es" ? "en" : "es"}
                  className="inline-flex items-center border border-white/[0.14] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-300 no-underline transition-colors duration-200 hover:border-accent hover:text-white"
                >
                  {t.nav.otherLang}
                </a>
              )}
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-[1080px] px-5 pb-20 pt-10 min-[700px]:px-8 min-[700px]:pt-16">
          <div className="grid grid-cols-1 gap-8 min-[800px]:grid-cols-[minmax(0,420px)_1fr] min-[800px]:gap-14">
            <figure className="m-0">
              <img
                src={release.coverArt}
                alt={t.release.coverAlt(release.name)}
                width={640}
                height={640}
                decoding="async"
                className="aspect-square w-full border border-white/[0.08] object-cover"
              />
            </figure>

            <div className="flex min-w-0 flex-col">
              <p className="m-0 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                {catalogCode(release)} · {formatLabel}
              </p>

              <h1
                className="m-0 mt-5 font-display font-semibold leading-[0.98] tracking-[-0.025em] text-white [text-wrap:balance]"
                style={{ fontSize: "clamp(34px, 7vw, 64px)" }}
              >
                {release.name}
              </h1>
              {collab && (
                <p className="m-0 mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-soft">
                  {collab}
                </p>
              )}

              <div className="mt-8 grid grid-cols-3 divide-x divide-white/[0.14] border-y border-white/[0.14]">
                <MetaCell label={t.tracks.format} value={formatLabel} />
                <MetaCell
                  label={t.tracks.released}
                  value={formatDay(release, lang)}
                />
                <MetaCell
                  label={t.tracks.labelWord}
                  value={
                    release.label ??
                    (release.type === "EP" ? "Beta-Time Records" : "Kalamarico")
                  }
                />
              </div>

              {release.tracks && release.tracks.length > 0 && (
                <div className="mt-8">
                  <p className="m-0 mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-gray-500">
                    {t.release.tracklist}
                  </p>
                  <ol className="m-0 list-none border-t border-white/[0.08] p-0">
                    {release.tracks.map((tr, i) => (
                      <li
                        key={tr.id}
                        className="grid items-center gap-3 border-b border-white/[0.08] py-2.5 [grid-template-columns:32px_1fr_auto] min-[700px]:gap-4 min-[700px]:py-3"
                      >
                        <span className="font-mono text-[11px] tracking-[0.18em] text-gray-500">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-[14px] font-medium text-gray-100 min-[700px]:text-[15px]">
                          {tr.name}
                        </span>
                        <span className="font-mono text-[12px] text-gray-400">
                          {formatDuration(tr.durationMs)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-2 min-[700px]:gap-3">
                <a
                  href={release.spotifyUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center gap-2.5 bg-accent px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-950 no-underline transition-colors duration-200 hover:bg-accent-soft"
                >
                  <FaSpotify size={14} aria-hidden /> {t.release.openInSpotify}
                </a>
                <a
                  href={SOUNDCLOUD}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center gap-2.5 border border-white/[0.14] bg-transparent px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-white no-underline transition-colors duration-200 hover:border-accent hover:text-accent-soft"
                >
                  <FaSoundcloud size={14} aria-hidden /> SoundCloud
                </a>
              </div>
            </div>
          </div>

          <section className="mt-16 border-t border-white/[0.08] pt-10 min-[700px]:mt-20">
            <h2 className="m-0 font-display text-[22px] font-semibold tracking-[-0.015em] text-white min-[700px]:text-[28px]">
              {t.release.aboutArtist}
            </h2>
            <p className="m-0 mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-soft">
              {t.hero.eyebrow} · Madrid
            </p>
            <p className="m-0 mt-5 max-w-[64ch] text-[15px] leading-[1.65] text-gray-300 min-[700px]:text-[16px]">
              {bioFirst}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={home}
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-soft no-underline transition-colors duration-200 hover:text-accent"
              >
                {t.release.moreAbout} →
              </a>
              <a
                href={`${home}#tracks`}
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-300 no-underline transition-colors duration-200 hover:text-white"
              >
                <FaPlay size={9} aria-hidden /> {t.release.fullDiscography} →
              </a>
            </div>
          </section>

          {(prev || next) && (
            <nav className="mt-12 grid grid-cols-1 gap-px border border-white/[0.08] bg-white/[0.08] min-[700px]:grid-cols-2">
              {prev ? (
                <AdjacentLink
                  release={prev}
                  lang={lang}
                  tag={t.release.previous}
                  arrow="←"
                />
              ) : (
                <span className="hidden bg-ink-950 min-[700px]:block" />
              )}
              {next ? (
                <AdjacentLink
                  release={next}
                  lang={lang}
                  tag={t.release.next}
                  arrow="→"
                  alignEnd
                />
              ) : (
                <span className="hidden bg-ink-950 min-[700px]:block" />
              )}
            </nav>
          )}
        </main>

        <footer className="border-t border-white/[0.08] px-5 py-6 min-[700px]:px-8">
          <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500 min-[700px]:text-[10px]">
            <span>
              © {new Date().getFullYear()}{" "}
              <b className="font-medium text-gray-300">Kalamarico</b> /
              Beta-Time Records
            </span>
            <a
              href={home}
              className="text-accent-soft no-underline transition-colors duration-200 hover:text-accent"
            >
              kalamarico.com
            </a>
          </div>
        </footer>
      </div>
    </LangContext.Provider>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 px-3 py-4 min-[900px]:px-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">
        {label}
      </span>
      <span className="font-display text-[15px] font-semibold tracking-[-0.005em] text-white min-[700px]:text-[17px]">
        {value}
      </span>
    </div>
  );
}

function AdjacentLink({
  release,
  lang,
  tag,
  arrow,
  alignEnd,
}: {
  release: Release;
  lang: Lang;
  tag: string;
  arrow: string;
  alignEnd?: boolean;
}) {
  const href = releasePagePath(release, lang) ?? langBase(lang);
  return (
    <a
      href={href}
      className={`group flex flex-col gap-2 bg-ink-950 p-5 no-underline transition-colors duration-200 hover:bg-ink-900 ${
        alignEnd ? "items-end text-right" : ""
      }`}
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gray-500">
        {alignEnd ? `${tag} ${arrow}` : `${arrow} ${tag}`}
      </span>
      <span className="font-display text-[16px] font-semibold tracking-[-0.01em] text-white transition-colors duration-200 group-hover:text-accent-soft">
        {release.name}
      </span>
    </a>
  );
}
