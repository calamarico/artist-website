import { useEffect } from "react";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#tracks", label: "Releases" },
  { href: "#listen", label: "Listen" },
  { href: "#label", label: "Label" },
] as const;

export function Footer() {
  useEffect(() => {
    console.log("%c🎵 Kalamarico", "font-size:20px; color:#a3e635;");
    console.log("Beta-Time Records | Electronic Music Producer");
  }, []);

  return (
    <footer className="border-t border-ink-700/60 bg-ink-950 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div>
          <p className="font-display text-lg font-semibold text-white">
            Kalamarico
          </p>
          <p className="mt-1 text-sm text-gray-500">
            © 2025 Kalamarico / Beta-Time Records
          </p>
        </div>

        <nav>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
