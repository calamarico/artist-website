/**
 * Cloudflare Pages Function — Markdown content negotiation for agents.
 *
 * Spec: https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md
 *
 * Runs as middleware on every request. When the client's `Accept` header
 * advertises `text/markdown` AND we're on a path that has a markdown
 * representation, fetches the pre-built `/index.md` (emitted at build time
 * by the markdownForAgents Vite plugin) and returns it with proper headers.
 * Otherwise falls through to the default static asset (HTML).
 *
 * NOTE: this file lives outside the `src/` TypeScript project and is
 * compiled by Cloudflare Pages' own toolchain at deploy time. Local
 * `tsc -b` does not type-check it.
 */

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
}

interface Context {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}

// Map HTML page paths → their markdown counterpart. Single-page site for now.
const MARKDOWN_FOR_PATH: Record<string, string> = {
  "/": "/index.md",
  "/index.html": "/index.md",
};

export const onRequest = async (context: Context): Promise<Response> => {
  const { request, env, next } = context;

  if (request.method !== "GET" && request.method !== "HEAD") {
    return next();
  }

  const url = new URL(request.url);
  const mdPath = MARKDOWN_FOR_PATH[url.pathname];
  if (!mdPath) {
    return next();
  }

  const accept = request.headers.get("accept") ?? "";
  if (!wantsMarkdown(accept)) {
    return next();
  }

  // Fetch the static index.md from this same Pages deployment.
  const mdRequest = new Request(new URL(mdPath, request.url).toString(), {
    method: "GET",
  });
  const mdResponse = await env.ASSETS.fetch(mdRequest);
  if (!mdResponse.ok) {
    return next();
  }

  if (request.method === "HEAD") {
    return new Response(null, {
      status: 200,
      headers: buildHeaders(""),
    });
  }

  const text = await mdResponse.text();
  return new Response(text, {
    status: 200,
    headers: buildHeaders(text),
  });
};

function wantsMarkdown(accept: string): boolean {
  // Parse Accept header. Match only when `text/markdown` is explicitly listed
  // — `*/*` from browsers should keep getting HTML.
  const parts = accept.toLowerCase().split(",");
  for (const part of parts) {
    const type = part.split(";")[0]?.trim();
    if (type === "text/markdown") return true;
  }
  return false;
}

function buildHeaders(text: string): HeadersInit {
  return {
    "content-type": "text/markdown; charset=utf-8",
    "x-markdown-tokens": String(estimateTokens(text)),
    vary: "Accept",
    // 5 min edge cache, then revalidate. Markdown is rebuilt on each deploy.
    "cache-control": "public, max-age=300, must-revalidate",
    // Be explicit that this content is fine for agents.
    "content-signal": "ai-train=yes, search=yes, ai-input=yes",
  };
}

function estimateTokens(text: string): number {
  // Rough tiktoken-style heuristic: 1 token ≈ 4 chars for English/markdown.
  // Good enough for the optional `x-markdown-tokens` header.
  return Math.max(1, Math.ceil(text.length / 4));
}
