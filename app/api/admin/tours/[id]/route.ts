import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Difficulty, TourType } from "@/generated/prisma/enums";

const VALID_DIFFICULTIES = new Set(["easy", "moderate", "challenging"]);
const VALID_TYPES = new Set(["guided", "self_guided", "rental"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const {
    title, slug, subtitle, description,
    days, price, maxGroupSize, region,
    type, difficulty, featured, published,
    highlights, includes, excludes,
  } = body;

  if (difficulty && !VALID_DIFFICULTIES.has(difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
  }
  if (type && !VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  if (slug) {
    const conflict = await prisma.tour.findFirst({ where: { slug, NOT: { id } } });
    if (conflict) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  try {
    const tour = await prisma.tour.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        ...(days !== undefined && { days: Number(days) }),
        ...(price !== undefined && { price: Number(price) }),
        ...(maxGroupSize !== undefined && { maxGroupSize: Number(maxGroupSize) }),
        ...(region !== undefined && { region }),
        ...(type !== undefined && { type: type as TourType }),
        ...(difficulty !== undefined && { difficulty: difficulty as Difficulty }),
        ...(featured !== undefined && { featured }),
        ...(published !== undefined && { published }),
        ...(highlights !== undefined && { highlights }),
        ...(includes !== undefined && { includes }),
        ...(excludes !== undefined && { excludes }),
      },
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error("[PATCH /api/admin/tours/[id]]", error);
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 });
  }
}
