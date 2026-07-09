import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

console.log(
  `%c Designed by:\n` +
  `%c` +
  ` ██╗  ██╗ █████╗ ██╗      █████╗ ███╗   ███╗ █████╗ ██████╗ ██╗ ██████╗ ██████╗ \n` +
  ` ██║ ██╔╝██╔══██╗██║     ██╔══██╗████╗ ████║██╔══██╗██╔══██╗██║██╔════╝██╔═══██╗\n` +
  ` █████╔╝ ███████║██║     ███████║██╔████╔██║███████║██████╔╝██║██║     ██║   ██║\n` +
  ` ██╔═██╗ ██╔══██║██║     ██╔══██║██║╚██╔╝██║██╔══██║██╔══██╗██║██║     ██║   ██║\n` +
  ` ██║  ██╗██║  ██║███████╗██║  ██║██║ ╚═╝ ██║██║  ██║██║  ██║██║╚██████╗╚██████╔╝\n` +
  ` ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═════╝ \n\n` +
  ` 🔗 @calamarico\n`,
  'color: #aaa; font-size: 14px; font-weight: normal;',
  'color: #e0a0ff; font-size: 10px; font-family: monospace; font-weight: bold;'
)

if (!rootElement) throw new Error("Root element #root not found");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production builds ship prerendered markup inside #root (see
// scripts/prerender.ts) — hydrate it. In dev the div only holds the
// <!--app-html--> comment (no elements), so render from scratch.
if (rootElement.firstElementChild) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
