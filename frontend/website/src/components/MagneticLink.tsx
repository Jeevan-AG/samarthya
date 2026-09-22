import { useRef } from "react";

export default function MagneticLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const reset = () => {
    const node = ref.current;
    if (node) node.style.transform = "translate3d(0,0,0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      data-cursor
      onMouseLeave={reset}
      onMouseMove={(e) => {
        const node = ref.current;
        if (!node) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = node.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        node.style.transform = `translate3d(${x * 0.22}px, ${y * 0.22}px, 0)`;
      }}
    >
      {children}
    </a>
  );
}
