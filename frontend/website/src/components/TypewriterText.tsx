import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text?: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursorChar?: string;
  highlightWord?: string;
}

export default function TypewriterText({
  text = "// about",
  speed = 42,
  delay = 80,
  className = "",
  cursorChar = "_",
  highlightWord,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let currentIndex = 0;
    let timer: ReturnType<typeof setInterval>;

    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(timer);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(timer);
    };
  }, [hasStarted, text, speed, delay]);

  // Split displayed text to highlight "//" in cyan if present
  const isSlashPrefix = displayedText.startsWith("//");
  const prefix = isSlashPrefix ? displayedText.slice(0, Math.min(displayedText.length, 2)) : "";
  const rest = isSlashPrefix ? displayedText.slice(2).replace(/^\s+/, "") : displayedText;
  const hasSpaceAfterSlash = isSlashPrefix && displayedText.length > 2;

  // Handle keyword highlighting if highlightWord is provided
  let normalPart = rest;
  let highlightedPart = "";
  let postPart = "";
  let needsSpaceBeforeHighlight = false;

  if (highlightWord) {
    const cleanWord = highlightWord.trim();
    const fullRest = isSlashPrefix ? text.slice(2).replace(/^\s+/, "") : text;
    const highlightIndex = fullRest.toLowerCase().indexOf(cleanWord.toLowerCase());
    if (highlightIndex !== -1) {
      let highlightEnd = highlightIndex + cleanWord.length;
      if (fullRest.charAt(highlightEnd).toLowerCase() === 's' && !cleanWord.toLowerCase().endsWith('s')) {
        highlightEnd += 1;
      }

      const rawBefore = fullRest.slice(0, highlightIndex);
      const isSpaceBefore = rawBefore.endsWith(" ");

      if (rest.length <= (isSpaceBefore ? highlightIndex - 1 : highlightIndex)) {
        normalPart = rest;
        highlightedPart = "";
        postPart = "";
      } else if (rest.length <= highlightEnd) {
        normalPart = isSpaceBefore ? rest.slice(0, highlightIndex - 1) : rest.slice(0, highlightIndex);
        needsSpaceBeforeHighlight = isSpaceBefore && rest.length >= highlightIndex;
        highlightedPart = rest.slice(highlightIndex);
        postPart = "";
      } else {
        normalPart = isSpaceBefore ? rest.slice(0, highlightIndex - 1) : rest.slice(0, highlightIndex);
        needsSpaceBeforeHighlight = isSpaceBefore;
        highlightedPart = rest.slice(highlightIndex, highlightEnd);
        postPart = rest.slice(highlightEnd);
      }
    }
  }

  return (
    <h2
      ref={containerRef}
      className={`font-mono inline-flex items-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white ${className}`}
      aria-label={text}
    >
      <span aria-hidden="true" className="inline-flex items-center flex-wrap">
        {prefix && <span className="text-cyan">{prefix}</span>}
        {hasSpaceAfterSlash && <span className="inline-block w-4 sm:w-5"></span>}
        <span className="heading-chrome inline-block whitespace-pre-wrap">{normalPart}</span>
        {needsSpaceBeforeHighlight && <span className="inline-block w-2.5 sm:w-3.5"></span>}
        {highlightedPart && <span className="text-cyan">{highlightedPart}</span>}
        {postPart && <span className="heading-chrome inline-block whitespace-pre-wrap">{postPart}</span>}
        <span
          className="inline-block ml-1 font-bold text-cyan animate-[pulse_1s_ease-in-out_infinite]"
          aria-hidden="true"
        >
          {cursorChar}
        </span>
      </span>
      <span className="sr-only">{text}</span>
    </h2>
  );
}
