import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { VehicleType } from "@/generated/prisma/enums";

const VALID_TYPES = new Set(["ural_sidecar", "dnepr_sidecar", "solo_bike"]);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    name,
    type,
    description,
    pricePerDay,
    available = true,
    specs = {},
  } = body;

  if (!name || !type || !description || !pricePerDay) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid vehicle type" }, { status: 400 });
  }

  try {
    const rental = await prisma.rental.create({
      data: {
        name,
        type: type as VehicleType,
        description,
        pricePerDay: Number(pricePerDay),
        available,
        specs,
        images: [],
      },
    });

    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/rentals]", error);
    return NextResponse.json({ error: "Failed to create rental" }, { status: 500 });
  }
}
