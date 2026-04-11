import Link from "next/link";
import { notFound } from "next/navigation";
import { Rental } from "@/lib/types";

async function getRental(id: string): Promise<Rental | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/rentals/${id}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  return res.json();
}

function blobSrc(url: string) {
  return `/api/blob-image?url=${encodeURIComponent(url)}`;
}

const VEHICLE_LABELS: Record<string, string> = {
  ural_sidecar: "Ural Sidecar",
  dnepr_sidecar: "Dnepr Sidecar",
  solo_bike: "Solo Bike",
};

export default async function RentalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rental = await getRental(id);

  if (!rental) notFound();

  const primaryImage = rental.images?.[0];
  const galleryImages = rental.images?.slice(1, 5) ?? [];
  const specs = (rental.specs ?? {}) as Record<string, string>;
  const hasSpecs = Object.keys(specs).length > 0;

  return (
    <main className="min-h-screen" style={{ background: "var(--warm-white)" }}>
      {/* ── HERO ── */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blobSrc(primaryImage)}
            alt={rental.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-8xl"
            style={{ background: "var(--parchment)", opacity: 0.4 }}
          >
            🏍
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(245,235,206,1) 0%, rgba(245,235,206,0.5) 40%, rgba(0,0,0,0.3) 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pb-12 w-full">
          <Link
            href="/tours"
            className="font-condensed text-xs tracking-widest uppercase block mb-6 transition-colors hover:text-gold"
            style={{ color: "var(--dark-brown)" }}
          >
            ← All Rentals & Tours
          </Link>
          <div className="flex items-center gap-3 mb-3">
            {rental.type && (
              <span
                className="font-condensed text-xs tracking-widest uppercase px-3 py-1 border"
                style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
              >
                {VEHICLE_LABELS[rental.type] ?? rental.type}
              </span>
            )}
            {rental.available !== false && (
              <span
                className="font-condensed text-xs tracking-wider uppercase"
                style={{ color: "var(--dark-brown)" }}
              >
                Available now
              </span>
            )}
          </div>
          <h1
            className="font-display text-5xl md:text-6xl"
            style={{ color: "var(--dark-brown)" }}
          >
            {rental.name}
          </h1>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: details */}
          <div className="lg:col-span-2 flex flex-col gap-10">

            {/* Description */}
            <p className="text-base leading-relaxed" style={{ color: "var(--ash)" }}>
              {rental.description}
            </p>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={blobSrc(url)}
                    alt={`${rental.name} ${i + 2}`}
                    className="w-full aspect-video object-cover"
                    style={{ border: "1px solid rgba(61,46,24,0.08)" }}
                  />
                ))}
              </div>
            )}

            {/* Specs */}
            {hasSpecs && (
              <div>
                <h2
                  className="font-condensed text-sm tracking-widest uppercase mb-4"
                  style={{ color: "var(--dark-brown)" }}
                >
                  Specifications
                </h2>
                <div
                  className="divide-y overflow-hidden"
                  style={{ border: "1px solid rgba(61,46,24,0.1)" }}
                >
                  {Object.entries(specs).map(([key, val], idx) => (
                    <div
                      key={key}
                      className="flex justify-between items-center px-5 py-3 text-sm"
                      style={{
                        background: idx % 2 === 0 ? "var(--cream)" : "var(--warm-white)",
                      }}
                    >
                      <span
                        className="font-condensed text-xs tracking-wider uppercase"
                        style={{ color: "var(--stone)" }}
                      >
                        {key}
                      </span>
                      <span style={{ color: "var(--dark-brown)" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's included */}
            <div>
              <h2
                className="font-condensed text-sm tracking-widest uppercase mb-4"
                style={{ color: "var(--dark-brown)" }}
              >
                Every Rental Includes
              </h2>
              <ul className="flex flex-col gap-2">
                {[
                  "Route planning & briefing",
                  "Camping gear (tent, sleeping bag, cooking kit)",
                  "Satellite communicator",
                  "24/7 roadside assistance",
                  "Basic tool kit & spare parts",
                  "Liability insurance",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span style={{ color: "var(--gold)" }}>✓</span>
                    <span className="text-sm" style={{ color: "var(--ash)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
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
                <p className="font-display text-4xl" style={{ color: "var(--gold)" }}>
                  ${rental.pricePerDay}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--stone)" }}>
                  per day
                </p>
              </div>

              <div className="gold-line" />

              <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--ash)" }}>
                {rental.type && (
                  <div className="flex justify-between">
                    <span className="font-condensed text-xs tracking-wider uppercase">Type</span>
                    <span style={{ color: "var(--dark-brown)" }}>
                      {VEHICLE_LABELS[rental.type] ?? rental.type}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-condensed text-xs tracking-wider uppercase">Availability</span>
                  <span style={{ color: rental.available !== false ? "#16a34a" : "var(--stone)" }}>
                    {rental.available !== false ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-condensed text-xs tracking-wider uppercase">Min. rental</span>
                  <span style={{ color: "var(--dark-brown)" }}>3 days</span>
                </div>
              </div>

              <Link
                href={`/book?type=rental&rental=${rental.id}`}
                className="btn-gold text-center w-full"
              >
                Reserve This Vehicle
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
