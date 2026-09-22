import { useRef } from "react";

export default function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      data-cursor
      onMouseLeave={() => {
        const node = ref.current;
        if (node) node.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
      }}
      onMouseMove={(e) => {
        const node = ref.current;
        if (!node) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = node.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        node.style.transform = `perspective(900px) rotateX(${-py * 7}deg) rotateY(${px * 9}deg)`;
      }}
    >
      {children}
    </div>
  );
}
