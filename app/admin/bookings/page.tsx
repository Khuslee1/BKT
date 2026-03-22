import { BookingStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const bookings = await prisma.booking.findMany({
    where: status ? { status: status as BookingStatus } : {},
    orderBy: { createdAt: "desc" },
    include: {
      tour: { select: { title: true } },
      rental: { select: { name: true } },
    },
  });

  const statuses = [
    "all",
    "pending",
    "confirmed",
    "deposit_paid",
    "fully_paid",
    "cancelled",
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="section-eyebrow mb-2">Manage</p>
        <h1 className="font-display text-3xl text-parchment">Bookings</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map((s) => {
          const active = (s === "all" && !status) || s === status;
          return (
            <Link
              key={s}
              href={
                s === "all" ? "/admin/bookings" : `/admin/bookings?status=${s}`
              }
              className="px-4 py-1.5 font-condensed text-xs tracking-widest uppercase border transition-colors"
              style={{
                borderColor: active ? "var(--gold)" : "var(--stone)",
                color: active ? "var(--gold)" : "var(--stone)",
                background: active ? "rgba(201,151,42,0.08)" : "transparent",
              }}
            >
              {s.replace("_", " ")}
            </Link>
          );
        })}
      </div>

      <div className="bg-charcoal border border-stone/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone/10">
              {[
                "Guest",
                "Service",
                "Dates",
                "Group",
                "Total",
                "Status",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left font-condensed text-[10px] tracking-widest uppercase text-stone"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-stone text-sm"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-stone/5 hover:bg-stone/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm text-parchment">{b.guestName}</p>
                    <p className="text-xs text-stone">{b.guestEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone">
                    {b.tour?.title ?? b.rental?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-xs text-stone">
                    {new Date(b.startDate).toLocaleDateString()} →{" "}
                    {new Date(b.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-stone">
                    {b.groupSize}
                  </td>
                  <td className="px-6 py-4 text-sm text-gold">
                    ${b.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="font-condensed text-xs tracking-widest uppercase text-stone hover:text-gold transition-colors"
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
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    confirmed: "text-green-400 bg-green-400/10 border-green-400/20",
    deposit_paid: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    fully_paid: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return (
    <span
      className={`font-condensed text-[10px] tracking-widest uppercase px-2 py-1 border ${colors[status] ?? "text-stone border-stone/20"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
