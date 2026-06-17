import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import { HiPlay } from "react-icons/hi";
import { artist, type Video } from "../data/artist";

function cleanTitle(title: string): string {
  return title
    .replace(/^Best DJ Mixes(?:\s+vol\.\d+)?\s*-\s*/i, "")
    .replace(/\s*-?\s*#betatimerecords\s*$/i, "")
    .replace(/\s+VS\s+/g, " VS ")
    .trim();
}

export function VideoLab() {
  const { djMixes, session, labelPick } = artist.videoLab;

  const indexed = djMixes.videos.map((video, i) => ({ video, vol: i + 1 }));
  const featuredSet = new Set<string>(djMixes.featuredIds);
  const featured = djMixes.featuredIds
    .map((id) => indexed.find((iv) => iv.video.id === id))
    .filter((iv): iv is { video: Video; vol: number } => Boolean(iv));
  const rest = indexed.filter(({ video }) => !featuredSet.has(video.id));
  const total = djMixes.videos.length;
  const sessionTitle = cleanTitle(session.title);

  return (
    <section
      id="video"
      className="relative border-t border-ink-700/60 bg-ink-900 py-16 min-[700px]:py-20 min-[900px]:py-[120px]"
    >
      <div className="mx-auto max-w-[1280px] px-5 min-[700px]:px-8">
        <div
          className="
            mb-8 grid grid-cols-1 items-start gap-3 border-b border-white/[0.08] pb-6 text-left
            min-[700px]:mb-10 min-[700px]:gap-4 min-[700px]:pb-8
            min-[800px]:items-end min-[800px]:gap-12 min-[800px]:[grid-template-columns:200px_1fr]
            min-[900px]:mb-16 min-[900px]:pb-14
          "
        >
          <div className="font-display text-xs font-medium text-gray-500 min-[700px]:text-sm">
            <span className="text-accent">03 / 05</span>
            &nbsp;— Video Lab
          </div>
          <div className="grid items-end gap-6 min-[900px]:grid-cols-[1.4fr_1fr] min-[900px]:gap-12">
            <h2
              className="m-0 font-display font-semibold leading-[1.02] tracking-[-0.02em] text-white"
              style={{
                fontSize: "clamp(28px, 4.2vw, 52px)",
                textWrap: "pretty" as never,
              }}
            >
              Better the devil you know?{" "}
              <span className="block font-normal not-italic text-gradient-accent">
                Let&rsquo;s test that.
              </span>
            </h2>
            <p className="m-0 max-w-[44ch] font-display leading-[1.5] tracking-[-0.005em] text-gray-300 text-[16px] min-[700px]:text-[18px] min-[900px]:text-[19px]">
              Six DJ-style mixes pitting today&rsquo;s productions against the
              classics that still dominate sets — plus a full Beta-Time
              session.
            </p>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-3 min-[700px]:mb-10">
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft">
            The experiment · 6 DJ mixes, old × new
          </p>
          <p className="m-0 max-w-[60ch] font-display text-[15px] leading-[1.55] text-gray-300 min-[700px]:text-[17px]">
            Two tracks mixed DJ-style — one of mine against a track DJs still
            spin. The bet: the new one holds the floor.
          </p>
        </div>

        <ul className="mt-10 grid list-none grid-cols-1 gap-6 min-[900px]:grid-cols-2 min-[900px]:gap-8">
          {featured.map(({ video, vol }, index) => (
            <FeaturedMixCard
              key={video.id}
              video={video}
              vol={vol}
              total={total}
              index={index}
            />
          ))}
        </ul>

        <div className="mt-12 flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500">
            + {rest.length} more in the series
          </span>
          <span className="h-px flex-1 bg-ink-700" />
        </div>

        <ul className="mt-6 grid list-none grid-cols-2 gap-3 min-[800px]:grid-cols-4 min-[800px]:gap-4">
          {rest.map(({ video, vol }, index) => (
            <CompactMixCard
              key={video.id}
              video={video}
              vol={vol}
              total={total}
              index={index}
            />
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={djMixes.playlistUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-3 rounded-full border border-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.24em] text-accent transition-all duration-200 hover:bg-accent hover:text-ink-950"
          >
            <FaYoutube size={16} aria-hidden /> Watch full playlist on YouTube
            <span aria-hidden>→</span>
          </a>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500">
            6 videos · ~27 min total
          </span>
        </div>

        <div className="mt-24 border-t border-ink-700/60 pt-16">
          <p className="m-0 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-accent-ping" />
            Closing piece
          </p>
          <h3
            className="m-0 mt-5 font-display font-semibold leading-[1.05] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(26px, 3.2vw, 42px)" }}
          >
            Eleven minutes,{" "}
            <span className="text-accent-soft">Beta-Time only</span>
          </h3>
          <p className="m-0 mt-4 max-w-[60ch] font-display text-[15px] leading-[1.55] text-gray-300 min-[700px]:text-[17px]">
            {session.description}
          </p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            href={`https://youtu.be/${session.id}`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Watch "${sessionTitle}" on YouTube`}
            className="
              group relative mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-ink-700
              bg-ink-800/70 transition-all duration-300
              hover:border-accent hover:shadow-2xl hover:shadow-accent/20
              min-[900px]:[grid-template-columns:1.4fr_1fr]
            "
          >
            <div className="relative aspect-video overflow-hidden bg-ink-950 min-[900px]:aspect-auto">
              <img
                src={`https://i.ytimg.com/vi/${session.id}/maxresdefault.jpg`}
                alt={sessionTitle}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${session.id}/hqdefault.jpg`;
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/0 to-ink-950/0" />
              <span className="absolute bottom-3 right-3 rounded bg-ink-950/80 px-3 py-1.5 font-mono text-[13px] tracking-wide text-white backdrop-blur">
                {session.duration}
              </span>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-ink-950 shadow-2xl shadow-accent/40">
                  <HiPlay size={36} aria-hidden />
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-5 p-6 min-[900px]:p-10">
              <p className="m-0 inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-accent-soft">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-accent-ping" />
                {session.eyebrow}
              </p>
              <h4
                className="m-0 font-display font-semibold leading-[1.05] tracking-[-0.02em] text-white transition-colors duration-200 group-hover:text-accent-soft"
                style={{
                  fontSize: "clamp(24px, 3vw, 38px)",
                  textWrap: "balance" as never,
                }}
              >
                {sessionTitle}
              </h4>
              <ul className="m-0 flex flex-wrap items-center gap-2 p-0 font-mono text-[10px] uppercase tracking-[0.22em] text-gray-300">
                <li className="border border-white/[0.14] bg-white/[0.02] px-2.5 py-1.5">
                  Duration · {session.duration}
                </li>
                <li className="border border-white/[0.14] bg-white/[0.02] px-2.5 py-1.5">
                  Label · Beta-Time
                </li>
                <li className="border border-white/[0.14] bg-white/[0.02] px-2.5 py-1.5">
                  Tracks · 100% catalogue
                </li>
              </ul>
              <div>
                <span className="inline-flex items-center gap-3 bg-accent px-[22px] py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-950 transition-all duration-200 group-hover:-translate-y-px group-hover:bg-accent-soft">
                  <FaYoutube size={14} aria-hidden /> Watch on YouTube
                  <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          </motion.a>
        </div>

        {labelPick && <MagoTvCard labelPick={labelPick} />}
      </div>
    </section>
  );
}

type LabelPick = NonNullable<typeof artist.videoLab.labelPick>;

function MagoTvCard({ labelPick }: { labelPick: LabelPick }) {
  return (
    <div className="mt-24 border-t border-ink-700/60 pt-16">
      <p className="m-0 mb-7 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-accent-ping" />
        From the label · Worth a watch
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mago-card"
      >
        {/* Left — electric channel avatar with an occasional power surge */}
        <div className="mago-visual">
          <div className="mago-avatar-stage">
            <span className="mago-shock" aria-hidden />
            <span className="mago-shock mago-shock--s2" aria-hidden />
            <div className="mago-avatar-ring">
              <img
                src={labelPick.logo}
                alt={`${labelPick.artist} Retro Electro TV channel logo`}
                loading="lazy"
                decoding="async"
                className="mago-avatar"
              />
              <span className="mago-flash" aria-hidden />
            </div>
          </div>
          <span className="mago-live">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-accent-ping" />
            On air · {labelPick.channelHandle}
          </span>
          <span className="mago-ch">{labelPick.channelMeta}</span>
        </div>

        {/* Right — the channel, playing on a retro CRT television */}
        <div className="mago-body">
          <div className="mago-tv-set">
            <div className="mago-tv-screen">
              <span className="mago-tv-ch" aria-hidden>
                CH 105
              </span>
              <span className="mago-tv-badge" aria-hidden>
                <span className="rec" /> MAGO TV
              </span>
              <div className="mago-tv-content">
                <p className="mago-kicker">{labelPick.eyebrow}</p>
                <h3 className="mago-name">
                  {labelPick.artist}{" "}
                  <span className="bolt" aria-hidden>
                    ⚡
                  </span>{" "}
                  Retro Electro{" "}
                  <span className="bolt" aria-hidden>
                    ⚡
                  </span>{" "}
                  TV
                </h3>
                <p className="mago-desc">{labelPick.description}</p>
                <ul className="mago-tags">
                  {labelPick.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <div className="mago-actions">
                  <a
                    className="mago-btn"
                    href={labelPick.channelUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <FaYoutube size={15} aria-hidden /> Visit MAGO TV
                    <span aria-hidden>→</span>
                  </a>
                  <a
                    className="mago-ghost"
                    href={labelPick.videosUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Latest transmissions
                  </a>
                </div>
              </div>
            </div>
            <div className="mago-tv-controls">
              <div className="mago-tv-left">
                <div className="mago-tv-grille" aria-hidden>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} />
                  ))}
                </div>
                <div className="mago-tv-brand" aria-hidden>
                  <span className="mago-tv-led" /> Model · Neonic 19 · 1984
                </div>
              </div>
              <div className="mago-tv-knobs" aria-hidden>
                <div className="mago-knob-wrap">
                  <span className="mago-knob-lbl">Tuning</span>
                  <div className="mago-knob mago-knob--r1" />
                </div>
                <div className="mago-knob-wrap">
                  <span className="mago-knob-lbl">Volume</span>
                  <div className="mago-knob mago-knob--r2" />
                </div>
                <div className="mago-knob-wrap">
                  <span className="mago-knob-lbl">Channel</span>
                  <div className="mago-knob mago-knob--r3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FeaturedMixCard({
  video,
  vol,
  total,
  index,
}: {
  video: Video;
  vol: number;
  total: number;
  index: number;
}) {
  const title = cleanTitle(video.title);
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="list-none"
    >
      <a
        href={`https://youtu.be/${video.id}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Watch "${title}" on YouTube`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-800/70 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-2xl hover:shadow-accent/20"
      >
        <div className="relative aspect-video overflow-hidden bg-ink-950">
          <img
            src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/0 to-ink-950/0" />
          <span className="absolute left-3 top-3 rounded-full border border-ink-700/60 bg-ink-950/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent-soft backdrop-blur">
            Mix {String(vol).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="absolute bottom-3 right-3 rounded bg-ink-950/80 px-2 py-1 font-mono text-[11px] tracking-wide text-white backdrop-blur">
            {video.duration}
          </span>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-ink-950 shadow-2xl shadow-accent/40">
              <HiPlay size={28} aria-hidden />
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500">
            <span>DJ Mix · Vol {String(vol).padStart(2, "0")}</span>
            <span className="h-px w-8 bg-ink-700" />
            <span>{video.duration}</span>
          </div>
          <h4
            className="m-0 font-display text-xl font-semibold leading-snug text-white transition-colors duration-200 group-hover:text-accent-soft min-[700px]:text-2xl"
            style={{ textWrap: "balance" as never }}
          >
            {title}
          </h4>
          <div className="mt-1 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-gray-400 transition-colors duration-200 group-hover:text-accent-soft">
            <FaYoutube size={12} aria-hidden /> Watch on YouTube
            <span aria-hidden>→</span>
          </div>
        </div>
      </a>
    </motion.li>
  );
}

function CompactMixCard({
  video,
  vol,
  total,
  index,
}: {
  video: Video;
  vol: number;
  total: number;
  index: number;
}) {
  const title = cleanTitle(video.title);
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="list-none"
    >
      <a
        href={`https://youtu.be/${video.id}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Watch "${title}" on YouTube`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink-700 bg-ink-800/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-xl hover:shadow-accent/10"
      >
        <div className="relative aspect-video overflow-hidden bg-ink-950">
          <img
            src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.id}/default.jpg`;
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/0 to-ink-950/0" />
          <span className="absolute left-2 top-2 rounded-full border border-ink-700/60 bg-ink-950/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent-soft backdrop-blur">
            Mix {String(vol).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="absolute bottom-2 right-2 rounded bg-ink-950/80 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-white backdrop-blur">
            {video.duration}
          </span>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/95 text-ink-950 shadow-lg">
              <HiPlay size={18} aria-hidden />
            </span>
          </div>
        </div>
        <div className="p-3">
          <h4 className="m-0 line-clamp-2 font-display text-sm font-medium leading-snug text-white transition-colors duration-200 group-hover:text-accent-soft">
            {title}
          </h4>
        </div>
      </a>
    </motion.li>
  );
}
