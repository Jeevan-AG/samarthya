import type { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SAMARTHYA — the ECE department's flagship technical club driving innovation, learning, and excellence.",
};

const milestones = [
  {
    year: "2021",
    title: "Foundation",
    description:
      "SAMARTHYA was founded by a group of passionate ECE students with a vision to create a platform for hands-on technical learning.",
  },
  {
    year: "2022",
    title: "First Technical Symposium",
    description:
      "Organized our inaugural TechVista symposium, attracting participation from over 300 students across departments.",
  },
  {
    year: "2023",
    title: "National Recognition",
    description:
      "Teams from SAMARTHYA qualified for Smart India Hackathon and won multiple inter-college competitions.",
  },
  {
    year: "2024",
    title: "Workshop Revolution",
    description:
      "Launched a comprehensive workshop series covering PCB design, IoT, VLSI, and embedded systems — reaching 500+ students.",
  },
  {
    year: "2025",
    title: "Industry Partnerships",
    description:
      "Established collaborations with industry partners for internships, project guidance, and guest lecture series.",
  },
  {
    year: "2026",
    title: "Growing Stronger",
    description:
      "Expanding our reach with online workshops, alumni network, and research-driven project incubation.",
  },
];

const pillars = [
  {
    title: "Innovation",
    description:
      "We foster a culture of creative problem-solving, encouraging students to think beyond textbooks and build real-world solutions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
      </svg>
    ),
  },
  {
    title: "Collaboration",
    description:
      "Our strength lies in teamwork. We bring together diverse minds — from circuit designers to coders — to tackle complex challenges together.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Excellence",
    description:
      "We set high standards for every event, workshop, and project. Mediocrity is not an option — we strive for technical excellence in everything.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
  {
    title: "Community",
    description:
      "SAMARTHYA is more than a club — it is a community. We support each other through mentorship, knowledge sharing, and lifelong connections.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About SAMARTHYA"
        subtitle="The flagship technical club of the ECE Department — fostering innovation, building skills, and shaping the engineers of tomorrow."
        accentWord="SAMARTHYA"
      />

      {/* ═══════════════════════════════════════════
          MISSION & VISION
          ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <AnimatedSection direction="left">
              <div className="bg-surface border border-border rounded-2xl p-8 lg:p-10">
                <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-4 block">
                  Our Mission
                </span>
                <h2 className="heading-section text-2xl md:text-3xl mb-4">
                  Bridging Theory and Practice
                </h2>
                <p className="text-body text-text-secondary">
                  To create an ecosystem where ECE students can explore emerging
                  technologies, develop practical skills, and gain hands-on
                  experience through workshops, projects, and competitions. We
                  believe that the best learning happens when students build with
                  their own hands.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.15}>
              <div className="bg-surface border border-border rounded-2xl p-8 lg:p-10">
                <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-4 block">
                  Our Vision
                </span>
                <h2 className="heading-section text-2xl md:text-3xl mb-4">
                  Shaping Future Innovators
                </h2>
                <p className="text-body text-text-secondary">
                  To be recognized as a center of technical excellence that
                  produces industry-ready engineers who are not just technically
                  proficient but also creative thinkers and collaborative leaders.
                  Every SAMARTHYA member graduates with a portfolio, not just a
                  degree.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PILLARS
          ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-14">
              <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-4 block">
                What Drives Us
              </span>
              <h2 className="heading-section text-3xl md:text-4xl">
                Our Core Pillars
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, i) => (
              <AnimatedSection key={pillar.title} delay={i * 0.1}>
                <div className="bg-surface border border-border rounded-2xl p-8 card-hover h-full">
                  <div className="w-12 h-12 rounded-xl bg-accent-glow flex items-center justify-center mb-5">
                    {pillar.icon}
                  </div>
                  <h3 className="heading-section text-xl mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TIMELINE
          ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-14">
              <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-4 block">
                Our Journey
              </span>
              <h2 className="heading-section text-3xl md:text-4xl">
                Milestones
              </h2>
            </div>
          </AnimatedSection>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <AnimatedSection
                  key={milestone.year}
                  delay={i * 0.1}
                  direction={i % 2 === 0 ? "left" : "right"}
                >
                  <div
                    className={`relative flex items-start gap-8 ${
                      i % 2 === 0
                        ? "md:flex-row"
                        : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ml-12 md:ml-0 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                      <span className="text-mono text-xs tracking-wider text-accent">
                        {milestone.year}
                      </span>
                      <h3 className="heading-section text-xl mt-1 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent -translate-x-1.5 mt-1.5 ring-4 ring-canvas" />

                    {/* Spacer for other side */}
                    <div className="hidden md:block flex-1" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
