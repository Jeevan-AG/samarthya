import React from "react";
import { Calendar } from "lucide-react";
import ScrambleText from "./ScrambleText";

export const UpcomingEventsSection: React.FC = () => {
  return (
    <section
      id="upcoming"
      className="relative py-16 sm:py-20 lg:py-24 scroll-mt-20 border-t border-line/25"
      aria-label="Upcoming Events"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[400px] w-[500px] rounded-full bg-cyan/[0.03] blur-[150px] opacity-60" />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <div className="mb-3">
            <ScrambleText text="upcoming events" />
          </div>
          <p className="font-mono text-xs text-faint uppercase tracking-widest mt-1">
            Technical Workshops &amp; Club Initiatives
          </p>
        </div>

        {/* Clean Announcement Card */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-surface/60 p-8 sm:p-12 text-center backdrop-blur-md transition-all duration-300 hover:border-white/20">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-paper/70">
            <Calendar size={26} />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl text-paper">
            No Upcoming Events Scheduled
          </h3>
          <p className="mt-2 text-sm font-mono text-mute max-w-md mx-auto leading-relaxed">
            Stay tuned! Announcements for upcoming workshops, technical sessions, and competitions will be posted here soon.
          </p>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
