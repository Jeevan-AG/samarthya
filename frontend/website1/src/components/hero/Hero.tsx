"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroVideo from "./HeroVideo";
import ScrollIndicator from "./ScrollIndicator";
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
  const bottomContentRef = useRef<HTMLDivElement | null>(null);

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

      // Supporting Content & CTAs entrance
      if (bottomContentRef.current) {
        if (!isReduced) {
          gsap.set(bottomContentRef.current, { opacity: 0, y: 14 });
          tl.to(
            bottomContentRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 1.0,
              ease: "power2.out",
            },
            "-=0.6"
          );
        } else {
          gsap.set(bottomContentRef.current, { opacity: 0 });
          tl.to(bottomContentRef.current, { opacity: 1, duration: 0.6 }, "+=0.1");
        }
      }

      // ══════════════════════════════════════════════════
      // 2. MOUSE PARALLAX (Subtle 8-10px X, 5-6px Y)
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

        if (bottomContentRef.current) {
          gsap.to(bottomContentRef.current, {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "25% top",
              scrub: 0.5,
            },
            opacity: 0,
            y: -16,
            ease: "none",
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[100dvh] min-h-[580px] w-full overflow-hidden bg-canvas flex flex-col justify-between"
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
      {/* Balanced with optical vertical offset so SAMARTHYA typography never collides with supporting HTML text on short viewports or high zoom */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none -translate-y-4 sm:-translate-y-6 md:-translate-y-7 lg:-translate-y-8">
        <div
          ref={visualWrapperRef}
          className="relative w-full h-[65dvh] sm:h-[72dvh] lg:h-full max-w-[1920px] max-h-[1080px] flex items-center justify-center pointer-events-auto"
        >
          <div className="relative w-full h-full pointer-events-none">
            <HeroVideo onLoaded={onVideoLoaded} />
          </div>
        </div>
      </div>

      {/* 3. Top Spacer for Navbar balance */}
      <div className="h-16 sm:h-20 w-full z-20 pointer-events-none" />

      {/* 4. Bottom Supporting Info, CTAs & Scroll Cue */}
      <div
        ref={bottomContentRef}
        className="relative z-20 flex flex-col items-center pb-3 sm:pb-5 md:pb-7 px-4 sm:px-6 pointer-events-auto select-none gap-2.5 sm:gap-3 text-center max-w-xl mx-auto"
      >
        {/* Subordinate Supporting Text Hierarchy */}
        <div className="space-y-0.5 sm:space-y-1">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-accent uppercase font-semibold">
            ECE Department Technical Club
          </p>
          <p className="text-xs sm:text-sm text-text-primary/90 tracking-wide font-normal">
            Empowering Innovation Through Technology.
          </p>
        </div>

        {/* Compact, Restrained CTAs */}
        <div className="flex items-center justify-center gap-3 pt-0.5">
          <Link
            href="/events"
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold text-canvas bg-accent rounded-lg hover:bg-accent-dim transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-[0.98] shadow-sm"
          >
            Explore Events
          </Link>
          <Link
            href="/team"
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-medium text-text-primary bg-surface/90 border border-border-accent/40 rounded-lg hover:border-accent/60 hover:text-white transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-[0.98]"
          >
            Meet the Team
          </Link>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="pt-0.5">
          <ScrollIndicator />
        </div>
      </div>

      {/* 5. Subtle Bottom Transition into About section (Gentle dissolve, preserves Blender floor reflection) */}
      <div className="absolute bottom-0 left-0 right-0 h-36 md:h-52 bg-gradient-to-t from-canvas via-canvas/60 to-transparent pointer-events-none z-10" />

      {/* 6. Ambient Floating Cyan Micro-Embers (React to Depth) */}
      <CyberEmbers />
    </section>
  );
}
