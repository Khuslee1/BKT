import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Difficulty } from "@/generated/prisma/enums";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get("difficulty");
  const sort = searchParams.get("sort");

  try {
    const tours = await prisma.tour.findMany({
      where: {
        ...(difficulty ? { difficulty: difficulty as Difficulty } : {}),
      },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
      },
      orderBy:
        sort === "price_asc"
          ? { price: "asc" }
          : sort === "price_desc"
            ? { price: "desc" }
            : sort === "duration"
              ? { days: "asc" }
              : { createdAt: "desc" },
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error("[GET /api/tours]", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 },
    );
  }
}
