"use client";

import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import EventCard from "@/components/EventCard";
import eventsData from "@/data/events.json";

export default function Home() {
  const upcomingEvents = eventsData
    .filter((e) => e.status === "upcoming")
    .slice(0, 3);

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO SECTION (Exact Cinematic Visual Match)
          ═══════════════════════════════════════════ */}
      <section className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-canvas">
        {/* Full-bleed Exact 3D Cinematic Render Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/samarthya_hero_exact.png"
            alt="SAMARTHYA 3D Scene"
            fill
            priority
            unoptimized
            className="object-cover object-center select-none pointer-events-none"
          />
          {/* Subtle bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-canvas via-canvas/30 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ABOUT PREVIEW
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <div>
                <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-4 block">
                  Who We Are
                </span>
                <h2 className="heading-section text-3xl md:text-4xl lg:text-5xl mb-6">
                  Innovate. Build.{" "}
                  <span className="gradient-accent-text">Excel.</span>
                </h2>
                <p className="text-body text-text-secondary mb-6">
                  SAMARTHYA is the flagship technical club of the Electronics
                  and Communication Engineering department. We are a
                  community of passionate students dedicated to bridging the
                  gap between theoretical knowledge and practical innovation.
                </p>
                <p className="text-body text-text-secondary mb-8">
                  From circuit design workshops to national-level hackathons,
                  we provide a platform for students to explore, experiment,
                  and excel in the world of electronics and technology.
                </p>
                <Link href="/about" className="btn-ghost inline-block">
                  Read Our Story
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-surface border border-border rounded-2xl p-6 card-hover">
                      <div className="w-10 h-10 rounded-xl bg-accent-glow flex items-center justify-center mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5" />
                          <path d="M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <h3 className="heading-section text-sm mb-1">Workshops</h3>
                      <p className="text-xs text-text-muted">Hands-on technical sessions</p>
                    </div>
                    <div className="bg-surface border border-border rounded-2xl p-6 card-hover">
                      <div className="w-10 h-10 rounded-xl bg-accent-glow flex items-center justify-center mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <h3 className="heading-section text-sm mb-1">Mentorship</h3>
                      <p className="text-xs text-text-muted">Guided by industry experts</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="bg-surface border border-border rounded-2xl p-6 card-hover">
                      <div className="w-10 h-10 rounded-xl bg-accent-glow flex items-center justify-center mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <h3 className="heading-section text-sm mb-1">Competitions</h3>
                      <p className="text-xs text-text-muted">National-level hackathons</p>
                    </div>
                    <div className="bg-surface border border-border rounded-2xl p-6 card-hover">
                      <div className="w-10 h-10 rounded-xl bg-accent-glow flex items-center justify-center mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                          <rect x="9" y="9" width="6" height="6" />
                          <line x1="9" y1="1" x2="9" y2="4" />
                          <line x1="15" y1="1" x2="15" y2="4" />
                          <line x1="9" y1="20" x2="9" y2="23" />
                          <line x1="15" y1="20" x2="15" y2="23" />
                          <line x1="20" y1="9" x2="23" y2="9" />
                          <line x1="20" y1="14" x2="23" y2="14" />
                          <line x1="1" y1="9" x2="4" y2="9" />
                          <line x1="1" y1="14" x2="4" y2="14" />
                        </svg>
                      </div>
                      <h3 className="heading-section text-sm mb-1">Projects</h3>
                      <p className="text-xs text-text-muted">Real-world applications</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          UPCOMING EVENTS
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
              <div>
                <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-4 block">
                  What&apos;s Happening
                </span>
                <h2 className="heading-section text-3xl md:text-4xl">
                  Upcoming Events
                </h2>
              </div>
              <Link href="/events" className="btn-ghost text-sm self-start md:self-auto">
                View All Events
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, i) => (
              <EventCard
                key={event.id}
                {...event}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative bg-surface border border-border rounded-3xl p-12 md:p-16 lg:p-20 overflow-hidden text-center">
              {/* Background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

              <div className="relative z-10">
                <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl mb-6">
                  Ready to Join the{" "}
                  <span className="gradient-accent-text">Movement</span>?
                </h2>
                <p className="text-body text-text-secondary text-lg mb-10 mx-auto">
                  Be part of a community that turns curiosity into capability.
                  Explore our events, meet the team, and start building.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/events" className="btn-primary">
                    Browse Events
                  </Link>
                  <Link href="/team" className="btn-ghost">
                    Meet the Team
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
