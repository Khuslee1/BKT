import Link from "next/link";
import { Tour } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/constants";

export default function TourCard({
  tour,
  index = 0,
}: {
  tour: Tour;
  index?: number;
}) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="card-dark group block overflow-hidden"
    >
      {/* Image placeholder */}
      <div className="relative h-52 bg-charcoal-mid overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-10">
          🏔
        </div>
        <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`text-[10px] font-condensed tracking-widest uppercase px-2.5 py-1 border ${DIFFICULTY_COLORS[tour.difficulty]}`}
          >
            {tour.difficulty}
          </span>
          {tour.featured && (
            <span className="text-[10px] font-condensed tracking-widest uppercase px-2.5 py-1 border border-gold/30 bg-gold/10 text-gold">
              Featured
            </span>
          )}
        </div>

        {/* Days */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 text-center">
          <div className="font-display text-gold text-lg leading-none">
            {tour.days}
          </div>
          <div className="font-condensed text-stone text-[9px] tracking-widest uppercase">
            days
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="section-eyebrow text-[10px] mb-2">
          {tour.region} · {tour.type}
        </p>
        <h3 className="font-display text-parchment text-xl mb-1 group-hover:text-gold transition-colors">
          {tour.title}
        </h3>
        <p className="text-stone text-sm leading-relaxed line-clamp-2 mb-4">
          {tour.subtitle ?? tour.summary}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {tour.highlights?.slice(0, 3).map((h) => (
            <span
              key={h}
              className="text-[10px] font-condensed uppercase tracking-wider text-stone border border-charcoal-light px-2 py-0.5"
            >
              {h}
            </span>
          ))}
        </div>

        <div className="gold-line mb-4" />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-stone text-xs font-condensed uppercase tracking-wider">
              From{" "}
            </span>
            <span className="font-display text-gold text-2xl">
              ${tour.price.toLocaleString()}
            </span>
            <span className="text-stone text-xs ml-1">/ person</span>
          </div>
          <span className="font-condensed text-xs tracking-[0.15em] uppercase text-gold border border-gold/40 px-3 py-1.5 group-hover:bg-gold group-hover:text-black transition-all duration-200">
            Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
