import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Difficulty, TourType } from "@prisma/client";

const VALID_TYPES = new Set(["guided", "self_guided", "rental"]);
const VALID_DIFFICULTIES = new Set(["easy", "moderate", "challenging"]);

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    title,
    subtitle = "",
    description,
    days,
    price,
    maxGroupSize = 8,
    type = "guided",
    region,
    difficulty = "moderate",
    featured = false,
    published = false,
    highlights = [],
    includes = [],
    excludes = [],
  } = body;

  if (!title || !description || !days || !price || !region) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid tour type" }, { status: 400 });
  }
  if (!VALID_DIFFICULTIES.has(difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
  }

  // Generate unique slug
  let slug = toSlug(title);
  const existing = await prisma.tour.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  try {
    const tour = await prisma.tour.create({
      data: {
        slug,
        title,
        subtitle,
        description,
        days: Number(days),
        price: Number(price),
        maxGroupSize: Number(maxGroupSize),
        type: type as TourType,
        region,
        difficulty: difficulty as Difficulty,
        featured,
        published,
        highlights,
        includes,
        excludes,
      },
    });

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/tours]", error);
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 });
  }
}
