import { motion } from "framer-motion";
import { HiExternalLink } from "react-icons/hi";
import { SiBeatport } from "react-icons/si";
import { artist } from "../data/artist";

export function Label() {
  const { label } = artist;

  return (
    <section
      id="label"
      className="relative border-t border-ink-700/60 bg-ink-900 py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-ink-700 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-8 sm:p-12 md:p-16"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-[120px]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-accent-glow/15 blur-[120px]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-grid opacity-30"
          />

          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">
              The Label
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {label.name}
            </h2>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {label.role}
            </div>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300">
              Curating and releasing electronic music that pushes the boundaries
              of techno and electronic sound.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={label.website}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-glow"
              >
                <HiExternalLink size={18} aria-hidden />
                Visit website
              </a>
              <a
                href={label.beatport}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-900/70 px-5 py-3 text-sm font-semibold text-gray-100 transition hover:border-accent hover:text-white"
              >
                <SiBeatport size={18} aria-hidden />
                Beatport
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
