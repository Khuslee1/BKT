import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookingStatus } from "@/generated/prisma/enums";

const STATUS_COLORS: Record<string, string> = {
  pending:  "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
  rejected: "text-red-400    border-red-400/30    bg-red-400/5",
  paid:     "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
};

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const [totalBookings, pendingCount, revenueAgg, bookings] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.aggregate({ _sum: { totalPrice: true } }),
    prisma.booking.findMany({
      where: status ? { status: status as BookingStatus } : {},
      orderBy: { createdAt: "desc" },
      include: {
        tour:   { select: { title: true } },
        rental: { select: { name: true } },
      },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.totalPrice ?? 0;

  const stats = [
    { label: "Total Bookings", value: totalBookings },
    { label: "Pending Review", value: pendingCount, highlight: true },
    { label: "Total Revenue",  value: `$${totalRevenue.toLocaleString()}` },
  ];

  const statusFilters = [
    { key: "",         label: "All" },
    { key: "pending",  label: "Pending" },
    { key: "rejected", label: "Rejected" },
    { key: "paid",     label: "Paid" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="section-eyebrow mb-2">Welcome back</p>
        <h1 className="font-display text-3xl text-parchment">
          Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-5"
            style={{
              background: "var(--charcoal)",
              border: `1px solid ${s.highlight ? "var(--gold)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <p className="font-condensed text-[10px] tracking-widest uppercase text-stone mb-3">
              {s.label}
            </p>
            <p
              className="font-display text-3xl"
              style={{ color: s.highlight ? "var(--gold)" : "var(--parchment)" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Bookings section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-condensed text-sm tracking-widest uppercase text-parchment">
            Bookings
          </h2>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {statusFilters.map((f) => {
            const active = f.key === (status ?? "");
            return (
              <Link
                key={f.key}
                href={f.key ? `/admin?status=${f.key}` : "/admin"}
                className="px-4 py-1.5 font-condensed text-xs tracking-widest uppercase border transition-all"
                style={{
                  borderColor: active ? "var(--gold)" : "rgba(255,255,255,0.08)",
                  color:       active ? "var(--gold)" : "var(--stone)",
                  background:  active ? "rgba(201,144,42,0.08)" : "transparent",
                }}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {/* Table */}
        <div style={{ background: "var(--charcoal)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Guest", "Service", "Dates", "Group", "Total", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left font-condensed text-[10px] tracking-widest uppercase text-stone"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-stone text-sm">
                    No bookings {status ? `with status "${status.replace("_", " ")}"` : "yet"}.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr
                    key={b.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm text-parchment">{b.guestName}</p>
                      <p className="text-xs text-stone mt-0.5">{b.guestEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-stone">
                      {b.tour?.title ?? b.rental?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-xs text-stone">
                      {new Date(b.startDate).toLocaleDateString()} →{" "}
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-stone">{b.groupSize}</td>
                    <td className="px-5 py-4 text-sm font-display" style={{ color: "var(--gold)" }}>
                      ${b.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-condensed text-[10px] tracking-widest uppercase px-2 py-1 border ${STATUS_COLORS[b.status] ?? "text-stone border-stone/20"}`}
                      >
                        {b.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="font-condensed text-[10px] tracking-widest uppercase text-stone hover:text-gold transition-colors"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
