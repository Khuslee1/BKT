import { PrismaClient } from "../generated/prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── TOURS ──────────────────────────────────────────────
  const tours = await Promise.all([
    prisma.tour.upsert({
      where: { slug: "khangai-classic" },
      update: {},
      create: {
        slug: "khangai-classic",
        title: "Khangai Classic",
        subtitle: "The heart of Mongolia by sidecar",
        description:
          "A journey through the rolling valleys and sacred mountains of the Khangai range. Visit nomadic families, sleep in traditional ger camps, and ride through landscapes unchanged for centuries.",
        days: 10,
        price: 2200,
        maxGroupSize: 8,
        type: "guided",
        region: "Khangai",
        difficulty: "moderate",
        featured: true,
        published: true,
        highlights: [
          "Ride through Orkhon Valley UNESCO site",
          "Stay with nomadic herder families",
          "Visit Erdene Zuu monastery",
          "Sunset at White Lake (Tsagaan Nuur)",
        ],
        includes: [
          "All accommodation (ger camps & guesthouses)",
          "All meals",
          "English-speaking guide",
          "Fully serviced sidecar",
          "Fuel",
          "Airport transfers",
        ],
        excludes: [
          "International flights",
          "Travel insurance",
          "Personal expenses",
          "Alcoholic beverages",
        ],
      },
    }),
    prisma.tour.upsert({
      where: { slug: "gobi-expedition" },
      update: {},
      create: {
        slug: "gobi-expedition",
        title: "Gobi Expedition",
        subtitle: "Sand dunes, saxaul forests and ancient canyons",
        description:
          "Cross the vastness of the Gobi Desert on a sidecar built for the terrain. From the singing dunes of Khongoryn Els to the flaming cliffs of Bayanzag — this is the raw Gobi.",
        days: 14,
        price: 3100,
        maxGroupSize: 6,
        type: "guided",
        region: "Gobi",
        difficulty: "challenging",
        featured: true,
        published: true,
        highlights: [
          "Khongoryn Els singing sand dunes",
          "Bayanzag flaming cliffs (dinosaur fossils)",
          "Yol Valley ice canyon",
          "Camel trek with local herders",
        ],
        includes: [
          "All accommodation",
          "All meals",
          "Expert local guide",
          "Sidecar with off-road setup",
          "Fuel & maintenance",
          "Camel trek (1 day)",
        ],
        excludes: [
          "International flights",
          "Travel insurance",
          "Personal expenses",
        ],
      },
    }),
    prisma.tour.upsert({
      where: { slug: "altai-eagle-hunters" },
      update: {},
      create: {
        slug: "altai-eagle-hunters",
        title: "Altai Eagle Hunters",
        subtitle: "Ride with the Kazakh eagle hunters of western Mongolia",
        description:
          "Journey to the far west and immerse yourself in the ancient tradition of Kazakh eagle hunting. Ride alongside hunters on horseback, witness the bond between hunter and eagle, and camp under the clearest skies in Asia.",
        days: 12,
        price: 2800,
        maxGroupSize: 6,
        type: "guided",
        region: "Altai",
        difficulty: "challenging",
        featured: true,
        published: true,
        highlights: [
          "Private time with eagle hunter families",
          "Attend a local eagle festival (seasonal)",
          "Ride through Altai mountain passes",
          "Cross the Khovd river by local ferry",
        ],
        includes: [
          "All accommodation",
          "All meals",
          "Kazakh-speaking local guide",
          "Sidecar with mountain setup",
          "Fuel",
          "Eagle hunting demonstration",
        ],
        excludes: [
          "International flights",
          "Travel insurance",
          "Personal expenses",
          "Domestic flight to Ulgii (optional)",
        ],
      },
    }),
    prisma.tour.upsert({
      where: { slug: "steppe-weekender" },
      update: {},
      create: {
        slug: "steppe-weekender",
        title: "Steppe Weekender",
        subtitle: "A short taste of the Mongolian steppe",
        description:
          "Not enough time for a full expedition? The Steppe Weekender gets you out of Ulaanbaatar and into the open grasslands in just three days. Perfect first sidecar experience.",
        days: 3,
        price: 650,
        maxGroupSize: 8,
        type: "guided",
        region: "Central Mongolia",
        difficulty: "easy",
        featured: false,
        published: true,
        highlights: [
          "Terelj National Park riding",
          "Overnight in authentic ger camp",
          "Turtle Rock and Ariyabal Monastery",
        ],
        includes: [
          "2 nights ger camp accommodation",
          "All meals",
          "Guide",
          "Sidecar",
          "Fuel",
        ],
        excludes: ["Personal expenses", "Travel insurance"],
      },
    }),
  ]);

  console.log(`✅ ${tours.length} tours seeded`);

  // ── RENTALS ────────────────────────────────────────────
  const rentals = await Promise.all([
    prisma.rental.upsert({
      where: { id: "rental-ural-gear-up" },
      update: {},
      create: {
        id: "rental-ural-gear-up",
        name: "Ural Gear-Up Sidecar",
        type: "ural_sidecar",
        description:
          "The legendary Russian Ural with full-time 2WD. Ideal for off-road adventures. Comes fully equipped with camping gear, tools, and a spare wheel.",
        pricePerDay: 85,
        available: true,
        specs: {
          engine: "749cc boxer twin",
          power: "41hp",
          drivetrain: "2WD (bike + sidecar wheel)",
          payload: "200kg sidecar capacity",
        },
        images: [],
      },
    }),
    prisma.rental.upsert({
      where: { id: "rental-ural-solo" },
      update: {},
      create: {
        id: "rental-ural-solo",
        name: "Ural Solo (no sidecar)",
        type: "solo_bike",
        description:
          "The Ural stripped back to just the bike. Nimble, capable, and great for riders who want freedom without the sidecar.",
        pricePerDay: 65,
        available: true,
        specs: {
          engine: "749cc boxer twin",
          power: "41hp",
          drivetrain: "Rear wheel drive",
        },
        images: [],
      },
    }),
    prisma.rental.upsert({
      where: { id: "rental-dnepr-sidecar" },
      update: {},
      create: {
        id: "rental-dnepr-sidecar",
        name: "Dnepr MT-11 Sidecar",
        type: "dnepr_sidecar",
        description:
          "A classic Soviet-era Dnepr fully restored. Slightly more raw than the Ural — for riders who want the authentic experience.",
        pricePerDay: 75,
        available: true,
        specs: {
          engine: "650cc boxer twin",
          power: "36hp",
          drivetrain: "Rear wheel drive",
          payload: "180kg sidecar capacity",
        },
        images: [],
      },
    }),
  ]);

  console.log(`✅ ${rentals.length} rentals seeded`);

  // ── ADMIN USER ─────────────────────────────────────────
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@bktravel.mn" },
    update: {},
    create: {
      email: "admin@bktravel.mn",
      name: "BKT Admin",
      password: adminPassword,
      role: "super_admin",
      active: true,
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email}`);
  console.log("🏁 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
