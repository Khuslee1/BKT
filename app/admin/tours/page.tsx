import { prisma } from "@/lib/prisma";
import Link from "next/link";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy:        "text-emerald-700 border-emerald-600/40 bg-emerald-50",
  moderate:    "text-amber-700   border-amber-600/40   bg-amber-50",
  challenging: "text-red-600     border-red-500/40     bg-red-50",
};

export default async function AdminToursPage() {
  const tours = await prisma.tour.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-eyebrow mb-2">Manage</p>
          <h1 className="font-display text-3xl text-dark-brown">Tours</h1>
        </div>
        <Link href="/admin/tours/new" className="btn-gold text-xs px-5 py-2.5">
          + New Tour
        </Link>
      </div>

      <div style={{ background: "var(--warm-white)", border: "1px solid rgba(61,46,24,0.1)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(61,46,24,0.08)" }}>
              {["Title", "Region", "Days", "Price", "Difficulty", "Status", ""].map((h) => (
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
            {tours.map((t) => (
              <tr
                key={t.id}
                style={{ borderBottom: "1px solid rgba(61,46,24,0.06)" }}
                className="hover:bg-dark-brown/[0.03] transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="text-sm text-dark-brown">{t.title}</p>
                  <p className="text-xs text-stone mt-0.5 font-mono">{t.slug}</p>
                </td>
                <td className="px-6 py-4 text-sm text-ash">{t.region}</td>
                <td className="px-6 py-4 text-sm text-ash">{t.days}d</td>
                <td className="px-6 py-4 text-sm font-display" style={{ color: "var(--gold)" }}>
                  ${t.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`font-condensed text-[10px] tracking-widest uppercase px-2 py-1 border ${DIFFICULTY_COLORS[t.difficulty] ?? "text-ash border-stone/20"}`}
                  >
                    {t.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {t.published ? (
                      <span className="font-condensed text-[10px] tracking-widest uppercase px-2 py-0.5 border border-emerald-600/40 bg-emerald-50 text-emerald-700 w-fit">
                        Published
                      </span>
                    ) : (
                      <span className="font-condensed text-[10px] tracking-widest uppercase px-2 py-0.5 border border-stone/30 text-stone w-fit">
                        Draft
                      </span>
                    )}
                    {t.featured && (
                      <span className="font-condensed text-[10px] tracking-widest uppercase px-2 py-0.5 border border-gold/40 bg-gold/5 text-gold w-fit">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/tours/${t.id}`}
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
