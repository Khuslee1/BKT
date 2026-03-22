"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { SlideData } from "@/app/components/admin/AdminEditProvider";

// ── Default slide content (used when no DB override exists) ───────

export const DEFAULT_SLIDES: SlideData[] = [
  {
    eyebrow: "Bulgan Khangai Travel · Mongolia",
    heading: "Sidecar Saga",
    sub: "Into the Wild",
    body: "Authentic sidecar adventures through Mongolia's most remote landscapes. Ger camps, eagle hunters, and endless steppe.",
    ctaLabel: "Explore Tours",
    ctaHref: "/tours",
    secondaryLabel: "Book a Sidecar",
    secondaryHref: "/book",
  },
  {
    eyebrow: "Guided expeditions",
    heading: "Ride the",
    sub: "Mongolian Steppe",
    body: "From the Gobi desert to the Altai eagle hunters — every route is hand-crafted, fully guided, and completely unforgettable.",
    ctaLabel: "View All Tours",
    ctaHref: "/tours",
    secondaryLabel: "Custom Route",
    secondaryHref: "/#contact",
  },
  {
    eyebrow: "Self-guided freedom",
    heading: "Rent a",
    sub: "Ural Sidecar",
    body: "Prefer to chart your own course? Our fleet of restored Soviet-era Ural and Dnepr sidecars are serviced and ready to go.",
    ctaLabel: "See Rentals",
    ctaHref: "/tours",
    secondaryLabel: "Reserve Now",
    secondaryHref: "/book?type=rental",
  },
];

const SLIDE_BACKGROUNDS = [
  "linear-gradient(135deg, #1e1608 0%, #17130e 50%, #1a1208 100%)",
  "linear-gradient(135deg, #16180e 0%, #17130e 50%, #1c1610 100%)",
  "linear-gradient(135deg, #1a1208 0%, #17130e 50%, #160e06 100%)",
];

// ── Component ─────────────────────────────────────────────────────

export default function HeroCarousel({
  slides: externalSlides,
}: {
  slides?: SlideData[];
}) {
  const slidesData = externalSlides ?? DEFAULT_SLIDES;

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const DURATION = 5500;

  const next = useCallback(() => {
    setActive((p) => (p + 1) % slidesData.length);
    setProgress(0);
  }, [slidesData.length]);

  const prev = () => {
    setActive((p) => (p - 1 + slidesData.length) % slidesData.length);
    setProgress(0);
  };

  const goTo = (i: number) => {
    setActive(i);
    setProgress(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 100 / (DURATION / 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [next]);

  const slide = slidesData[active];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background gradients */}
      {slidesData.map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: SLIDE_BACKGROUNDS[i % SLIDE_BACKGROUNDS.length],
            opacity: i === active ? 1 : 0,
          }}
        />
      ))}

      {/* Subtle gold grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.028] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--gold) 1px, transparent 1px),
                           linear-gradient(90deg, var(--gold) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Warm radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(201,144,42,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Slide content */}
      <div className="relative flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full pt-28 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div key={active}>
            <p className="section-eyebrow animate-fade-up delay-100 mb-6">
              {slide.eyebrow}
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-parchment leading-[1.05] mb-6 animate-fade-up delay-200">
              {slide.heading}
              <em className="block text-gold not-italic">{slide.sub}</em>
            </h1>
            <p className="text-stone text-lg leading-relaxed mb-10 max-w-md animate-fade-up delay-300">
              {slide.body}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up delay-400">
              <Link href={slide.ctaHref} className="btn-gold">
                {slide.ctaLabel}
              </Link>
              <Link href={slide.secondaryHref} className="btn-outline-gold">
                {slide.secondaryLabel}
              </Link>
            </div>
          </div>

          {/* Right — stats card */}
          <div className="animate-fade-up delay-500">
            <div
              className="backdrop-blur-sm p-8"
              style={{
                background: "rgba(35,30,18,0.7)",
                border: "1px solid rgba(201,144,42,0.15)",
              }}
            >
              <p className="section-eyebrow mb-6">Why ride with BKT</p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "6+", label: "Years operating" },
                  { num: "200+", label: "Adventurers guided" },
                  { num: "12", label: "Tour routes" },
                  { num: "100%", label: "Local & authentic" },
                ].map((s) => (
                  <div key={s.label} className="border-l-2 border-gold pl-4">
                    <div className="font-display text-3xl text-gold">{s.num}</div>
                    <div className="font-condensed text-stone text-xs tracking-wider uppercase mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="gold-line my-6" />
              <p className="text-stone text-xs leading-relaxed italic font-display">
                "One of the last places on earth where it feels like you're
                discovering unexplored lands."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Dots */}
          <div className="flex gap-2">
            {slidesData.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all duration-300"
                style={{
                  width: i === active ? 32 : 8,
                  height: 3,
                  background:
                    i === active ? "var(--gold)" : "rgba(201,151,42,0.3)",
                }}
              />
            ))}
          </div>

          <span className="font-condensed text-xs tracking-widest text-stone">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(slidesData.length).padStart(2, "0")}
          </span>

          <div className="flex gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 border border-stone/30 hover:border-gold hover:text-gold text-stone transition-colors flex items-center justify-center font-condensed text-sm"
            >
              ←
            </button>
            <button
              onClick={next}
              className="w-10 h-10 border border-stone/30 hover:border-gold hover:text-gold text-stone transition-colors flex items-center justify-center font-condensed text-sm"
            >
              →
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="h-px bg-charcoal-light w-full">
            <div
              className="h-px bg-gold transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
