import { useEffect, useState } from "react";

interface PreloaderProps {
  duration?: number;
  fadeDuration?: number;
  sessionKey?: string;
  forceShow?: boolean;
}

const WAVEFORM_PATH =
  "M 10,30 L 100,30 L 110,15 L 130,45 L 150,15 L 170,45 L 190,15 L 200,30 L 290,30 L 300,15 L 320,45 L 340,15 L 360,45 L 380,30 L 490,30";

const DEFAULT_SESSION_KEY = "samarthya_preloader_seen";
const DEFAULT_DURATION = 1800;
const DEFAULT_FADE_DURATION = 850;
const REDUCED_MOTION_DURATION = 600;

export default function Preloader({
  duration = DEFAULT_DURATION,
  fadeDuration = DEFAULT_FADE_DURATION,
  sessionKey = DEFAULT_SESSION_KEY,
  forceShow = false,
}: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!forceShow) {
      try {
        if (sessionStorage.getItem(sessionKey)) {
          setIsLoading(false);
          return;
        }
      } catch {}
    }

    document.body.style.overflow = "hidden";

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const activeDuration = isReduced ? REDUCED_MOTION_DURATION : duration;

    const timer = window.setTimeout(() => {
      setIsFading(true);
      document.body.style.overflow = "";

      try {
        sessionStorage.setItem(sessionKey, "true");
      } catch {}

      window.setTimeout(() => {
        setIsLoading(false);
      }, fadeDuration);
    }, activeDuration);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [duration, fadeDuration, sessionKey, forceShow]);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black select-none overflow-hidden transition-opacity duration-850 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="absolute w-[360px] h-[160px] bg-cyan/12 rounded-full blur-[80px] pointer-events-none" />

      <div className="loader-container relative z-10">
        <svg
          viewBox="0 0 500 60"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path id="line-path" className="track" d={WAVEFORM_PATH} />
          <path className="progress" d={WAVEFORM_PATH} />
        </svg>
      </div>
    </div>
  );
}

