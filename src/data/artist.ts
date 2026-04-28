export type ReleaseType = "SINGLE" | "EP";
export type DatePrecision = "DAY" | "YEAR";

export type Release = {
  id: string;
  name: string;
  type: ReleaseType;
  date: string;
  datePrecision: DatePrecision;
  trackCount: number;
  coverArt: string;
  spotifyUrl: string;
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

const cover = (hash: string) => `https://i.scdn.co/image/ab67616d0000b273${hash}`;
const spotify = (id: string, share: string) =>
  `https://open.spotify.com/album/${id}?si=${share}`;

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
  releases: [
    {
      id: "0QYS4uncZjCoZNz4GQijBS",
      name: "Too Late",
      type: "SINGLE",
      date: "2026-04-03",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("ac6c385042e5798499b8182a"),
      spotifyUrl: spotify("0QYS4uncZjCoZNz4GQijBS", "uIENizrmSiW-qTEMlV5mIQ"),
    },
    {
      id: "4TZo8TQyOk7cIePvJ00IZH",
      name: "Winter Chaser",
      type: "SINGLE",
      date: "2026-01-24",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("b972c66caa5584a30ea37869"),
      spotifyUrl: spotify("4TZo8TQyOk7cIePvJ00IZH", "THFe7zTjSJGae1sqhv6D3g"),
    },
    {
      id: "11hNQafSmlGLjsxF8kmVBc",
      name: "Prometheus",
      type: "SINGLE",
      date: "2026-01-09",
      datePrecision: "DAY",
      trackCount: 2,
      coverArt: cover("bb3e7a20fd8c560448320fb0"),
      spotifyUrl: spotify("11hNQafSmlGLjsxF8kmVBc", "BZ5sjVQNT8mLehIGy4xBYg"),
    },
    {
      id: "7olIYAytuhcgklR6WmVv2A",
      name: "The Journey",
      type: "SINGLE",
      date: "2025-12-26",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("21e251f3964bbedc5deefd4a"),
      spotifyUrl: spotify("7olIYAytuhcgklR6WmVv2A", "84bcHLl6QP2s207Y0g-SwA"),
    },
    {
      id: "7nqZVctgpMTbwkgdtDYEEK",
      name: "Snow Drift",
      type: "SINGLE",
      date: "2025-11-21",
      datePrecision: "DAY",
      trackCount: 2,
      coverArt: cover("e37e059b724ce46df1fd8b2a"),
      spotifyUrl: spotify("7nqZVctgpMTbwkgdtDYEEK", "OOawImTkTEq4n0RACkgzPQ"),
    },
    {
      id: "7ANLekOJD3NIxAQbQblJbc",
      name: "The Game Continues",
      type: "EP",
      date: "2025-11-14",
      datePrecision: "DAY",
      trackCount: 4,
      coverArt: cover("d8cce3f44148d085a7e69a49"),
      spotifyUrl: spotify("7ANLekOJD3NIxAQbQblJbc", "F7Xq3nDzRPWf41GONquCpw"),
    },
    {
      id: "0hzXxFKhdEXg882XZvSZ2H",
      name: "Echoes of Addiction",
      type: "SINGLE",
      date: "2025-10-10",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("7c3e76e909e56b39ec779ce9"),
      spotifyUrl: spotify("0hzXxFKhdEXg882XZvSZ2H", "hfPszGy9QbijIMzDT_N7hg"),
    },
    {
      id: "3OdflCveziY0AnrspwWQKC",
      name: "Through the Dragon's Gate",
      type: "SINGLE",
      date: "2025-10-03",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("514b1461b707e795329063ec"),
      spotifyUrl: spotify("3OdflCveziY0AnrspwWQKC", "ss2UwBJ_Rq6aLqymsn_ncA"),
    },
    {
      id: "3RxmoUDx0eWT3u3O3Rc0MY",
      name: "Eugenie 100",
      type: "SINGLE",
      date: "2025-06-06",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("c021eab0e19974d06a76af73"),
      spotifyUrl: spotify("3RxmoUDx0eWT3u3O3Rc0MY", "fMr2INb9SSCjiCLSq1-dVA"),
    },
    {
      id: "4h1jBiWVJ1PDPMaRngP2qK",
      name: "The Game",
      type: "EP",
      date: "2025-02-14",
      datePrecision: "DAY",
      trackCount: 5,
      coverArt: cover("725816c99759e30fa554a0d8"),
      spotifyUrl: spotify("4h1jBiWVJ1PDPMaRngP2qK", "VtGODGCeQ4e9N-UmgHUAkw"),
    },
    {
      id: "2L2uwMFGneh0kN303TRfd0",
      name: "This Is Raveolution",
      type: "SINGLE",
      date: "2025-01-29",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("0838bbe26981914e6bc2055a"),
      spotifyUrl: spotify("2L2uwMFGneh0kN303TRfd0", "15uwSrQJSFCZm0eiQFMynQ"),
    },
    {
      id: "6GSSLtiM7tMDsn8vXLpZ1k",
      name: "Federado",
      type: "SINGLE",
      date: "2025-01-10",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("12b47ff7e077fa911148fbf1"),
      spotifyUrl: spotify("6GSSLtiM7tMDsn8vXLpZ1k", "HIvnaMtSRf2bnkn7eWWI6g"),
    },
    {
      id: "6n4yVSAbAiBylpsJwxcR8s",
      name: "Crouching Tiger Hidden Dragon",
      type: "SINGLE",
      date: "2025-01-03",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("457fe24b754f6cc897000ec7"),
      spotifyUrl: spotify("6n4yVSAbAiBylpsJwxcR8s", "0sT_JqrXRbaczdwQgVf3qw"),
    },
    {
      id: "2Zq4OVIb9PusVWtpEpW5lt",
      name: "Signal Dimensions",
      type: "SINGLE",
      date: "2024-12-06",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("a258e1ef6e79cc779ea61a53"),
      spotifyUrl: spotify("2Zq4OVIb9PusVWtpEpW5lt", "eG8sIfCrQuGBI60unIzs1Q"),
    },
    {
      id: "0nSXFFB7iHZK5Z8UtehLgD",
      name: "Mare's-Nest Temple",
      type: "SINGLE",
      date: "2024-10-11",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("985dff06dcdf4527fcd3ed1c"),
      spotifyUrl: spotify("0nSXFFB7iHZK5Z8UtehLgD", "cMLfSPAvRFeKMdSIrii1hQ"),
    },
    {
      id: "6AD4TzNt0EH6COm61w164v",
      name: "2 State",
      type: "EP",
      date: "2024-07-05",
      datePrecision: "DAY",
      trackCount: 4,
      coverArt: cover("82890f2b43879452147083b8"),
      spotifyUrl: spotify("6AD4TzNt0EH6COm61w164v", "MgPGw8UoRguvZn84H5NIJQ"),
    },
    {
      id: "1UlTedIYQmLXCS90PwdDan",
      name: "Wave Chaser",
      type: "SINGLE",
      date: "2024-05-22",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("b6488f64a2ff9b46424a0fed"),
      spotifyUrl: spotify("1UlTedIYQmLXCS90PwdDan", "eZT7VlfqT1GnSYZ_VyUaCw"),
    },
    {
      id: "3vmah9JhnbAYd7zl2VvoNd",
      name: "Metallurgeon",
      type: "SINGLE",
      date: "2024-04-12",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("210f07476b9d775a5850c701"),
      spotifyUrl: spotify("3vmah9JhnbAYd7zl2VvoNd", "-ipGAN79SS2mFhRjxDoHKA"),
    },
    {
      id: "7iVzWBTJr3BVPQ4vFni0MM",
      name: "Cursed Steam",
      type: "SINGLE",
      date: "2024-02-16",
      datePrecision: "DAY",
      trackCount: 2,
      coverArt: cover("fdb375eb0425b9b20a5d7d94"),
      spotifyUrl: spotify("7iVzWBTJr3BVPQ4vFni0MM", "D57Y-YYeSz-G-cIWqm_JqA"),
    },
    {
      id: "5U7Yk9TEv04EyCRd8jsMZ1",
      name: "Interruption 21h",
      type: "SINGLE",
      date: "2024-01-19",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("b955244221adc93ee3d422b7"),
      spotifyUrl: spotify("5U7Yk9TEv04EyCRd8jsMZ1", "py8nTCp_QeShJcgsH7ciNw"),
    },
    {
      id: "10PUAsjeBLM8chWN4lGCnB",
      name: "Redress",
      type: "SINGLE",
      date: "2024-01-05",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("931a321383724a2ceda9f79b"),
      spotifyUrl: spotify("10PUAsjeBLM8chWN4lGCnB", "F7TsWZJ2RF6_WlhRf4HYqA"),
    },
    {
      id: "4AvhTIprgEFYF6h8iUAF4t",
      name: "Nice Shot",
      type: "SINGLE",
      date: "2024-01-01",
      datePrecision: "YEAR",
      trackCount: 1,
      coverArt: cover("ef6c56a0ee82e73886933074"),
      spotifyUrl: spotify("4AvhTIprgEFYF6h8iUAF4t", "CdsJRcOVTwy_paVkn4cmVg"),
    },
    {
      id: "6YGyDVNofK9nrN8Jaq2oN1",
      name: "Percthusiasm",
      type: "SINGLE",
      date: "2023-12-12",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("84c043380d9910d755416aa6"),
      spotifyUrl: spotify("6YGyDVNofK9nrN8Jaq2oN1", "VD-TZWJsQuuR1ZszuOmyoA"),
    },
    {
      id: "0xrkWxjC8Dx71YyDq4KpSv",
      name: "Electric Isolation",
      type: "SINGLE",
      date: "2023-08-29",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("61827f6713b13ecb57e01dde"),
      spotifyUrl: spotify("0xrkWxjC8Dx71YyDq4KpSv", "3OY2A8ZfSKmcdQk7_Wji3A"),
    },
    {
      id: "0FzbHF9X7tXu8WluGXjVGS",
      name: "Recursive UseCase Reloaded",
      type: "SINGLE",
      date: "2023-06-05",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("8b84df081e7787bf365cb37b"),
      spotifyUrl: spotify("0FzbHF9X7tXu8WluGXjVGS", "piO4MqOJRxGhBJ7bD0ObFg"),
    },
    {
      id: "2kvPXNQnTlqWNLdVux541c",
      name: "The Gravedigger",
      type: "SINGLE",
      date: "2023-01-01",
      datePrecision: "YEAR",
      trackCount: 1,
      coverArt: cover("79e618af4e26b99a314fc994"),
      spotifyUrl: spotify("2kvPXNQnTlqWNLdVux541c", "M-o89tF6QVuxMcryYEksiQ"),
    },
    {
      id: "02ago43O1xgl1dkdoP18UB",
      name: "Sönar",
      type: "SINGLE",
      date: "2023-01-01",
      datePrecision: "YEAR",
      trackCount: 1,
      coverArt: cover("f6b7a1d81d0db4d756d82e50"),
      spotifyUrl: spotify("02ago43O1xgl1dkdoP18UB", "qFkTjBCvRMq5u0_s8WemBw"),
    },
    {
      id: "5oAce7LEooZ5CaUOA3iNz0",
      name: "Last Uplift",
      type: "SINGLE",
      date: "2023-01-01",
      datePrecision: "YEAR",
      trackCount: 1,
      coverArt: cover("e3b6a884b179ba554dc9077c"),
      spotifyUrl: spotify("5oAce7LEooZ5CaUOA3iNz0", "0zvVr13kTTiWS42cBaOmXA"),
    },
    {
      id: "3qSDSaQ9LvpDiCmNXYrXWL",
      name: "Top-Level-Await",
      type: "SINGLE",
      date: "2022-10-11",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("b4bbe831471418129e89c8ad"),
      spotifyUrl: spotify("3qSDSaQ9LvpDiCmNXYrXWL", "QIfXwVB_TcWKtuMblq22XA"),
    },
    {
      id: "6vb1limyIh2EIJtH2z8gLb",
      name: "Chapa Kalamarico",
      type: "SINGLE",
      date: "2022-08-27",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("216d1e46db2d1daa79ce73b8"),
      spotifyUrl: spotify("6vb1limyIh2EIJtH2z8gLb", "UZHK3W3XSe-J70qPPoPA7w"),
    },
    {
      id: "7wCPyAlW77Izn3RGTG5GK3",
      name: "Recursive UseCase",
      type: "SINGLE",
      date: "2022-06-25",
      datePrecision: "DAY",
      trackCount: 1,
      coverArt: cover("cb81b3b76950d888714093d0"),
      spotifyUrl: spotify("7wCPyAlW77Izn3RGTG5GK3", "5xGsmBFxRxqBtlG9sfG_Sw"),
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
