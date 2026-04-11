import Link from "next/link";
import { notFound } from "next/navigation";
import { Tour } from "@/lib/types";

async function getTour(slug: string): Promise<Tour | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tours/${slug}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  return res.json();
}

function blobSrc(url: string) {
  return `/api/blob-image?url=${encodeURIComponent(url)}`;
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
  const galleryImages = tour.images?.slice(1, 5) ?? [];

  return (
    <main className="min-h-screen" style={{ background: "var(--warm-white)" }}>
      {/* ── HERO ── */}
      <section className="relative h-[60vh] min-h-[480px] flex items-end">
        {primaryImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={blobSrc(primaryImage.url)}
            alt={primaryImage.alt ?? tour.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "var(--parchment)" }}
          />
        )}
        {/* gradient fades into warm-white */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(245,235,206,1) 0%, rgba(245,235,206,0.6) 40%, rgba(0,0,0,0.4) 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pb-12 w-full">
          <Link
            href="/tours"
            className="font-condensed text-xs tracking-widest uppercase block mb-6 transition-colors hover:text-gold"
            style={{ color: "var(--dark-brown)" }}
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
              style={{ color: "var(--dark-brown)" }}
            >
              {tour.days} days · {tour.region}
            </span>
          </div>
          <h1
            className="font-display text-5xl md:text-6xl"
            style={{ color: "var(--dark-brown)" }}
          >
            {tour.title}
          </h1>
          {tour.subtitle && (
            <p
              className="mt-2 font-condensed text-sm tracking-wide"
              style={{ color: "var(--ash)" }}
            >
              {tour.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ── BODY + STICKY BOOKING PANEL ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: details */}
          <div className="lg:col-span-2 flex flex-col gap-10">

            {/* Description */}
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--ash)" }}
            >
              {(tour as unknown as { description?: string }).description ?? tour.summary}
            </p>

            {/* Image gallery */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((img, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={i}
                    src={blobSrc(img.url)}
                    alt={img.alt ?? `${tour.title} ${i + 2}`}
                    className="w-full aspect-video object-cover"
                    style={{ border: "1px solid rgba(61,46,24,0.08)" }}
                  />
                ))}
              </div>
            )}

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div>
                <h2
                  className="font-condensed text-sm tracking-widest uppercase mb-4"
                  style={{ color: "var(--dark-brown)" }}
                >
                  Highlights
                </h2>
                <ul className="flex flex-col gap-2">
                  {tour.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span style={{ color: "var(--gold)" }}>—</span>
                      <span className="text-sm" style={{ color: "var(--ash)" }}>
                        {h}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Includes / Excludes */}
            {((tour.includes && tour.includes.length > 0) ||
              (tour.excludes && tour.excludes.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tour.includes && tour.includes.length > 0 && (
                  <div>
                    <h2
                      className="font-condensed text-sm tracking-widest uppercase mb-4"
                      style={{ color: "var(--dark-brown)" }}
                    >
                      Included
                    </h2>
                    <ul className="flex flex-col gap-2">
                      {tour.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span style={{ color: "var(--gold)" }}>✓</span>
                          <span className="text-sm" style={{ color: "var(--ash)" }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excludes && tour.excludes.length > 0 && (
                  <div>
                    <h2
                      className="font-condensed text-sm tracking-widest uppercase mb-4"
                      style={{ color: "var(--dark-brown)" }}
                    >
                      Not Included
                    </h2>
                    <ul className="flex flex-col gap-2">
                      {tour.excludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span style={{ color: "var(--stone)" }}>✕</span>
                          <span className="text-sm" style={{ color: "var(--ash)" }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: sticky booking panel */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-28 p-6 flex flex-col gap-5"
              style={{
                background: "var(--cream)",
                border: "1px solid rgba(61,46,24,0.12)",
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
                style={{ color: "var(--ash)" }}
              >
                <div className="flex justify-between">
                  <span className="font-condensed text-xs tracking-wider uppercase">
                    Duration
                  </span>
                  <span style={{ color: "var(--dark-brown)" }}>
                    {tour.days} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-condensed text-xs tracking-wider uppercase">
                    Region
                  </span>
                  <span style={{ color: "var(--dark-brown)" }}>
                    {tour.region}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-condensed text-xs tracking-wider uppercase">
                    Difficulty
                  </span>
                  <span style={{ color: "var(--dark-brown)" }}>
                    {tour.difficulty}
                  </span>
                </div>
                {tour.maxGroupSize && (
                  <div className="flex justify-between">
                    <span className="font-condensed text-xs tracking-wider uppercase">
                      Group Size
                    </span>
                    <span style={{ color: "var(--dark-brown)" }}>
                      Max {tour.maxGroupSize}
                    </span>
                  </div>
                )}
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
