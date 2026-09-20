"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroVideo from "./HeroVideo";
import CyberEmbers from "@/components/CyberEmbers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroProps {
  onVideoLoaded?: () => void;
}

export default function Hero({ onVideoLoaded }: HeroProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const visualWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      // ══════════════════════════════════════════════════
      // 1. GSAP ENTRANCE SEQUENCE
      // ══════════════════════════════════════════════════
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Visual hero entrance (scale 0.96 -> 1.0, subtle fade in)
      if (visualWrapperRef.current) {
        if (!isReduced) {
          gsap.set(visualWrapperRef.current, { scale: 0.96, opacity: 0 });
          tl.to(
            visualWrapperRef.current,
            {
              scale: 1.0,
              opacity: 1,
              duration: 1.6,
              ease: "power3.out",
            },
            "+=0.2"
          );
        } else {
          gsap.set(visualWrapperRef.current, { opacity: 0 });
          tl.to(visualWrapperRef.current, { opacity: 1, duration: 0.8 }, "+=0.1");
        }
      }

      // ══════════════════════════════════════════════════
      // 2. MOUSE PARALLAX (Subtle 8-12px X, 5-8px Y)
      // ══════════════════════════════════════════════════
      if (!isReduced && !isTouch && containerRef.current && visualWrapperRef.current) {
        const handleMouseMove = (e: MouseEvent) => {
          const { innerWidth, innerHeight } = window;
          const normX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
          const normY = (e.clientY / innerHeight - 0.5) * 2;

          gsap.to(visualWrapperRef.current, {
            x: normX * 10,
            y: normY * 6,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const container = containerRef.current;
        container.addEventListener("mousemove", handleMouseMove);

        return () => {
          container.removeEventListener("mousemove", handleMouseMove);
        };
      }

      // ══════════════════════════════════════════════════
      // 3. GSAP SCROLLTRIGGER (Cinematic Section Exit)
      // ══════════════════════════════════════════════════
      if (!isReduced && containerRef.current && visualWrapperRef.current) {
        gsap.to(visualWrapperRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          scale: 0.94,
          y: -50,
          opacity: 0.3,
          ease: "none",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-canvas"
      aria-label="Hero Section"
    >
      <h1 className="sr-only">SAMARTHYA — ECE Department Technical Club</h1>

      {/* 1. Background Atmosphere & Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft cyan atmospheric radial glow behind center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-[800px] h-[50%] max-h-[600px] bg-cyan/5 rounded-full blur-[120px]" />
        {/* Vignette edges */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,7,12,0.7)_100%)]" />
      </div>

      {/* 2. Center 3D Cinematic Visual (Blender Source of Truth) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div
          ref={visualWrapperRef}
          className="absolute -inset-4 flex items-center justify-center pointer-events-auto"
        >
          <div className="relative w-full h-full pointer-events-none">
            <HeroVideo onLoaded={onVideoLoaded} />
          </div>
        </div>
      </div>

      {/* 3. Subtle Bottom Transition into About section (Extremely gentle dissolve, preserves real reflection) */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-canvas via-canvas/40 to-transparent pointer-events-none z-20" />

      {/* 4. Ambient Floating Cyan Micro-Embers (React to Depth) */}
      <CyberEmbers />
    </section>
  );
}
