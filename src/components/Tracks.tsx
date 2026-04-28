import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaSpotify } from "react-icons/fa";
import { HiPlay } from "react-icons/hi";
import { artist, type Release } from "../data/artist";

type Filter = "all" | "single" | "ep";

const FEATURED_COUNT = 3;

const dateLong = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatReleaseDate(release: Release): string {
  if (release.datePrecision === "YEAR") return String(new Date(release.date).getUTCFullYear());
  return dateLong.format(new Date(release.date));
}

function formatYear(release: Release): string {
  return String(new Date(release.date).getUTCFullYear());
}

export function Tracks() {
  const [filter, setFilter] = useState<Filter>("all");

  const releases = artist.releases;
  const featured = releases.slice(0, FEATURED_COUNT);

  const filtered = useMemo(() => {
    if (filter === "all") return releases;
    const target = filter === "ep" ? "EP" : "SINGLE";
    return releases.filter((r) => r.type === target);
  }, [releases, filter]);

  const counts = useMemo(
    () => ({
      all: releases.length,
      single: releases.filter((r) => r.type === "SINGLE").length,
      ep: releases.filter((r) => r.type === "EP").length,
    }),
    [releases],
  );

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
          <p className="max-w-md text-base leading-relaxed text-gray-300 sm:text-lg">
            My latest three. Full catalogue follows.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((release, i) => (
            <FeaturedCard key={release.id} release={release} index={i} />
          ))}
        </ul>

        <div className="mt-24 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">
              Full catalogue
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Every release, in one place
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              {counts.all} releases on Spotify — singles and EPs from {formatYear(releases[releases.length - 1])} to today.
            </p>
          </div>

          <FilterTabs value={filter} onChange={setFilter} counts={counts} />
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((release, i) => (
            <ReleaseCard key={release.id} release={release} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FeaturedCard({ release, index }: { release: Release; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <a
        href={release.spotifyUrl}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Listen to ${release.name} on Spotify`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-800/70 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-2xl hover:shadow-accent/20"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative aspect-square overflow-hidden rounded-xl bg-ink-900">
          <img
            src={release.coverArt}
            alt={`${release.name} cover art`}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/0 to-ink-950/0 opacity-90"
          />
          <span className="absolute left-3 top-3 rounded-full border border-ink-700/60 bg-ink-950/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-soft backdrop-blur">
            {release.type === "EP" ? `EP · ${release.trackCount}` : "Single"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
            {formatReleaseDate(release)}
          </span>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-white">
            {release.name}
          </h3>

          <div className="mt-auto flex items-center justify-between pt-6">
            <span className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-200">
              <FaSpotify
                className="text-accent-soft transition-colors"
                size={16}
                aria-hidden
              />
              Play on Spotify
            </span>
            <span
              aria-hidden
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 bg-ink-900 text-accent-soft transition-all group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
            >
              <HiPlay size={20} />
            </span>
          </div>
        </div>
      </a>
    </motion.li>
  );
}

function ReleaseCard({ release, index }: { release: Release; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: Math.min(index, 12) * 0.04, ease: "easeOut" }}
    >
      <a
        href={release.spotifyUrl}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Listen to ${release.name} on Spotify`}
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-ink-700 bg-ink-800/70 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-accent/15"
      >
        <div className="relative aspect-square overflow-hidden bg-ink-900">
          <img
            src={release.coverArt}
            alt={`${release.name} cover art`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/40"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-ink-950 shadow-lg shadow-accent/40">
              <HiPlay size={22} />
            </span>
          </span>
          {release.type === "EP" && (
            <span className="absolute left-2 top-2 rounded-full border border-ink-700/60 bg-ink-950/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent-soft backdrop-blur">
              EP · {release.trackCount}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3">
          <h3 className="font-display text-base font-semibold leading-snug text-white line-clamp-2">
            {release.name}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
            {formatYear(release)}
          </span>
        </div>
      </a>
    </motion.li>
  );
}

function FilterTabs({
  value,
  onChange,
  counts,
}: {
  value: Filter;
  onChange: (v: Filter) => void;
  counts: { all: number; single: number; ep: number };
}) {
  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "single", label: "Singles", count: counts.single },
    { key: "ep", label: "EPs", count: counts.ep },
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter releases by type"
      className="inline-flex items-center gap-1 rounded-full border border-ink-700 bg-ink-800/70 p-1"
    >
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={`relative rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
              active
                ? "bg-accent text-ink-950"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 text-[10px] ${
                active ? "text-ink-950/70" : "text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
