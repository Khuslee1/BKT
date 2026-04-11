import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import TourForm from "../_components/TourForm";

export default async function AdminTourEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tour = await prisma.tour.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!tour) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/tours"
          className="font-condensed text-xs tracking-widest uppercase text-ash hover:text-gold transition-colors block mb-3"
        >
          ← Back to Tours
        </Link>
        <p className="section-eyebrow mb-2">Edit</p>
        <h1 className="font-display text-3xl text-dark-brown">{tour.title}</h1>
        <p className="text-stone text-xs font-mono mt-1">{tour.slug}</p>
      </div>

      <TourForm
        initial={{
          id: tour.id,
          slug: tour.slug,
          title: tour.title,
          subtitle: tour.subtitle ?? "",
          description: tour.description ?? "",
          days: tour.days,
          price: tour.price,
          maxGroupSize: tour.maxGroupSize,
          type: tour.type,
          region: tour.region,
          difficulty: tour.difficulty,
          featured: tour.featured,
          published: tour.published,
          highlights: tour.highlights,
          includes: tour.includes,
          excludes: tour.excludes,
          images: tour.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt ?? "",
          })),
        }}
      />
    </div>
  );
}
