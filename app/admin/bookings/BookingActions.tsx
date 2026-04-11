"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "rejected", "paid"] as const;

export default function BookingActions({
  bookingId,
  currentStatus,
  adminNotes,
}: {
  bookingId: string;
  currentStatus: string;
  adminNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus]   = useState(currentStatus);
  const [notes, setNotes]     = useState(adminNotes);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes: notes }),
    });

    setLoading(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    background: "var(--cream)",
    border: "1px solid rgba(61,46,24,0.15)",
    color: "var(--dark-brown)",
  };

  return (
    <div style={{ background: "var(--warm-white)", border: "1px solid rgba(61,46,24,0.1)" }}>
      <div
        className="px-6 py-4"
        style={{ borderBottom: "1px solid rgba(61,46,24,0.08)" }}
      >
        <h2 className="font-condensed text-sm tracking-widest uppercase text-dark-brown">
          Actions
        </h2>
      </div>
      <div className="p-6 flex flex-col gap-5">
        <div>
          <label
            className="block font-condensed text-[11px] tracking-widest uppercase mb-2"
            style={{ color: "var(--gold)" }}
          >
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
            style={inputStyle}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block font-condensed text-[11px] tracking-widest uppercase mb-2"
            style={{ color: "var(--gold)" }}
          >
            Admin Notes
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes, deposit details, follow-up reminders..."
            className="w-full px-4 py-3 text-sm outline-none focus:border-gold transition-colors resize-vertical"
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-gold disabled:opacity-40 self-start"
        >
          {loading ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
