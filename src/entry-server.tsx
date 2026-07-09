import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

/**
 * SSR entry used only at build time by scripts/prerender.ts to bake the
 * initial page markup into dist/index.html. The client (main.tsx) hydrates
 * this markup instead of rendering from scratch, so crawlers that don't run
 * JS (Bing, LLM agents) — and Google's first, unrendered pass — see the full
 * content.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
