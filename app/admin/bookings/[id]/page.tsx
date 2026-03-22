import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import BookingActions from "../BookingActions";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      tour: { select: { title: true, slug: true } },
      rental: { select: { name: true } },
    },
  });

  if (!booking) notFound();

  const rows = [
    { label: "Guest Name", value: booking.guestName },
    { label: "Email", value: booking.guestEmail },
    { label: "Phone", value: booking.guestPhone ?? "—" },
    { label: "Nationality", value: booking.nationality },
    {
      label: "Service",
      value: booking.tour?.title ?? booking.rental?.name ?? "—",
    },
    {
      label: "Start Date",
      value: new Date(booking.startDate).toLocaleDateString(),
    },
    {
      label: "End Date",
      value: new Date(booking.endDate).toLocaleDateString(),
    },
    { label: "Group Size", value: String(booking.groupSize) },
    { label: "Riding Experience", value: booking.ridingExperience },
    { label: "Total Price", value: `$${booking.totalPrice.toLocaleString()}` },
    { label: "Deposit Paid", value: booking.depositPaid ? "Yes" : "No" },
    { label: "Submitted", value: new Date(booking.createdAt).toLocaleString() },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/admin/bookings"
            className="font-condensed text-xs tracking-widest uppercase text-stone hover:text-gold transition-colors block mb-3"
          >
            ← Back to Bookings
          </Link>
          <h1 className="font-display text-3xl text-parchment">
            Booking <em className="text-gold">Detail</em>
          </h1>
          <p className="text-stone text-xs mt-1 font-mono">{booking.id}</p>
        </div>
      </div>

      <div className="bg-charcoal border border-stone/10 mb-6">
        <div className="px-6 py-4 border-b border-stone/10">
          <h2 className="font-condensed text-sm tracking-widest uppercase text-parchment">
            Booking Info
          </h2>
        </div>
        <div className="divide-y divide-stone/5">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between px-6 py-3">
              <span className="font-condensed text-xs tracking-widest uppercase text-stone">
                {row.label}
              </span>
              <span className="text-sm text-parchment text-right">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {booking.specialRequests && (
        <div className="bg-charcoal border border-stone/10 mb-6 px-6 py-4">
          <p className="font-condensed text-xs tracking-widest uppercase text-stone mb-2">
            Special Requests
          </p>
          <p className="text-sm text-parchment leading-relaxed whitespace-pre-line">
            {booking.specialRequests}
          </p>
        </div>
      )}

      <BookingActions
        bookingId={booking.id}
        currentStatus={booking.status}
        adminNotes={booking.adminNotes ?? ""}
      />
    </div>
  );
}
