import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rentals = await prisma.rental.findMany({
      orderBy: { pricePerDay: "asc" },
    });

    return NextResponse.json(rentals);
  } catch (error) {
    console.error("[GET /api/rentals]", error);
    return NextResponse.json(
      { error: "Failed to fetch rentals" },
      { status: 500 },
    );
  }
}
