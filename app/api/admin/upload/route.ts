import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

export async function POST(request: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!ALLOWED_TYPES.has(file.type))
    return NextResponse.json({ error: "Only JPEG, PNG, WebP and GIF images are allowed" }, { status: 415 });

  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "File exceeds 8 MB limit" }, { status: 413 });

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `bkt/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(filename, file, { access: "private" });

  return NextResponse.json({ url: blob.url });
}
