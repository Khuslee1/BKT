import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import PostForm from "../_components/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/posts"
          className="font-condensed text-xs tracking-widest uppercase text-stone hover:text-gold transition-colors block mb-3"
        >
          ← Back to Posts
        </Link>
        <p className="section-eyebrow mb-2">Edit</p>
        <h1 className="font-display text-3xl text-parchment">
          {post.title}
        </h1>
      </div>

      <PostForm
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: post.body,
          coverImage: post.coverImage,
          published: post.published,
        }}
      />
    </div>
  );
}
