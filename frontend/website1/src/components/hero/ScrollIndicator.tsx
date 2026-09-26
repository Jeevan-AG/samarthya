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
      className={`group flex flex-col items-center gap-1.5 text-text-secondary hover:text-accent transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 rounded-full py-1.5 px-3 ${className}`}
    >
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase select-none opacity-90 group-hover:opacity-100 transition-opacity font-medium">
        Scroll to Explore
      </span>
      <svg
        className="w-3.5 h-3.5 text-accent/80 group-hover:text-accent animate-bounce transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
  );
}
