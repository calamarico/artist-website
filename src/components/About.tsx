import { motion } from "framer-motion";
import { artist } from "../data/artist";
import { SectionHead } from "./SectionHead";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export function About() {
  const paragraphs = artist.bio.split(/\n\s*\n/);
  const firstChar = paragraphs[0]?.charAt(0) ?? "";
  const firstRest = paragraphs[0]?.slice(1) ?? "";

  return (
    <section
      id="about"
      className="relative bg-ink-950 py-16 min-[700px]:py-20 min-[900px]:py-[120px]"
    >
      <div className="mx-auto max-w-[1280px] px-5 min-[700px]:px-8">
        <SectionHead num="01 / 04" label="About">
          Sound exploration,
          <br />
          <span className="font-normal not-italic text-accent-soft">
            always evolving.
          </span>
        </SectionHead>

        <div className="grid grid-cols-1 gap-10 max-[900px]:gap-14 min-[900px]:grid-cols-[1fr_1.1fr] min-[900px]:gap-24">
          <motion.aside
            {...fadeIn}
            className="self-start text-center min-[900px]:sticky min-[900px]:top-[120px] min-[900px]:text-left"
          >
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.28em] text-gray-500">
              Pull quote
            </p>
            <p
              className="mb-6 mt-2 font-display font-semibold leading-[1.25] tracking-[-0.015em] text-white max-[700px]:text-[22px] min-[700px]:mb-8 min-[700px]:leading-[1.15]"
              style={{ fontSize: "clamp(28px, 2.4vw, 36px)" }}
            >
              &ldquo;Continuous improvement — both in mixing and composition —
              is a core part of my creative{" "}
              <span className="not-italic text-accent-soft">process</span>
              .&rdquo;
            </p>

            <div className="grid grid-cols-2 gap-px border border-white/[0.08] bg-white/[0.08]">
              <Stat value={String(artist.releases.length)} unit="releases" label="Discography" />
              <Stat value={String(artist.labels.length)} label="Active labels" />
              <Stat value="30" unit="yrs" label="Producing" />
              <Stat value="MAD" label="Based in" />
            </div>
          </motion.aside>

          <motion.div
            {...fadeIn}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <div className="max-w-[56ch]">
              {paragraphs[0] && (
                <p className="m-0 mb-[1.1em] text-[15px] leading-[1.6] text-gray-300 min-[700px]:text-[19px] min-[700px]:leading-[1.65]">
                  <span
                    className="float-left pr-2 pt-1 font-display font-semibold leading-[0.85] text-accent-soft text-[44px] min-[700px]:pr-3 min-[700px]:pt-1.5 min-[700px]:text-[64px]"
                  >
                    {firstChar}
                  </span>
                  {firstRest}
                </p>
              )}
              {paragraphs.slice(1).map((p, i) => (
                <p
                  key={i}
                  className="m-0 mb-[1.1em] text-[15px] leading-[1.6] text-gray-300 min-[700px]:text-[17px] min-[700px]:leading-[1.65]"
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-14 border-t border-white/[0.08] pt-8">
              <p className="m-0 font-mono text-[11px] uppercase tracking-[0.28em] text-gray-500">
                Released on
              </p>
              <ul className="mt-4 flex flex-col">
                {artist.labels.map((label, i) => (
                  <li
                    key={label}
                    className="group flex items-baseline justify-between border-b border-white/[0.08] py-3 transition-colors duration-200 min-[700px]:py-3.5"
                  >
                    <span className="font-display text-[15px] font-medium text-gray-300 transition-colors duration-200 group-hover:text-accent-soft min-[700px]:text-[18px]">
                      {label}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-gray-500 min-[700px]:text-[11px]">
                      {String(i + 1).padStart(2, "0")} ↗
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-ink-950 p-5">
      <div className="font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-white min-[700px]:text-[36px]">
        {value}
        {unit && (
          <small className="ml-1.5 text-[11px] font-normal text-gray-500 min-[700px]:text-[14px]">
            {unit}
          </small>
        )}
      </div>
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500 min-[700px]:text-[10px] min-[700px]:tracking-[0.22em]">
        {label}
      </div>
    </div>
  );
}
