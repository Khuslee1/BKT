"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostFormProps {
  initial?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    coverImage: string | null;
    published: boolean;
  };
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PostForm({ initial }: PostFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    body: initial?.body ?? "",
    coverImage: initial?.coverImage ?? "",
    published: initial?.published ?? false,
  });

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleTitleChange = (value: string) => {
    setForm((p) => ({
      ...p,
      title: value,
      slug: isEdit ? p.slug : toSlug(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isEdit ? `/api/admin/posts/${initial!.id}` : "/api/admin/posts";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/posts/${initial!.id}`, { method: "DELETE" });

    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      setError("Failed to delete post.");
      setDeleting(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 bg-black border border-stone/20 text-parchment text-sm outline-none focus:border-gold transition-colors";
  const labelCls =
    "block font-condensed text-[11px] tracking-widest uppercase text-gold mb-2";

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-3xl flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className={labelCls}>Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title"
              className={inputCls}
            />
          </div>

          <div className="col-span-2">
            <label className={labelCls}>Slug</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => set("slug", toSlug(e.target.value))}
              placeholder="post-slug"
              className={inputCls + " font-mono text-xs"}
            />
          </div>

          <div className="col-span-2">
            <label className={labelCls}>Excerpt</label>
            <textarea
              required
              rows={2}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Short preview shown in listings"
              className={inputCls + " resize-none"}
            />
          </div>

          <div className="col-span-2">
            <label className={labelCls}>Body</label>
            <textarea
              required
              rows={14}
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder="Full post content..."
              className={inputCls + " resize-vertical"}
            />
          </div>

          <div className="col-span-2">
            <label className={labelCls}>Cover Image URL (optional)</label>
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-4 py-4 border-t border-stone/10">
          <button
            type="button"
            onClick={() => set("published", !form.published)}
            className="w-10 h-5 relative transition-colors"
            style={{
              background: form.published ? "var(--gold)" : "var(--ash)",
            }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 bg-black transition-all"
              style={{ left: form.published ? "calc(100% - 18px)" : "2px" }}
            />
          </button>
          <span className="font-condensed text-xs tracking-widest uppercase text-stone">
            {form.published ? "Published" : "Draft"}
          </span>
        </div>

        {error && (
          <p className="text-red-400 text-sm border border-red-400/20 bg-red-400/5 px-4 py-3">
            ⚠ {error}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-gold disabled:opacity-40"
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Post"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="font-condensed text-xs tracking-widest uppercase text-red-400 border border-red-400/20 hover:border-red-400 px-4 py-2 transition-colors disabled:opacity-40"
            >
              {deleting ? "Deleting…" : "Delete Post"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
