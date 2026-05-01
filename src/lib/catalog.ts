import { artist, type Release } from "../data/artist";

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
