"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import achievementsData from "@/data/achievements.json";

const categories = [
  "All",
  ...Array.from(new Set(achievementsData.map((a) => a.category))),
];

export default function AchievementsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? achievementsData
      : achievementsData.filter((a) => a.category === activeFilter);

  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="max-w-3xl">
              <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-6">
                Our{" "}
                <span className="gradient-accent-text">Achievements</span>
              </h1>
              <p className="text-body text-text-secondary text-lg md:text-xl">
                A showcase of milestones, awards, and recognition earned by
                SAMARTHYA members through dedication and innovation.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px w-20 bg-accent" />
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                    activeFilter === cat
                      ? "bg-accent text-canvas"
                      : "bg-surface border border-border text-text-secondary hover:border-accent/30 hover:text-text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="group bg-surface border border-border rounded-2xl overflow-hidden card-hover"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-surface-raised">
                  <Image
                    src={achievement.image}
                    alt={achievement.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-mono text-xs tracking-wider uppercase bg-canvas/80 backdrop-blur text-accent px-3 py-1.5 rounded-full">
                      {achievement.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-mono text-xs text-text-muted">
                      {new Date(achievement.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="heading-section text-xl mb-3 group-hover:text-accent transition-colors duration-300">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {achievement.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">
                No achievements found for this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
