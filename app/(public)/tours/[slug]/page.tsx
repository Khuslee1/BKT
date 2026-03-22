import Link from "next/link";
import { notFound } from "next/navigation";
import { Tour } from "@/lib/types";

async function getTour(slug: string): Promise<Tour | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tours/${slug}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (!tour) notFound();

  const primaryImage = tour.images?.[0];

  return (
    <main className="min-h-screen" style={{ background: "var(--black)" }}>
      {/* ── HERO ── */}
      <section className="relative h-[60vh] min-h-[480px] flex items-end">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={tour.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "var(--charcoal)" }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--black) 30%, transparent 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pb-12 w-full">
          <Link
            href="/tours"
            className="font-condensed text-xs tracking-widest uppercase block mb-6 transition-colors"
            style={{ color: "var(--stone)" }}
          >
            ← All Tours
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span
              className="font-condensed text-xs tracking-widest uppercase px-3 py-1 border"
              style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            >
              {tour.difficulty}
            </span>
            <span
              className="font-condensed text-xs tracking-wider uppercase"
              style={{ color: "var(--stone)" }}
            >
              {tour.days} days · {tour.region}
            </span>
          </div>
          <h1
            className="font-display text-5xl md:text-6xl"
            style={{ color: "var(--parchment)" }}
          >
            {tour.title}
          </h1>
        </div>
      </section>

      {/* ── BODY + STICKY BOOKING PANEL ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: details */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--stone)" }}
            >
              {tour.summary}
            </p>

            {/* Image gallery */}
            {tour.images && tour.images.length > 1 && (
              <div className="grid grid-cols-2 gap-3">
                {tour.images.slice(1, 5).map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`${tour.title} ${i + 2}`}
                    className="w-full aspect-video object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: sticky booking panel */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-28 p-6 flex flex-col gap-5"
              style={{
                border: "1px solid var(--charcoal-light)",
                background: "var(--charcoal)",
              }}
            >
              <div>
                <p
                  className="font-condensed text-xs tracking-widest uppercase mb-1"
                  style={{ color: "var(--stone)" }}
                >
                  From
                </p>
                <p
                  className="font-display text-4xl"
                  style={{ color: "var(--gold)" }}
                >
                  ${tour.price.toLocaleString()}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--stone)" }}>
                  per person
                </p>
              </div>

              <div className="gold-line" />

              <div
                className="flex flex-col gap-2 text-sm"
                style={{ color: "var(--stone)" }}
              >
                <div className="flex justify-between">
                  <span className="font-condensed text-xs tracking-wider uppercase">
                    Duration
                  </span>
                  <span style={{ color: "var(--parchment)" }}>
                    {tour.days} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-condensed text-xs tracking-wider uppercase">
                    Region
                  </span>
                  <span style={{ color: "var(--parchment)" }}>
                    {tour.region}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-condensed text-xs tracking-wider uppercase">
                    Difficulty
                  </span>
                  <span style={{ color: "var(--parchment)" }}>
                    {tour.difficulty}
                  </span>
                </div>
              </div>

              <Link
                href={`/book?type=tour&tour=${tour.slug}`}
                className="btn-gold text-center w-full"
              >
                Book This Tour
              </Link>

              <Link
                href="/book"
                className="btn-outline-gold text-center w-full text-xs"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
