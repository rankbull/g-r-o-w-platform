import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );

    const targets = el.querySelectorAll(".scroll-reveal");
    for (const t of targets) {
      observer.observe(t);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
