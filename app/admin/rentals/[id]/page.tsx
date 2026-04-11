import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import RentalForm from "../_components/RentalForm";

export default async function AdminRentalEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rental = await prisma.rental.findUnique({ where: { id } });
  if (!rental) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/rentals"
          className="font-condensed text-xs tracking-widest uppercase text-ash hover:text-gold transition-colors block mb-3"
        >
          ← Back to Rentals
        </Link>
        <p className="section-eyebrow mb-2">Edit</p>
        <h1 className="font-display text-3xl text-dark-brown">{rental.name}</h1>
      </div>

      <RentalForm
        initial={{
          id:          rental.id,
          name:        rental.name,
          type:        rental.type,
          description: rental.description,
          pricePerDay: rental.pricePerDay,
          available:   rental.available,
          specs:       (rental.specs as Record<string, string>) ?? {},
          images:      rental.images,
        }}
      />
    </div>
  );
}
