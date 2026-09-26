"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If already shown in this session, skip immediately
    if (typeof window !== "undefined" && sessionStorage.getItem("samarthya_preloader_seen")) {
      setIsLoading(false);
      return;
    }

    // Lock scrolling while preloader is active
    document.body.style.overflow = "hidden";

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = isReduced ? 600 : 1800; // 1 crisp, complete pulse cycle

    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem("samarthya_preloader_seen", "true");
      } catch {}
    }, duration);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.85,
              ease: [0.4, 0, 0.2, 1], // Smooth cubic-bezier fade-out reveal
            },
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black select-none overflow-hidden"
          role="status"
          aria-live="polite"
          aria-label="Loading..."
        >
          {/* Subtle Ambient Glow Behind Waveform */}
          <div className="absolute w-[360px] h-[160px] bg-[#00f0ff]/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Waveform Pulse Container */}
          <div className="loader-container relative z-10">
            <svg
              viewBox="0 0 500 60"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              {/* Track (Dim background line) */}
              <path
                id="line-path"
                className="track"
                d="M 10,30 L 100,30 
                   L 110,15 L 130,45 L 150,15 L 170,45 L 190,15 L 200,30 
                   L 290,30 
                   L 300,15 L 320,45 L 340,15 L 360,45 L 380,30 
                   L 490,30"
              />

              {/* Loading Line (Cyan Accent) */}
              <path
                className="progress"
                d="M 10,30 L 100,30 
                   L 110,15 L 130,45 L 150,15 L 170,45 L 190,15 L 200,30 
                   L 290,30 
                   L 300,15 L 320,45 L 340,15 L 360,45 L 380,30 
                   L 490,30"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
