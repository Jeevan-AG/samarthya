import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import PageHeader from "@/components/PageHeader";
import facultyData from "@/data/faculty.json";

export const metadata: Metadata = {
  title: "Faculty Co-ordinator",
  description:
    "Meet the faculty co-ordinators guiding SAMARTHYA — the ECE department technical club.",
};

export default function FacultyPage() {
  return (
    <>
      <PageHeader
        title="Faculty Co-ordinators"
        subtitle="The guiding forces behind SAMARTHYA — experienced academicians who mentor, inspire, and drive our technical vision forward."
        accentWord="Co-ordinators"
      />

      {/* Faculty Cards */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-20">
            {facultyData.map((faculty, i) => (
              <AnimatedSection key={faculty.id} delay={i * 0.15}>
                <div className="bg-surface border border-border rounded-3xl overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Image */}
                    <div className="lg:col-span-4 relative">
                      <div className="aspect-square lg:aspect-auto lg:h-full relative bg-surface-raised">
                        <Image
                          src={faculty.image}
                          alt={faculty.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-surface" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="lg:col-span-8 p-8 lg:p-12 flex flex-col justify-center">
                      <span className="text-mono text-xs tracking-[0.2em] uppercase text-accent mb-3 block">
                        {faculty.specialization}
                      </span>
                      <h2 className="heading-section text-3xl md:text-4xl mb-2">
                        {faculty.name}
                      </h2>
                      <p className="text-text-secondary text-sm mb-6">
                        {faculty.designation}
                      </p>

                      <p className="text-body text-text-secondary mb-8">
                        {faculty.bio}
                      </p>

                      {/* Qualifications */}
                      <div className="mb-8">
                        <h3 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-3">
                          Qualifications
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {faculty.qualifications.map((q) => (
                            <span
                              key={q}
                              className="text-xs px-3 py-1.5 rounded-full bg-surface-hover border border-border text-text-secondary"
                            >
                              {q}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex flex-wrap gap-6 text-sm text-text-muted">
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          <a
                            href={`mailto:${faculty.contact.email}`}
                            className="hover:text-accent transition-colors"
                          >
                            {faculty.contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{faculty.contact.office}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
