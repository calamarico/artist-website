import { useEffect, useState } from "react";
import { HiBars3 } from "react-icons/hi2";
import { useActiveSection } from "../lib/useActiveSection";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#tracks", label: "Releases" },
  { href: "#listen", label: "Listen" },
] as const;

const SECTION_IDS = ["about", "tracks", "listen", "label"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const SECTION_META: Record<SectionId, { num: string; label: string }> = {
  about: { num: "01", label: "About" },
  tracks: { num: "02", label: "Releases" },
  listen: { num: "03", label: "Listen" },
  label: { num: "04", label: "The Label" },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection<SectionId>(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const meta = active ? SECTION_META[active] : null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.08] bg-[rgb(5_5_7_/_0.78)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <nav
          className="
            mx-auto grid max-w-[1280px] items-center gap-3 px-5 py-3
            [grid-template-columns:1fr_auto]
            min-[700px]:gap-6 min-[700px]:px-8 min-[700px]:py-4
            min-[700px]:[grid-template-columns:1fr_auto_1fr]
          "
        >
          <ul className="hidden items-center gap-7 min-[700px]:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="border-b border-transparent py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-300 transition-colors duration-200 hover:border-accent hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#top"
            className="font-display text-sm font-semibold uppercase tracking-[0.04em] text-white"
          >
            Kalamarico
          </a>

          <div className="flex items-center justify-end gap-3 min-[700px]:gap-7">
            <span
              key={meta?.label ?? "live"}
              className="
                inline-flex animate-fade-up items-center gap-2 font-mono text-[10px]
                uppercase tracking-[0.18em] text-gray-500
                min-[700px]:text-[11px] min-[700px]:tracking-[0.2em]
              "
            >
              {meta ? (
                <>
                  <span className="text-accent">{meta.num} / 04</span>
                  <span className="hidden text-gray-300 min-[420px]:inline">
                    {meta.label}
                  </span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 animate-blink rounded-full bg-accent" />
                  Live · MAD
                </>
              )}
            </span>
            <a
              href="#label"
              className="hidden border-b border-transparent py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-300 transition-colors duration-200 hover:border-accent hover:text-white min-[700px]:inline-flex"
            >
              Beta-Time ↗
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.14] text-gray-200 transition-colors duration-200 hover:border-accent hover:text-white min-[700px]:hidden"
            >
              <HiBars3 size={18} />
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
