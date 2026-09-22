import { useEffect, useRef, useState } from "react";

interface ScrambleTextProps {
  text?: string;
  speed?: number;
  delay?: number;
  className?: string;
  highlightWord?: string;
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01_アイウエオカキクケコサシスセソタチツテト";

export default function ScrambleText({
  text = "core team",
  speed = 32,
  delay = 120,
  className = "",
  highlightWord = "",
}: ScrambleTextProps) {
  const [displayedChars, setDisplayedChars] = useState<string[]>(() =>
    text.split("").map((c) => (c === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
  );
  const [isResolved, setIsResolved] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const containerRef = useRef<HTMLHeadingElement>(null);
  const isHoverScrambling = useRef(false);

  const startScramble = () => {
    let frame = 0;
    const cyclesPerChar = 3;
    const totalFrames = text.length * cyclesPerChar;

    const interval = setInterval(() => {
      frame++;
      const resolvedCount = Math.floor(frame / cyclesPerChar);

      setDisplayedChars(
        text.split("").map((char, index) => {
          if (char === " ") return " ";
          if (index < resolvedCount) {
            return text[index];
          }
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
      );

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayedChars(text.split(""));
        setIsResolved(true);
        isHoverScrambling.current = false;
      }
    }, speed);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          setTimeout(() => {
            startScramble();
          }, delay);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasTriggered, text, speed, delay]);

  const handleMouseEnter = () => {
    if (!isResolved || isHoverScrambling.current) return;
    isHoverScrambling.current = true;
    startScramble();
  };

  // Determine highlight indices
  const highlightStart = highlightWord ? text.toLowerCase().indexOf(highlightWord.toLowerCase()) : -1;
  const highlightEnd = highlightStart !== -1 ? highlightStart + highlightWord.length : -1;

  return (
    <h2
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`font-mono inline-flex items-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white cursor-pointer select-none group ${className}`}
      aria-label={text}
      title="Hover to re-scramble"
    >
      <span aria-hidden="true" className="inline-flex items-center flex-wrap">
        {displayedChars.map((char, index) => {
          const isHighlighted = highlightStart !== -1 && index >= highlightStart && index < highlightEnd;
          const isCurrentlyScrambled = !isResolved && char !== text[index] && char !== " ";

          return (
            <span
              key={index}
              className={`transition-colors duration-150 ${
                char === " " ? "inline-block w-3 sm:w-4" : ""
              } ${
                isCurrentlyScrambled
                  ? "text-cyan/50 font-medium"
                  : isHighlighted
                  ? "text-cyan"
                  : "heading-chrome inline-block"
              }`}
            >
              {char}
            </span>
          );
        })}
      </span>
      <span className="sr-only">{text}</span>
    </h2>
  );
}
