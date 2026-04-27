# Kalamarico — Artist Website

Single-page artist site for **Kalamarico** — Electronic Music Producer and Co-CEO of Beta-Time Records. Built with Vite + React + TypeScript + Tailwind CSS.

## Stack

- **Vite 5** + **React 18** + **TypeScript** (strict)
- **Tailwind CSS v3** with a small dark palette + electric purple (`#7c3aed`) accent
- **framer-motion** for fade-in-on-scroll
- **react-icons** for platform iconography

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build locally
```

## Project structure

```
artist-website/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Tracks.tsx
│   │   ├── Streaming.tsx
│   │   ├── Label.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── artist.ts        # all static content lives here
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── tsconfig.json
```

## Editing content

All copy, links, tracks, and platform URLs live in [src/data/artist.ts](src/data/artist.ts). Update that file to change what the site renders — no component changes needed.

## Deploying

The build outputs static files to `dist/`. Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3+CloudFront). `vite.config.ts` uses `base: "/"`; if hosting under a subpath, change it accordingly.
