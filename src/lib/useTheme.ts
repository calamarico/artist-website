import { useEffect, useState } from "react";

export type Theme = "green" | "fire";

function readTheme(): Theme {
  if (typeof document === "undefined") return "green";
  return document.documentElement.dataset.theme === "fire" ? "fire" : "green";
}

export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(readTheme);
  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(readTheme()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  return theme;
}
