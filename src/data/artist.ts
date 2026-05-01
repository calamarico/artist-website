import { releases } from "./catalog.generated";

export type ReleaseType =
  | "SINGLE"
  | "EP"
  | "ALBUM"
  | "COMPILATION"
  | "APPEARS_ON";
export type DatePrecision = "DAY" | "MONTH" | "YEAR";

export type ReleaseArtist = {
  id: string;
  name: string;
  spotifyUrl: string;
};

export type Track = {
  id: string;
  name: string;
  trackNumber: number;
  durationMs: number;
  isrc?: string;
  previewUrl?: string;
  spotifyUrl: string;
  artists: ReleaseArtist[];
  isCollab: boolean;
};

export type Release = {
  id: string;
  name: string;
  type: ReleaseType;
  date: string;
  datePrecision: DatePrecision;
  trackCount: number;
  coverArt: string;
  spotifyUrl: string;
  // Populated by `npm run sync:catalog` from Spotify Web API.
  // Optional so the legacy hardcoded array below still type-checks.
  artists?: ReleaseArtist[];
  isPrimaryArtist?: boolean;
  tracks?: Track[];
  label?: string;
};

export type Social = {
  label: string;
  url: string;
};

export type LabelInfo = {
  name: string;
  role: string;
  website: string;
  beatport: string;
};

export type Artist = {
  name: string;
  tagline: string;
  location: string;
  bio: string;
  labels: string[];
  releases: Release[];
  socials: Social[];
  label: LabelInfo;
};

export const artist: Artist = {
  name: "Kalamarico",
  tagline: "Electronic Music Producer | Co-CEO of Beta-Time Records",
  location: "Madrid, Spain",
  bio: `Since my first sequences in FastTracker nearly 30 years ago, I've developed a creative approach focused on sound exploration, electronic texture design, and technical evolution in music production. I work with a hybrid setup of software and hardware, with a particular interest in balancing rhythmic structure and atmospheric depth.

As Co-CEO of Beta-Time Records, I manage projects, curate releases, and collaborate with artists to shape proposals that stand out in today's electronic music scene. Continuous improvement — both in mixing and composition — is a core part of my creative process.`,
  labels: [
    "Beta-Time Records",
    "Vanta Record",
    "Techno Drum Records",
    "Nothing But",
  ],
  releases,
  socials: [
    {
      label: "Spotify",
      url: "https://open.spotify.com/intl-es/artist/69pHpbXQUapyazWqZw1O2d",
    },
    { label: "SoundCloud", url: "https://soundcloud.com/kalamarico" },
    { label: "Instagram", url: "https://www.instagram.com/kalamarico/" },
    {
      label: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61555786563900",
    },
    { label: "YouTube", url: "https://www.youtube.com/@Kalamarico" },
    {
      label: "Apple Music",
      url: "https://geo.music.apple.com/us/artist/kalamarico/1647473536",
    },
    {
      label: "Beatport",
      url: "https://www.beatport.com/artist/kalamarico/1173551",
    },
    { label: "Bandcamp", url: "https://kalamarico.bandcamp.com/" },
    { label: "Deezer", url: "https://www.deezer.com/us/artist/175032397" },
    { label: "Tidal", url: "https://tidal.com/browse/artist/32959332" },
  ],
  label: {
    name: "Beta-Time Records",
    role: "Co-CEO",
    website: "https://www.beta-time.de/Start.htm",
    beatport: "https://www.beatport.com/label/beta-time-records/115999",
  },
};
