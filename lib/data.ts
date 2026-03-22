export const TOURS = [
  {
    id: "1",
    slug: "khangai-classic",
    title: "Khangai Classic",
    subtitle: "The Heart of Mongolia by Sidecar",
    description:
      "Traverse the legendary Khangai mountain range through ancient valleys, nomadic ger camps, and crystal rivers.",
    days: 7,
    price: 1400,
    maxGroupSize: 6,
    type: "guided",
    region: "Khangai",
    difficulty: "moderate" as const,
    featured: true,
    highlights: [
      "Terkhin Tsagaan Lake",
      "Khorgo Volcano",
      "Nomad family stay",
      "Eagle hunter visit",
    ],
    includes: [
      "Sidecar & fuel",
      "Experienced guide",
      "Ger camp accommodation",
      "All meals",
    ],
    excludes: ["International flights", "Travel insurance"],
  },
  {
    id: "2",
    slug: "eagle-hunter-expedition",
    title: "Eagle Hunter Expedition",
    subtitle: "Into the Altai Wilderness",
    description:
      "Journey deep into the Altai Mountains to meet the Kazakh eagle hunters — one of the last cultures to practice this ancient art.",
    days: 10,
    price: 2200,
    maxGroupSize: 4,
    type: "guided",
    region: "Altai",
    difficulty: "challenging" as const,
    featured: true,
    highlights: [
      "Kazakh eagle hunters",
      "Altai mountain passes",
      "River crossings",
      "Throat singing ceremony",
    ],
    includes: [
      "Sidecar & fuel",
      "Expert guide",
      "Camping equipment",
      "All meals",
    ],
    excludes: ["International flights", "Travel insurance"],
  },
  {
    id: "3",
    slug: "gobi-desert-loop",
    title: "Gobi Desert Loop",
    subtitle: "Sand, Silence & Sky",
    description:
      "The Gobi is not just sand — flaming cliffs, dinosaur fossils, and endless horizon. Ride it on a sidecar.",
    days: 5,
    price: 950,
    maxGroupSize: 8,
    type: "guided",
    region: "Gobi",
    difficulty: "easy" as const,
    featured: true,
    highlights: [
      "Flaming Cliffs",
      "Khongoryn Els dunes",
      "Dinosaur fossil sites",
      "Bactrian camel ride",
    ],
    includes: ["Sidecar & fuel", "Guide", "Ger camp stays", "All meals"],
    excludes: ["International flights", "Travel insurance"],
  },
];

export const RENTALS = [
  {
    id: "r1",
    name: "Ural Gear-Up Sidecar",
    type: "ural_sidecar",
    description:
      "The legendary Ural — built tough for Mongolian terrain. 750cc boxer engine, two-wheel drive.",
    pricePerDay: 85,
    available: true,
    specs: {
      Engine: "750cc Boxer twin",
      Drive: "2WD",
      Fuel: "Petrol 19L",
      "Top Speed": "95 km/h",
    },
  },
  {
    id: "r2",
    name: "Dnepr MT-11 Sidecar",
    type: "dnepr_sidecar",
    description:
      "Classic Soviet-era Dnepr, fully restored. Raw, characterful — the authentic Mongolian experience.",
    pricePerDay: 65,
    available: true,
    specs: {
      Engine: "650cc Boxer twin",
      Drive: "1WD",
      Fuel: "Petrol 16L",
      "Top Speed": "85 km/h",
    },
  },
];

export const DIFFICULTY_COLORS = {
  easy: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  moderate: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  challenging: "text-red-400 border-red-400/30 bg-red-400/10",
};
