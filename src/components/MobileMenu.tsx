import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiXMark, HiArrowTopRightOnSquare } from "react-icons/hi2";
import { artist } from "../data/artist";

const SECTIONS = [
  { num: "01", id: "about", label: "About" },
  { num: "02", id: "tracks", label: "Releases" },
  { num: "03", id: "listen", label: "Listen" },
  { num: "04", id: "label", label: "The Label" },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex flex-col bg-ink-950/95 backdrop-blur-2xl"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.05,
            }}
            className="flex h-full flex-col px-5 pb-8 pt-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold uppercase tracking-[0.04em] text-white">
                Kalamarico
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.14] bg-ink-950/60 text-white transition-colors duration-200 hover:bg-accent hover:text-ink-950"
              >
                <HiXMark size={18} />
              </button>
            </div>

            <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.28em] text-gray-500">
              Menu
            </p>

            <nav className="mt-4 border-t border-white/[0.08]">
              <ul className="m-0 list-none p-0">
                {SECTIONS.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.12 + i * 0.06,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={onClose}
                      className="group grid items-baseline gap-4 border-b border-white/[0.08] py-5 text-white transition-colors duration-200 [grid-template-columns:60px_1fr_24px]"
                    >
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                        {s.num} / 04
                      </span>
                      <span
                        className="font-display font-semibold tracking-[-0.015em] transition-colors duration-200 group-hover:text-accent-soft"
                        style={{ fontSize: "clamp(28px, 8vw, 40px)" }}
                      >
                        {s.label}
                      </span>
                      <span className="font-mono text-[14px] text-gray-500 transition-colors duration-200 group-hover:text-accent-soft">
                        ↗
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="mt-auto flex flex-col gap-3 pt-8"
            >
              <a
                href={artist.label.website}
                target="_blank"
                rel="noreferrer noopener"
                onClick={onClose}
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-300 transition-colors duration-200 hover:text-accent-soft"
              >
                <HiArrowTopRightOnSquare size={12} aria-hidden /> Beta-Time
                Records
              </a>
              <a
                href="mailto:hello@kalamarico.com"
                onClick={onClose}
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-soft transition-colors duration-200 hover:text-accent"
              >
                HELLO@KALAMARICO.COM ↗
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
