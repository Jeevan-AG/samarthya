import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.18,
      touchMultiplier: 1.55,
    });

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("a[href*='#'], a[href='/']");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      
      if (href === "/") {
        if (window.location.pathname === "/" || window.location.pathname === "") {
          event.preventDefault();
          lenis.scrollTo(0, { offset: 0 });
          window.history.pushState(null, "", "/");
        }
        return;
      }

      const isAnchor = href.startsWith("#");
      const isHomeAnchor = href.startsWith("/#") && (window.location.pathname === "/" || window.location.pathname === "");
      
      if (isAnchor || isHomeAnchor) {
        const hash = href.startsWith("/#") ? href.slice(1) : href;
        const dest = document.querySelector(hash);
        if (dest instanceof HTMLElement) {
          event.preventDefault();
          const offset = hash === "#about" ? -96 : -72;
          lenis.scrollTo(dest, { offset });
          window.history.pushState(null, "", hash);
        }
      }
    };

    document.addEventListener("click", onClick);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
