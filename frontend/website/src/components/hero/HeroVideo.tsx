"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroVideoProps {
  posterSrc?: string;
  webmSrc?: string;
  mp4Src?: string;
  onLoaded?: () => void;
  className?: string;
}

export default function HeroVideo({
  posterSrc = "/media/samarthya_hero_poster.webp",
  webmSrc = "/media/samarthya_hero_loop.webm",
  mp4Src = "/media/samarthya_hero_loop.mp4",
  onLoaded,
  className = "",
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user motion preferences
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    return () => motionQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    const handleCanPlay = () => {
      setVideoReady(true);
      onLoaded?.();
      // Attempt play with error safety
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay was prevented, falling back to poster:", err);
          setVideoError(true);
        });
      }
    };

    const handleError = () => {
      console.warn("Video failed to load or decode, showing poster fallback.");
      setVideoError(true);
    };

    video.addEventListener("canplaythrough", handleCanPlay);
    video.addEventListener("error", handleError);

    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [onLoaded, prefersReducedMotion]);

  return (
    <div className={`relative w-full h-full select-none overflow-hidden ${className}`}>
      {/* 1. Static Poster Image (Guaranteed First Paint & Fail-safe) */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
          videoReady && !prefersReducedMotion && !videoError ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={posterSrc}
          alt="SAMARTHYA 3D Brand Emblem"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-contain md:object-cover object-center pointer-events-none select-none"
        />
      </div>

      {/* 2. Looping 1080p Video (WebM preferred, MP4 fallback) */}
      {!prefersReducedMotion && !videoError && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          poster={posterSrc}
          className={`absolute inset-0 w-full h-full object-contain md:object-cover object-center pointer-events-none transition-opacity duration-1000 z-10 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
