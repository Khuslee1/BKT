import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { imageId } = await params;

  const image = await prisma.tourImage.findUnique({ where: { id: imageId } });
  if (!image)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Best-effort delete from blob storage
  try {
    await del(image.url);
  } catch {
    // ignore — URL may not be a Vercel Blob URL
  }

  await prisma.tourImage.delete({ where: { id: imageId } });

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
