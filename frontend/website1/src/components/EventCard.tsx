"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

interface EventCardProps {
  id?: string;
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

function formatEventDate(dateString: string) {
  const [year, month, day] = dateString.split("-");
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const mIndex = parseInt(month, 10) - 1;
  const dayNum = parseInt(day, 10);
  return `${dayNum} ${monthNames[mIndex] || month} ${year}`;
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
  const shouldReduceMotion = useReducedMotion();
  const formattedDate = formatEventDate(date);
  const isPast = status === "past";

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }
      }
      className={`group relative bg-surface border border-border/70 hover:border-accent/40 rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col justify-between p-6 ${
        isPast ? "opacity-75" : ""
      }`}
    >
      <div>
        {/* Category & Status badge row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-accent-glow text-accent uppercase tracking-wider font-semibold">
            {category}
          </span>
          <span
            className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
              isPast
                ? "bg-surface-hover border-border/50 text-text-muted"
                : registrationOpen
                ? "bg-accent/10 border-accent/30 text-accent"
                : "bg-surface-hover border-border/70 text-text-muted"
            }`}
          >
            {isPast
              ? "Completed"
              : registrationOpen
              ? "Open for Reg."
              : "Upcoming"}
          </span>
        </div>

        {/* Content */}
        <h3 className="heading-section text-lg md:text-xl mb-3 group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>
      </div>

      <div>
        {/* Meta */}
        <div className="flex flex-col gap-2 pt-4 border-t border-border/50 text-xs text-text-muted mb-6">
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-accent/80 shrink-0"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <time className="font-mono text-text-secondary" dateTime={date}>
              {formattedDate}
            </time>
            <span className="text-text-muted" aria-hidden="true">·</span>
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-accent/80 shrink-0"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-text-secondary">{venue}</span>
          </div>
        </div>

        {/* CTA */}
        {onRegister ? (
          <button
            type="button"
            onClick={onRegister}
            className="w-full btn-primary text-sm text-center py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            Register Now
          </button>
        ) : (
          <Link
            href="/events"
            className={`w-full text-sm text-center py-2.5 rounded-lg font-medium inline-block transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${
              registrationOpen
                ? "btn-primary"
                : "btn-ghost border border-border/80 text-text-secondary hover:text-text-primary"
            }`}
          >
            {registrationOpen ? "Register for Event" : "View Details"}
          </Link>
        )}
      </div>
    </motion.article>
  );
}
