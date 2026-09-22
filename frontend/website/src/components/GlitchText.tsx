import { useEffect, useRef, useState } from "react";

interface GlitchTextProps {
  text?: string;
  className?: string;
  highlightWord?: string;
  showBadge?: boolean;
}

export default function GlitchText({
  text = "events",
  className = "",
  highlightWord = "events",
  showBadge = false,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const containerRef = useRef<HTMLHeadingElement>(null);

  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
    }, 450);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasEntered) {
          setHasEntered(true);
          triggerGlitch();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEntered]);

  // Periodic subtle ambient glitch twitch every 5 seconds
  useEffect(() => {
    if (!hasEntered) return;
    const interval = setInterval(() => {
      triggerGlitch();
    }, 5500);
    return () => clearInterval(interval);
  }, [hasEntered]);

  const letters = text.split("");
  const highlightStart = highlightWord ? text.toLowerCase().indexOf(highlightWord.toLowerCase()) : -1;
  const highlightEnd = highlightStart !== -1 ? highlightStart + highlightWord.length : -1;

  return (
    <h2
      ref={containerRef}
      onMouseEnter={triggerGlitch}
      className={`relative font-mono inline-flex items-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight cursor-pointer select-none ${className}`}
      aria-label={text}
      title="Hover to glitch"
    >
      <span
        aria-hidden="true"
        className={`inline-flex items-center transition-all duration-300 ${
          isGlitching ? "cyber-glitch-active" : ""
        }`}
      >
        {letters.map((char, i) => {
          const isHighlighted = highlightStart !== -1 && i >= highlightStart && i < highlightEnd;
          const delayStyle = {
            transitionDelay: `${i * 35}ms`,
            animationDelay: `${i * 45}ms`,
          };

          return (
            <span
              key={i}
              style={delayStyle}
              className={`relative inline-block transition-transform duration-300 ${
                char === " " ? "w-3 sm:w-4" : ""
              } ${
                !hasEntered
                  ? "opacity-0 translate-y-4 -rotate-12 scale-90"
                  : "opacity-100 translate-y-0 rotate-0 scale-100"
              } ${
                isHighlighted
                  ? "text-cyan"
                  : "heading-chrome"
              }`}
            >
              {char}
            </span>
          );
        })}

        {showBadge && (
          <span className="ml-3 sm:ml-4 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-cyan/30 bg-cyan/10 font-mono text-[10px] sm:text-xs tracking-widest text-cyan uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-ping"></span>
            ACTIVE
          </span>
        )}
      </span>

      <span className="sr-only">{text}</span>

      <style>{`
        .cyber-glitch-active {
          animation: cyberGlitchBurst 0.45s ease-in-out forwards;
        }

        @keyframes cyberGlitchBurst {
          0% {
            transform: translate(0, 0);
            text-shadow: none;
          }
          15% {
            transform: translate(-3px, 1px) skewX(-2deg);
            text-shadow: 1.5px 0 rgba(0, 251, 248, 0.7), -1.5px 0 rgba(255, 0, 85, 0.7);
          }
          35% {
            transform: translate(3px, -2px) skewX(3deg);
            text-shadow: -1.5px 0 rgba(0, 251, 248, 0.7), 1.5px 0 rgba(255, 0, 85, 0.7);
          }
          55% {
            transform: translate(-1px, 2px);
            text-shadow: 1px 0 rgba(0, 251, 248, 0.7), -1px 0 rgba(255, 0, 85, 0.7);
          }
          75% {
            transform: translate(2px, -1px);
            text-shadow: -1px 0 rgba(0, 251, 248, 0.7), 1px 0 rgba(255, 0, 85, 0.7);
          }
          100% {
            transform: translate(0, 0);
            text-shadow: none;
          }
        }
      `}</style>
    </h2>
  );
}
