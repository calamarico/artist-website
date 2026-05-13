import type { ComponentType } from "react";
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
import { SectionHead } from "./SectionHead";

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
      className="relative bg-ink-950 py-16 min-[700px]:py-20 min-[900px]:py-[120px]"
    >
      <div className="mx-auto max-w-[1280px] px-5 min-[700px]:px-8">
        <SectionHead num="04 / 05" label="Listen">
          Listen &amp;{" "}
          <span className="font-normal not-italic text-accent-soft">
            follow
          </span>
        </SectionHead>

        <Group title="Streaming & stores" items={streaming} action="Stream" />
        <div className="mt-12">
          <Group title="Social" items={social} action="Follow" />
        </div>
      </div>
    </section>
  );
}

function Group({
  title,
  items,
  action,
}: {
  title: string;
  items: Social[];
  action: string;
}) {
  return (
    <div>
      <p className="m-0 mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-gray-500">
        {title}
      </p>
      <ul
        className="
          grid list-none grid-cols-2 gap-px border border-white/[0.08] bg-white/[0.08]
          max-[420px]:gap-px
          min-[800px]:grid-cols-4
        "
      >
        {items.map((s, i) => (
          <Tile key={s.label} item={s} index={i} action={action} />
        ))}
      </ul>
    </div>
  );
}

function Tile({
  item,
  index,
  action,
}: {
  item: Social;
  index: number;
  action: string;
}) {
  const Glyph = ICONS[item.label];
  return (
    <li className="group relative flex cursor-pointer flex-col gap-3 overflow-hidden bg-ink-950 p-4 px-4 transition-colors duration-200 hover:bg-ink-900 min-[700px]:gap-4 min-[700px]:p-7 min-[700px]:px-6">
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer noopener"
        className="absolute inset-0"
        aria-label={`${action} on ${item.label}`}
      />
      <span className="absolute right-2.5 top-2.5 font-mono text-[9px] tracking-[0.18em] text-gray-600 min-[700px]:right-3.5 min-[700px]:top-3.5 min-[700px]:text-[10px]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="inline-flex h-6 w-6 items-center justify-center text-accent-soft min-[700px]:h-8 min-[700px]:w-8">
        {Glyph ? <Glyph size={28} /> : null}
      </div>
      <div>
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500 min-[700px]:text-[10px] min-[700px]:tracking-[0.22em]">
          {action}
        </div>
        <div className="mt-1 font-display text-[14px] font-semibold tracking-[-0.005em] text-white min-[700px]:text-[18px]">
          {item.label}
        </div>
      </div>
      <span className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500 transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent-soft min-[700px]:bottom-4 min-[700px]:right-4 min-[700px]:text-[11px] min-[700px]:tracking-[0.22em]">
        Open ↗
      </span>
    </li>
  );
}
