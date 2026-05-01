import "dotenv/config";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getAlbum,
  getToken,
  paginate,
  withConcurrency,
  type SpotifyAlbumDetail,
  type SpotifyAlbumSummary,
  type SpotifyTrack,
} from "./spotify-client.js";
import type {
  DatePrecision,
  Release,
  ReleaseArtist,
  ReleaseType,
  Track,
} from "../src/data/artist.js";

const KALAMARICO_ID = "69pHpbXQUapyazWqZw1O2d";
const MARKET = "ES";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../src/data/catalog.generated.ts");

async function main() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in env.\n" +
        "Copy .env.example to .env and fill in credentials from " +
        "https://developer.spotify.com/dashboard",
    );
    process.exit(1);
  }

  console.log("→ Authenticating with Spotify…");
  const token = await getToken(clientId, clientSecret);

  console.log(`→ Fetching albums for artist ${KALAMARICO_ID}…`);
  // Spotify quirks (late 2024+):
  //  - `limit=20+` rejects with "Invalid limit"; 10 is the practical cap.
  //  - Combined `include_groups=album,single,appears_on,compilation` silently
  //    drops `appears_on`. Each group must be fetched separately.
  //  - `album_group` field is no longer returned in summaries, so we track
  //    the group by which call surfaced the album.
  const groupById = new Map<string, string>();
  const summaries: SpotifyAlbumSummary[] = [];
  for (const group of ["album", "single", "compilation", "appears_on"] as const) {
    const items = await paginate<SpotifyAlbumSummary>(
      `/artists/${KALAMARICO_ID}/albums?include_groups=${group}&limit=10&market=${MARKET}`,
      token,
    );
    for (const item of items) {
      if (!groupById.has(item.id)) groupById.set(item.id, group);
      summaries.push(item);
    }
    console.log(`  · ${group.padEnd(12)} ${items.length} items`);
  }

  // Dedupe by id, then by name+date (Spotify often duplicates regional masters).
  const byId = new Map<string, SpotifyAlbumSummary>();
  for (const s of summaries) {
    if (!byId.has(s.id)) byId.set(s.id, s);
  }
  const uniqueIds = [...byId.keys()];

  console.log(
    `→ ${uniqueIds.length} unique album IDs (from ${summaries.length} entries). Fetching details + tracks…`,
  );
  const details = await withConcurrency(
    uniqueIds,
    (id) => getAlbum(id, token, MARKET),
    5,
  );

  // Final dedupe by name+isoDate, picking the one available in MARKET if possible.
  const byKey = new Map<string, SpotifyAlbumDetail>();
  for (const d of details) {
    const key = `${d.name.toLowerCase().trim()}|${d.release_date}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, d);
      continue;
    }
    const existingHasMarket = existing.available_markets?.includes(MARKET);
    const dHasMarket = d.available_markets?.includes(MARKET);
    if (!existingHasMarket && dHasMarket) {
      byKey.set(key, d);
    }
  }
  const deduped = [...byKey.values()];

  const releases = deduped
    .map((album) =>
      mapAlbumToRelease(album, album.tracks.items, groupById.get(album.id)),
    )
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const counts = {
    total: releases.length,
    singles: releases.filter((r) => r.type === "SINGLE").length,
    eps: releases.filter((r) => r.type === "EP").length,
    albums: releases.filter((r) => r.type === "ALBUM").length,
    compilations: releases.filter((r) => r.type === "COMPILATION").length,
    appearsOn: releases.filter((r) => r.type === "APPEARS_ON").length,
    tracks: releases.reduce((acc, r) => acc + (r.tracks?.length ?? 0), 0),
    collabTracks: releases.reduce(
      (acc, r) => acc + (r.tracks?.filter((t) => t.isCollab).length ?? 0),
      0,
    ),
  };

  await writeOutput(releases);

  console.log("\n✓ Sync complete");
  console.log(`  ${counts.total} releases  (${counts.singles} singles · ${counts.eps} EPs · ${counts.albums} albums · ${counts.compilations} compilations · ${counts.appearsOn} appears_on)`);
  console.log(`  ${counts.tracks} tracks total  (${counts.collabTracks} collab tracks)`);
  console.log(`  → ${OUTPUT_PATH}`);
}

function mapAlbumToRelease(
  album: SpotifyAlbumDetail,
  tracks: SpotifyTrack[],
  group: string | undefined,
): Release {
  const isAppearsOn = group === "appears_on";
  const isPrimaryArtist =
    !isAppearsOn && album.artists.some((a) => a.id === KALAMARICO_ID);
  const cover = pickCover(album.images);
  const datePrecision = mapPrecision(album.release_date_precision);
  const date = normalizeDate(album.release_date, album.release_date_precision);
  const type: ReleaseType = isAppearsOn
    ? "APPEARS_ON"
    : album.album_type === "single"
      ? // total_tracks > 1 + own → treat as EP (matches the original convention)
        album.total_tracks > 1
        ? "EP"
        : "SINGLE"
      : album.album_type === "compilation"
        ? "COMPILATION"
        : "ALBUM";

  return {
    id: album.id,
    name: album.name,
    type,
    date,
    datePrecision,
    trackCount: album.total_tracks,
    coverArt: cover,
    spotifyUrl: album.external_urls.spotify,
    artists: album.artists.map(toArtistRef),
    isPrimaryArtist,
    label: album.label,
    tracks: tracks.map((t) => mapTrack(t)),
  };
}

function mapTrack(track: SpotifyTrack): Track {
  const isCollab =
    track.artists.length > 1 ||
    !track.artists.some((a) => a.id === KALAMARICO_ID);
  return {
    id: track.id,
    name: track.name,
    trackNumber: track.track_number,
    durationMs: track.duration_ms,
    isrc: track.external_ids?.isrc,
    previewUrl: track.preview_url ?? undefined,
    spotifyUrl: track.external_urls.spotify,
    artists: track.artists.map(toArtistRef),
    isCollab,
  };
}

function toArtistRef(a: { id: string; name: string; external_urls: { spotify: string } }): ReleaseArtist {
  return {
    id: a.id,
    name: a.name,
    spotifyUrl: a.external_urls.spotify,
  };
}

function pickCover(images: { url: string; width: number | null }[]): string {
  // Spotify returns 3 sizes (640, 300, 64). Prefer 640 or largest.
  const sorted = [...images].sort(
    (a, b) => (b.width ?? 0) - (a.width ?? 0),
  );
  return sorted[0]?.url ?? "";
}

function mapPrecision(p: "year" | "month" | "day"): DatePrecision {
  return p === "year" ? "YEAR" : p === "month" ? "MONTH" : "DAY";
}

function normalizeDate(date: string, precision: "year" | "month" | "day"): string {
  // Spotify returns "YYYY", "YYYY-MM", or "YYYY-MM-DD". Normalize to ISO-like.
  if (precision === "year") return `${date}-01-01`;
  if (precision === "month") return `${date}-01`;
  return date;
}

async function writeOutput(releases: Release[]) {
  const header = [
    "// AUTO-GENERATED — do not edit by hand.",
    "// Run `npm run sync:catalog` to refresh.",
    `// Generated at ${new Date().toISOString()}`,
    "",
    'import type { Release } from "./artist";',
    "",
    "export const releases: Release[] = ",
  ].join("\n");

  const body = JSON.stringify(releases, null, 2);
  const content = `${header}${body};\n`;

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, content, "utf8");
}

main().catch((err) => {
  console.error("\n✗ Sync failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
