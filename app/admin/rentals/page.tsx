import { prisma } from "@/lib/prisma";
import Link from "next/link";

const TYPE_LABELS: Record<string, string> = {
  ural_sidecar:  "Ural Sidecar",
  dnepr_sidecar: "Dnepr Sidecar",
  solo_bike:     "Solo Bike",
};

export default async function AdminRentalsPage() {
  const rentals = await prisma.rental.findMany({ orderBy: { pricePerDay: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-eyebrow mb-2">Edit Content</p>
          <h1 className="font-display text-3xl text-parchment">Sidecar Rentals</h1>
        </div>
        <Link href="/admin/rentals/new" className="btn-gold text-xs px-5 py-2.5">
          + New Rental
        </Link>
      </div>

      <div style={{ background: "var(--charcoal)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Vehicle", "Type", "Price / Day", "Status", ""].map((h) => (
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
            {rentals.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-white/[0.02] transition-colors"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <td className="px-6 py-4">
                  <p className="text-sm text-parchment">{r.name}</p>
                  <p className="text-xs text-stone mt-0.5 line-clamp-1">
                    {r.description.slice(0, 60)}…
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-stone">
                  {TYPE_LABELS[r.type] ?? r.type}
                </td>
                <td className="px-6 py-4 font-display text-gold">
                  ${r.pricePerDay}
                </td>
                <td className="px-6 py-4">
                  {r.available ? (
                    <span className="font-condensed text-[10px] tracking-widest uppercase px-2 py-1 border border-emerald-400/30 bg-emerald-400/5 text-emerald-400">
                      Available
                    </span>
                  ) : (
                    <span className="font-condensed text-[10px] tracking-widest uppercase px-2 py-1 border border-stone/20 text-stone">
                      Unavailable
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/rentals/${r.id}`}
                    className="font-condensed text-[10px] tracking-widest uppercase text-stone hover:text-gold transition-colors"
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
