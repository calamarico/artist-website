/**
 * Post-build prerender step.
 *
 * Run after `vite build` (client → dist/) and
 * `vite build --ssr src/entry-server.tsx --outDir dist-ssr`:
 *   1. renders the app to static HTML via the SSR bundle,
 *   2. injects it into dist/index.html replacing the <!--app-html--> marker,
 *   3. stamps <lastmod> in dist/sitemap.xml with the build date,
 *   4. removes the intermediate dist-ssr/ bundle.
 *
 * The deployed HTML therefore contains the full page content (bio,
 * discography, videos) for crawlers that don't execute JS; main.tsx
 * hydrates it on the client.
 */
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const APP_HTML_MARKER = "<!--app-html-->";

async function main() {
  const ssrEntry = resolve(ROOT, "dist-ssr/entry-server.js");
  const { render } = (await import(pathToFileURL(ssrEntry).href)) as {
    render: () => string;
  };

  const indexPath = resolve(ROOT, "dist/index.html");
  const template = readFileSync(indexPath, "utf8");
  if (!template.includes(APP_HTML_MARKER)) {
    throw new Error(
      `dist/index.html is missing the ${APP_HTML_MARKER} marker inside #root`,
    );
  }
  const appHtml = render();
  writeFileSync(indexPath, template.replace(APP_HTML_MARKER, appHtml));
  console.log(
    `[prerender] dist/index.html: injected ${appHtml.length} bytes of static markup`,
  );

  const sitemapPath = resolve(ROOT, "dist/sitemap.xml");
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = readFileSync(sitemapPath, "utf8").replace(
    /<lastmod>.*?<\/lastmod>/,
    `<lastmod>${today}</lastmod>`,
  );
  writeFileSync(sitemapPath, sitemap);
  console.log(`[prerender] dist/sitemap.xml: lastmod → ${today}`);

  rmSync(resolve(ROOT, "dist-ssr"), { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
