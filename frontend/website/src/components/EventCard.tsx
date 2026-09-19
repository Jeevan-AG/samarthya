"use client";

import { motion } from "framer-motion";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  status: string;
  registrationOpen: boolean;
  onRegister?: () => void;
  index?: number;
}

export default function EventCard({
  title,
  description,
  date,
  time,
  venue,
  category,
  status,
  registrationOpen,
  onRegister,
  index = 0,
}: EventCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isPast = status === "past";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`group relative bg-surface border border-border rounded-2xl overflow-hidden card-hover ${
        isPast ? "opacity-70" : ""
      }`}
    >
      {/* Category & Status badge row */}
      <div className="px-6 pt-6 flex items-center justify-between">
        <span className="text-mono text-xs tracking-wider uppercase text-accent">
          {category}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            isPast
              ? "bg-surface-hover text-text-muted"
              : "bg-accent-glow text-accent"
          }`}
        >
          {isPast ? "Completed" : "Upcoming"}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="heading-section text-xl mb-3 group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-5 line-clamp-3">
          {description}
        </p>

        {/* Meta */}
        <div className="flex flex-col gap-2 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-mono">{formattedDate}</span>
            <span className="text-text-muted mx-1">·</span>
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{venue}</span>
          </div>
        </div>

        {/* CTA */}
        {!isPast && registrationOpen && (
          <button
            onClick={onRegister}
            className="mt-6 w-full btn-primary text-sm text-center"
          >
            Register Now
          </button>
        )}
      </div>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
}
