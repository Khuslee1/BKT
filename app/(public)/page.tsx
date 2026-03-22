import Link from "next/link";
import HeroCarousel, { DEFAULT_SLIDES } from "@/app/components/ui/HeroCarousel";
import TourCard from "@/app/components/ui/TourCard";
import EditableSection from "@/app/components/admin/EditableSection";
import { prisma } from "@/lib/prisma";
import { Rental, Tour } from "@/lib/types";
import type { SlideData } from "@/app/components/admin/AdminEditProvider";

// ── Default content ───────────────────────────────────────────────

const DEFAULT_STATS = [
  { num: "6+",   label: "Years of Experience" },
  { num: "200+", label: "Happy Adventurers" },
  { num: "12",   label: "Unique Routes" },
  { num: "3",    label: "Sidecar Models" },
  { num: "100%", label: "Locally Owned" },
];

const DEFAULT_ABOUT = {
  title: "Born in the",
  titleEm: "Steppe",
  para1:
    "Bulgan Khangai Travel was founded by local Mongolians who grew up riding the vast open lands of the Khangai region. We started with one Ural sidecar and a dream to share Mongolia's raw beauty with the world.",
  para2:
    "Today we operate a fleet of restored Soviet-era sidecars and offer expeditions into every corner of Mongolia — from the Gobi to the taiga, from eagle hunters to reindeer people.",
  para3:
    "Every tour is led by a local guide who knows these lands intimately. Travel should be genuine, responsible, and unforgettable.",
};

// ── Page ──────────────────────────────────────────────────────────

export default async function HomePage() {
  const [featured, rentals, heroRaw, statsRaw, aboutRaw] = await Promise.all([
    prisma.tour.findMany({
      where: { featured: true, published: true },
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
    }),
    prisma.rental.findMany({
      where: { available: true },
      orderBy: { pricePerDay: "asc" },
    }),
    prisma.siteContent.findUnique({ where: { key: "homepage_hero" } }),
    prisma.siteContent.findUnique({ where: { key: "homepage_stats" } }),
    prisma.siteContent.findUnique({ where: { key: "homepage_about" } }),
  ]);

  const heroSlides: SlideData[] = heroRaw
    ? (JSON.parse(heroRaw.value) as { slides: SlideData[] }).slides
    : DEFAULT_SLIDES;

  const statsItems: typeof DEFAULT_STATS = statsRaw
    ? (JSON.parse(statsRaw.value) as { items: typeof DEFAULT_STATS }).items
    : DEFAULT_STATS;

  const about =
    aboutRaw
      ? (JSON.parse(aboutRaw.value) as typeof DEFAULT_ABOUT)
      : DEFAULT_ABOUT;

  return (
    <main>
      {/* ── HERO CAROUSEL ──────────────────────────────── */}
      <EditableSection sectionId="hero" data={{ slides: heroSlides }} label="Hero Slides" position="bottom-left">
        <HeroCarousel slides={heroSlides} />
      </EditableSection>

      {/* ── STATS BAR ──────────────────────────────────── */}
      <EditableSection sectionId="stats" data={{ items: statsItems }} label="Stats">
        <div className="bg-gold">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
            {statsItems.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="font-display text-2xl text-black">{s.num}</span>
                <span className="font-condensed text-[11px] tracking-widest uppercase text-black/70">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </EditableSection>

      {/* ── FEATURED TOURS ─────────────────────────────── */}
      <section id="tours" className="py-24 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="section-eyebrow mb-3">Our expeditions</p>
              <h2 className="font-display text-4xl md:text-5xl text-parchment">
                Featured <em className="text-gold">Tours</em>
              </h2>
            </div>
            <Link
              href="/tours"
              className="btn-outline-gold hidden md:inline-flex text-xs px-5 py-2.5"
            >
              All tours →
            </Link>
          </div>

          {featured.length === 0 ? (
            <p className="text-stone text-center py-12">No featured tours yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((tour: Tour, i: number) => (
                <EditableSection
                  key={tour.id}
                  sectionId={`tour:${tour.id}`}
                  data={tour as unknown as Record<string, unknown>}
                  label={tour.title}
                >
                  <TourCard tour={tour} index={i} />
                </EditableSection>
              ))}
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link href="/tours" className="btn-outline-gold">
              All tours →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SIDECAR RENTAL ─────────────────────────────── */}
      <section id="rentals" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-eyebrow mb-3">Self-guided freedom</p>
            <h2 className="font-display text-4xl md:text-5xl text-parchment">
              Rent a <em className="text-gold">Sidecar</em>
            </h2>
            <p className="text-stone mt-4 max-w-xl mx-auto leading-relaxed">
              Prefer to chart your own course? Our fleet of restored Soviet-era
              sidecars are fully serviced and ready. Set your own pace, choose
              your own roads — or lack thereof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {rentals.map((r: Rental) => (
              <EditableSection
                key={r.id}
                sectionId={`rental:${r.id}`}
                data={r as unknown as Record<string, unknown>}
                label={r.name}
              >
                <div className="card-dark group flex flex-col">
                  <div
                    className="h-44 flex items-center justify-center text-5xl relative overflow-hidden"
                    style={{ background: "var(--charcoal-mid)" }}
                  >
                    <span className="opacity-10">🏍</span>
                    <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-300" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <p className="section-eyebrow text-[10px] mb-1">Available now</p>
                    <h3 className="font-display text-xl text-parchment mb-2 group-hover:text-gold transition-colors">
                      {r.name}
                    </h3>
                    <p className="text-stone text-sm leading-relaxed mb-4 flex-1">
                      {r.description?.slice(0, 80)}…
                    </p>
                    <div className="gold-line mb-4" />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-condensed text-xs text-stone uppercase tracking-wider">
                          From{" "}
                        </span>
                        <span className="font-display text-2xl text-gold">
                          ${r.pricePerDay}
                        </span>
                        <span className="text-stone text-xs ml-1">/ day</span>
                      </div>
                      <Link
                        href={`/book?type=rental&rental=${r.id}`}
                        className="font-condensed text-xs tracking-widest uppercase text-gold border border-gold/40 px-3 py-1.5 group-hover:bg-gold group-hover:text-black transition-all duration-200"
                      >
                        Reserve →
                      </Link>
                    </div>
                  </div>
                </div>
              </EditableSection>
            ))}
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "🗺",
                title: "Route Planning",
                desc: "We map your route and brief you on must-see spots, fuel stops, and local tips.",
              },
              {
                icon: "🔧",
                title: "24/7 Roadside Assistance",
                desc: "Our mechanics are always on call. Breakdowns in the steppe won't leave you stranded.",
              },
              {
                icon: "⛺",
                title: "Camping Gear Included",
                desc: "Full camping kit — tent, sleeping bags, cooking equipment.",
              },
              {
                icon: "📡",
                title: "Satellite Communication",
                desc: "Each rental includes a satellite communicator for remote safety.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-5 border border-charcoal-light hover:border-gold/40 transition-colors"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <p className="font-condensed text-parchment tracking-wide mb-1 text-sm">
                    {f.title}
                  </p>
                  <p className="text-stone text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────── */}
      <EditableSection
        sectionId="about"
        data={{ about }}
        label="About Section"
      >
        <section
          id="about"
          className="py-24 relative overflow-hidden section-cream"
        >
          {/* Warm gold accent line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px opacity-30"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--gold), transparent)",
            }}
          />

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p
                  className="section-eyebrow mb-4"
                  style={{ color: "var(--gold)" }}
                >
                  Our story
                </p>
                <h2
                  className="font-display text-4xl md:text-5xl mb-6"
                  style={{ color: "var(--dark-brown)" }}
                >
                  {about.title}{" "}
                  <em className="text-gold">{about.titleEm}</em>
                </h2>
                <div
                  className="space-y-4 leading-relaxed"
                  style={{ color: "var(--ash)" }}
                >
                  {about.para1 && <p>{about.para1}</p>}
                  {about.para2 && <p>{about.para2}</p>}
                  {about.para3 && <p>{about.para3}</p>}
                </div>
                <div className="mt-8">
                  <Link href="/tours" className="btn-gold">
                    See Our Tours
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Locally Owned",
                    desc: "Proudly Mongolian, supporting local communities",
                    icon: "🇲🇳",
                  },
                  {
                    label: "Responsible Travel",
                    desc: "Low-impact, environmentally conscious operations",
                    icon: "🌿",
                  },
                  {
                    label: "Expert Guides",
                    desc: "Born and raised in the regions we explore",
                    icon: "🧭",
                  },
                  {
                    label: "Small Groups",
                    desc: "Max 8 guests — intimate, personal adventures",
                    icon: "👥",
                  },
                ].map((v) => (
                  <div
                    key={v.label}
                    className="p-5 hover:shadow-md transition-shadow"
                    style={{
                      border: "1px solid rgba(61,46,24,0.15)",
                      background: "rgba(255,255,255,0.5)",
                    }}
                  >
                    <span className="text-2xl mb-3 block">{v.icon}</span>
                    <div
                      className="w-6 h-0.5 mb-3"
                      style={{ background: "var(--gold)" }}
                    />
                    <p
                      className="font-condensed tracking-wide mb-2 text-sm"
                      style={{ color: "var(--dark-brown)" }}
                    >
                      {v.label}
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--ash)" }}
                    >
                      {v.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

      {/* ── BOOKING CTA ────────────────────────────────── */}
      <section id="contact" className="py-24 bg-charcoal relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-72 h-72 opacity-[0.06]"
          style={{
            background: "radial-gradient(circle at top left, var(--gold), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-72 h-72 opacity-[0.06]"
          style={{
            background: "radial-gradient(circle at bottom right, var(--gold), transparent 70%)",
          }}
        />

        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-4">Ready to ride?</p>
            <h2 className="font-display text-4xl md:text-6xl text-parchment mb-5">
              Start Your <em className="text-gold">Saga</em>
            </h2>
            <p className="text-stone text-lg leading-relaxed max-w-xl mx-auto">
              Have questions about a tour, want to customise a route, or just
              want to know if sidecars are right for you? We're here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="border border-charcoal-light p-8 hover:border-gold/50 transition-colors text-center">
              <div className="text-3xl mb-4">🏔</div>
              <h3 className="font-display text-xl text-parchment mb-2">
                Guided <em className="text-gold">Tour</em>
              </h3>
              <p className="text-stone text-sm leading-relaxed mb-6">
                Fully guided with accommodation, meals, and an expert local
                guide. Everything handled for you.
              </p>
              <Link href="/book?type=tour" className="btn-gold w-full justify-center">
                Book a Tour
              </Link>
            </div>
            <div className="border border-charcoal-light p-8 hover:border-gold/50 transition-colors text-center">
              <div className="text-3xl mb-4">🏍</div>
              <h3 className="font-display text-xl text-parchment mb-2">
                Sidecar <em className="text-gold">Rental</em>
              </h3>
              <p className="text-stone text-sm leading-relaxed mb-6">
                Self-guided freedom with route planning support, camping gear,
                and 24/7 roadside assistance.
              </p>
              <Link href="/book?type=rental" className="btn-outline-gold w-full justify-center">
                Reserve a Sidecar
              </Link>
            </div>
          </div>

          <div className="gold-line mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-stone text-sm">
            <a
              href="mailto:info@bktravel.mn"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <span>✉</span>
              <span>info@bktravel.mn</span>
            </a>
            <span className="hidden sm:block text-charcoal-light">|</span>
            <a
              href="tel:+97699001234"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <span>📞</span>
              <span>+976 9900 1234</span>
            </a>
            <span className="hidden sm:block text-charcoal-light">|</span>
            <span className="flex items-center gap-2">
              <span>📍</span>
              <span>Ulaanbaatar, Mongolia</span>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
