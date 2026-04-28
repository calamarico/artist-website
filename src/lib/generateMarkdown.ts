import type { Artist } from "../data/artist";

const STREAMING_LABELS = new Set([
  "Spotify",
  "SoundCloud",
  "Apple Music",
  "Deezer",
  "Tidal",
  "Bandcamp",
  "Beatport",
]);

/**
 * Renders the artist data as a clean markdown document for agents/LLMs that
 * fetch the page with `Accept: text/markdown`. Mirrors the same data the
 * site renders visually in React, kept in sync via a single source of truth
 * (src/data/artist.ts).
 */
export function generateMarkdown(
  artist: Artist,
  canonicalUrl = "https://www.kalamarico.com/",
): string {
  const lines: string[] = [];

  lines.push(`# ${artist.name}`);
  lines.push("");
  lines.push(`**${artist.tagline}**`);
  lines.push("");
  lines.push(`Based in ${artist.location}.`);
  lines.push("");
  lines.push(`Website: ${canonicalUrl}`);
  lines.push("");

  lines.push("## About");
  lines.push("");
  lines.push(artist.bio.trim());
  lines.push("");

  lines.push("## Genres");
  lines.push("");
  lines.push("Electronic, Techno");
  lines.push("");

  if (artist.labels.length) {
    lines.push("## Affiliated labels");
    lines.push("");
    for (const label of artist.labels) {
      lines.push(`- ${label}`);
    }
    lines.push("");
  }

  if (artist.releases.length) {
    lines.push("## Releases");
    lines.push("");
    const sorted = [...artist.releases].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
    for (const release of sorted) {
      const year = release.date.slice(0, 4);
      const typeLabel =
        release.type === "EP" ? `EP, ${release.trackCount} tracks` : "Single";
      lines.push(
        `- **${release.name}** (${year}, ${typeLabel}) — ${release.spotifyUrl}`,
      );
    }
    lines.push("");
  }

  const streaming = artist.socials.filter((s) => STREAMING_LABELS.has(s.label));
  const social = artist.socials.filter((s) => !STREAMING_LABELS.has(s.label));

  if (streaming.length) {
    lines.push("## Streaming & stores");
    lines.push("");
    for (const s of streaming) {
      lines.push(`- [${s.label}](${s.url})`);
    }
    lines.push("");
  }

  if (social.length) {
    lines.push("## Social");
    lines.push("");
    for (const s of social) {
      lines.push(`- [${s.label}](${s.url})`);
    }
    lines.push("");
  }

  lines.push("## Record label");
  lines.push("");
  lines.push(
    `[${artist.label.name}](${artist.label.website}) — ${artist.label.role}`,
  );
  lines.push("");
  lines.push(`Beatport profile: ${artist.label.beatport}`);
  lines.push("");

  return lines.join("\n");
}
