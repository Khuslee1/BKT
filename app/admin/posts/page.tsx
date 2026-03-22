import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="section-eyebrow mb-2">Manage</p>
          <h1 className="font-display text-3xl text-parchment">Posts</h1>
        </div>
        <Link href="/admin/posts/new" className="btn-gold text-xs">
          + New Post
        </Link>
      </div>

      <div className="bg-charcoal border border-stone/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone/10">
              {["Title", "Slug", "Published", "Date", ""].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left font-condensed text-[10px] tracking-widest uppercase text-stone"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-stone text-sm">
                  No posts yet. Create your first one.
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-stone/5 hover:bg-stone/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm text-parchment">{p.title}</p>
                    <p className="text-xs text-stone line-clamp-1 mt-0.5">{p.excerpt}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-stone font-mono">{p.slug}</td>
                  <td className="px-6 py-4">
                    {p.published ? (
                      <span className="font-condensed text-[10px] tracking-widest uppercase px-2 py-1 border border-emerald-400/30 bg-emerald-400/5 text-emerald-400">
                        Published
                      </span>
                    ) : (
                      <span className="font-condensed text-[10px] tracking-widest uppercase px-2 py-1 border border-stone/20 text-stone">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-stone">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/posts/${p.id}`}
                      className="font-condensed text-[10px] tracking-widest uppercase text-stone hover:text-gold transition-colors"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
