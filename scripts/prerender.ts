/**
 * Post-build prerender step.
 *
 * Runs after `vite build` (client → dist/) and
 * `vite build --ssr src/entry-server.tsx --outDir dist-ssr`. Emits:
 *   - dist/index.html            — English home with static markup baked in
 *   - dist/es/index.html         — Spanish home (localized <head> + markup)
 *   - dist{,/es}/releases/{slug}/index.html — zero-JS release landing pages
 *   - dist/sitemap.xml           — every URL with hreflang alternates
 * then removes the intermediate dist-ssr/ bundle.
 *
 * The SPA pages keep their JS bundle and hydrate (main.tsx); release pages
 * are pure HTML styled by the same built stylesheet.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

type Lang = "en" | "es";

interface Release {
  id: string;
  name: string;
  type: string;
  date: string;
  coverArt: string;
}

interface SsrBundle {
  render: (lang: Lang) => string;
  renderRelease: (release: Release, lang: Lang) => string;
  releasesWithPages: () => Release[];
  releaseSlug: (release: Release) => string | null;
  releaseCanonical: (release: Release, lang: Lang) => string;
  releaseTitle: (release: Release, lang: Lang) => string;
  releaseDescription: (release: Release, lang: Lang) => string;
  releaseJsonLd: (release: Release, lang: Lang) => string;
  ORIGIN: string;
  STRINGS: Record<Lang, { meta: Record<string, string> }>;
}

const ROOT = resolve(import.meta.dirname, "..");
const DIST = resolve(ROOT, "dist");
const APP_HTML_MARKER = "<!--app-html-->";

/** String replace that fails the build if the needle is missing. */
function mustReplace(html: string, from: string, to: string): string {
  if (!html.includes(from)) {
    throw new Error(`prerender: expected to find in template: ${from}`);
  }
  return html.replace(from, to);
}

function writeFile(relPath: string, content: string) {
  const abs = resolve(DIST, relPath);
  mkdirSync(resolve(abs, ".."), { recursive: true });
  writeFileSync(abs, content);
}

async function main() {
  const ssrEntry = resolve(ROOT, "dist-ssr/entry-server.js");
  const ssr = (await import(pathToFileURL(ssrEntry).href)) as SsrBundle;

  const template = readFileSync(resolve(DIST, "index.html"), "utf8");
  if (!template.includes(APP_HTML_MARKER)) {
    throw new Error(
      `dist/index.html is missing the ${APP_HTML_MARKER} marker inside #root`,
    );
  }

  const cssHref = template.match(/\/assets\/index-[\w-]+\.css/)?.[0];
  if (!cssHref) throw new Error("prerender: built CSS asset not found");

  // ---- Home, English -------------------------------------------------
  writeFile("index.html", template.replace(APP_HTML_MARKER, ssr.render("en")));

  // ---- Home, Spanish -------------------------------------------------
  const esMeta = ssr.STRINGS.es.meta;
  let es = template;
  es = mustReplace(es, '<html lang="en">', '<html lang="es">');
  es = mustReplace(
    es,
    "<title>Kalamarico — DJ & Electronic Music Producer · Madrid</title>",
    `<title>${esMeta.title}</title>`,
  );
  es = mustReplace(
    es,
    'content="Kalamarico — DJ & electronic music producer from Madrid. Techno releases on Beta-Time Records. Listen on Spotify, Apple Music, Beatport and more."',
    `content="${esMeta.description}"`,
  );
  es = mustReplace(
    es,
    '<link rel="canonical" href="https://kalamarico.com/" />',
    '<link rel="canonical" href="https://kalamarico.com/es/" />',
  );
  es = mustReplace(
    es,
    '<meta property="og:title" content="Kalamarico — DJ & Electronic Music Producer" />',
    `<meta property="og:title" content="${esMeta.ogTitle}" />`,
  );
  es = mustReplace(
    es,
    '<meta property="og:description" content="DJ & electronic music producer from Madrid. Co-CEO of Beta-Time Records." />',
    `<meta property="og:description" content="${esMeta.ogDescription}" />`,
  );
  es = mustReplace(
    es,
    '<meta property="og:url" content="https://kalamarico.com/" />',
    '<meta property="og:url" content="https://kalamarico.com/es/" />',
  );
  es = mustReplace(
    es,
    '<meta property="og:locale" content="en_US" />',
    '<meta property="og:locale" content="es_ES" />\n    <meta property="og:locale:alternate" content="en_US" />',
  );
  es = mustReplace(
    es,
    '<meta property="og:image:alt" content="Kalamarico — DJ & electronic music producer from Madrid" />',
    '<meta property="og:image:alt" content="Kalamarico — DJ y productor de música electrónica de Madrid" />',
  );
  es = mustReplace(
    es,
    '<meta name="twitter:title" content="Kalamarico — DJ & Electronic Music Producer" />',
    `<meta name="twitter:title" content="${esMeta.ogTitle}" />`,
  );
  es = mustReplace(
    es,
    '<meta name="twitter:description" content="DJ & electronic music producer from Madrid. Co-CEO of Beta-Time Records." />',
    `<meta name="twitter:description" content="${esMeta.ogDescription}" />`,
  );
  es = mustReplace(
    es,
    '<meta name="twitter:image:alt" content="Kalamarico — DJ & electronic music producer from Madrid" />',
    '<meta name="twitter:image:alt" content="Kalamarico — DJ y productor de música electrónica de Madrid" />',
  );
  writeFile("es/index.html", es.replace(APP_HTML_MARKER, ssr.render("es")));

  // ---- Release pages (both languages, zero JS) ------------------------
  const releases = ssr.releasesWithPages();
  const langs: Lang[] = ["en", "es"];
  for (const release of releases) {
    const slug = ssr.releaseSlug(release);
    if (!slug) continue;
    for (const lang of langs) {
      const doc = releaseDocument(ssr, release, lang, cssHref);
      const prefix = lang === "es" ? "es/" : "";
      writeFile(`${prefix}releases/${slug}/index.html`, doc);
    }
  }

  // ---- Sitemap ---------------------------------------------------------
  const today = new Date().toISOString().slice(0, 10);
  writeFile("sitemap.xml", sitemap(ssr, releases, today));

  console.log(
    `[prerender] home ×2 + ${releases.length * 2} release pages + sitemap (${
      releases.length * 2 + 2
    } URLs)`,
  );

  rmSync(resolve(ROOT, "dist-ssr"), { recursive: true, force: true });
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function releaseDocument(
  ssr: SsrBundle,
  release: Release,
  lang: Lang,
  cssHref: string,
): string {
  const title = escapeAttr(ssr.releaseTitle(release, lang));
  const description = escapeAttr(ssr.releaseDescription(release, lang));
  const canonical = ssr.releaseCanonical(release, lang);
  const altEn = ssr.releaseCanonical(release, "en");
  const altEs = ssr.releaseCanonical(release, "es");
  const ogType = release.type === "SINGLE" ? "music.song" : "music.album";
  const locale = lang === "es" ? "es_ES" : "en_US";
  const altLocale = lang === "es" ? "en_US" : "es_ES";
  const body = ssr.renderRelease(release, lang);
  const jsonLd = ssr.releaseJsonLd(release, lang);

  return `<!doctype html>
<html lang="${lang}" data-theme="green">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="author" content="Kalamarico" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="theme-color" content="#0a0a0a" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="en" href="${altEn}" />
    <link rel="alternate" hreflang="es" href="${altEs}" />
    <link rel="alternate" hreflang="x-default" href="${altEn}" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta property="og:site_name" content="Kalamarico" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="${locale}" />
    <meta property="og:locale:alternate" content="${altLocale}" />
    <meta property="og:image" content="${release.coverArt}" />
    <meta property="og:image:width" content="640" />
    <meta property="og:image:height" content="640" />
    <meta property="og:image:alt" content="${escapeAttr(release.name)}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${release.coverArt}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
    <link rel="stylesheet" href="${cssHref}" />
    <link rel="preload" as="image" href="${release.coverArt}" fetchpriority="high" />
    <script type="application/ld+json">
${jsonLd}
    </script>
  </head>
  <body>
    ${body}
  </body>
</html>
`;
}

function sitemap(ssr: SsrBundle, releases: Release[], lastmod: string): string {
  const alternates = (en: string, es: string) =>
    `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="es" href="${es}"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>`;

  const url = (loc: string, en: string, es: string) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates(en, es)}\n  </url>`;

  const home = `${ssr.ORIGIN}/`;
  const homeEs = `${ssr.ORIGIN}/es/`;
  const entries = [url(home, home, homeEs), url(homeEs, home, homeEs)];

  for (const release of releases) {
    const en = ssr.releaseCanonical(release, "en");
    const es = ssr.releaseCanonical(release, "es");
    entries.push(url(en, en, es), url(es, en, es));
  }

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    entries.join("\n") +
    "\n</urlset>\n"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
