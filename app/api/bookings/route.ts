import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      tourId,
      rentalId,
      firstName,
      lastName,
      email,
      phone,
      startDate,
      endDate,
      groupSize,
      ridingExperience,
      nationality,
      specialRequests,
      totalPrice,
    } = body;

    if (!email || !startDate || !groupSize || !totalPrice || !nationality) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!tourId && !rentalId) {
      return NextResponse.json(
        { error: "A tour or rental must be specified" },
        { status: 400 },
      );
    }

    const booking = await prisma.booking.create({
      data: {
        ...(tourId ? { tourId } : {}),
        ...(rentalId ? { rentalId } : {}),
        guestName: `${firstName} ${lastName}`.trim(),
        guestEmail: email,
        guestPhone: phone ?? null,
        nationality,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date(startDate),
        groupSize: Number(groupSize),
        ridingExperience: ridingExperience ?? "beginner",
        specialRequests: specialRequests ?? null,
        totalPrice: Number(totalPrice),
        status: "pending",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("[POST /api/bookings]", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
