import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BookingStatus } from "@/generated/prisma/enums";

const VALID_STATUSES = new Set(["pending", "rejected", "paid"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status, adminNotes } = await request.json();

  if (status && !VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status ? { status: status as BookingStatus } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[PATCH /api/admin/bookings/[id]]", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
