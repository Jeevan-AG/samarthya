"use client";

import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/faculty", label: "Faculty Advisory" },
  { href: "/team", label: "Core Team" },
  { href: "/events", label: "Events & Workshops" },
  { href: "/achievements", label: "Achievements" },
];

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  return (
    <footer className="relative bg-surface border-t border-border/80" aria-label="Site Footer">
      {/* Accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-4 rounded-lg p-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              aria-label="SAMARTHYA Home"
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.svg"
                  alt="SAMARTHYA Logo"
                  fill
                  className="object-contain rounded-full"
                  unoptimized
                />
              </div>
              <span className="heading-section text-xl">SAMARTHYA</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm mb-4">
              The official technical club of the Electronics & Communication
              Engineering Department. Fostering hands-on engineering,
              hardware innovation, and technical excellence.
            </p>
            <p className="text-xs font-mono text-accent tracking-wider uppercase">
              Dept. of Electronics & Communication Engineering
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4 font-mono">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors duration-200 rounded px-1 -mx-1 py-0.5 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Academic Affiliation */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4 font-mono">
                Department Office
              </h3>
              <div className="flex flex-col gap-2.5 text-sm text-text-secondary">
                <p>ECE Block, Campus Infrastructure</p>
                <a
                  href="mailto:samarthya@college.edu"
                  className="hover:text-accent transition-colors duration-200 rounded px-1 -mx-1 py-0.5 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 w-fit"
                >
                  samarthya@college.edu
                </a>
              </div>
            </div>

            {/* Back to top button */}
            <div className="mt-8 pt-4 border-t border-border/50">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted hover:text-accent transition-colors py-2 px-3 rounded-lg border border-border/70 hover:border-accent/40 bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                aria-label="Back to top of page"
              >
                <span>Back to Top</span>
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
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; 2026 SAMARTHYA — ECE Department Club. All rights reserved.
          </p>
          <p className="text-xs font-mono text-text-muted">
            ECE Technical Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
