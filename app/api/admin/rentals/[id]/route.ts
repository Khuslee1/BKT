import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { VehicleType } from "@/generated/prisma/enums";

const VALID_TYPES = new Set(["ural_sidecar", "dnepr_sidecar", "solo_bike"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, type, description, pricePerDay, available, specs } =
    await request.json();

  if (type && !VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid vehicle type" }, { status: 400 });
  }

  try {
    const rental = await prisma.rental.update({
      where: { id },
      data: {
        ...(name        !== undefined && { name }),
        ...(type        !== undefined && { type: type as VehicleType }),
        ...(description !== undefined && { description }),
        ...(pricePerDay !== undefined && { pricePerDay: Number(pricePerDay) }),
        ...(available   !== undefined && { available }),
        ...(specs       !== undefined && { specs }),
      },
    });

    return NextResponse.json(rental);
  } catch (error) {
    console.error("[PATCH /api/admin/rentals/[id]]", error);
    return NextResponse.json({ error: "Failed to update rental" }, { status: 500 });
  }
}
