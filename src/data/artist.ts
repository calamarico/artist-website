import { labelStats, releases } from "./catalog.generated";

export { labelStats };

export type LabelStats = {
  releases: number;
  artists: number;
  founded: number;
};

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

export type Video = {
  id: string;
  title: string;
  duration: string;
};

export type VideoLab = {
  djMixes: {
    playlistUrl: string;
    featuredIds: [string, string];
    videos: Video[];
  };
  session: Video & {
    eyebrow: string;
    description: string;
  };
  labelPick?: {
    artist: string;
    channelHandle: string;
    channelUrl: string;
    videosUrl: string;
    logo: string;
    eyebrow: string;
    description: string;
    tags: string[];
    channelMeta: string;
  };
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
  videoLab: VideoLab;
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
  videoLab: {
    djMixes: {
      playlistUrl:
        "https://www.youtube.com/playlist?list=PLUDlAM_gad50mc22HSoxlZU-4tgZHEj5o",
      featuredIds: ["QIKEQFocXQI", "HsugPL6Wph0"],
      videos: [
        {
          id: "QIKEQFocXQI",
          title:
            "Best DJ Mixes - Kalamarico VS Fragma - Eugenie 100 VS Everytime You Need Me - #betatimerecords",
          duration: "5:20",
        },
        {
          id: "_D35wLU4mzo",
          title:
            "Best DJ Mixes vol.2 - Kalamarico - Sönar VS Control Representative #betatimerecords",
          duration: "2:49",
        },
        {
          id: "HsugPL6Wph0",
          title:
            "Best DJ Mixes vol.3 - Kalamarico - Elude VS Motiv 8 & Kym Mazelle - Searching For The Golden Eye",
          duration: "4:41",
        },
        {
          id: "ZdzEhbzhdeM",
          title:
            "Best DJ Mixes vol.4 - MAGO VS Kalamarico - Clang! VS Percthusiasm - #betatimerecords",
          duration: "4:57",
        },
        {
          id: "uLYRVVvganE",
          title:
            "Best DJ Mixes vol.5 - Federado VS Interrumption 24h - #betatimerecords",
          duration: "4:48",
        },
        {
          id: "T_9XPAof-v8",
          title:
            "Best DJ Mixes vol.6 - Through the Dragon's Gate VS Dans tes Yeux - MAGO & Spacey Panda & Kalamarico",
          duration: "4:03",
        },
      ],
    },
    session: {
      id: "z2jl_qwJBGM",
      title: "Electronic/Techno short set #betatimerecords",
      duration: "11:43",
      eyebrow: "FULL SESSION · BETA-TIME RECORDS ONLY",
      description:
        "An eleven-minute set built exclusively from Beta-Time Records releases — the sound of the label, in one continuous flow.",
    },
    labelPick: {
      artist: "MAGO",
      channelHandle: "@xMAGAJNAx",
      channelUrl: "https://www.youtube.com/@xMAGAJNAx",
      videosUrl: "https://www.youtube.com/@xMAGAJNAx/videos",
      logo: "/mago-tv-logo.jpg",
      eyebrow: "Beta-Time family · YouTube channel",
      description:
        "Retro Electro, straight from the Beta-Time family. MAGO TV is a broadcast station for original synthwave, electro and futuristic soundscapes — where every release is a transmission in an ongoing cinematic universe built on classic video games, cyberpunk aesthetics, arcade culture and analog technology. Tune the dial and let it run.",
      tags: [
        "Synthwave",
        "Electro",
        "Cyberpunk",
        "Arcade culture",
        "Beta-Time Records",
      ],
      channelMeta: "CH 01 → CH 105 · transmitting",
    },
  },
};
