import { useEffect, useRef, useState } from "react";

interface WaveTextProps {
  text?: string;
  className?: string;
  highlightWord?: string;
}

export default function WaveText({
  text = "achievements",
  className = "",
  highlightWord = "ments",
}: WaveTextProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasEntered) {
          setHasEntered(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEntered]);

  const triggerWave = () => {
    if (isWaving) return;
    setIsWaving(true);
    setTimeout(() => {
      setIsWaving(false);
    }, 700);
  };

  const letters = text.split("");
  const highlightStart = highlightWord ? text.toLowerCase().indexOf(highlightWord.toLowerCase()) : -1;
  const highlightEnd = highlightStart !== -1 ? highlightStart + highlightWord.length : -1;

  return (
    <h2
      ref={containerRef}
      onMouseEnter={triggerWave}
      className={`font-mono inline-flex items-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight cursor-pointer select-none perspective-[800px] ${className}`}
      aria-label={text}
      title="Hover for wave effect"
    >
      <span aria-hidden="true" className="inline-flex items-center flex-wrap overflow-hidden py-1">
        {letters.map((char, i) => {
          const isHighlighted = highlightStart !== -1 && i >= highlightStart && i < highlightEnd;
          const staggerDelay = `${i * 45}ms`;

          return (
            <span
              key={i}
              style={{
                transitionDelay: hasEntered ? (isWaving ? `${i * 35}ms` : "0ms") : staggerDelay,
                animationDelay: isWaving ? `${i * 40}ms` : "0ms",
              }}
              className={`relative inline-block transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                char === " " ? "w-3 sm:w-4" : ""
              } ${
                !hasEntered
                  ? "opacity-0 translate-y-full rotate-x-90"
                  : isWaving
                  ? "wave-bounce"
                  : "opacity-100 translate-y-0 rotate-x-0"
              } ${
                isHighlighted ? "text-cyan" : "text-paper"
              }`}
            >
              {char}
            </span>
          );
        })}
      </span>

      <span className="sr-only">{text}</span>

      <style>{`
        .rotate-x-90 {
          transform: translateY(100%) rotateX(-90deg);
        }
        .rotate-x-0 {
          transform: translateY(0) rotateX(0deg);
        }
        .wave-bounce {
          animation: letterWave 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes letterWave {
          0% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px) scale(1.08);
          }
          70% {
            transform: translateY(3px);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </h2>
  );
}
