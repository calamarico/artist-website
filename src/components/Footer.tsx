import { artist } from "../data/artist";

const SITE = [
  { href: "#about", label: "About" },
  { href: "#tracks", label: "Releases" },
  { href: "#listen", label: "Listen" },
  { href: "#label", label: "Label" },
];

const LISTEN = ["Spotify", "SoundCloud", "Beatport", "Bandcamp"] as const;
const FOLLOW = ["Instagram", "YouTube", "Facebook"] as const;

const linkBy = (label: string): string =>
  artist.socials.find((s) => s.label === label)?.url ?? "#";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-ink-950 px-5 pb-6 pt-12 min-[700px]:px-8 min-[700px]:pb-8 min-[700px]:pt-16">
      <div className="mx-auto max-w-[1280px]">
        <h2
          className="
            text-gradient-footer m-0 mb-8 text-center font-display font-bold leading-[0.85] tracking-[-0.04em]
            text-[clamp(40px,14vw,96px)]
            min-[700px]:mb-12 min-[700px]:text-left min-[700px]:text-[clamp(64px,14vw,220px)]
          "
        >
          KALAMARICO
        </h2>

        <div
          className="
            grid grid-cols-2 gap-x-4 gap-y-6 border-b border-white/[0.08] pb-6 text-center
            min-[700px]:gap-8 min-[700px]:pb-8 min-[700px]:text-left
            min-[800px]:[grid-template-columns:2fr_1fr_1fr_1fr]
          "
        >
          <div className="col-span-2 min-[800px]:col-span-1">
            <h4 className="m-0 mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500 min-[700px]:mb-4 min-[700px]:text-[10px] min-[700px]:tracking-[0.24em]">
              Madrid · ES
            </h4>
            <p className="mx-auto m-0 max-w-[340px] text-[14px] leading-[1.6] text-gray-300 min-[700px]:mx-0">
              Electronic music producer &amp; Co-CEO of Beta-Time Records.
              Available for releases, remixes, and mastering.
            </p>
            <p className="mt-4">
              <a
                href="mailto:hello@kalamarico.com"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-soft no-underline transition-colors duration-200 hover:text-accent"
              >
                HELLO@KALAMARICO.COM ↗
              </a>
            </p>
          </div>

          <FooterCol title="Site">
            {SITE.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-display text-[14px] font-medium text-gray-300 no-underline transition-colors duration-200 hover:text-accent-soft min-[700px]:text-[15px]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Listen">
            {LISTEN.map((label) => (
              <li key={label}>
                <a
                  href={linkBy(label)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-display text-[14px] font-medium text-gray-300 no-underline transition-colors duration-200 hover:text-accent-soft min-[700px]:text-[15px]"
                >
                  {label}
                </a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Follow">
            {FOLLOW.map((label) => (
              <li key={label}>
                <a
                  href={linkBy(label)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-display text-[14px] font-medium text-gray-300 no-underline transition-colors duration-200 hover:text-accent-soft min-[700px]:text-[15px]"
                >
                  {label}
                </a>
              </li>
            ))}
          </FooterCol>
        </div>

        <div
          className="
            flex flex-col items-center gap-2 pt-6 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500
            min-[700px]:flex-row min-[700px]:flex-wrap min-[700px]:items-start min-[700px]:justify-between min-[700px]:gap-4
            min-[700px]:text-left min-[700px]:text-[10px] min-[700px]:tracking-[0.2em]
          "
        >
          <span>
            © {new Date().getFullYear()}{" "}
            <b className="font-medium text-gray-300">Kalamarico</b> /
            Beta-Time Records
          </span>
          <span>v2 · Editorial · {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="m-0 mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500 min-[700px]:mb-4 min-[700px]:text-[10px] min-[700px]:tracking-[0.24em]">
        {title}
      </h4>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">{children}</ul>
    </div>
  );
}
