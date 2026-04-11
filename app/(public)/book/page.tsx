"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tour, Rental } from "@/lib/types";

interface FormData {
  serviceType: "tour" | "rental";
  tourId: string;
  rentalId: string;
  startDate: string;
  endDate: string;
  groupSize: string;
  ridingExperience: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  nationality: string;
  specialRequests: string;
  agreedToTerms: boolean;
}

const STEPS = ["Service", "Dates", "Your details", "Confirm"];

// ── shared styles ──
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  fontSize: "14px",
  background: "var(--cream)",
  border: "1px solid rgba(61,46,24,0.15)",
  color: "var(--dark-brown)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "Barlow Condensed, sans-serif",
  fontSize: "11px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "var(--gold)",
  marginBottom: "8px",
};

function BookingForm() {
  const searchParams = useSearchParams();
  const tourSlug = searchParams.get("tour") ?? "";
  const typeParam = searchParams.get("type") ?? "tour";
  const rentalParam = searchParams.get("rental") ?? "";

  const [tours, setTours] = useState<Tour[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    fetch("/api/tours")
      .then((r) => r.json())
      .then((data) => setTours(Array.isArray(data) ? data : (data.tours ?? [])))
      .catch(() => {});
    fetch("/api/rentals")
      .then((r) => r.json())
      .then((data) =>
        setRentals(Array.isArray(data) ? data : (data.rentals ?? [])),
      )
      .catch(() => {});
  }, []);

  const preselectedTour = tours.find((t) => t.slug === tourSlug);
  const preselectedRental = rentals.find((r) => r.id === rentalParam);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    serviceType: typeParam === "rental" ? "rental" : "tour",
    tourId: "",
    rentalId: "",
    startDate: "",
    endDate: "",
    groupSize: "1",
    ridingExperience: "beginner",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    nationality: "",
    specialRequests: "",
    agreedToTerms: false,
  });

  useEffect(() => {
    if (preselectedTour) setForm((p) => ({ ...p, tourId: preselectedTour.id }));
  }, [preselectedTour?.id]);

  useEffect(() => {
    if (preselectedRental)
      setForm((p) => ({ ...p, rentalId: preselectedRental.id }));
  }, [preselectedRental?.id]);

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const selectedTour = tours.find((t) => t.id === form.tourId);
  const selectedRental = rentals.find((r) => r.id === form.rentalId);

  const calcPrice = () => {
    if (form.serviceType === "tour" && selectedTour) {
      return selectedTour.price * Number(form.groupSize);
    }
    if (
      form.serviceType === "rental" &&
      selectedRental &&
      form.startDate &&
      form.endDate
    ) {
      const days = Math.max(
        1,
        Math.ceil(
          (new Date(form.endDate).getTime() -
            new Date(form.startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );
      return selectedRental.pricePerDay * days;
    }
    return 0;
  };

  const totalPrice = calcPrice();

  const canProceed = () => {
    if (step === 1)
      return form.serviceType === "tour" ? !!form.tourId : !!form.rentalId;
    if (step === 2) return !!form.startDate && !!form.endDate;
    if (step === 3)
      return !!form.guestName && !!form.guestEmail && !!form.nationality;
    return true;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const nameParts = form.guestName.trim().split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || nameParts[0];

    const extras = [
      form.nationality ? `Nationality: ${form.nationality}` : null,
      form.ridingExperience ? `Riding experience: ${form.ridingExperience}` : null,
      form.specialRequests || null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(form.serviceType === "tour"
            ? { tourId: form.tourId }
            : { rentalId: form.rentalId }),
          firstName,
          lastName,
          email: form.guestEmail,
          phone: form.guestPhone || undefined,
          startDate: form.startDate,
          endDate: form.endDate,
          groupSize: Number(form.groupSize),
          ridingExperience: form.ridingExperience,
          nationality: form.nationality,
          specialRequests: extras || undefined,
          totalPrice,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── success screen ──
  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "var(--warm-white)" }}
      >
        <div className="max-w-md text-center">
          <div
            className="w-16 h-16 border mx-auto flex items-center justify-center mb-8"
            style={{ borderColor: "var(--gold)" }}
          >
            <span className="text-2xl" style={{ color: "var(--gold)" }}>✓</span>
          </div>
          <h2 className="font-display text-4xl mb-4" style={{ color: "var(--dark-brown)" }}>
            Request Sent
          </h2>
          <p className="leading-relaxed mb-2" style={{ color: "var(--ash)" }}>
            Thank you,{" "}
            <span style={{ color: "var(--dark-brown)" }}>{form.guestName}</span>.
            We've received your booking request and will confirm within 24 hours.
          </p>
          <p className="text-sm mb-8" style={{ color: "var(--ash)" }}>
            Check your inbox at{" "}
            <span style={{ color: "var(--gold)" }}>{form.guestEmail}</span>
          </p>
          <div className="gold-line mb-8" />
          <Link href="/tours" className="btn-outline-gold">
            Explore More Tours
          </Link>
        </div>
      </div>
    );
  }

  const borderInactive = "rgba(61,46,24,0.15)";

  return (
    <main className="min-h-screen" style={{ background: "var(--warm-white)" }}>
      {/* ── HEADER ── */}
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-6">
          <Link
            href="/tours"
            className="font-condensed text-xs tracking-widest uppercase block mb-8 transition-colors hover:text-gold"
            style={{ color: "var(--ash)" }}
          >
            ← Back to Tours
          </Link>
          <p className="section-eyebrow mb-3">Reserve your adventure</p>
          <h1 className="font-display text-4xl mb-10" style={{ color: "var(--dark-brown)" }}>
            Book Your <em style={{ color: "var(--gold)" }}>Expedition</em>
          </h1>

          {/* Step indicator */}
          <div className="flex items-center mb-12">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 border flex items-center justify-center font-condensed text-xs transition-all"
                    style={{
                      borderColor: i + 1 <= step ? "var(--gold)" : borderInactive,
                      background: i + 1 < step ? "var(--gold)" : "transparent",
                      color:
                        i + 1 < step
                          ? "var(--black)"
                          : i + 1 === step
                            ? "var(--gold)"
                            : "var(--stone)",
                    }}
                  >
                    {i + 1 < step ? "✓" : i + 1}
                  </div>
                  <span
                    className="font-condensed text-[10px] tracking-wider uppercase mt-1.5"
                    style={{ color: i + 1 === step ? "var(--gold)" : "var(--stone)" }}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px mx-3 mb-5 transition-colors"
                    style={{ background: i + 1 < step ? "var(--gold)" : borderInactive }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ── */}
      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto px-6 pb-24">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <p style={labelStyle}>What are you looking for?</p>
                <div className="grid grid-cols-2 gap-4">
                  {(["tour", "rental"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => set("serviceType", type)}
                      className="p-5 text-left transition-all"
                      style={{
                        border: `1px solid ${form.serviceType === type ? "var(--gold)" : borderInactive}`,
                        background:
                          form.serviceType === type
                            ? "rgba(201,144,42,0.06)"
                            : "var(--cream)",
                      }}
                    >
                      <p
                        className="font-condensed tracking-wider uppercase mb-1"
                        style={{ color: "var(--dark-brown)" }}
                      >
                        {type === "tour" ? "Guided Tour" : "Sidecar Rental"}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--ash)" }}>
                        {type === "tour"
                          ? "Fully guided with accommodation & meals"
                          : "Self-guided with route planning support"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {form.serviceType === "tour" && (
                <div>
                  <p style={labelStyle}>Select a tour</p>
                  <div className="flex flex-col gap-3">
                    {tours.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => set("tourId", t.id)}
                        className="w-full p-4 text-left flex items-center justify-between transition-all"
                        style={{
                          border: `1px solid ${form.tourId === t.id ? "var(--gold)" : borderInactive}`,
                          background:
                            form.tourId === t.id
                              ? "rgba(201,144,42,0.06)"
                              : "var(--cream)",
                        }}
                      >
                        <div>
                          <p className="font-condensed tracking-wide" style={{ color: "var(--dark-brown)" }}>
                            {t.title}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--ash)" }}>
                            {t.days} days · {t.region}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-display text-lg" style={{ color: "var(--gold)" }}>
                            ${t.price.toLocaleString()}
                          </p>
                          <p className="text-[10px]" style={{ color: "var(--stone)" }}>
                            per person
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {form.serviceType === "rental" && (
                <div>
                  <p style={labelStyle}>Select a vehicle</p>
                  <div className="flex flex-col gap-3">
                    {rentals.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => set("rentalId", r.id)}
                        className="w-full p-4 text-left flex items-center justify-between transition-all"
                        style={{
                          border: `1px solid ${form.rentalId === r.id ? "var(--gold)" : borderInactive}`,
                          background:
                            form.rentalId === r.id
                              ? "rgba(201,144,42,0.06)"
                              : "var(--cream)",
                        }}
                      >
                        <div>
                          <p className="font-condensed tracking-wide" style={{ color: "var(--dark-brown)" }}>
                            {r.name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--ash)" }}>
                            {r.description.slice(0, 55)}…
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-display text-lg" style={{ color: "var(--gold)" }}>
                            ${r.pricePerDay}
                          </p>
                          <p className="text-[10px]" style={{ color: "var(--stone)" }}>
                            per day
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceed()}
                  className="btn-gold disabled:opacity-40"
                >
                  Next: Choose Dates →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label style={labelStyle}>Start date</label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => set("startDate", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    {form.serviceType === "rental" ? "Return date" : "End date"}
                  </label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => set("endDate", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {form.serviceType === "tour" && (
                <div>
                  <label style={labelStyle}>Group size</label>
                  <select
                    value={form.groupSize}
                    onChange={(e) => set("groupSize", e.target.value)}
                    style={inputStyle}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "person" : "people"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={labelStyle}>Riding experience</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["beginner", "intermediate", "experienced"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => set("ridingExperience", lvl)}
                      className="p-3 text-center font-condensed text-xs tracking-wider uppercase transition-all"
                      style={{
                        border: `1px solid ${form.ridingExperience === lvl ? "var(--gold)" : borderInactive}`,
                        background:
                          form.ridingExperience === lvl
                            ? "rgba(201,144,42,0.06)"
                            : "var(--cream)",
                        color:
                          form.ridingExperience === lvl
                            ? "var(--gold)"
                            : "var(--ash)",
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {totalPrice > 0 && (
                <div
                  className="p-4 border-l-2 flex items-center justify-between"
                  style={{
                    borderColor: "var(--gold)",
                    background: "var(--cream)",
                    border: "1px solid rgba(61,46,24,0.12)",
                    borderLeft: "3px solid var(--gold)",
                  }}
                >
                  <span
                    className="font-condensed text-xs tracking-wider uppercase"
                    style={{ color: "var(--ash)" }}
                  >
                    Estimated total
                  </span>
                  <span className="font-display text-2xl" style={{ color: "var(--gold)" }}>
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-outline-gold text-xs">
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceed()}
                  className="btn-gold disabled:opacity-40"
                >
                  Next: Your Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label style={labelStyle}>Full name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={form.guestName}
                    onChange={(e) => set("guestName", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={form.guestEmail}
                    onChange={(e) => set("guestEmail", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label style={labelStyle}>Phone (optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 000 000 0000"
                    value={form.guestPhone}
                    onChange={(e) => set("guestPhone", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nationality</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. German"
                    value={form.nationality}
                    onChange={(e) => set("nationality", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Special requests or questions</label>
                <textarea
                  rows={4}
                  placeholder="Dietary requirements, custom route ideas, questions..."
                  value={form.specialRequests}
                  onChange={(e) => set("specialRequests", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(2)} className="btn-outline-gold text-xs">
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!canProceed()}
                  className="btn-gold disabled:opacity-40"
                >
                  Review Booking →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <div
                className="mb-6 overflow-hidden"
                style={{ border: "1px solid rgba(61,46,24,0.12)" }}
              >
                <div
                  className="px-6 py-4 border-b"
                  style={{
                    borderColor: "rgba(61,46,24,0.12)",
                    background: "var(--cream)",
                  }}
                >
                  <p className="section-eyebrow">Booking summary</p>
                </div>
                <div>
                  {[
                    {
                      label: "Service",
                      value:
                        form.serviceType === "tour"
                          ? (selectedTour?.title ?? "—")
                          : (selectedRental?.name ?? "—"),
                    },
                    { label: "Dates", value: `${form.startDate} → ${form.endDate}` },
                    { label: "Group size", value: `${form.groupSize} person(s)` },
                    { label: "Experience", value: form.ridingExperience },
                    { label: "Name", value: form.guestName },
                    { label: "Email", value: form.guestEmail },
                    { label: "Nationality", value: form.nationality },
                  ].map((row, idx) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-start px-6 py-3 text-sm"
                      style={{
                        borderTop: idx > 0 ? "1px solid rgba(61,46,24,0.08)" : undefined,
                        background: "var(--warm-white)",
                      }}
                    >
                      <span
                        className="font-condensed text-xs tracking-wider uppercase"
                        style={{ color: "var(--stone)" }}
                      >
                        {row.label}
                      </span>
                      <span className="text-right max-w-[60%]" style={{ color: "var(--dark-brown)" }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                  <div
                    className="flex justify-between items-center px-6 py-4"
                    style={{
                      background: "var(--cream)",
                      borderTop: "1px solid rgba(61,46,24,0.12)",
                    }}
                  >
                    <span
                      className="font-condensed text-xs tracking-wider uppercase"
                      style={{ color: "var(--ash)" }}
                    >
                      Estimated total
                    </span>
                    <span className="font-display text-2xl" style={{ color: "var(--gold)" }}>
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {form.specialRequests && (
                <div
                  className="p-4 mb-6 text-sm italic"
                  style={{
                    background: "var(--cream)",
                    border: "1px solid rgba(61,46,24,0.12)",
                    color: "var(--ash)",
                  }}
                >
                  "{form.specialRequests}"
                </div>
              )}

              <div className="flex items-start gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => set("agreedToTerms", !form.agreedToTerms)}
                  className="mt-0.5 w-5 h-5 border flex-shrink-0 flex items-center justify-center transition-colors"
                  style={{
                    borderColor: form.agreedToTerms ? "var(--gold)" : "rgba(61,46,24,0.3)",
                    background: form.agreedToTerms ? "var(--gold)" : "transparent",
                  }}
                >
                  {form.agreedToTerms && (
                    <span style={{ color: "var(--black)", fontSize: "11px" }}>✓</span>
                  )}
                </button>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ash)" }}>
                  I understand this is a booking <em>request</em>. BKT will confirm
                  availability and send a deposit link within 24 hours. I agree to the{" "}
                  <Link href="#" style={{ color: "var(--gold)" }}>
                    terms and conditions
                  </Link>
                  .
                </p>
              </div>

              {error && (
                <div
                  className="mb-6 px-4 py-3 text-sm border"
                  style={{
                    borderColor: "rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.05)",
                    color: "#dc2626",
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(3)} className="btn-outline-gold text-xs">
                  ← Edit Details
                </button>
                <button
                  type="submit"
                  disabled={!form.agreedToTerms || loading}
                  className="btn-gold disabled:opacity-40"
                >
                  {loading ? "Sending…" : "Send Booking Request ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense>
      <BookingForm />
    </Suspense>
  );
}
