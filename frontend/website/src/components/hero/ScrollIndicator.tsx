"use client";

interface ScrollIndicatorProps {
  onClick?: () => void;
  className?: string;
}

export default function ScrollIndicator({ onClick, className = "" }: ScrollIndicatorProps) {
  const handleScroll = () => {
    if (onClick) {
      onClick();
      return;
    }
    const nextSection = document.getElementById("about-preview");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <button
      id="hero-scroll-indicator"
      onClick={handleScroll}
      aria-label="Scroll to explore"
      className={`group flex flex-col items-center gap-2 text-text-muted hover:text-cyan transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 rounded-full py-2 px-4 ${className}`}
    >
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase select-none opacity-80 group-hover:opacity-100 transition-opacity">
        Scroll to Explore
      </span>
      <svg
        className="w-4 h-4 text-cyan/70 group-hover:text-cyan animate-bounce transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
  );
}
