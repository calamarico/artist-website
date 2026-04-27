import { motion } from "framer-motion";
import { artist } from "../data/artist";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export function About() {
  const paragraphs = artist.bio.split(/\n\s*\n/);

  return (
    <section
      id="about"
      className="relative border-t border-ink-700/60 bg-ink-950 py-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:gap-16">
        <motion.div {...fadeIn} className="relative">
          <div className="sticky top-28">
            <PortraitPlaceholder />
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/60 px-3 py-1 text-xs font-mono uppercase tracking-wider text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Kalamarico — Madrid
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeIn} transition={{ duration: 0.6, delay: 0.1 }}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">
            About
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Sound exploration, <span className="text-gradient-accent">always evolving</span>.
          </h2>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-gray-300 sm:text-lg">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500">
              Released on
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {artist.labels.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-ink-700 bg-ink-900/60 px-3 py-1 text-sm text-gray-200 hover:border-accent hover:text-white transition-colors"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PortraitPlaceholder() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
      <svg
        viewBox="0 0 400 500"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="portraitBg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#0a0a0c" />
            <stop offset="100%" stopColor="#1a1a1f" />
          </linearGradient>
          <linearGradient id="portraitAccent" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#bef264" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0.4" />
          </linearGradient>
          <pattern
            id="portraitGrid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="rgba(163,230,53,0.12)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="400" height="500" fill="url(#portraitBg)" />
        <rect width="400" height="500" fill="url(#portraitGrid)" />
        <circle cx="200" cy="220" r="120" fill="url(#portraitAccent)" opacity="0.65" />
        <circle cx="200" cy="220" r="80" fill="#0a0a0c" />
        <path
          d="M80 380 Q200 320 320 380 L320 500 L80 500 Z"
          fill="url(#portraitAccent)"
          opacity="0.45"
        />
        <g stroke="#a3e635" strokeOpacity="0.45" strokeWidth="1">
          <line x1="0" y1="120" x2="400" y2="120" />
          <line x1="0" y1="380" x2="400" y2="380" />
        </g>
        <text
          x="20"
          y="478"
          fontFamily="JetBrains Mono, monospace"
          fontSize="12"
          fill="#6b7280"
          letterSpacing="2"
        >
          K — MADRID — 01
        </text>
      </svg>
    </div>
  );
}
