"use client";

import { useState } from "react";
import EventCard from "@/components/EventCard";
import AnimatedSection from "@/components/AnimatedSection";
import eventsData from "@/data/events.json";
import { motion, AnimatePresence } from "framer-motion";

type FilterType = "all" | "upcoming" | "past";

export default function EventsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered =
    filter === "all"
      ? eventsData
      : eventsData.filter((e) => e.status === filter);

  const handleRegister = (eventId?: string) => {
    if (eventId) {
      setSelectedEvent(eventId);
    }
    setShowModal(true);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          eventId: selectedEvent,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormState({ name: "", email: "", phone: "" });
      }
    } catch {
      // Handle error silently
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="max-w-3xl">
              <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-6">
                Our <span className="gradient-accent-text">Events</span>
              </h1>
              <p className="text-body text-text-secondary text-lg md:text-xl">
                Workshops, hackathons, symposiums, and more — explore everything
                happening at SAMARTHYA.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px w-20 bg-accent" />
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap gap-2">
              {(["all", "upcoming", "past"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs font-medium px-4 py-2 rounded-full capitalize transition-all duration-200 ${
                    filter === f
                      ? "bg-accent text-canvas"
                      : "bg-surface border border-border text-text-secondary hover:border-accent/30 hover:text-text-primary"
                  }`}
                >
                  {f === "all" ? "All Events" : f}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <EventCard
                key={event.id}
                {...event}
                index={i}
                onRegister={() => handleRegister(event.id)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">
                No events found for this filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-accent-glow flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="heading-section text-xl mb-2">
                    Registration Successful
                  </h3>
                  <p className="text-sm text-text-secondary">
                    You have been registered for the event. We will send
                    confirmation details to your email.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="heading-section text-xl mb-1">
                    Register for Event
                  </h3>
                  <p className="text-sm text-text-muted mb-6">
                    Fill in your details to register.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) =>
                          setFormState({ ...formState, phone: e.target.value })
                        }
                        className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-primary text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Registering..." : "Register"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
