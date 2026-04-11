import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookingStatus } from "@prisma/client";

const STATUS_COLORS: Record<string, string> = {
  pending:  "text-amber-700  border-amber-600/40  bg-amber-50",
  rejected: "text-red-600    border-red-500/40    bg-red-50",
  paid:     "text-emerald-700 border-emerald-600/40 bg-emerald-50",
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

  const cardStyle = {
    background: "var(--warm-white)",
    border: "1px solid rgba(61,46,24,0.1)",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="section-eyebrow mb-2">Welcome back</p>
        <h1 className="font-display text-3xl text-dark-brown">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-5"
            style={{
              background: "var(--warm-white)",
              border: `1px solid ${s.highlight ? "var(--gold)" : "rgba(61,46,24,0.1)"}`,
            }}
          >
            <p className="font-condensed text-[10px] tracking-widest uppercase text-stone mb-3">
              {s.label}
            </p>
            <p
              className="font-display text-3xl"
              style={{ color: s.highlight ? "var(--gold)" : "var(--dark-brown)" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Bookings section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-condensed text-sm tracking-widest uppercase text-dark-brown">
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
                  borderColor: active ? "var(--gold)" : "rgba(61,46,24,0.15)",
                  color:       active ? "var(--gold)" : "var(--ash)",
                  background:  active ? "rgba(201,144,42,0.08)" : "transparent",
                }}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {/* Table */}
        <div style={cardStyle}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(61,46,24,0.08)" }}>
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
                    style={{ borderBottom: "1px solid rgba(61,46,24,0.06)" }}
                    className="hover:bg-dark-brown/[0.03] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm text-dark-brown">{b.guestName}</p>
                      <p className="text-xs text-stone mt-0.5">{b.guestEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-ash">
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
                        className={`font-condensed text-[10px] tracking-widest uppercase px-2 py-1 border ${STATUS_COLORS[b.status] ?? "text-ash border-stone/20"}`}
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
