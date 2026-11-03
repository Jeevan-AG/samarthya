import React, { useState } from "react";
import { motion } from "framer-motion";
import { EventGalleryModal, type GalleryModalData } from "./EventGalleryModal";
import { EventFlipCard } from "./EventFlipCard";
import { DEFAULT_SAMARTHYA_EVENTS } from "./EventsSection";
import ScrambleText from "./ScrambleText";

export const EventsPageContent: React.FC<{
  events?: GalleryModalData[];
}> = ({ events = DEFAULT_SAMARTHYA_EVENTS }) => {
  const [activeModalData, setActiveModalData] = useState<GalleryModalData | null>(null);

  const allEvents = events && events.length > 0 ? events : DEFAULT_SAMARTHYA_EVENTS;

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* Clean Hero Header matching Core Team */}
        <div className="mb-10 sm:mb-14">
          <ScrambleText text="events" as="h1" />
        </div>

        {/* Events Grid */}
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allEvents.map((event, idx) => (
            <motion.div
              key={`${event.slug || event.title}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <EventFlipCard
                event={event}
                onOpenGallery={(ev) => setActiveModalData(ev)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      <EventGalleryModal data={activeModalData} onClose={() => setActiveModalData(null)} />
    </div>
  );
};
