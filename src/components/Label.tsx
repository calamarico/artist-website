import { SiBeatport } from "react-icons/si";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { artist } from "../data/artist";
import { SectionHead } from "./SectionHead";

export function Label() {
  const { label } = artist;

  return (
    <section
      id="label"
      className="relative bg-ink-900 py-16 min-[700px]:py-20 min-[900px]:py-[120px]"
    >
      <div className="mx-auto max-w-[1280px] px-5 min-[700px]:px-8">
        <SectionHead num="04 / 04" label="The Label">
          Curating{" "}
          <span className="font-normal not-italic text-accent-soft">
            electronic music
          </span>
        </SectionHead>

        <div
          className="
            relative overflow-hidden border border-white/[0.14]
            bg-gradient-to-br from-ink-800 to-ink-950
            px-6 py-10
            min-[700px]:px-12 min-[700px]:py-14
            min-[900px]:px-16 min-[900px]:py-20
          "
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              WebkitMaskImage:
                "radial-gradient(ellipse at top right, black 30%, transparent 70%)",
              maskImage:
                "radial-gradient(ellipse at top right, black 30%, transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[100px] -right-[100px]"
            style={{
              width: 500,
              height: 500,
              background:
                "radial-gradient(circle, rgb(var(--color-accent) / 0.18), transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          <div
            className="
              relative grid grid-cols-1 items-end gap-8
              min-[800px]:grid-cols-2 min-[800px]:gap-16
            "
          >
            <div className="text-center min-[800px]:text-left">
              <p className="m-0 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                {label.role} since 2023
              </p>
              <h3
                className="m-0 mt-6 font-display font-bold leading-[0.9] tracking-[-0.03em] text-white"
                style={{ fontSize: "clamp(32px, 9vw, 88px)" }}
              >
                Beta-Time
                <br />
                <span className="text-gradient-records not-italic">
                  Records
                </span>
              </h3>
              <p
                className="mx-auto mt-6 max-w-[480px] font-display font-normal leading-[1.4] tracking-[-0.005em] text-gray-300 text-[17px] min-[700px]:mt-8 min-[700px]:text-[clamp(20px,1.8vw,26px)] min-[800px]:mx-0"
              >
                Releases that push the boundaries of techno and electronic
                sound — curated, mastered, and shipped from Madrid.
              </p>
            </div>

            <div className="flex flex-col gap-5 min-[700px]:gap-6">
              <div className="mt-5 grid grid-cols-3 gap-px border border-white/[0.08] bg-white/[0.08] min-[700px]:mt-0">
                <Stat value="42+" label="Releases" />
                <Stat value="18" label="Artists" />
                <Stat value="2023" label="Founded" />
              </div>
              <div className="flex flex-col flex-wrap gap-3 min-[700px]:flex-row">
                <a
                  href={label.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="
                    inline-flex w-full items-center justify-center gap-2.5 bg-accent
                    px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink-950
                    transition-colors duration-200 hover:bg-accent-soft
                    min-[700px]:w-auto min-[700px]:px-5 min-[700px]:tracking-[0.22em] min-[700px]:text-[11px]
                  "
                >
                  <HiArrowTopRightOnSquare size={14} aria-hidden /> Visit
                  website
                </a>
                <a
                  href={label.beatport}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="
                    inline-flex w-full items-center justify-center gap-2.5 border border-white/[0.14]
                    bg-transparent px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white
                    transition-colors duration-200 hover:border-accent hover:text-accent-soft
                    min-[700px]:w-auto min-[700px]:px-5 min-[700px]:tracking-[0.22em] min-[700px]:text-[11px]
                  "
                >
                  <SiBeatport size={14} aria-hidden /> Beatport store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[rgba(5,5,7,0.6)] p-3 backdrop-blur-md min-[700px]:p-4">
      <div className="font-display text-[18px] font-semibold leading-none tracking-[-0.01em] text-white min-[700px]:text-[24px]">
        {value}
      </div>
      <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em] text-gray-500 min-[700px]:text-[9px] min-[700px]:tracking-[0.22em]">
        {label}
      </div>
    </div>
  );
}
