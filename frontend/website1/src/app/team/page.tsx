"use client";

import { useState } from "react";
import TeamCard from "@/components/TeamCard";
import AnimatedSection from "@/components/AnimatedSection";
import teamData from "@/data/team.json";

const roles = ["All", ...Array.from(new Set(teamData.map((m) => m.role)))];

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? teamData
      : teamData.filter((m) => m.role === activeFilter);

  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="max-w-3xl">
              <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-6">
                Core <span className="gradient-accent-text">Team</span>
              </h1>
              <p className="text-body text-text-secondary text-lg md:text-xl">
                The passionate individuals driving SAMARTHYA forward — from
                organizing events to building projects that matter.
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
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveFilter(role)}
                  className={`text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                    activeFilter === role
                      ? "bg-accent text-canvas"
                      : "bg-surface border border-border text-text-secondary hover:border-accent/30 hover:text-text-primary"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((member, i) => (
              <TeamCard key={member.id} {...member} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">
                No team members found for this role.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
