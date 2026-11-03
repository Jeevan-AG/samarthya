import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Calendar } from "lucide-react";
import type { GalleryModalData } from "./EventGalleryModal";

export const EventFlipCard: React.FC<{
  event: GalleryModalData;
  onOpenGallery: (event: GalleryModalData) => void;
}> = ({ event, onOpenGallery }) => {
  const rotateY = useMotionValue(0);
  const isFlippingRef = useRef(false);
  const pointerDownPos = useRef<{ x: number; y: number; t: number } | null>(null);

  // Derived values for front/back face visibility
  const frontOpacity = useTransform(rotateY, [0, 89, 90, 180], [1, 1, 0, 0]);
  const backOpacity = useTransform(rotateY, [0, 89, 90, 180], [0, 0, 1, 1]);

  const triggerFlip = useCallback(() => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;

    // Animate to 180° with a snappy spring-like ease
    animate(rotateY, 180, {
      duration: 0.38,
      ease: [0.2, 0.9, 0.3, 1],
      onComplete: () => {
        onOpenGallery(event);
        // After gallery opens, reset flip without animation (instant reset)
        setTimeout(() => {
          animate(rotateY, 0, { duration: 0.001 });
          isFlippingRef.current = false;
        }, 120);
      },
    });
  }, [rotateY, event, onOpenGallery]);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerDownPos.current) return;
    const dx = Math.abs(e.clientX - pointerDownPos.current.x);
    const dy = Math.abs(e.clientY - pointerDownPos.current.y);
    const dt = Date.now() - pointerDownPos.current.t;
    pointerDownPos.current = null;

    if ((dx > 15 || dy > 15) && dt > 100) return;

    triggerFlip();
  };

  return (
    <div
      className="flip-card-container h-full min-h-[410px] sm:min-h-[440px] w-full cursor-pointer select-none group"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          triggerFlip();
        }
      }}
    >
      <motion.div
        className="flip-card-inner h-full min-h-[410px] sm:min-h-[440px] w-full rounded-2xl"
        style={{
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* FRONT FACE (Rich photo card with hover states) */}
        <motion.article
          className="flip-card-face flip-card-front flex h-full min-h-[410px] sm:min-h-[440px] flex-col rounded-2xl border border-white/10 bg-surface/75 p-5 sm:p-6 text-left transition-all duration-300 hover:border-cyan/50 hover:shadow-[0_0_35px_rgba(0,229,224,0.22)] hover:-translate-y-1.5 backdrop-blur-md"
          style={{ opacity: frontOpacity }}
        >
          <div>
            {/* Clean Photo Container (No text overlay) */}
            {event.images && event.images[0] && (
              <div className="relative mb-4 overflow-hidden rounded-xl bg-void aspect-[16/10] border border-white/10 group-hover:border-cyan/40 transition-colors">
                <img
                  src={event.images[0]}
                  alt={event.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            )}

            {/* Date Badge */}
            <div className="mb-2.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-mute">
                <Calendar size={12} className="text-cyan" />
                <span>{event.cardDateBadge}</span>
              </span>
            </div>

            {/* Event Title */}
            <h3 className="mb-1.5 font-display text-2xl sm:text-3xl text-paper transition-colors group-hover:text-cyan leading-tight">
              {event.title}
            </h3>

            {/* Subtitle / Venue */}
            <p className="mb-3 font-mono text-xs text-cyan/90 font-medium">
              {event.cardSubtitle}
            </p>

            {/* Body description */}
            <p className="font-sans text-sm leading-relaxed text-mute line-clamp-3">
              {event.paragraphs[0]}
            </p>
          </div>
        </motion.article>

        {/* BACK FACE (Cyber Hologram Back during 3D Flip) */}
        <motion.div
          className="flip-card-face flip-card-back flex h-full flex-col items-center justify-center rounded-2xl border border-cyan bg-void p-6 text-center shadow-[0_0_40px_rgba(0,229,224,0.3)]"
          style={{ opacity: backOpacity }}
        >
          <div className="relative flex flex-col items-center justify-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan/60 bg-cyan/10 text-cyan shadow-[0_0_24px_rgba(0,229,224,0.4)] animate-pulse">
              <span className="font-mono text-lg font-bold">SMT</span>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-cyan drop-shadow-[0_0_12px_rgba(0,229,224,0.6)]">
              OPENING GALLERY...
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
