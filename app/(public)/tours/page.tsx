import { prisma } from "@/lib/prisma";
import ToursClient from "./_components/ToursClients";

export default async function ToursPage() {
  const [tours, rentals] = await Promise.all([
    prisma.tour.findMany({
      where: { published: true },
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.rental.findMany({
      where: { available: true },
      orderBy: { pricePerDay: "asc" },
    }),
  ]);

  return <ToursClient tours={tours} rentals={rentals} />;
}
