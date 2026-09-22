import { useEffect, useRef, useState } from "react";

interface LaserScanTextProps {
  prefix?: string;
  text?: string;
  className?: string;
  prefixColor?: string;
}

export default function LaserScanText({
  prefix = "//",
  text = "achievements",
  className = "",
  prefixColor = "text-cyan",
}: LaserScanTextProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const containerRef = useRef<HTMLHeadingElement>(null);

  const runScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 850);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasEntered) {
          setHasEntered(true);
          runScan();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEntered]);

  const handleMouseEnter = () => {
    if (isScanning) return;
    runScan();
  };

  const letters = text.split("");

  return (
    <h2
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`font-mono inline-flex items-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white cursor-pointer select-none group ${className}`}
      aria-label={`${prefix} ${text}`}
      title="Hover to scan"
    >
      <span aria-hidden="true" className="inline-flex items-center flex-wrap">
        {/* Prefix in distinct accent color */}
        {prefix && (
          <span
            className={`${prefixColor} transition-transform duration-300 group-hover:scale-110 select-none`}
          >
            {prefix}
          </span>
        )}

        {/* Guaranteed non-collapsing spacing */}
        <span className="inline-block w-3 sm:w-4"></span>

        {/* Word container with laser beam sweep */}
        <span className="relative inline-flex items-center overflow-hidden py-1">
          {letters.map((char, i) => {
            const delayMs = i * 40;
            return (
              <span
                key={i}
                style={{
                  transitionDelay: hasEntered ? (isScanning ? `${delayMs}ms` : "0ms") : `${delayMs + 100}ms`,
                }}
                className={`relative inline-block text-paper transition-all duration-400 ease-out ${
                  char === " " ? "w-3 sm:w-4" : ""
                } ${
                  !hasEntered
                    ? "opacity-0 translate-y-3 blur-[4px]"
                    : isScanning
                    ? "opacity-100 translate-y-0 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                    : "opacity-100 translate-y-0 blur-0 text-paper"
                }`}
              >
                {char}
              </span>
            );
          })}

          {/* Glowing Laser Scanline Bar */}
          <span
            className={`pointer-events-none absolute top-0 bottom-0 w-[3px] bg-cyan shadow-[0_0_14px_rgba(0,229,224,0.95)] transition-all duration-700 ease-in-out ${
              isScanning
                ? "left-full opacity-100"
                : hasEntered
                ? "left-full opacity-0 duration-200"
                : "left-0 opacity-0"
            }`}
          />
        </span>
      </span>

      <span className="sr-only">
        {prefix} {text}
      </span>
    </h2>
  );
}
