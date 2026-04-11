import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { url, alt } = await request.json();

  if (!url)
    return NextResponse.json({ error: "url is required" }, { status: 400 });

  const last = await prisma.tourImage.findFirst({
    where: { tourId: id },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const order = (last?.order ?? -1) + 1;

  const image = await prisma.tourImage.create({
    data: { tourId: id, url, alt: alt ?? "", order },
  });

  revalidatePath("/");
  return NextResponse.json(image);
}
