import { FaPlay } from "react-icons/fa";
import { LangContext, langBase, STRINGS, type Lang } from "../lib/i18n";

/**
 * Standalone static 404, prerendered at build time to dist/404.html (and
 * /es/404.html). Cloudflare Pages serves the nearest 404.html with a real
 * 404 status, which is what keeps unknown URLs from answering 200 with the
 * home page. Ships zero JavaScript and carries `noindex` (see the head in
 * scripts/prerender.ts) — it must never be indexed.
 */
export function NotFoundPage({ lang }: { lang: Lang }) {
  const t = STRINGS[lang];
  const home = langBase(lang);

  return (
    <LangContext.Provider value={lang}>
      <div className="flex min-h-screen flex-col bg-ink-950 text-gray-100 antialiased">
        <header className="border-b border-white/[0.08]">
          <nav className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-5 py-4 min-[700px]:px-8">
            <a
              href={home}
              className="font-display text-sm font-semibold uppercase tracking-[0.04em] text-white no-underline"
            >
              ← Kalamarico
            </a>
            <a
              href={lang === "es" ? "/404.html" : "/es/404.html"}
              hrefLang={lang === "es" ? "en" : "es"}
              className="inline-flex items-center border border-white/[0.14] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-300 no-underline transition-colors duration-200 hover:border-accent hover:text-white"
            >
              {t.nav.otherLang}
            </a>
          </nav>
        </header>

        <main className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col justify-center px-5 py-20 min-[700px]:px-8">
          <p className="m-0 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {t.notFound.code}
          </p>

          <h1
            className="m-0 mt-5 max-w-[20ch] font-display font-semibold leading-[0.98] tracking-[-0.025em] text-white [text-wrap:balance]"
            style={{ fontSize: "clamp(34px, 7vw, 64px)" }}
          >
            {t.notFound.heading}
          </h1>

          <p className="m-0 mt-6 max-w-[58ch] text-[15px] leading-[1.65] text-gray-300 min-[700px]:text-[16px]">
            {t.notFound.lead}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-2 min-[700px]:gap-3">
            <a
              href={home}
              className="inline-flex items-center justify-center gap-2.5 bg-accent px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-950 no-underline transition-colors duration-200 hover:bg-accent-soft"
            >
              {t.notFound.backHome}
            </a>
            <a
              href={`${home}#tracks`}
              className="inline-flex items-center justify-center gap-2.5 border border-white/[0.14] bg-transparent px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-white no-underline transition-colors duration-200 hover:border-accent hover:text-accent-soft"
            >
              <FaPlay size={9} aria-hidden /> {t.notFound.seeReleases}
            </a>
          </div>
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
