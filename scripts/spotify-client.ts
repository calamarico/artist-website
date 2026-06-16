const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

export type Page<T> = {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

export type SpotifyArtistRef = {
  id: string;
  name: string;
  external_urls: { spotify: string };
};

export type SpotifyImage = {
  url: string;
  width: number | null;
  height: number | null;
};

export type SpotifyAlbumSummary = {
  id: string;
  name: string;
  album_type: "album" | "single" | "compilation";
  album_group?: "album" | "single" | "compilation" | "appears_on";
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  total_tracks: number;
  artists: SpotifyArtistRef[];
  images: SpotifyImage[];
  external_urls: { spotify: string };
  available_markets?: string[];
};

export type SpotifyAlbumDetail = SpotifyAlbumSummary & {
  label?: string;
  copyrights?: { text: string; type: string }[];
  popularity?: number;
  tracks: Page<SpotifyTrack>;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  track_number: number;
  duration_ms: number;
  artists: SpotifyArtistRef[];
  external_urls: { spotify: string };
  external_ids?: { isrc?: string };
  preview_url: string | null;
};

export async function getToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Spotify token request failed (${res.status}): ${body.slice(0, 200)}`,
    );
  }
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchSpotify<T>(
  path: string,
  token: string,
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("Retry-After") ?? "1");
      await sleep(retryAfter * 1000);
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `Spotify ${url} failed (${res.status}): ${body.slice(0, 300)}`,
      );
    }
    return (await res.json()) as T;
  }
  throw new Error(`Spotify ${url} failed: too many 429 retries`);
}

export async function paginate<T>(
  initialPath: string,
  token: string,
): Promise<T[]> {
  const out: T[] = [];
  let next: string | null = initialPath;
  while (next) {
    const page: Page<T> = await fetchSpotify<Page<T>>(next, token);
    out.push(...page.items);
    next = page.next;
  }
  return out;
}

/**
 * Enumerate a label's full catalogue. Spotify supports a `label:"name"` filter
 * on the search endpoint — the only way to enumerate a label (Spotify has no
 * first-class label entity).
 *
 * Spotify quirk: the search endpoint HARD-CAPS `label:"name"` at 100 results.
 * It reports `total: 100` and stops returning `next` at offset 100, no matter
 * how large the label actually is. (The old "max 1000" assumption is wrong as
 * of 2025+.) To get the whole catalogue we slice the query by release year
 * (`label:"name" year:YYYY`) so each slice stays well under the cap, then
 * union the results deduped by album id. The unfiltered query is kept as a
 * first pass to catch any release the year filter might miss.
 */
export async function searchAlbumsByLabel(
  label: string,
  token: string,
  fromYear: number,
  market = "ES",
): Promise<SpotifyAlbumSummary[]> {
  const byId = new Map<string, SpotifyAlbumSummary>();
  const currentYear = new Date().getFullYear();

  const queries = [`label:"${label}"`];
  for (let year = fromYear; year <= currentYear; year++) {
    queries.push(`label:"${label}" year:${year}`);
  }

  for (const rawQuery of queries) {
    const q = encodeURIComponent(rawQuery);
    let url: string | null = `/search?q=${q}&type=album&limit=10&market=${market}`;
    while (url) {
      const res: { albums: Page<SpotifyAlbumSummary> } = await fetchSpotify(
        url,
        token,
      );
      for (const item of res.albums.items) {
        if (!byId.has(item.id)) byId.set(item.id, item);
      }
      url = res.albums.next;
    }
  }
  return [...byId.values()];
}

// NOTE: Spotify's batch `/albums?ids=...` endpoint returns 403 Forbidden as of
// late 2024 for Client Credentials apps, even with a single ID. We use
// per-album fetches via `getAlbum()` instead.
export async function getAlbum(
  albumId: string,
  token: string,
  market = "ES",
): Promise<SpotifyAlbumDetail> {
  const album = await fetchSpotify<SpotifyAlbumDetail>(
    `/albums/${albumId}?market=${market}`,
    token,
  );
  // The embedded tracks page may be truncated (default 50). Paginate if needed.
  if (album.tracks.next) {
    const rest = await paginate<SpotifyTrack>(album.tracks.next, token);
    album.tracks.items.push(...rest);
  }
  return album;
}

export async function withConcurrency<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  limit = 5,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}
