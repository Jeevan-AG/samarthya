"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface TeamCardProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  socials: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
  index?: number;
}

export default function TeamCard({
  name,
  role,
  image,
  bio,
  socials,
  index = 0,
}: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative bg-surface border border-border rounded-2xl overflow-hidden card-hover"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-raised">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Overlay with socials on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-canvas/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <div className="flex gap-3">
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent-glow transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            )}
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent-glow transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            )}
            {socials.email && (
              <a
                href={`mailto:${socials.email}`}
                className="w-9 h-9 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent-glow transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="heading-section text-base mb-1 group-hover:text-accent transition-colors duration-300">
          {name}
        </h3>
        <p className="text-xs text-accent font-medium text-mono tracking-wider uppercase mb-2">
          {role}
        </p>
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
          {bio}
        </p>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
}
