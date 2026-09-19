"use client";

import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import EventCard from "@/components/EventCard";
import Hero from "@/components/hero/Hero";
import eventsData from "@/data/events.json";
import achievementsData from "@/data/achievements.json";

function formatMonthYear(dateString: string) {
  const [year, month] = dateString.split("-");
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const mIndex = parseInt(month, 10) - 1;
  return `${monthNames[mIndex] || month} ${year}`;
}

export default function Home() {
  const upcomingEvents = eventsData
    .filter((e) => e.status === "upcoming")
    .slice(0, 3);

  const featuredAchievements = achievementsData.slice(0, 3);

  return (
    <>
      {/* ═══════════════════════════════════════════
          CINEMATIC HERO (Blender Source of Truth + GSAP)
          ═══════════════════════════════════════════ */}
      <Hero />

      {/* ═══════════════════════════════════════════
          ABOUT & VERIFIED IMPACT
          ═══════════════════════════════════════════ */}
      <section id="about-preview" className="py-24 lg:py-32 overflow-x-clip" aria-label="About SAMARTHYA">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Verified Department Impact Metrics */}
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              <div className="bg-surface/50 border border-border/70 rounded-2xl p-6 text-center transition-colors hover:border-accent/40">
                <div className="font-mono text-2xl md:text-3xl font-bold text-accent mb-1">
                  2021
                </div>
                <div className="text-[11px] font-mono tracking-widest uppercase text-text-muted">
                  Founded
                </div>
              </div>
              <div className="bg-surface/50 border border-border/70 rounded-2xl p-6 text-center transition-colors hover:border-accent/40">
                <div className="font-mono text-2xl md:text-3xl font-bold text-accent mb-1">
                  500+
                </div>
                <div className="text-[11px] font-mono tracking-widest uppercase text-text-muted">
                  Students Reached
                </div>
              </div>
              <div className="bg-surface/50 border border-border/70 rounded-2xl p-6 text-center transition-colors hover:border-accent/40">
                <div className="font-mono text-2xl md:text-3xl font-bold text-accent mb-1">
                  12+
                </div>
                <div className="text-[11px] font-mono tracking-widest uppercase text-text-muted">
                  Technical Workshops
                </div>
              </div>
              <div className="bg-surface/50 border border-border/70 rounded-2xl p-6 text-center transition-colors hover:border-accent/40">
                <div className="font-mono text-2xl md:text-3xl font-bold text-accent mb-1">
                  6+
                </div>
                <div className="text-[11px] font-mono tracking-widest uppercase text-text-muted">
                  Major Accolades
                </div>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <div>
                <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-4 block">
                  Department of Electronics & Communication Engineering
                </span>
                <h2 className="heading-section text-3xl md:text-4xl lg:text-5xl mb-6">
                  Innovate. Build.{" "}
                  <span className="gradient-accent-text">Excel.</span>
                </h2>
                <p className="text-body text-text-secondary mb-6 leading-relaxed">
                  SAMARTHYA is the official technical club of the Electronics
                  and Communication Engineering department. We are a community
                  of passionate student engineers dedicated to bridging the gap
                  between academic coursework and hands-on technical excellence.
                </p>
                <p className="text-body text-text-secondary mb-8 leading-relaxed">
                  From custom circuit synthesis and PCB design to autonomous
                  robotics and IoT architectures, we provide a disciplined platform
                  for students to explore, experiment, and compete at the highest level.
                </p>
                <Link
                  href="/about"
                  className="btn-ghost inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  <span>Explore Our Journey</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-surface border border-border/70 rounded-2xl p-6 transition-all duration-300 hover:border-accent/40 card-hover">
                      <div className="w-10 h-10 rounded-xl bg-accent-glow flex items-center justify-center mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5" />
                          <path d="M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <h3 className="heading-section text-sm mb-1">Technical Workshops</h3>
                      <p className="text-xs text-text-muted leading-relaxed">Hands-on hardware & embedded sessions</p>
                    </div>
                    <div className="bg-surface border border-border/70 rounded-2xl p-6 transition-all duration-300 hover:border-accent/40 card-hover">
                      <div className="w-10 h-10 rounded-xl bg-accent-glow flex items-center justify-center mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <h3 className="heading-section text-sm mb-1">Peer Mentorship</h3>
                      <p className="text-xs text-text-muted leading-relaxed">Senior guidance & research collaboration</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="bg-surface border border-border/70 rounded-2xl p-6 transition-all duration-300 hover:border-accent/40 card-hover">
                      <div className="w-10 h-10 rounded-xl bg-accent-glow flex items-center justify-center mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <h3 className="heading-section text-sm mb-1">Competitions</h3>
                      <p className="text-xs text-text-muted leading-relaxed">National-level hackathons & symposiums</p>
                    </div>
                    <div className="bg-surface border border-border/70 rounded-2xl p-6 transition-all duration-300 hover:border-accent/40 card-hover">
                      <div className="w-10 h-10 rounded-xl bg-accent-glow flex items-center justify-center mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                      <h3 className="heading-section text-sm mb-1">Hardware Projects</h3>
                      <p className="text-xs text-text-muted leading-relaxed">Applied robotics, IoT & signal systems</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ACHIEVEMENTS SHOWCASE (Curated from verified data)
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-surface/30 border-y border-border/40" aria-label="Key Achievements">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
              <div>
                <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-3 block">
                  Recognition & Excellence
                </span>
                <h2 className="heading-section text-3xl md:text-4xl">
                  Milestones of Impact
                </h2>
              </div>
              <Link
                href="/achievements"
                className="btn-ghost text-sm self-start md:self-auto inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                <span>View All Achievements</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAchievements.map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 0.1}>
                <div className="h-full bg-surface border border-border/70 hover:border-accent/40 transition-colors duration-300 rounded-2xl p-6 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-accent-glow text-accent uppercase tracking-wider font-semibold">
                        {item.category}
                      </span>
                      <time className="text-xs font-mono text-text-muted" dateTime={item.date}>
                        {formatMonthYear(item.date)}
                      </time>
                    </div>
                    <h3 className="heading-section text-lg mb-3 group-hover:text-accent transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          UPCOMING EVENTS
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32" aria-label="Upcoming Events">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
              <div>
                <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-3 block">
                  Technical Calendar
                </span>
                <h2 className="heading-section text-3xl md:text-4xl">
                  Upcoming Initiatives
                </h2>
              </div>
              <Link
                href="/events"
                className="btn-ghost text-sm self-start md:self-auto inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                <span>View Full Schedule</span>
                <span aria-hidden="true">&rarr;</span>
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
          FACULTY & LEADERSHIP GUIDANCE (Neutral & Informational)
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-surface/30 border-y border-border/40" aria-label="Faculty Guidance & Leadership">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mb-14">
              <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-3 block">
                Academic Mentorship & Leadership
              </span>
              <h2 className="heading-section text-3xl md:text-4xl mb-4">
                Guided by Faculty, Driven by Students
              </h2>
              <p className="text-body text-text-secondary leading-relaxed">
                SAMARTHYA operates under the technical mentorship of the Department of
                Electronics & Communication Engineering. Academic faculty provide lab access
                and research direction, while elected student office bearers coordinate
                hands-on projects, workshops, and national symposium delegations.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedSection delay={0.1}>
              <div className="h-full bg-surface border border-border/70 hover:border-accent/40 rounded-2xl p-8 flex flex-col justify-between transition-colors duration-300">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-accent-glow text-accent uppercase tracking-wider font-semibold">
                      Department Advisory
                    </span>
                    <span className="text-xs font-mono text-text-muted">ECE Mentors</span>
                  </div>
                  <h3 className="heading-section text-xl mb-3">Faculty Coordinators</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    Department professors and specialized academic guides providing curriculum
                    alignment, laboratory infrastructure access, and research direction for
                    hardware development and paper submissions.
                  </p>
                </div>
                <div>
                  <Link
                    href="/faculty"
                    className="btn-ghost text-sm inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
                    <span>View Faculty Profiles</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="h-full bg-surface border border-border/70 hover:border-accent/40 rounded-2xl p-8 flex flex-col justify-between transition-colors duration-300">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-accent-glow text-accent uppercase tracking-wider font-semibold">
                      Student Body
                    </span>
                    <span className="text-xs font-mono text-text-muted">Office Bearers</span>
                  </div>
                  <h3 className="heading-section text-xl mb-3">Core Leadership Team</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    Passionate student engineers elected to lead project incubation, workshop
                    organization, hackathon preparations, and peer mentoring across all ECE
                    academic years.
                  </p>
                </div>
                <div>
                  <Link
                    href="/team"
                    className="btn-ghost text-sm inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
                    <span>Meet Student Team</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION (Verified Routes Only)
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32" aria-label="Join Community Call to Action">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative bg-surface border border-border/80 rounded-3xl p-10 md:p-14 lg:p-18 overflow-hidden text-center">
              {/* Subtle background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/[0.04] rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-4 block">
                  Department Community
                </span>
                <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl mb-6">
                  Ready to Build with{" "}
                  <span className="gradient-accent-text">SAMARTHYA</span>?
                </h2>
                <p className="text-body text-text-secondary text-base md:text-lg mb-8 leading-relaxed">
                  Join fellow students in exploring embedded hardware, signal systems, and
                  robotics. Attend technical workshops, form competition teams, and sharpen
                  real-world engineering capabilities.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-4">
                  <Link
                    href="/events"
                    className="btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
                    Explore Events & Workshops
                  </Link>
                  <Link
                    href="/team"
                    className="btn-ghost focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
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
