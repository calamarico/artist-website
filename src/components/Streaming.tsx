import type { ComponentType } from "react";
import { motion } from "framer-motion";
import {
  FaSpotify,
  FaSoundcloud,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaApple,
  FaBandcamp,
  FaDeezer,
} from "react-icons/fa";
import { SiBeatport, SiTidal } from "react-icons/si";
import { artist, type Social } from "../data/artist";

type IconType = ComponentType<{ size?: number | string; className?: string }>;

const ICONS: Record<string, IconType> = {
  Spotify: FaSpotify,
  SoundCloud: FaSoundcloud,
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  YouTube: FaYoutube,
  "Apple Music": FaApple,
  Beatport: SiBeatport,
  Bandcamp: FaBandcamp,
  Deezer: FaDeezer,
  Tidal: SiTidal,
};

const STREAMING = new Set([
  "Spotify",
  "SoundCloud",
  "Apple Music",
  "Deezer",
  "Tidal",
  "Bandcamp",
  "Beatport",
]);

export function Streaming() {
  const streaming = artist.socials.filter((s) => STREAMING.has(s.label));
  const social = artist.socials.filter((s) => !STREAMING.has(s.label));

  return (
    <section
      id="listen"
      className="relative border-t border-ink-700/60 bg-ink-950 py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">
          Everywhere
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Listen & <span className="text-gradient-accent">Download</span>
        </h2>
        <p className="mt-4 max-w-xl text-gray-400">
          Stream Kalamarico on every major platform, or follow on social for the
          latest drops.
        </p>

        <Group title="Streaming & stores" items={streaming} delayBase={0} />
        <Group title="Social" items={social} delayBase={4} />
      </div>
    </section>
  );
}

function Group({
  title,
  items,
  delayBase,
}: {
  title: string;
  items: Social[];
  delayBase: number;
}) {
  return (
    <div className="mt-14">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500">
        {title}
      </p>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <PlatformLink key={item.url} item={item} delay={(delayBase + i) * 0.05} />
        ))}
      </ul>
    </div>
  );
}

function PlatformLink({ item, delay }: { item: Social; delay: number }) {
  const Icon = ICONS[item.label];

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer noopener"
        className="group flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900/60 px-4 py-3.5 text-sm font-medium text-gray-200 transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-ink-800 hover:text-white hover:shadow-lg hover:shadow-accent/10"
      >
        {Icon ? (
          <Icon
            className="text-accent-soft transition-colors group-hover:text-white"
            size={18}
          />
        ) : null}
        <span className="truncate">{item.label}</span>
      </a>
    </motion.li>
  );
}
