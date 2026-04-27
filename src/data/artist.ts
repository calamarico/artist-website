export type Track = {
  title: string;
  year: number;
  url: string;
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
  tracks: Track[];
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
  tracks: [
    {
      title: "Too Late",
      year: 2026,
      url: "https://soundcloud.com/kalamarico/too-late",
    },
    {
      title: "Nice Shot",
      year: 2026,
      url: "https://soundcloud.com/kalamarico/nice-shot-1",
    },
    {
      title: "Winter Chaser",
      year: 2026,
      url: "https://soundcloud.com/kalamarico/winterchaser",
    },
    {
      title: "Prometheus Solar Bust",
      year: 2025,
      url: "https://soundcloud.com/kalamarico/prometheus-solar-bust",
    },
    {
      title: "The Journey",
      year: 2025,
      url: "https://soundcloud.com/kalamarico/the-journey-1",
    },
  ],
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
