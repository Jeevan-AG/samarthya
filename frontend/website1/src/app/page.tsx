"use client";

import Image from "next/image";
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
              <div className="relative group">
                {/* Ambient Cyan Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-cyan/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500" />

                <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-surface shadow-2xl transition-all duration-300 group-hover:border-accent/50 aspect-[4/3]">
                  <Image
                    src="/images/samarthya_group.jpg"
                    alt="SAMARTHYA Team & ECE Department Students"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  {/* Bottom subtle gradient for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Caption Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-text-primary bg-canvas/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-border">
                      SAMARTHYA Team // ECE
                    </span>
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
