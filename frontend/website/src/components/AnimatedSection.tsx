"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, useReducedMotion, type Variant } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
}

const directionVariants: Record<string, { hidden: Variant; visible: Variant }> = {
  up: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
};

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-40px" });
  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      controls.set("visible");
      return;
    }
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls, shouldReduceMotion]);

  const variants = directionVariants[direction];

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate={controls}
      variants={variants}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.6,
              delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
