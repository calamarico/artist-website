import type { Artist, Release } from "../data/artist";

/**
 * Builds the Schema.org MusicGroup JSON-LD payload from artist data so that
 * crawlers (Google Knowledge Panel, Bing, LLM search) get a complete and
 * up-to-date picture of releases without manual sync. Mirrors the markdown
 * generator pattern in generateMarkdown.ts.
 */
export function generateJsonLd(
  artist: Artist,
  canonicalUrl = "https://kalamarico.com/",
): string {
  const image = `${canonicalUrl.replace(/\/$/, "")}/avatars/avatar-green.jpeg`;
  const byArtist = { "@type": "MusicGroup", name: artist.name };

  const datePublished = (release: Release) =>
    release.datePrecision === "DAY" ? release.date : release.date.slice(0, 4);

  const sortedDesc = [...artist.releases].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const tracks = sortedDesc
    .filter((r) => r.type === "SINGLE")
    .map((r) => ({
      "@type": "MusicRecording",
      name: r.name,
      url: r.spotifyUrl,
      datePublished: datePublished(r),
      image: r.coverArt,
      byArtist,
    }));

  const albums = sortedDesc
    .filter((r) => r.type === "EP")
    .map((r) => ({
      "@type": "MusicAlbum",
      name: r.name,
      url: r.spotifyUrl,
      datePublished: datePublished(r),
      numTracks: r.trackCount,
      image: r.coverArt,
      byArtist,
    }));

  const data = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    url: canonicalUrl,
    image,
    genre: ["Electronic", "Techno"],
    description: artist.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
    sameAs: artist.socials.map((s) => s.url),
    track: tracks,
    album: albums,
    recordLabel: {
      "@type": "Organization",
      name: artist.label.name,
      url: artist.label.website,
    },
  };

  return JSON.stringify(data, null, 2);
}
