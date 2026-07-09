import { createContext, useContext } from "react";
import { artist } from "../data/artist";

/**
 * Two static builds share one bundle: "/" (English) and "/es/" (Spanish).
 * The language is fixed per URL — set once at hydration (main.tsx) or at
 * prerender time (entry-server.tsx) — so the context never changes at
 * runtime and both trees stay hydration-safe.
 */
export type Lang = "en" | "es";

export const LangContext = createContext<Lang>("en");

export function useLang(): Lang {
  return useContext(LangContext);
}

/** Root path of a language's build: "/" or "/es/". */
export function langBase(lang: Lang): string {
  return lang === "es" ? "/es/" : "/";
}

export function langFromPathname(pathname: string): Lang {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

const en = {
  meta: {
    title: "Kalamarico — DJ & Electronic Music Producer · Madrid",
    description:
      "Kalamarico — DJ & electronic music producer from Madrid. Techno releases on Beta-Time Records. Listen on Spotify, Apple Music, Beatport and more.",
    ogTitle: "Kalamarico — DJ & Electronic Music Producer",
    ogDescription:
      "DJ & electronic music producer from Madrid. Co-CEO of Beta-Time Records.",
  },
  nav: {
    links: {
      about: "About",
      releases: "Releases",
      video: "Video",
      listen: "Listen",
      label: "Label",
    },
    sectionMeta: {
      about: "About",
      tracks: "Releases",
      video: "Video Lab",
      listen: "Listen",
      label: "The Label",
    },
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    siteNav: "Site navigation",
    otherLang: "ES",
    otherLangTitle: "Versión en español",
  },
  hero: {
    artistTag: "Artist",
    est: "EST. 1996 — FastTracker → Now",
    releasesWord: "releases",
    labelsWord: "labels",
    eyebrow: "DJ · Electronic music producer",
    sub: "Sound exploration, electronic texture, and a 30-year obsession with rhythmic structure — built in Madrid.",
    listenSpotify: "Listen on Spotify",
    latestRelease: "Latest release",
  },
  about: {
    label: "About",
    headTop: "Sound exploration,",
    headAccent: "always evolving.",
    pullQuote: "Pull quote",
    quoteBefore:
      "Continuous improvement — both in mixing and composition — is a core part of my creative ",
    quoteAccent: "process",
    bio: artist.bio,
    stats: {
      discography: "Discography",
      releasesUnit: "releases",
      activeLabels: "Active labels",
      activeSince: "Active since",
      basedIn: "Based in",
    },
    releasedOn: "Released on",
  },
  tracks: {
    label: "Discography",
    headTop: "Latest",
    headAccent: "releases",
    headNote: "three featured · full catalogue follows",
    fullCatalogue: "Full catalogue",
    releasesWord: "releases",
    singlesWord: "singles",
    epsWord: "EPs",
    all: "All",
    grid: "Grid",
    list: "List",
    timeline: "Timeline",
    single: "Single",
    album: "Album",
    compilation: "Comp.",
    featured: "Featured",
    tracksWord: "tracks",
    listen: "Listen",
    latestOutNow: "Latest release · Out now",
    format: "Format",
    released: "Released",
    labelWord: "Label",
    stream: "Stream",
    listenNow: "Listen now",
    openRelease: "Open release",
    listHead: {
      cat: "Cat#",
      cover: "Cover",
      title: "Title",
      type: "Type",
      year: "Year",
      tracks: "Tracks",
    },
    scrollHint: "Scroll horizontally",
    by: "by",
  },
  video: {
    sectionLabel: "Video Lab",
    headTop: "Better the devil you know?",
    headAccent: "Let’s test that.",
    lead: "Six DJ-style mixes pitting today’s productions against the classics that still dominate sets — plus a full Beta-Time session.",
    experiment: "The experiment · 6 DJ mixes, old × new",
    experimentSub:
      "Two tracks mixed DJ-style — one of mine against a track DJs still spin. The bet: the new one holds the floor.",
    moreInSeries: "more in the series",
    watchPlaylist: "Watch full playlist on YouTube",
    playlistMeta: "6 videos · ~27 min total",
    closingPiece: "Closing piece",
    closingTop: "Eleven minutes,",
    closingAccent: "Beta-Time only",
    sessionEyebrow: "FULL SESSION · BETA-TIME RECORDS ONLY",
    sessionDescription: artist.videoLab.session.description,
    duration: "Duration",
    labelWord: "Label",
    tracksCatalogue: "Tracks · 100% catalogue",
    watchOnYouTube: "Watch on YouTube",
    watchAria: (title: string) => `Watch "${title}" on YouTube`,
    mixWord: "Mix",
    djMixVol: "DJ Mix · Vol",
    fromTheLabel: "From the label · Worth a watch",
    onAir: "On air",
    magoEyebrow: "Beta-Time family · YouTube channel",
    magoDescription: artist.videoLab.labelPick?.description ?? "",
    visitMago: "Visit MAGO TV",
    latestTransmissions: "Latest transmissions",
    tuning: "Tuning",
    volume: "Volume",
    channel: "Channel",
  },
  streaming: {
    label: "Listen",
    headTop: "Listen &",
    headAccent: "follow",
    streamingStores: "Streaming & stores",
    social: "Social",
    stream: "Stream",
    follow: "Follow",
    open: "Open",
  },
  label: {
    sectionLabel: "The Label",
    headTop: "Curating",
    headAccent: "electronic music",
    roleSince: (role: string) => `${role} since 2023`,
    lead: "Releases that push the boundaries of techno and electronic sound — curated, mastered, and shipped from Madrid.",
    releases: "Releases",
    artists: "Artists",
    founded: "Founded",
    visitWebsite: "Visit website",
    beatportStore: "Beatport store",
  },
  footer: {
    location: "Madrid · ES",
    blurb:
      "DJ & electronic music producer, Co-CEO of Beta-Time Records. Available for releases, remixes, and mastering.",
    site: "Site",
    listen: "Listen",
    follow: "Follow",
  },
  modal: {
    close: "Close",
    type: "Type",
    released: "Released",
    artist: "Artist",
    labelWord: "Label",
    tracklist: "Tracklist",
    openInSpotify: "Open in Spotify",
    featuredAppearance: "Featured appearance",
    single: "Single",
    tracksWord: "tracks",
    epOf: (n: number) => `EP · ${n} tracks`,
    albumOf: (n: number) => `Album · ${n} tracks`,
    compilationOf: (n: number) => `Compilation · ${n} tracks`,
    with: "with",
    releasePage: "Release page",
  },
  release: {
    back: "Kalamarico",
    breadcrumbReleases: "Releases",
    stream: "Stream",
    openInSpotify: "Open in Spotify",
    tracklist: "Tracklist",
    aboutArtist: "About Kalamarico",
    moreAbout: "More about Kalamarico",
    fullDiscography: "Full discography",
    previous: "Previous",
    next: "Next",
    otherLangLink: "Ver en español",
    coverAlt: (name: string) => `${name} cover art`,
  },
  cover: {
    alt: (name: string) => `${name} cover`,
  },
};

export type Strings = typeof en;

const es: Strings = {
  meta: {
    title: "Kalamarico — DJ y Productor de Música Electrónica · Madrid",
    description:
      "Kalamarico — DJ y productor de música electrónica de Madrid. Techno en Beta-Time Records. Escúchalo en Spotify, Apple Music, Beatport y más.",
    ogTitle: "Kalamarico — DJ y Productor de Música Electrónica",
    ogDescription:
      "DJ y productor de música electrónica de Madrid. Co-CEO de Beta-Time Records.",
  },
  nav: {
    links: {
      about: "Bio",
      releases: "Lanzamientos",
      video: "Vídeo",
      listen: "Escuchar",
      label: "Sello",
    },
    sectionMeta: {
      about: "Bio",
      tracks: "Lanzamientos",
      video: "Video Lab",
      listen: "Escuchar",
      label: "El Sello",
    },
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    menu: "Menú",
    siteNav: "Navegación del sitio",
    otherLang: "EN",
    otherLangTitle: "English version",
  },
  hero: {
    artistTag: "Artista",
    est: "EST. 1996 — FastTracker → Hoy",
    releasesWord: "lanzamientos",
    labelsWord: "sellos",
    eyebrow: "DJ · Productor de música electrónica",
    sub: "Exploración sonora, textura electrónica y una obsesión de 30 años con la estructura rítmica — hecho en Madrid.",
    listenSpotify: "Escúchame en Spotify",
    latestRelease: "Último lanzamiento",
  },
  about: {
    label: "Bio",
    headTop: "Exploración sonora,",
    headAccent: "siempre evolucionando.",
    pullQuote: "Cita",
    quoteBefore:
      "La mejora continua — tanto en mezcla como en composición — es parte esencial de mi ",
    quoteAccent: "proceso creativo",
    bio: `Desde mis primeras secuencias en FastTracker hace casi 30 años, he desarrollado un enfoque creativo centrado en la exploración sonora, el diseño de texturas electrónicas y la evolución técnica en la producción musical. Trabajo con un setup híbrido de software y hardware, con especial interés en equilibrar estructura rítmica y profundidad atmosférica.

Como Co-CEO de Beta-Time Records, gestiono proyectos, superviso lanzamientos y colaboro con artistas para dar forma a propuestas que destaquen en la escena electrónica actual. La mejora continua — tanto en mezcla como en composición — es parte esencial de mi proceso creativo.`,
    stats: {
      discography: "Discografía",
      releasesUnit: "lanzamientos",
      activeLabels: "Sellos activos",
      activeSince: "Activo desde",
      basedIn: "Base",
    },
    releasedOn: "Publicado en",
  },
  tracks: {
    label: "Discografía",
    headTop: "Últimos",
    headAccent: "lanzamientos",
    headNote: "tres destacados · después, el catálogo completo",
    fullCatalogue: "Catálogo completo",
    releasesWord: "lanzamientos",
    singlesWord: "singles",
    epsWord: "EPs",
    all: "Todo",
    grid: "Mosaico",
    list: "Lista",
    timeline: "Cronología",
    single: "Single",
    album: "Álbum",
    compilation: "Comp.",
    featured: "Colaboración",
    tracksWord: "temas",
    listen: "Escuchar",
    latestOutNow: "Último lanzamiento · Ya disponible",
    format: "Formato",
    released: "Publicado",
    labelWord: "Sello",
    stream: "Escúchalo en",
    listenNow: "Escuchar ya",
    openRelease: "Abrir ficha",
    listHead: {
      cat: "Cat#",
      cover: "Portada",
      title: "Título",
      type: "Tipo",
      year: "Año",
      tracks: "Temas",
    },
    scrollHint: "Desplázate en horizontal",
    by: "de",
  },
  video: {
    sectionLabel: "Video Lab",
    headTop: "¿Mejor malo conocido?",
    headAccent: "Vamos a comprobarlo.",
    lead: "Seis mezclas DJ que enfrentan producciones actuales con los clásicos que aún dominan las sesiones — más una sesión íntegra de Beta-Time.",
    experiment: "El experimento · 6 mezclas DJ, viejo × nuevo",
    experimentSub:
      "Dos temas mezclados al estilo DJ: uno mío contra un tema que los DJs siguen pinchando. La apuesta: el nuevo aguanta la pista.",
    moreInSeries: "más en la serie",
    watchPlaylist: "Ver la playlist completa en YouTube",
    playlistMeta: "6 vídeos · ~27 min en total",
    closingPiece: "Pieza final",
    closingTop: "Once minutos,",
    closingAccent: "solo Beta-Time",
    sessionEyebrow: "SESIÓN COMPLETA · SOLO BETA-TIME RECORDS",
    sessionDescription:
      "Una sesión de once minutos construida exclusivamente con lanzamientos de Beta-Time Records — el sonido del sello en un único flujo continuo.",
    duration: "Duración",
    labelWord: "Sello",
    tracksCatalogue: "Temas · 100% catálogo",
    watchOnYouTube: "Ver en YouTube",
    watchAria: (title: string) => `Ver "${title}" en YouTube`,
    mixWord: "Mix",
    djMixVol: "Mezcla DJ · Vol",
    fromTheLabel: "Del sello · Merece un vistazo",
    onAir: "En emisión",
    magoEyebrow: "Familia Beta-Time · Canal de YouTube",
    magoDescription:
      "Retro Electro directo de la familia Beta-Time. MAGO TV es una estación que emite synthwave original, electro y paisajes sonoros futuristas — cada lanzamiento es una transmisión dentro de un universo cinematográfico construido sobre videojuegos clásicos, estética cyberpunk, cultura arcade y tecnología analógica. Sintoniza el dial y déjalo sonar.",
    visitMago: "Visita MAGO TV",
    latestTransmissions: "Últimas transmisiones",
    tuning: "Sintonía",
    volume: "Volumen",
    channel: "Canal",
  },
  streaming: {
    label: "Escuchar",
    headTop: "Escucha y",
    headAccent: "sigue",
    streamingStores: "Streaming y tiendas",
    social: "Redes",
    stream: "Escuchar",
    follow: "Seguir",
    open: "Abrir",
  },
  label: {
    sectionLabel: "El Sello",
    headTop: "Impulsando",
    headAccent: "música electrónica",
    roleSince: (role: string) => `${role} desde 2023`,
    lead: "Lanzamientos que empujan los límites del techno y el sonido electrónico — seleccionados, masterizados y publicados desde Madrid.",
    releases: "Lanzamientos",
    artists: "Artistas",
    founded: "Fundado",
    visitWebsite: "Visitar web",
    beatportStore: "Tienda Beatport",
  },
  footer: {
    location: "Madrid · ES",
    blurb:
      "DJ y productor de música electrónica, Co-CEO de Beta-Time Records. Disponible para lanzamientos, remixes y mastering.",
    site: "Sitio",
    listen: "Escuchar",
    follow: "Seguir",
  },
  modal: {
    close: "Cerrar",
    type: "Tipo",
    released: "Publicado",
    artist: "Artista",
    labelWord: "Sello",
    tracklist: "Tracklist",
    openInSpotify: "Abrir en Spotify",
    featuredAppearance: "Colaboración",
    single: "Single",
    tracksWord: "temas",
    epOf: (n: number) => `EP · ${n} temas`,
    albumOf: (n: number) => `Álbum · ${n} temas`,
    compilationOf: (n: number) => `Recopilatorio · ${n} temas`,
    with: "con",
    releasePage: "Ficha del lanzamiento",
  },
  release: {
    back: "Kalamarico",
    breadcrumbReleases: "Lanzamientos",
    stream: "Escúchalo en",
    openInSpotify: "Abrir en Spotify",
    tracklist: "Tracklist",
    aboutArtist: "Sobre Kalamarico",
    moreAbout: "Más sobre Kalamarico",
    fullDiscography: "Discografía completa",
    previous: "Anterior",
    next: "Siguiente",
    otherLangLink: "View in English",
    coverAlt: (name: string) => `Portada de ${name}`,
  },
  cover: {
    alt: (name: string) => `Portada de ${name}`,
  },
};

export const STRINGS: Record<Lang, Strings> = { en, es };

export function useT(): Strings {
  return STRINGS[useLang()];
}
