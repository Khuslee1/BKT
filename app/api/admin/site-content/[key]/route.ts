import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const content = await prisma.siteContent.findUnique({ where: { key } });
  return NextResponse.json(content ?? null);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key } = await params;
  const { value } = await request.json();

  const content = await prisma.siteContent.upsert({
    where: { key },
    update: { value, type: "json" },
    create: { key, value, type: "json" },
  });

  return NextResponse.json(content);
}
