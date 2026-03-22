import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const tour = await prisma.tour.findUnique({
      where: { slug },
      include: { images: true },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error("[GET /api/tours/[slug]]", error);
    return NextResponse.json(
      { error: "Failed to fetch tour" },
      { status: 500 },
    );
  }
}
