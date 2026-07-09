import { artist, type Release, type ReleaseArtist } from "../data/artist";
import type { Lang } from "./i18n";

const KALAMARICO_NAME = "Kalamarico";

export function isAppearsOn(release: Release): boolean {
  return release.type === "APPEARS_ON" || release.isPrimaryArtist === false;
}

/** Names of artists OTHER than Kalamarico. Empty array if none. */
export function otherArtists(artists: ReleaseArtist[] | undefined): string[] {
  if (!artists) return [];
  return artists.filter((a) => a.name !== KALAMARICO_NAME).map((a) => a.name);
}

/**
 * Returns a short display label for collaborators on a release:
 *  - APPEARS_ON: "by Mago" / "de Mago" (release belongs to another artist)
 *  - own collab: "feat. Dudette" / "feat. Mago, Spacey Panda"
 *  - solo: null
 */
export function collaboratorLabel(
  release: Release,
  lang: Lang = "en",
): string | null {
  const others = otherArtists(release.artists);
  if (others.length === 0) return null;
  const list = others.join(", ");
  if (!isAppearsOn(release)) return `feat. ${list}`;
  return lang === "es" ? `de ${list}` : `by ${list}`;
}

/** Formatted track duration "M:SS" from milliseconds. */
export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const sortedAsc = [...artist.releases].sort(
  (a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime() ||
    a.id.localeCompare(b.id),
);

const numberById = new Map<string, number>(
  sortedAsc.map((release, i) => [release.id, i + 1]),
);

export function releaseNumber(release: Release): number {
  return numberById.get(release.id) ?? 1;
}

export function catalogCode(release: Release): string {
  const prefix = release.type === "EP" ? "BTR-EP" : "KAL";
  return `${prefix}${String(releaseNumber(release)).padStart(3, "0")}`;
}

// Release dates are date-only strings parsed as UTC midnight. Format them
// with fixed month tables instead of Intl so the output never depends on the
// viewer's timezone or ICU version — prerendered HTML must match what every
// client hydrates, byte for byte.
const MONTHS: Record<Lang, readonly string[]> = {
  // prettier-ignore
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  // prettier-ignore
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
};

export function releaseDateParts(
  release: Release,
  lang: Lang = "en",
): { day: string; month: string; year: number } {
  const d = new Date(release.date);
  return {
    day: String(d.getUTCDate()).padStart(2, "0"),
    month: MONTHS[lang][d.getUTCMonth()],
    year: d.getUTCFullYear(),
  };
}

export function formatMonth(release: Release, lang: Lang = "en"): string {
  const { month, year } = releaseDateParts(release, lang);
  return `${month} ${year}`.toUpperCase();
}

export function formatDay(release: Release, lang: Lang = "en"): string {
  const { day, month, year } = releaseDateParts(release, lang);
  if (release.datePrecision === "YEAR") return String(year);
  return `${day} ${month} ${year}`;
}

export function releaseYear(release: Release): number {
  return new Date(release.date).getUTCFullYear();
}

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Stable URL slug per release that has its own page. Releases where
// Kalamarico only appears (APPEARS_ON) get no page — they belong to other
// artists. Collisions resolve deterministically by appending the year.
const slugById = (() => {
  const map = new Map<string, string>();
  const taken = new Set<string>();
  for (const r of sortedAsc) {
    if (isAppearsOn(r)) continue;
    const base = slugify(r.name) || r.id.toLowerCase();
    let slug = base;
    if (taken.has(slug)) slug = `${base}-${releaseYear(r)}`;
    let n = 2;
    while (taken.has(slug)) slug = `${base}-${releaseYear(r)}-${n++}`;
    taken.add(slug);
    map.set(r.id, slug);
  }
  return map;
})();

export function releaseSlug(release: Release): string | null {
  return slugById.get(release.id) ?? null;
}

/** URL of a release's standalone page ("/releases/{slug}/"), or null for APPEARS_ON. */
export function releasePagePath(
  release: Release,
  lang: Lang = "en",
): string | null {
  const slug = slugById.get(release.id);
  if (!slug) return null;
  return `${lang === "es" ? "/es" : ""}/releases/${slug}/`;
}

/** Releases that have their own page, oldest → newest. */
export function releasesWithPages(): Release[] {
  return sortedAsc.filter((r) => slugById.has(r.id));
}
