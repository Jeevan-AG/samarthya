"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/achievements", label: "Achievements" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-4 sm:top-5 inset-x-0 z-50 flex flex-col items-center px-4 sm:px-6 pointer-events-none">
      {/* Floating Capsule Bar */}
      <div
        className={`pointer-events-auto relative w-full max-w-[960px] h-[64px] sm:h-[70px] flex items-center justify-between px-5 sm:px-8 rounded-2xl md:rounded-full transition-all duration-300 ${
          scrolled || open
            ? "bg-canvas/92 backdrop-blur-xl border border-border/60 shadow-[0_16px_48px_rgba(0,0,0,0.75),0_0_24px_rgba(0,251,248,0.12)]"
            : "bg-canvas/80 backdrop-blur-xl border border-white/[0.12] shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_16px_rgba(0,251,248,0.06)]"
        }`}
      >

        {/* Logo SVG (Bigger, Clean, No Text) */}
        <Link
          href="/"
          className="group relative z-10 inline-flex items-center rounded-xl p-1 -ml-1 focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="SAMARTHYA home"
        >
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo.svg"
              alt="SAMARTHYA"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </Link>

        {/* Desktop Primary Navigation (Clean text, NO highlighting box/pill on touch/active) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-9 relative z-10" aria-label="Primary">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (pathname !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex items-center py-2 text-[14.5px] sm:text-[15.5px] font-semibold tracking-[0.14em] uppercase transition-colors duration-180 focus-visible:outline-2 focus-visible:outline-accent ${
                  active
                    ? "text-accent"
                    : "text-text-primary/70 hover:text-accent"
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Spacer for balanced centering on desktop */}
        <div className="hidden lg:block w-12" aria-hidden="true" />

        {/* Mobile Menu Toggle Button (44px touch target) */}
        <button
          type="button"
          className="relative z-10 inline-flex h-11 w-11 items-center justify-center p-2.5 text-text-primary rounded-xl focus-visible:outline-2 focus-visible:outline-accent lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="relative h-4 w-5">
            <span
              className={`absolute left-0 right-0 h-[1.5px] bg-current rounded-full transition-all duration-200 ease-out ${
                open ? "top-2 rotate-45" : "top-0.5"
              }`}
            />
            <span
              className={`absolute left-0 right-0 top-2 h-[1.5px] bg-current rounded-full transition-all duration-150 ease-out ${
                open ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[1.5px] bg-current rounded-full transition-all duration-200 ease-out ${
                open ? "top-2 -rotate-45" : "top-3.5"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Navigation Dropdown Card */}
      {open && (
        <nav
          id="mobile-nav"
          className="pointer-events-auto mt-2.5 w-full max-w-[960px] rounded-2xl bg-canvas/96 backdrop-blur-xl border border-border/50 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_25px_rgba(0,251,248,0.1)] lg:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (pathname !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[44px] items-center px-4 py-2.5 text-[14px] font-semibold tracking-[0.1em] uppercase transition-colors duration-150 ${
                    active
                      ? "text-accent"
                      : "text-text-primary/75 hover:text-accent"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
