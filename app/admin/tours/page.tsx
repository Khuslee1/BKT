import { prisma } from "@/lib/prisma";
import Link from "next/link";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  moderate: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  challenging: "text-red-400 border-red-400/30 bg-red-400/5",
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
          <h1 className="font-display text-3xl text-parchment">Tours</h1>
        </div>
        <Link href="/admin/tours/new" className="btn-gold text-xs px-5 py-2.5">
          + New Tour
        </Link>
      </div>

      <div className="bg-charcoal border border-stone/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone/10">
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
                className="border-b border-stone/5 hover:bg-stone/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="text-sm text-parchment">{t.title}</p>
                  <p className="text-xs text-stone mt-0.5 font-mono">{t.slug}</p>
                </td>
                <td className="px-6 py-4 text-sm text-stone">{t.region}</td>
                <td className="px-6 py-4 text-sm text-stone">{t.days}d</td>
                <td className="px-6 py-4 text-sm text-gold font-display">
                  ${t.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`font-condensed text-[10px] tracking-widest uppercase px-2 py-1 border ${DIFFICULTY_COLORS[t.difficulty] ?? "text-stone border-stone/20"}`}
                  >
                    {t.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {t.published ? (
                      <span className="font-condensed text-[10px] tracking-widest uppercase px-2 py-0.5 border border-emerald-400/30 bg-emerald-400/5 text-emerald-400 w-fit">
                        Published
                      </span>
                    ) : (
                      <span className="font-condensed text-[10px] tracking-widest uppercase px-2 py-0.5 border border-stone/20 text-stone w-fit">
                        Draft
                      </span>
                    )}
                    {t.featured && (
                      <span className="font-condensed text-[10px] tracking-widest uppercase px-2 py-0.5 border border-gold/30 bg-gold/5 text-gold w-fit">
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
