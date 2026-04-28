import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { artist } from "./src/data/artist";
import { generateMarkdown } from "./src/lib/generateMarkdown";

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

export default defineConfig({
  plugins: [react(), markdownForAgents()],
  base: "/",
});
