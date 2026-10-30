import { useEffect, useState, useCallback } from "react";

export interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  status: "completed" | "upcoming" | "past" | string;
  featured?: boolean;
  edition?: string;
  galleryFolder?: string;
  photosCount?: number;
  highlights?: string[];
  photos?: string[];
}

interface EventModalProps {
  events: EventItem[];
}

function formatDate(value: string) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m) - 1]} ${d ? d + ", " : ""}${y}`;
}

export default function EventModal({ events }: EventModalProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const openEvent = useCallback(
    (event: EventItem) => {
      setSelectedEvent(event);
      setActivePhotoIdx(0);
      document.body.style.overflow = "hidden";
      window.history.replaceState(null, "", `#${event.id}`);
    },
    []
  );

  const closeModal = useCallback(() => {
    setSelectedEvent(null);
    setActivePhotoIdx(0);
    document.body.style.overflow = "";
    if (window.location.hash.startsWith("#evt-")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Listen to hash changes & initial page load hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const found = events.find((e) => e.id === hash);
        if (found) {
          openEvent(found);
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [events, openEvent]);

  // Global click & keyboard listener on elements with [data-event-id]
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-event-id]");
      if (target) {
        const eventId = target.getAttribute("data-event-id");
        if (eventId) {
          const found = events.find((ev) => ev.id === eventId);
          if (found) {
            e.preventDefault();
            openEvent(found);
          }
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        const target = (e.target as HTMLElement).closest("[data-event-id]");
        if (target) {
          const eventId = target.getAttribute("data-event-id");
          if (eventId) {
            const found = events.find((ev) => ev.id === eventId);
            if (found) {
              e.preventDefault();
              openEvent(found);
            }
          }
        }
      }
    };

    const handleCustomOpen = (e: any) => {
      const id = e.detail?.id;
      if (id) {
        const found = events.find((ev) => ev.id === id);
        if (found) {
          openEvent(found);
        }
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-event-modal" as any, handleCustomOpen);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-event-modal" as any, handleCustomOpen);
    };
  }, [events, openEvent]);

  // Handle ESC key to close
  useEffect(() => {
    if (!selectedEvent) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEvent, closeModal]);

  const downloadCalendarFile = (event: EventItem) => {
    const startDate = event.date.replace(/-/g, "");
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SAMARTHYA//ECE Technical Events//EN",
      "BEGIN:VEVENT",
      `SUMMARY:SAMARTHYA: ${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, " ")}`,
      `LOCATION:${event.venue}`,
      `DTSTART:${startDate}T043000Z`,
      `DTEND:${startDate}T120000Z`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!selectedEvent) return null;

  const hasPhotos = selectedEvent.photos && selectedEvent.photos.length > 0;
  const isUpcoming = selectedEvent.status.toLowerCase() === "upcoming";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-event-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8 animate-fadeIn"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-void/85 backdrop-blur-xl transition-opacity"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-cyan/40 bg-surface/95 p-6 sm:p-8 md:p-10 shadow-[0_0_60px_rgba(0,251,248,0.25)] scrollbar-thin">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan/20 blur-[100px]" />

        {/* Top Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-line/40">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-cyan/15 text-cyan border border-cyan/30 font-semibold">
              {selectedEvent.category}
            </span>

            {isUpcoming ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Upcoming
              </span>
            ) : (
              <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 text-paper/70 border border-white/10">
                Completed
              </span>
            )}

            {selectedEvent.edition && (
              <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-cyan/80 border border-white/10">
                Edition {selectedEvent.edition}
              </span>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={closeModal}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line bg-surface/80 text-mute hover:text-cyan hover:border-cyan/50 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <span>ESC</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Title and Subtitle */}
        <div className="mt-6">
          <h2 id="modal-event-title" className="font-display text-3xl sm:text-4xl md:text-5xl text-paper tracking-tight leading-tight">
            {selectedEvent.title}
          </h2>
          {selectedEvent.subtitle && (
            <p className="font-mono text-xs sm:text-sm text-cyan/90 mt-2 font-medium tracking-wide">
              {selectedEvent.subtitle}
            </p>
          )}
        </div>

        {/* Key Info HUD Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-faint">Date</p>
              <p className="font-mono text-xs sm:text-sm text-paper font-medium mt-0.5">{formatDate(selectedEvent.date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-faint">Venue</p>
              <p className="font-mono text-xs sm:text-sm text-paper font-medium mt-0.5 truncate max-w-[240px]" title={selectedEvent.venue}>
                {selectedEvent.venue}
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-faint">About the Event</h3>
          <p className="text-sm sm:text-base leading-relaxed text-mute">
            {selectedEvent.description}
          </p>
        </div>

        {/* Highlights */}
        {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
          <div className="mt-8 space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-faint">Key Modules &amp; Takeaways</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedEvent.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs text-paper/90">{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Gallery (if photos available) */}
        {hasPhotos && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-faint">
                Event Photo Archive ({selectedEvent.photos!.length} Moments)
              </h3>
              <span className="font-mono text-xs text-cyan">
                {activePhotoIdx + 1} / {selectedEvent.photos!.length}
              </span>
            </div>

            {/* Active Preview */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-void border border-white/10 group">
              <img
                src={selectedEvent.photos![activePhotoIdx]}
                alt={`${selectedEvent.title} snapshot ${activePhotoIdx + 1}`}
                className="h-full w-full object-cover transition-all duration-300"
                loading="eager"
              />

              {/* Prev / Next Controls */}
              {selectedEvent.photos!.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : selectedEvent.photos!.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-void/80 text-white border border-white/20 hover:border-cyan hover:text-cyan transition-all cursor-pointer backdrop-blur-sm"
                    aria-label="Previous photo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePhotoIdx((prev) => (prev < selectedEvent.photos!.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-void/80 text-white border border-white/20 hover:border-cyan hover:text-cyan transition-all cursor-pointer backdrop-blur-sm"
                    aria-label="Next photo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            {selectedEvent.photos!.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {selectedEvent.photos!.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                      activePhotoIdx === idx ? "border-cyan scale-105 shadow-[0_0_12px_rgba(0,251,248,0.4)]" : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={photo} alt="Thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 pt-5 border-t border-line/40 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => downloadCalendarFile(selectedEvent)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider text-cyan bg-cyan/10 border border-cyan/30 hover:bg-cyan hover:text-void transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,251,248,0.1)] hover:shadow-[0_0_20px_rgba(0,251,248,0.3)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Add to Calendar (.ics)</span>
          </button>

          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider text-paper/70 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white transition-all cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
