"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TourData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  days: number;
  price: number;
  maxGroupSize: number;
  type: string;
  region: string;
  difficulty: string;
  featured: boolean;
  published: boolean;
  highlights: string[];
  includes: string[];
  excludes: string[];
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function ArrayField({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const update = (i: number, val: string) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);

  return (
    <div>
      <p className="block font-condensed text-[11px] tracking-widest uppercase text-gold mb-2">
        {label}
      </p>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              className="flex-1 px-4 py-2.5 bg-black border border-stone/20 text-parchment text-sm outline-none focus:border-gold transition-colors"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="px-3 font-condensed text-xs text-stone border border-stone/20 hover:border-red-400 hover:text-red-400 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="self-start font-condensed text-[10px] tracking-widest uppercase text-stone border border-stone/20 hover:border-gold hover:text-gold transition-colors px-3 py-1.5"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default function TourForm({ initial }: { initial: TourData }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: initial.title,
    slug: initial.slug,
    subtitle: initial.subtitle,
    description: initial.description,
    days: initial.days,
    price: initial.price,
    maxGroupSize: initial.maxGroupSize,
    type: initial.type,
    region: initial.region,
    difficulty: initial.difficulty,
    featured: initial.featured,
    published: initial.published,
    highlights: initial.highlights,
    includes: initial.includes,
    excludes: initial.excludes,
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const res = await fetch(`/api/admin/tours/${initial.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
    }

    setLoading(false);
  };

  const inputCls =
    "w-full px-4 py-3 bg-black border border-stone/20 text-parchment text-sm outline-none focus:border-gold transition-colors";
  const labelCls =
    "block font-condensed text-[11px] tracking-widest uppercase text-gold mb-2";

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-8 max-w-3xl">

        {/* ── Basic info ── */}
        <section className="bg-charcoal border border-stone/10 p-6">
          <h2 className="font-condensed text-sm tracking-widest uppercase text-parchment mb-5">
            Basic Info
          </h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className={labelCls}>Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
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
                className={inputCls + " font-mono text-xs"}
              />
            </div>

            <div className="col-span-2">
              <label className={labelCls}>Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="col-span-2">
              <label className={labelCls}>Description</label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className={inputCls + " resize-vertical"}
              />
            </div>
          </div>
        </section>

        {/* ── Details ── */}
        <section className="bg-charcoal border border-stone/10 p-6">
          <h2 className="font-condensed text-sm tracking-widest uppercase text-parchment mb-5">
            Details
          </h2>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Duration (days)</label>
              <input
                type="number"
                min={1}
                required
                value={form.days}
                onChange={(e) => set("days", Number(e.target.value))}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Price (USD / person)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                required
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Max Group Size</label>
              <input
                type="number"
                min={1}
                required
                value={form.maxGroupSize}
                onChange={(e) => set("maxGroupSize", Number(e.target.value))}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Region</label>
              <input
                type="text"
                required
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Type</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className={inputCls}
              >
                <option value="guided">Guided</option>
                <option value="self_guided">Self-Guided</option>
                <option value="rental">Rental</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => set("difficulty", e.target.value)}
                className={inputCls}
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
          </div>
        </section>

        {/* ── Lists ── */}
        <section className="bg-charcoal border border-stone/10 p-6">
          <h2 className="font-condensed text-sm tracking-widest uppercase text-parchment mb-5">
            Highlights, Includes & Excludes
          </h2>
          <div className="flex flex-col gap-6">
            <ArrayField
              label="Highlights"
              items={form.highlights}
              onChange={(v) => set("highlights", v)}
            />
            <div className="gold-line" />
            <ArrayField
              label="Includes"
              items={form.includes}
              onChange={(v) => set("includes", v)}
            />
            <div className="gold-line" />
            <ArrayField
              label="Excludes"
              items={form.excludes}
              onChange={(v) => set("excludes", v)}
            />
          </div>
        </section>

        {/* ── Visibility ── */}
        <section className="bg-charcoal border border-stone/10 p-6">
          <h2 className="font-condensed text-sm tracking-widest uppercase text-parchment mb-5">
            Visibility
          </h2>
          <div className="flex flex-col gap-4">
            {(
              [
                { key: "published", label: "Published (visible to public)" },
                { key: "featured", label: "Featured (shown on homepage)" },
              ] as { key: "published" | "featured"; label: string }[]
            ).map(({ key, label }) => (
              <div key={key} className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => set(key, !form[key])}
                  className="w-10 h-5 relative transition-colors flex-shrink-0"
                  style={{ background: form[key] ? "var(--gold)" : "var(--ash)" }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 bg-black transition-all"
                    style={{ left: form[key] ? "calc(100% - 18px)" : "2px" }}
                  />
                </button>
                <span className="font-condensed text-xs tracking-widest uppercase text-stone">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <p className="text-red-400 text-sm border border-red-400/20 bg-red-400/5 px-4 py-3">
            ⚠ {error}
          </p>
        )}

        <div className="pb-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-gold disabled:opacity-40"
          >
            {loading ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
