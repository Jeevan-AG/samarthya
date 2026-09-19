import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/faculty", label: "Faculty" },
  { href: "/team", label: "Core Team" },
  { href: "/events", label: "Events" },
  { href: "/achievements", label: "Achievements" },
];

export default function Footer() {
  return (
    <footer className="relative bg-surface border-t border-border">
      {/* Accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
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
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              The official technical club of the ECE Department. Empowering
              students through innovation, collaboration, and hands-on learning
              experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4">
              Get In Touch
            </h3>
            <div className="flex flex-col gap-2.5 text-sm text-text-secondary">
              <p>ECE Department</p>
              <a
                href="mailto:samarthya@college.edu"
                className="hover:text-accent transition-colors"
              >
                samarthya@college.edu
              </a>
              <div className="flex gap-4 mt-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="text-text-muted hover:text-accent transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="text-text-muted hover:text-accent transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="GitHub"
                  className="text-text-muted hover:text-accent transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} SAMARTHYA — ECE Department Club.
            All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Crafted with passion by SAMARTHYA
          </p>
        </div>
      </div>
    </footer>
  );
}
