import { motion } from "framer-motion";
import { HiPlay } from "react-icons/hi";
import { FaSoundcloud } from "react-icons/fa";
import { artist, type Track } from "../data/artist";

export function Tracks() {
  return (
    <section
      id="tracks"
      className="relative border-t border-ink-700/60 bg-ink-900 py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">
              Discography
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Latest <span className="text-gradient-accent">Releases</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-gray-400">
            Selected tracks streaming on SoundCloud. Click any card to play.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {artist.tracks.map((track, i) => (
            <TrackCard key={track.url} track={track} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function TrackCard({ track, index }: { track: Track; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
    >
      <a
        href={track.url}
        target="_blank"
        rel="noreferrer noopener"
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-800/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-2xl hover:shadow-accent/20"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
            {track.year}
          </span>
          <FaSoundcloud
            className="text-gray-600 transition-colors group-hover:text-accent-soft"
            size={18}
            aria-hidden
          />
        </div>

        <h3 className="mt-8 font-display text-2xl font-semibold leading-tight text-white">
          {track.title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-8">
          <span className="text-sm text-gray-400 group-hover:text-gray-200">
            Play on SoundCloud
          </span>
          <span
            aria-hidden
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 bg-ink-900 text-accent-soft transition-all group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
          >
            <HiPlay size={20} />
          </span>
        </div>
      </a>
    </motion.li>
  );
}
