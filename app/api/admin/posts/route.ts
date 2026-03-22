import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, slug, excerpt, body, coverImage, published } = await request.json();

  if (!title || !slug || !excerpt || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        body,
        coverImage: coverImage || null,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/posts]", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
