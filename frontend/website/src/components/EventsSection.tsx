import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { EventGalleryModal, type GalleryModalData } from "./EventGalleryModal";
import { EventFlipCard } from "./EventFlipCard";
import ScrambleText from "./ScrambleText";

export const DEFAULT_SAMARTHYA_EVENTS: GalleryModalData[] = [
  {
    slug: "CIRCUIT_CRAFT_2",
    tag: "SDP Workshop",
    title: "CircuitCraft 2.0",
    dateStr: "16th – 18th March 2026 · SJEC-AICTE IDEA Lab",
    cardDateBadge: "16 - 18 MAR 2026",
    cardSubtitle: "PCB Design Using KiCad · 4th Sem",
    venue: "SJEC-AICTE IDEA Lab",
    paragraphs: [
      "Building on the success of its first edition, Samarthya - The Electronics Technical Club of SJEC conducted CircuitCraft 2.0 from 16th - 18th March 2026, tailored for fourth-semester students.",
      "The three-day Student Development Programme (SDP) introduced 132 participants to the complete PCB development cycle, from schematic design and component selection to board layout, routing, and fabrication.",
      "Putting their learning into practice, students designed an infrared (IR) receiver circuit, with dedicated support in debugging, validation, and optimization to help them develop a functional design.",
      "Through initiatives like CircuitCraft, we continue to create opportunities for students to strengthen their technical skills, gain practical experience, and bring their ideas to life. Design. Build. Debug. Innovate. ⚡",
    ],
    images: [
      "/pics/events/circuit_craft_2/circuit_craft_2_1.webp",
      "/pics/events/circuit_craft_2/circuit_craft_2_2.webp",
      "/pics/events/circuit_craft_2/circuit_craft_2_3.webp",
      "/pics/events/circuit_craft_2/circuit_craft_2_4.webp",
      "/pics/events/circuit_craft_2/circuit_craft_2_5.webp",
      "/pics/events/circuit_craft_2/circuit_craft_2_6.webp",
      "/pics/events/circuit_craft_2/circuit_craft_2_7.webp",
    ],
  },
  {
    slug: "CIRCUIT_CRAFT_1",
    tag: "SDP Workshop",
    title: "CircuitCraft",
    dateStr: "4th – 6th February 2026 · SJEC-AICTE IDEA Lab",
    cardDateBadge: "04 - 06 FEB 2026",
    cardSubtitle: "PCB Design Using KiCad · 6th Sem",
    venue: "SJEC-AICTE IDEA Lab",
    paragraphs: [
      "From 4th - 6th February 2026, we conducted CircuitCraft, a three-day hands-on Student Development Programme (SDP) on PCB design using KiCad, in collaboration with the SJEC-AICTE IDEA Lab and with support from Prodigi.",
      "The programme guided 119 sixth-semester students through the complete PCB design workflow, covering schematic capture and component selection, PCB layout and routing, Design Rule Checking (DRC), and fabrication file generation.",
      "Putting theory into practice, participants designed an infrared receiver circuit from start to finish, gaining practical experience in PCB design and development.",
      "Through initiatives like CircuitCraft, Samarthya continues to create opportunities for students to explore beyond the classroom, strengthen their technical skills, and turn concepts into working designs. From schematic to board learning by building ⚡",
    ],
    images: [
      "/pics/events/circuit_craft_1/circuit_craft_1_1.webp",
      "/pics/events/circuit_craft_1/circuit_craft_1_2.webp",
      "/pics/events/circuit_craft_1/circuit_craft_1_3.webp",
      "/pics/events/circuit_craft_1/circuit_craft_1_4.webp",
      "/pics/events/circuit_craft_1/circuit_craft_1_5.webp",
    ],
  },
  {
    slug: "ELECTROVATION_2",
    tag: "Pitch & Funding",
    title: "Electrovation 2.0",
    dateStr: "24th January 2026 · DSP Lab, SJEC",
    cardDateBadge: "24 JAN 2026",
    cardSubtitle: "Project Pitch & Seed Funding",
    venue: "DSP Lab, SJEC",
    paragraphs: [
      "At Samarthya - The Electronics Technical Club of SJEC, we believe every great innovation begins with an idea. We kicked off 2026 with Electrovation 2.0, held on 24th January 2026 at the DSP Lab, St. Joseph Engineering College, Mangaluru.",
      "The event provided a platform for students to pitch innovative, technically feasible, and industry-relevant project ideas, bringing together 40 students across 11 competitive teams.",
      "The project pitches were evaluated based on originality, technical feasibility, societal relevance, scalability, and presentation. Six projects were selected for seed-funding support: SpineAlign, Explorer, NeuroPulse, SignalX, Impedance, and Sahayog.",
      "This initiative reflects our commitment to encouraging student innovation, nurturing problem-solving skills, and helping promising ideas take their first steps towards real-world impact. Here's to building, innovating, and turning ideas into impact! ⚡",
    ],
    images: [
      "/pics/events/electrovation_2/electrovation_2_1.webp",
      "/pics/events/electrovation_2/electrovation_2_2.webp",
      "/pics/events/electrovation_2/electrovation_2_3.webp",
      "/pics/events/electrovation_2/electrovation_2_4.webp",
      "/pics/events/electrovation_2/electrovation_2_5.webp",
      "/pics/events/electrovation_2/electrovation_2_6.webp",
      "/pics/events/electrovation_2/electrovation_2_7.webp",
      "/pics/events/electrovation_2/electrovation_2_8.webp",
      "/pics/events/electrovation_2/electrovation_2_9.webp",
    ],
  },
];

export const EventsSection: React.FC<{
  events?: GalleryModalData[];
}> = ({ events = DEFAULT_SAMARTHYA_EVENTS }) => {
  const [activeModalData, setActiveModalData] = useState<GalleryModalData | null>(null);
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayEvents = events && events.length > 0 ? events : DEFAULT_SAMARTHYA_EVENTS;

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / displayEvents.length;
    const newIdx = Math.round(el.scrollLeft / cardWidth);
    setActiveEventIndex(Math.max(0, Math.min(newIdx, displayEvents.length - 1)));
  };

  const scrollToEvent = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / displayEvents.length;
    el.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setActiveEventIndex(index);
  };

  return (
    <section id="events" className="relative py-24 lg:py-32 scroll-mt-20 border-t border-line/25" aria-label="Events and Technical Workshops">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
        {/* Section Header (matching Core Team style) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="mb-4">
              <ScrambleText text="events" />
            </div>
            <p className="font-mono text-xs text-faint uppercase tracking-widest mt-1">
              Technical Workshops &amp; Prototyping
            </p>
          </div>
          
          <a
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider text-cyan bg-cyan/10 border border-cyan/30 hover:bg-cyan hover:text-void transition-all duration-300 self-start sm:self-auto group"
          >
            <span>Explore All Events</span>
            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Flagship Event Cards */}
        <div className="mx-auto max-w-6xl">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8 sm:overflow-visible no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0"
          >
            {displayEvents.map((event, idx) => (
              <motion.div
                key={`${event.slug || event.title}-${idx}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="w-[88vw] max-w-[440px] shrink-0 snap-center sm:w-full sm:max-w-none h-full min-h-[410px] sm:min-h-[440px]"
              >
                <EventFlipCard
                  event={event}
                  onOpenGallery={(ev) => setActiveModalData(ev)}
                />
              </motion.div>
            ))}
          </div>

          {/* Mobile Pagination Dots */}
          {displayEvents.length > 1 && (
            <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:hidden">
              <div className="flex items-center gap-2">
                {displayEvents.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => scrollToEvent(dotIdx)}
                    aria-label={`Go to event ${dotIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 p-0 ${
                      dotIdx === activeEventIndex
                        ? "w-6 bg-cyan shadow-[0_0_8px_rgba(0,229,224,0.8)]"
                        : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-mute">
                Swipe horizontally to browse events ({activeEventIndex + 1}/{displayEvents.length})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Modal */}
      <EventGalleryModal data={activeModalData} onClose={() => setActiveModalData(null)} />
    </section>
  );
};

