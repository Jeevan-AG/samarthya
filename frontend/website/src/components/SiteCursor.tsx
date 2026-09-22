import { useEffect, useRef, useState } from "react";

export default function SiteCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-site-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };
    let hovering = false;
    let frame = 0;

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const over = (e: PointerEvent) => {
      const node = e.target as HTMLElement | null;
      hovering = Boolean(node?.closest("a, button, [data-cursor]"));
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      const el = ringRef.current;
      if (el) {
        el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        el.dataset.hover = hovering ? "1" : "0";
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-site-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      className="site-cursor pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
      aria-hidden="true"
    >
      <div className="site-cursor-dot" />
    </div>
  );
}
