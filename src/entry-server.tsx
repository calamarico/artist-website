import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { ReleasePage } from "./pages/ReleasePage";
import type { Release } from "./data/artist";
import type { Lang } from "./lib/i18n";

/**
 * SSR entry used only at build time by scripts/prerender.ts. It renders the
 * home page (per language) and every release page to static HTML, and
 * re-exports the catalog/SEO helpers the prerender script needs so all data
 * flows from src/data/artist.ts through one bundle.
 */
export function render(lang: Lang = "en"): string {
  return renderToString(
    <StrictMode>
      <App lang={lang} />
    </StrictMode>,
  );
}

export function renderRelease(release: Release, lang: Lang): string {
  return renderToString(<ReleasePage release={release} lang={lang} />);
}

export { releasesWithPages, releaseSlug } from "./lib/catalog";
export {
  ORIGIN,
  releaseCanonical,
  releaseDescription,
  releaseJsonLd,
  releaseTitle,
} from "./lib/releaseSeo";
export { STRINGS } from "./lib/i18n";
