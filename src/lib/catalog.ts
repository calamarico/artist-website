import { artist, type Release, type ReleaseArtist } from "../data/artist";

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
 *  - APPEARS_ON: "by Mago" (release belongs to another artist)
 *  - own collab: "feat. Dudette" / "feat. Mago, Spacey Panda"
 *  - solo: null
 */
export function collaboratorLabel(release: Release): string | null {
  const others = otherArtists(release.artists);
  if (others.length === 0) return null;
  const list = others.join(", ");
  return isAppearsOn(release) ? `by ${list}` : `feat. ${list}`;
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

const monthFmt = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
});

const dayFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatMonth(release: Release): string {
  return monthFmt.format(new Date(release.date)).toUpperCase();
}

export function formatDay(release: Release): string {
  if (release.datePrecision === "YEAR") {
    return String(new Date(release.date).getUTCFullYear());
  }
  return dayFmt.format(new Date(release.date));
}

export function releaseYear(release: Release): number {
  return new Date(release.date).getUTCFullYear();
}
