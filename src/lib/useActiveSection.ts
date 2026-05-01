import { useEffect, useState } from "react";

export function useActiveSection<T extends string>(ids: readonly T[]): T | null {
  const [active, setActive] = useState<T | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const visible = new Map<T, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as T;
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
        }
        if (visible.size === 0) {
          setActive(null);
          return;
        }
        let bestId: T | null = null;
        let bestIndex = Infinity;
        for (const id of visible.keys()) {
          const idx = ids.indexOf(id);
          if (idx >= 0 && idx < bestIndex) {
            bestIndex = idx;
            bestId = id;
          }
        }
        setActive(bestId);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
