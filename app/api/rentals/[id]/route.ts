import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const rental = await prisma.rental.findUnique({ where: { id } });

    if (!rental) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 });
    }

    return NextResponse.json(rental);
  } catch (error) {
    console.error("[GET /api/rentals/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch rental" }, { status: 500 });
  }
}
