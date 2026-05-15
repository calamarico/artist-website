import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { artist, type Release } from "../data/artist";
import {
  catalogCode,
  collaboratorLabel,
  formatDay,
  formatMonth,
  isAppearsOn,
  otherArtists,
  releaseNumber,
  releaseYear,
} from "../lib/catalog";
import { Cover } from "./Cover";
import { SectionHead } from "./SectionHead";

const STREAM_LABELS = new Set([
  "Spotify",
  "SoundCloud",
  "Apple Music",
  "Deezer",
  "Tidal",
  "Bandcamp",
  "Beatport",
]);

type Filter = "all" | "single" | "ep";
type View = "grid" | "list" | "timeline";

const FEATURED_COUNT = 3;

function readView(): View {
  if (typeof window === "undefined") return "timeline";
  const v = new URLSearchParams(window.location.search).get("view");
  return v === "grid" || v === "list" ? v : "timeline";
}

function writeView(v: View) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (v === "timeline") url.searchParams.delete("view");
  else url.searchParams.set("view", v);
  window.history.replaceState(null, "", url.toString());
}

type Props = {
  onOpenRelease: (release: Release) => void;
};

export function Tracks({ onOpenRelease }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>(readView);

  useEffect(() => writeView(view), [view]);

  const releases = artist.releases;
  const featured = releases
    .filter((r) => r.type !== "APPEARS_ON")
    .slice(0, FEATURED_COUNT);

  const counts = useMemo(
    () => ({
      all: releases.length,
      single: releases.filter((r) => r.type === "SINGLE").length,
      ep: releases.filter((r) => r.type === "EP").length,
    }),
    [releases],
  );

  const filtered = useMemo(() => {
    if (filter === "all") return releases;
    const target = filter === "ep" ? "EP" : "SINGLE";
    return releases.filter((r) => r.type === target);
  }, [releases, filter]);

  const byYear = useMemo(() => {
    const map = new Map<number, Release[]>();
    filtered.forEach((r) => {
      const y = releaseYear(r);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(r);
    });
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  const years = useMemo(() => filtered.map(releaseYear), [filtered]);
  const yearRange =
    years.length > 0
      ? `${Math.min(...years)} → ${Math.max(...years)}`
      : "";

  const filterLabel =
    filter === "ep" ? "EPs" : filter === "single" ? "singles" : "releases";

  return (
    <section
      id="tracks"
      className="relative bg-ink-900 py-16 min-[700px]:py-20 min-[900px]:py-[120px]"
    >
      <div className="mx-auto max-w-[1280px] px-5 min-[700px]:px-8">
        <SectionHead num="02 / 05" label="Discography">
          Latest{" "}
          <span className="font-normal not-italic text-accent-soft">
            releases
          </span>
          <span
            className="block font-display font-normal text-gray-500"
            style={{
              fontSize: "0.5em",
              marginTop: 8,
              letterSpacing: 0,
            }}
          >
            three featured · full catalogue follows
          </span>
        </SectionHead>

        <ul
          className="
            mb-14 grid list-none grid-cols-1 gap-5 border-t border-white/[0.08] pt-6
            min-[700px]:mb-20 min-[700px]:gap-6 min-[700px]:pt-8
            min-[900px]:grid-cols-2
          "
        >
          {featured.map((r, i) =>
            i === 0 ? (
              <FeaturedLead
                key={r.id}
                release={r}
                onClick={() => onOpenRelease(r)}
              />
            ) : (
              <FeaturedCard
                key={r.id}
                release={r}
                index={i}
                onClick={() => onOpenRelease(r)}
              />
            ),
          )}
        </ul>

        <div
          className="
            mt-8 grid grid-cols-1 items-end gap-5
            min-[800px]:[grid-template-columns:1fr_auto] min-[800px]:gap-8
          "
        >
          <div>
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft">
              Full catalogue
            </p>
            <h3
              className="mt-3 m-0 font-display font-semibold leading-[1.1] tracking-[-0.015em] text-white"
              style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
            >
              {filtered.length} {filterLabel}
              {yearRange ? ` · ${yearRange}` : ""}
            </h3>
          </div>

          <div className="flex w-full flex-col items-stretch gap-2 min-[700px]:w-auto min-[700px]:flex-row min-[700px]:flex-wrap min-[700px]:items-center min-[700px]:gap-4">
            <Switch
              value={filter}
              onChange={setFilter}
              options={[
                { k: "all", l: `All · ${counts.all}` },
                { k: "single", l: `Singles · ${counts.single}` },
                { k: "ep", l: `EPs · ${counts.ep}` },
              ]}
            />
            <Switch
              value={view}
              onChange={setView}
              options={[
                { k: "grid", l: "Grid" },
                { k: "list", l: "List" },
                { k: "timeline", l: "Timeline" },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 min-[700px]:mt-12">
          {view === "grid" && (
            <ul
              className="
                grid list-none grid-cols-2 gap-3.5
                max-[420px]:gap-2.5
                min-[600px]:grid-cols-3 min-[600px]:gap-6
                min-[900px]:grid-cols-4
              "
            >
              {filtered.map((r, i) => (
                <GridCard
                  key={r.id}
                  release={r}
                  index={i}
                  onClick={() => onOpenRelease(r)}
                />
              ))}
            </ul>
          )}

          {view === "list" && (
            <ListView releases={filtered} onOpenRelease={onOpenRelease} />
          )}

          {view === "timeline" && (
            <Timeline byYear={byYear} onOpenRelease={onOpenRelease} />
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({
  release,
  index,
  onClick,
}: {
  release: Release;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="flex cursor-pointer flex-col gap-4"
      onClick={onClick}
    >
      <div className="aspect-square">
        <Cover release={release} />
      </div>
      <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500">
        <span className="text-accent-soft">
          {release.type === "APPEARS_ON"
            ? "Featured"
            : release.type === "EP"
              ? `EP · ${release.trackCount} tracks`
              : "Single"}
        </span>
        <span>{formatDay(release)}</span>
      </div>
      <div>
        <h3 className="m-0 font-display text-[20px] font-semibold tracking-[-0.01em] text-white transition-colors duration-200 hover:text-accent-soft min-[700px]:text-[22px]">
          {release.name}
        </h3>
        {collaboratorLabel(release) && (
          <p className="m-0 mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-soft min-[700px]:text-[11px]">
            {collaboratorLabel(release)}
          </p>
        )}
      </div>
      <span className="inline-flex items-center gap-2 pt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gray-300">
        <FaPlay size={10} aria-hidden /> Listen
      </span>
    </motion.li>
  );
}

function FeaturedLead({
  release,
  onClick,
}: {
  release: Release;
  onClick: () => void;
}) {
  const streams = artist.socials
    .filter((s) => STREAM_LABELS.has(s.label))
    .slice(0, 6);

  const d = new Date(release.date);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const monthShort = d
    .toLocaleString("en-US", { month: "short", timeZone: "UTC" })
    .toUpperCase();
  const year = d.getUTCFullYear();
  const released = `${day} · ${monthShort} · ${year}`;

  const formatLabel =
    release.type === "EP"
      ? `EP · ${release.trackCount} tracks`
      : release.type === "ALBUM" || release.type === "COMPILATION"
        ? `${release.type === "ALBUM" ? "Album" : "Comp."} · ${release.trackCount} tracks`
        : release.type === "APPEARS_ON"
          ? "Featured"
          : "Single";

  const num = String(releaseNumber(release)).padStart(3, "0");

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      className="
        group grid cursor-pointer grid-cols-1 gap-7 border-b border-white/[0.14] pb-10 mb-2
        min-[900px]:col-span-2 min-[900px]:[grid-template-columns:1.05fr_1fr] min-[900px]:gap-14
      "
    >
      <div className="relative aspect-square w-full">
        <Cover release={release} />
        <span
          className="
            absolute left-3 top-3 z-[5] inline-flex items-center gap-2
            border border-white/[0.12] px-3 py-2
            font-mono text-[10px] uppercase tracking-[0.24em] text-white
          "
          style={{
            background: "rgba(5,5,7,0.72)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-accent-ping" />
          Latest release · Out now
        </span>
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-gray-500">
            {catalogCode(release)} · №{" "}
            <span className="text-accent-soft">{num}</span>
          </span>
          <span className="h-px flex-1 bg-white/[0.14]" />
        </div>

        <h3 className="m-0 mt-7 font-display font-semibold leading-[0.95] tracking-[-0.025em] text-[clamp(32px,9vw,48px)] [text-wrap:balance] text-white transition-colors duration-200 group-hover:text-accent-soft min-[900px]:text-[clamp(40px,5.2vw,76px)]">
          {release.name}
        </h3>
        {collaboratorLabel(release) && (
          <p className="m-0 mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-soft">
            {collaboratorLabel(release)}
          </p>
        )}

        <div className="mt-8 grid grid-cols-3 divide-x divide-white/[0.14] border-y border-white/[0.14]">
          <LeadMetaCell label="Format" value={formatLabel} />
          <LeadMetaCell label="Released" value={released} mono />
          <LeadMetaCell label="Label" value="Beta-Time" />
        </div>

        <div className="mt-7">
          <p className="m-0 mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-gray-500">
            Stream
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {streams.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={(e) => e.stopPropagation()}
                  className="
                    inline-flex items-center
                    border border-white/[0.14] bg-white/[0.02] px-2.5 py-1.5
                    font-mono text-[10px] uppercase tracking-[0.18em] text-gray-300
                    transition-colors duration-150
                    hover:border-accent-soft/50 hover:bg-accent-soft/10 hover:text-white
                  "
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-5 pt-8">
          <a
            href={release.spotifyUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => e.stopPropagation()}
            className="
              inline-flex items-center gap-3
              bg-accent px-[22px] py-3.5 text-ink-950
              font-mono text-[11px] font-semibold uppercase tracking-[0.24em]
              transition-all duration-200
              hover:-translate-y-px hover:bg-accent-soft
            "
          >
            <FaPlay size={11} aria-hidden /> Listen now{" "}
            <span aria-hidden>→</span>
          </a>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-400">
            Open release →
          </span>
        </div>
      </div>
    </motion.li>
  );
}

function LeadMetaCell({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 px-3 py-4 min-[900px]:px-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">
        {label}
      </span>
      <span
        className={
          mono
            ? "font-mono text-[16px] uppercase tracking-[0.05em] text-white"
            : "font-display text-[18px] font-semibold tracking-[-0.005em] text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}

function GridCard({
  release,
  index,
  onClick,
}: {
  release: Release;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index, 12) * 0.04,
        ease: "easeOut",
      }}
      className="group flex cursor-pointer flex-col gap-3"
      onClick={onClick}
    >
      <div className="aspect-square">
        <Cover release={release} />
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="m-0 font-display text-[13px] font-semibold leading-tight tracking-[-0.005em] text-white transition-colors duration-200 group-hover:text-accent-soft min-[700px]:text-[15px]">
            {release.name}
          </h4>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500 min-[700px]:text-[10px] min-[700px]:tracking-[0.2em]">
            {release.type === "APPEARS_ON"
              ? releaseYear(release)
              : release.type === "EP"
                ? `EP · ${release.trackCount}`
                : releaseYear(release)}
          </span>
        </div>
        {collaboratorLabel(release) && (
          <div className="mt-1 line-clamp-1 font-mono text-[9px] uppercase tracking-[0.18em] text-accent-soft min-[700px]:text-[10px] min-[700px]:tracking-[0.2em]">
            {collaboratorLabel(release)}
          </div>
        )}
      </div>
    </motion.li>
  );
}

function ListView({
  releases,
  onOpenRelease,
}: {
  releases: Release[];
  onOpenRelease: (r: Release) => void;
}) {
  return (
    <ul className="list-none">
      <li
        className="hidden gap-5 border-y border-white/[0.14] px-4 py-3.5 font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500 min-[800px]:grid min-[800px]:[grid-template-columns:56px_64px_1fr_100px_80px_90px_36px]"
      >
        <span>Cat#</span>
        <span>Cover</span>
        <span>Title</span>
        <span>Type</span>
        <span>Year</span>
        <span>Tracks</span>
        <span></span>
      </li>
      {releases.map((r) => (
        <li
          key={r.id}
          onClick={() => onOpenRelease(r)}
          className="
            group grid cursor-pointer items-center gap-3.5 border-b border-white/[0.08] p-3
            transition-colors duration-150 hover:bg-white/[0.025]
            [grid-template-columns:56px_1fr_36px]
            min-[700px]:gap-5 min-[700px]:px-4 min-[700px]:py-3.5
            min-[800px]:[grid-template-columns:56px_64px_1fr_100px_80px_90px_36px]
          "
        >
          <span className="hidden font-mono text-[11px] tracking-[0.18em] text-gray-500 min-[800px]:block">
            {isAppearsOn(r) ? "FEAT." : catalogCode(r)}
          </span>
          <div className="h-14 w-14">
            <Cover release={r} variant="mini" />
          </div>
          <span className="flex flex-col gap-1 font-display text-[14px] font-medium tracking-[-0.005em] text-white transition-colors duration-200 group-hover:text-accent-soft min-[700px]:text-[16px]">
            <span>{r.name}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500 min-[700px]:text-[10px] min-[700px]:tracking-[0.2em]">
              {(() => {
                const others = otherArtists(r.artists);
                if (isAppearsOn(r)) {
                  return `by ${others.join(", ")} · ${formatMonth(r)}`;
                }
                if (others.length > 0) {
                  return `Kalamarico, ${others.join(", ")} · ${formatMonth(r)}`;
                }
                return `Kalamarico · ${formatMonth(r)}`;
              })()}
            </span>
          </span>
          <span
            className={`hidden font-mono text-[10px] uppercase tracking-[0.22em] min-[800px]:block ${
              r.type === "EP"
                ? "text-accent-soft"
                : r.type === "APPEARS_ON"
                  ? "text-accent-soft"
                  : "text-gray-300"
            }`}
          >
            {r.type === "APPEARS_ON" ? "FEAT." : r.type}
          </span>
          <span className="hidden font-mono text-[12px] text-gray-300 min-[800px]:block">
            {releaseYear(r)}
          </span>
          <span className="hidden font-mono text-[12px] text-gray-300 min-[800px]:block">
            {r.trackCount}
          </span>
          <span className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.14] text-gray-300 transition-all duration-150 group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950">
            <FaPlay size={11} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Timeline({
  byYear,
  onOpenRelease,
}: {
  byYear: [number, Release[]][];
  onOpenRelease: (r: Release) => void;
}) {
  return (
    <>
      <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500">
        <span>Scroll horizontally</span>
        <span aria-hidden>→</span>
      </div>
      <div className="-mx-5 min-[700px]:-mx-8">
        <div
          className="
            flex items-start gap-5 overflow-x-auto p-6 px-5
            [scroll-snap-type:x_mandatory] [scrollbar-color:rgb(var(--color-accent))_transparent] [scrollbar-width:thin]
            [&::-webkit-scrollbar-thumb]:bg-accent [&::-webkit-scrollbar-track]:bg-white/[0.08] [&::-webkit-scrollbar]:h-1
            min-[700px]:gap-8 min-[700px]:p-8
          "
        >
          {byYear.flatMap(([year, items]) => [
            <div
              key={`marker-${year}`}
              className="flex flex-none flex-col items-center justify-end gap-3 self-stretch w-7 min-[700px]:w-10"
            >
              <div className="flex-1 w-px bg-white/[0.14]" />
              <div
                className="font-display text-[18px] font-semibold tracking-[0.1em] text-accent-soft min-[700px]:text-[24px]"
                style={{
                  writingMode: "vertical-rl" as never,
                  textOrientation: "mixed" as never,
                }}
              >
                {year}
              </div>
            </div>,
            ...items.map((r) => {
              const collab = collaboratorLabel(r);
              return (
                <div
                  key={r.id}
                  onClick={() => onOpenRelease(r)}
                  className="group flex w-[160px] cursor-pointer flex-none flex-col gap-3 [scroll-snap-align:start] min-[700px]:w-[220px]"
                >
                  <div className="aspect-square w-full">
                    <Cover release={r} />
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500 min-[700px]:text-[10px] min-[700px]:tracking-[0.22em]">
                    {isAppearsOn(r) ? "FEAT." : catalogCode(r)} ·{" "}
                    {r.type === "APPEARS_ON" ? "FEATURED" : r.type}
                  </div>
                  <div className="line-clamp-2 min-h-[2.5em] font-display text-[14px] font-semibold leading-[1.2] tracking-[-0.005em] text-white transition-colors duration-200 group-hover:text-accent-soft min-[700px]:text-[16px]">
                    {r.name}
                  </div>
                  {collab && (
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent-soft min-[700px]:text-[10px] min-[700px]:tracking-[0.22em]">
                      {collab}
                    </div>
                  )}
                </div>
              );
            }),
          ])}
        </div>
      </div>
    </>
  );
}

function Switch<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { k: T; l: string }[];
}) {
  return (
    <div className="inline-flex w-full border border-white/[0.14] min-[700px]:w-auto">
      {options.map((opt, i) => {
        const active = opt.k === value;
        const last = i === options.length - 1;
        return (
          <button
            key={opt.k}
            type="button"
            onClick={() => onChange(opt.k)}
            className={`
              inline-flex flex-1 items-center justify-center gap-2 px-2 py-2.5
              font-mono text-[9px] uppercase tracking-[0.18em] transition-colors duration-150
              min-[700px]:flex-none min-[700px]:px-4 min-[700px]:text-[11px] min-[700px]:tracking-[0.22em]
              ${last ? "" : "border-r border-white/[0.14]"}
              ${
                active
                  ? "bg-accent text-ink-950"
                  : "bg-transparent text-gray-400 hover:text-white"
              }
            `}
          >
            {opt.l}
          </button>
        );
      })}
    </div>
  );
}
