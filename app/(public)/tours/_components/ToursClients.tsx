"use client";

import { useState } from "react";
import Link from "next/link";
import TourCard from "../../../components/ui/TourCard";
import { Tour, Rental } from "@/lib/types";

type Tab = "all" | "tours" | "rentals";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  moderate: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  challenging: "border-red-500/40 bg-red-500/10 text-red-400",
};

export default function ToursClient({
  tours,
  rentals,
}: {
  tours: Tour[];
  rentals: Rental[];
}) {
  const [tab, setTab] = useState<Tab>("all");
  const [sort, setSort] = useState("newest");

  const sortedTours = [...tours].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "duration") return a.days - b.days;
    return 0;
  });

  const showTours = tab === "all" || tab === "tours";
  const showRentals = tab === "all" || tab === "rentals";

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "tours", label: "Tours" },
    { key: "rentals", label: "Sidecar Rentals" },
  ];

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--black)" }}
    >
      {/* ── HEADER ── */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Warm gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1e1608 0%, var(--black) 60%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--gold) 1px, transparent 1px),
                             linear-gradient(90deg, var(--gold) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gold glow */}
        <div
          className="absolute bottom-0 left-0 w-96 h-96 opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at bottom left, var(--gold), transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <p className="section-eyebrow mb-4">Bulgan Khangai Travel</p>
          <h1
            className="font-display text-5xl md:text-7xl mb-5 leading-tight"
            style={{ color: "var(--parchment)" }}
          >
            Our <em style={{ color: "var(--gold)" }}>Expeditions</em>
          </h1>
          <p
            className="text-lg max-w-xl leading-relaxed"
            style={{ color: "var(--stone)" }}
          >
            Guided tours through Mongolia's wildest regions, or rent a sidecar
            and blaze your own trail. Every adventure starts here.
          </p>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div
        className="sticky top-20 z-40 border-b"
        style={{
          background: "rgba(19,16,10,0.96)",
          backdropFilter: "blur(12px)",
          borderColor: "var(--charcoal-light)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="font-condensed text-sm tracking-widest uppercase px-5 py-2.5 transition-all duration-200"
                style={{
                  background:
                    tab === t.key ? "var(--gold)" : "transparent",
                  color:
                    tab === t.key ? "var(--black)" : "var(--stone)",
                  border: `1px solid ${tab === t.key ? "var(--gold)" : "var(--charcoal-light)"}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Sort — only relevant for tours */}
          {(tab === "all" || tab === "tours") && (
            <div className="flex items-center gap-3">
              <span
                className="font-condensed text-xs tracking-wider uppercase"
                style={{ color: "var(--stone)" }}
              >
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="font-condensed text-xs px-3 py-2 focus:outline-none focus:border-gold transition-colors"
                style={{
                  background: "var(--charcoal)",
                  border: "1px solid var(--charcoal-light)",
                  color: "var(--parchment)",
                }}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-20">

        {/* ── TOURS GRID ── */}
        {showTours && (
          <div>
            {tab === "all" && (
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="section-eyebrow mb-2">Guided expeditions</p>
                  <h2
                    className="font-display text-3xl md:text-4xl"
                    style={{ color: "var(--parchment)" }}
                  >
                    Tours
                  </h2>
                </div>
                <span
                  className="font-condensed text-xs tracking-wider uppercase"
                  style={{ color: "var(--stone)" }}
                >
                  {sortedTours.length} route{sortedTours.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {tab === "tours" && (
              <div className="mb-10">
                <p className="section-eyebrow mb-2">Guided expeditions</p>
                <h2
                  className="font-display text-3xl md:text-4xl"
                  style={{ color: "var(--parchment)" }}
                >
                  All <em style={{ color: "var(--gold)" }}>Tours</em>
                </h2>
              </div>
            )}

            {sortedTours.length === 0 ? (
              <p
                className="text-center py-16 font-condensed tracking-wider"
                style={{ color: "var(--stone)" }}
              >
                No tours available right now.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTours.map((tour, i) => (
                  <TourCard key={tour.id} tour={tour} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RENTALS GRID ── */}
        {showRentals && (
          <div>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-eyebrow mb-2">Self-guided freedom</p>
                <h2
                  className="font-display text-3xl md:text-4xl"
                  style={{ color: "var(--parchment)" }}
                >
                  Sidecar <em style={{ color: "var(--gold)" }}>Rentals</em>
                </h2>
              </div>
              <span
                className="font-condensed text-xs tracking-wider uppercase"
                style={{ color: "var(--stone)" }}
              >
                {rentals.length} vehicle{rentals.length !== 1 ? "s" : ""} available
              </span>
            </div>

            {rentals.length === 0 ? (
              <p
                className="text-center py-16 font-condensed tracking-wider"
                style={{ color: "var(--stone)" }}
              >
                No vehicles available right now.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rentals.map((r) => (
                  <div key={r.id} className="card-dark group flex flex-col">
                    {/* Image area */}
                    <div
                      className="h-52 flex items-center justify-center relative overflow-hidden"
                      style={{ background: "var(--charcoal-mid)" }}
                    >
                      <span className="text-6xl opacity-10">🏍</span>
                      <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-300" />
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1/2"
                        style={{
                          background:
                            "linear-gradient(to top, var(--charcoal), transparent)",
                        }}
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <p className="section-eyebrow text-[10px] mb-2">
                        Available now
                      </p>
                      <h3
                        className="font-display text-xl mb-2 group-hover:text-gold transition-colors"
                        style={{ color: "var(--parchment)" }}
                      >
                        {r.name}
                      </h3>
                      <p
                        className="text-sm leading-relaxed mb-5 flex-1"
                        style={{ color: "var(--stone)" }}
                      >
                        {r.description?.slice(0, 90)}…
                      </p>

                      <div className="gold-line mb-4" />

                      <div className="flex items-center justify-between">
                        <div>
                          <span
                            className="font-condensed text-xs uppercase tracking-wider"
                            style={{ color: "var(--stone)" }}
                          >
                            From{" "}
                          </span>
                          <span
                            className="font-display text-2xl"
                            style={{ color: "var(--gold)" }}
                          >
                            ${r.pricePerDay}
                          </span>
                          <span
                            className="text-xs ml-1"
                            style={{ color: "var(--stone)" }}
                          >
                            / day
                          </span>
                        </div>
                        <Link
                          href={`/book?type=rental&rental=${r.id}`}
                          className="font-condensed text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-200"
                          style={{
                            color: "var(--gold)",
                            borderColor: "rgba(201,144,42,0.4)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "var(--gold)";
                            (e.currentTarget as HTMLElement).style.color = "var(--black)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                            (e.currentTarget as HTMLElement).style.color = "var(--gold)";
                          }}
                        >
                          Reserve →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rental features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
              {[
                { icon: "🗺", title: "Route Planning", desc: "We map your route, brief you on fuel stops and must-see spots." },
                { icon: "🔧", title: "24/7 Roadside Help", desc: "Our mechanics are always on call — no matter where you are." },
                { icon: "⛺", title: "Camping Gear", desc: "Tent, sleeping bags, and cooking equipment all included." },
                { icon: "📡", title: "Satellite Comms", desc: "Each rental includes a satellite communicator for safety." },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex gap-4 p-5 border transition-colors"
                  style={{ borderColor: "var(--charcoal-light)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(201,144,42,0.4)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      "var(--charcoal-light)")
                  }
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <p
                      className="font-condensed tracking-wide mb-1 text-sm"
                      style={{ color: "var(--parchment)" }}
                    >
                      {f.title}
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--stone)" }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM CTA ── */}
      <section
        className="py-16 border-t"
        style={{
          background: "var(--charcoal)",
          borderColor: "var(--charcoal-light)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="section-eyebrow mb-3">Custom expedition?</p>
          <h3
            className="font-display text-3xl mb-4"
            style={{ color: "var(--parchment)" }}
          >
            Don't see what you're looking for?
          </h3>
          <p
            className="leading-relaxed mb-8"
            style={{ color: "var(--stone)" }}
          >
            We build bespoke routes for solo riders, couples, and groups. Tell
            us your dream and we'll make it happen.
          </p>
          <a href="mailto:info@bktravel.mn" className="btn-gold">
            Contact Us for a Custom Tour
          </a>
        </div>
      </section>
    </main>
  );
}
