import { useEffect, useState } from "react";

const links = [
  { id: "about", href: "/#about", label: "About" },
  { id: "faculty", href: "/#faculty", label: "Faculty" },
  { id: "team", href: "/#team", label: "Team" },
  { id: "events", href: "/#events", label: "Events" },
  { id: "gallery", href: "/#gallery", label: "Gallery" },
];

export default function Navbar({ pathname = "/" }: { pathname?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["about", "faculty", "team", "events", "gallery"];

    const updateActive = () => {
      // If in Hero section at top of page, no section is active
      if (window.scrollY < 120) {
        setActiveSection("");
        return;
      }

      // If above the first section (about), clear highlight
      const firstSection = document.getElementById("about");
      if (firstSection) {
        const firstRect = firstSection.getBoundingClientRect();
        if (firstRect.top > window.innerHeight * 0.45) {
          setActiveSection("");
          return;
        }
      }

      // Check which section is in focal view
      const focalPoint = window.innerHeight * 0.35;
      let found = "";

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalPoint) {
            found = id;
            break;
          }
        }
      }

      setActiveSection(found);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-4 sm:top-5 inset-x-0 z-50 flex flex-col items-center px-4 sm:px-6 pointer-events-none">
      {/* Floating Capsule Bar */}
      <div
        className={`pointer-events-auto relative w-full max-w-[960px] h-[64px] sm:h-[70px] flex items-center justify-between px-5 sm:px-8 rounded-2xl md:rounded-full transition-all duration-300 ${
          scrolled || open
            ? "bg-void/92 backdrop-blur-xl border border-line/60 shadow-[0_16px_48px_rgba(0,0,0,0.75),0_0_24px_rgba(0,251,248,0.12)]"
            : "bg-void/80 backdrop-blur-xl border border-white/[0.12] shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_16px_rgba(0,251,248,0.06)]"
        }`}
      >

        {/* Logo SVG */}
        <a
          href="/"
          className="group relative z-10 inline-flex items-center rounded-xl p-1 -ml-1 focus-visible:outline-2 focus-visible:outline-cyan"
          aria-label="SAMARTHYA home"
          onClick={() => {
            if (pathname === "/") {
              setActiveSection("");
            }
          }}
        >
          <img
            src="/logo.svg"
            alt="SAMARTHYA"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
          />
        </a>

        {/* Desktop Primary Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 relative z-10" aria-label="Primary">
          {links.map((link) => {
            const isSectionActive = pathname === "/" && activeSection === link.id;
            const isPathActive = pathname !== "/" && pathname.startsWith(`/${link.id}`);
            const active = isSectionActive || isPathActive;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex items-center py-2 text-[14px] sm:text-[14.5px] font-semibold tracking-[0.14em] uppercase transition-colors duration-180 focus-visible:outline-2 focus-visible:outline-cyan ${
                  active
                    ? "text-cyan"
                    : "text-paper/70 hover:text-cyan"
                }`}
              >
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Spacer for balanced centering on desktop */}
        <div className="hidden lg:block w-12" aria-hidden="true" />

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="relative z-10 inline-flex h-11 w-11 items-center justify-center p-2.5 text-paper rounded-xl focus-visible:outline-2 focus-visible:outline-cyan lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="relative h-4 w-5">
            <span
              className={`absolute left-0 right-0 h-[1.5px] bg-paper rounded-full transition-all duration-200 ease-out ${
                open ? "top-2 rotate-45" : "top-0.5"
              }`}
            />
            <span
              className={`absolute left-0 right-0 top-2 h-[1.5px] bg-paper rounded-full transition-all duration-150 ease-out ${
                open ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[1.5px] bg-paper rounded-full transition-all duration-200 ease-out ${
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
          className="pointer-events-auto mt-2.5 w-full max-w-[960px] rounded-2xl bg-void/96 backdrop-blur-xl border border-line/50 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_25px_rgba(0,251,248,0.1)] lg:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1.5">
            {links.map((link) => {
              const isSectionActive = pathname === "/" && activeSection === link.id;
              const isPathActive = pathname !== "/" && pathname.startsWith(`/${link.id}`);
              const active = isSectionActive || isPathActive;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[44px] items-center px-4 py-2.5 text-[14px] font-semibold tracking-[0.1em] uppercase transition-colors duration-150 ${
                    active
                      ? "text-cyan"
                      : "text-paper/75 hover:text-cyan"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
