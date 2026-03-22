import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="min-h-screen" style={{ background: "var(--black)" }}>
      {/* ── HEADER ── */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--gold) 1px, transparent 1px),
                            linear-gradient(90deg, var(--gold) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="section-eyebrow mb-4">From the steppe</p>
          <h1
            className="font-display text-5xl md:text-6xl mb-4"
            style={{ color: "var(--parchment)" }}
          >
            Travel <em style={{ color: "var(--gold)" }}>Journal</em>
          </h1>
          <p
            className="text-lg max-w-lg leading-relaxed"
            style={{ color: "var(--stone)" }}
          >
            Stories, guides, and dispatches from the road. Life on a sidecar
            through the Mongolian wilderness.
          </p>
        </div>
      </section>

      {/* ── POSTS GRID ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p
                className="font-display text-2xl"
                style={{ color: "var(--stone)" }}
              >
                No posts yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="card-dark group block overflow-hidden"
                >
                  {/* Cover image */}
                  <div className="relative h-48 overflow-hidden" style={{ background: "var(--charcoal-mid)" }}>
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-10">
                        ✍
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="section-eyebrow text-[10px] mb-2">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </p>
                    <h2
                      className="font-display text-xl mb-2 group-hover:text-gold transition-colors"
                      style={{ color: "var(--parchment)" }}
                    >
                      {post.title}
                    </h2>
                    <p
                      className="text-sm leading-relaxed line-clamp-3"
                      style={{ color: "var(--stone)" }}
                    >
                      {post.excerpt}
                    </p>
                    <div className="gold-line my-4" />
                    <span
                      className="font-condensed text-xs tracking-[0.15em] uppercase border px-3 py-1.5 group-hover:bg-gold group-hover:text-black transition-all duration-200"
                      style={{ color: "var(--gold)", borderColor: "rgba(201,151,42,0.4)" }}
                    >
                      Read →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
