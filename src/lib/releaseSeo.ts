import { artist, type Release } from "../data/artist";
import {
  otherArtists,
  releasePagePath,
  releaseYear,
} from "./catalog";
import { langBase, type Lang } from "./i18n";

export const ORIGIN = "https://kalamarico.com";

function formatName(release: Release, lang: Lang): string {
  switch (release.type) {
    case "EP":
      return "EP";
    case "ALBUM":
      return lang === "es" ? "Álbum" : "Album";
    case "COMPILATION":
      return lang === "es" ? "Recopilatorio" : "Compilation";
    default:
      return "Single";
  }
}

export function releaseCanonical(release: Release, lang: Lang): string {
  return `${ORIGIN}${releasePagePath(release, lang) ?? langBase(lang)}`;
}

export function releaseTitle(release: Release, lang: Lang): string {
  const fmt = formatName(release, lang);
  return lang === "es"
    ? `${release.name} — ${fmt} de Kalamarico`
    : `${release.name} — ${fmt} by Kalamarico`;
}

export function releaseDescription(release: Release, lang: Lang): string {
  const year = releaseYear(release);
  const feat = otherArtists(release.artists);
  const featEn = feat.length ? ` feat. ${feat.join(", ")}` : "";
  const featEs = feat.length ? ` con ${feat.join(", ")}` : "";
  if (release.type === "EP") {
    return lang === "es"
      ? `"${release.name}" — EP de ${release.trackCount} temas de Kalamarico${featEs} (${year}). Techno y electrónica desde Madrid. Escúchalo en Spotify, Apple Music y Beatport.`
      : `"${release.name}" — ${release.trackCount}-track EP by Kalamarico${featEn} (${year}). Techno & electronic music from Madrid. Stream it on Spotify, Apple Music and Beatport.`;
  }
  return lang === "es"
    ? `Escucha "${release.name}", single de Kalamarico${featEs} (${year}). Techno y electrónica desde Madrid, en Spotify, Apple Music y Beatport.`
    : `Listen to "${release.name}", a single by Kalamarico${featEn} (${year}). Techno & electronic music from Madrid, on Spotify, Apple Music and Beatport.`;
}

function isoDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `PT${m}M${s}S`;
}

/**
 * JSON-LD for a release page: MusicRecording (single) or MusicAlbum (EP+),
 * linked to the site-wide MusicGroup via @id, plus a BreadcrumbList.
 */
export function releaseJsonLd(release: Release, lang: Lang): string {
  const url = releaseCanonical(release, lang);
  const byArtist = {
    "@type": "MusicGroup",
    "@id": `${ORIGIN}/#artist`,
    name: artist.name,
  };
  const datePublished =
    release.datePrecision === "DAY" ? release.date : release.date.slice(0, 4);

  const base = {
    "@id": `${url}#release`,
    name: release.name,
    url,
    image: release.coverArt,
    datePublished,
    byArtist,
    sameAs: release.spotifyUrl,
    recordLabel: {
      "@type": "Organization",
      name:
        release.label ??
        (release.type === "EP" ? artist.label.name : artist.name),
    },
  };

  const main =
    release.type === "EP" ||
    release.type === "ALBUM" ||
    release.type === "COMPILATION"
      ? {
          "@type": "MusicAlbum",
          ...base,
          numTracks: release.trackCount,
          track: (release.tracks ?? []).map((tr) => ({
            "@type": "MusicRecording",
            name: tr.name,
            duration: isoDuration(tr.durationMs),
            url: tr.spotifyUrl,
            byArtist,
          })),
        }
      : {
          "@type": "MusicRecording",
          ...base,
          ...(release.tracks?.[0]
            ? { duration: isoDuration(release.tracks[0].durationMs) }
            : {}),
        };

  const home = `${ORIGIN}${langBase(lang)}`;
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Kalamarico",
        item: home,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: lang === "es" ? "Lanzamientos" : "Releases",
        item: `${home}#tracks`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: release.name,
        item: url,
      },
    ],
  };

  return JSON.stringify(
    { "@context": "https://schema.org", "@graph": [main, breadcrumb] },
    null,
    2,
  );
}
