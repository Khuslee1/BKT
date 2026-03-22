import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  return (
    <main className="min-h-screen" style={{ background: "var(--black)" }}>
      {/* ── HERO ── */}
      <section className="relative h-[50vh] min-h-[380px] flex items-end">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: "var(--charcoal)" }} />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, var(--black) 40%, transparent 100%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 pb-12 w-full">
          <Link
            href="/posts"
            className="font-condensed text-xs tracking-widest uppercase block mb-6 transition-colors"
            style={{ color: "var(--stone)" }}
          >
            ← Journal
          </Link>
          <p className="section-eyebrow mb-3">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </p>
          <h1
            className="font-display text-4xl md:text-5xl leading-tight"
            style={{ color: "var(--parchment)" }}
          >
            {post.title}
          </h1>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <p
            className="text-lg leading-relaxed mb-10 italic"
            style={{ color: "var(--stone)" }}
          >
            {post.excerpt}
          </p>

          <div className="gold-line mb-10" />

          <div
            className="prose-bkt text-base leading-relaxed whitespace-pre-line"
            style={{ color: "var(--stone)" }}
          >
            {post.body}
          </div>

          <div className="gold-line mt-16 mb-10" />

          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/posts" className="btn-outline-gold text-xs">
              ← Back to Journal
            </Link>
            <Link href="/book" className="btn-gold text-xs">
              Book a Tour
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
