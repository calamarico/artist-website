import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { artist } from "./src/data/artist";
import { generateMarkdown } from "./src/lib/generateMarkdown";
import { generateJsonLd } from "./src/lib/generateJsonLd";

/**
 * Emits dist/index.md at build time so a Cloudflare Pages Function (or any
 * edge middleware) can serve it when an agent sends `Accept: text/markdown`.
 * Source of truth is src/data/artist.ts — no duplication.
 */
function markdownForAgents(): Plugin {
  return {
    name: "markdown-for-agents",
    apply: "build",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "index.md",
        source: generateMarkdown(artist),
      });
    },
  };
}

/**
 * Injects Schema.org MusicGroup JSON-LD into index.html during dev and build,
 * keeping it in sync with src/data/artist.ts so crawlers (Google Knowledge
 * Panel, LLM search) always see the full release catalog.
 */
function jsonLdForCrawlers(): Plugin {
  return {
    name: "jsonld-for-crawlers",
    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: generateJsonLd(artist),
          injectTo: "head",
        },
      ];
    },
  };
}

export default defineConfig({
  plugins: [react(), markdownForAgents(), jsonLdForCrawlers()],
  base: "/",
});
