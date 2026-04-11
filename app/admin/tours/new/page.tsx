"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      <p className="block font-condensed text-[11px] tracking-widest uppercase mb-2" style={{ color: "var(--gold)" }}>
        {label}
      </p>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm outline-none focus:border-gold transition-colors"
              style={{ background: "var(--cream)", border: "1px solid rgba(61,46,24,0.15)", color: "var(--dark-brown)" }}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="px-3 font-condensed text-xs text-stone border transition-colors hover:border-red-400 hover:text-red-400"
              style={{ border: "1px solid rgba(61,46,24,0.15)" }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="self-start font-condensed text-[10px] tracking-widest uppercase text-stone border hover:border-gold hover:text-gold transition-colors px-3 py-1.5"
          style={{ border: "1px solid rgba(61,46,24,0.15)" }}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default function NewTourPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    days: 7,
    price: 0,
    maxGroupSize: 8,
    type: "guided",
    region: "",
    difficulty: "moderate",
    featured: false,
    published: false,
    highlights: [] as string[],
    includes: [] as string[],
    excludes: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const tour = await res.json();
      router.push(`/admin/tours/${tour.id}`);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 text-sm outline-none focus:border-gold transition-colors";
  const inputStyle = { background: "var(--cream)", border: "1px solid rgba(61,46,24,0.15)", color: "var(--dark-brown)" };
  const labelCls = "block font-condensed text-[11px] tracking-widest uppercase mb-2";
  const labelStyle = { color: "var(--gold)" };
  const sectionStyle = { background: "var(--warm-white)", border: "1px solid rgba(61,46,24,0.1)" };
  const sectionHeadingCls = "font-condensed text-sm tracking-widest uppercase mb-5";
  const sectionHeadingStyle = { color: "var(--dark-brown)" };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-eyebrow mb-2">Tours</p>
          <h1 className="font-display text-3xl text-dark-brown">Add New Tour</h1>
        </div>
        <Link
          href="/admin/tours"
          className="font-condensed text-xs tracking-widest uppercase text-ash hover:text-gold transition-colors"
        >
          ← Back to Tours
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-8 max-w-3xl">

          {/* Basic info */}
          <section className="p-6" style={sectionStyle}>
            <h2 className={sectionHeadingCls} style={sectionHeadingStyle}>Basic Info</h2>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className={labelCls} style={labelStyle}>Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => { set("title", e.target.value); }}
                  placeholder="e.g. Khangai Classic"
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
              <div className="col-span-2">
                <label className={labelCls} style={labelStyle}>Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => set("subtitle", e.target.value)}
                  placeholder="Short tagline shown on cards"
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
              <div className="col-span-2">
                <label className={labelCls} style={labelStyle}>Description *</label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Full tour description..."
                  className={inputCls + " resize-vertical"}
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="p-6" style={sectionStyle}>
            <h2 className={sectionHeadingCls} style={sectionHeadingStyle}>Details</h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelCls} style={labelStyle}>Duration (days) *</label>
                <input type="number" min={1} required value={form.days}
                  onChange={(e) => set("days", Number(e.target.value))}
                  className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Price (USD / person) *</label>
                <input type="number" min={0} step="0.01" required value={form.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                  className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Max Group Size</label>
                <input type="number" min={1} value={form.maxGroupSize}
                  onChange={(e) => set("maxGroupSize", Number(e.target.value))}
                  className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Region *</label>
                <input type="text" required value={form.region}
                  onChange={(e) => set("region", e.target.value)}
                  placeholder="e.g. Khangai, Gobi, Altai"
                  className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Type</label>
                <select value={form.type} onChange={(e) => set("type", e.target.value)}
                  className={inputCls} style={inputStyle}>
                  <option value="guided">Guided</option>
                  <option value="self_guided">Self-Guided</option>
                  <option value="rental">Rental</option>
                </select>
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Difficulty</label>
                <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}
                  className={inputCls} style={inputStyle}>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>
            </div>
          </section>

          {/* Lists */}
          <section className="p-6" style={sectionStyle}>
            <h2 className={sectionHeadingCls} style={sectionHeadingStyle}>
              Highlights, Includes & Excludes
            </h2>
            <div className="flex flex-col gap-6">
              <ArrayField label="Highlights" items={form.highlights} onChange={(v) => set("highlights", v)} />
              <div className="gold-line" />
              <ArrayField label="Includes" items={form.includes} onChange={(v) => set("includes", v)} />
              <div className="gold-line" />
              <ArrayField label="Excludes" items={form.excludes} onChange={(v) => set("excludes", v)} />
            </div>
          </section>

          {/* Visibility */}
          <section className="p-6" style={sectionStyle}>
            <h2 className={sectionHeadingCls} style={sectionHeadingStyle}>Visibility</h2>
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
                    style={{ background: form[key] ? "var(--gold)" : "rgba(61,46,24,0.2)", borderRadius: "2px" }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 bg-white transition-all"
                      style={{ left: form[key] ? "calc(100% - 18px)" : "2px" }}
                    />
                  </button>
                  <span className="font-condensed text-xs tracking-widest uppercase text-ash">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {error && (
            <p className="text-red-500 text-sm border border-red-400/20 bg-red-400/5 px-4 py-3">
              ⚠ {error}
            </p>
          )}

          <div className="pb-4">
            <button type="submit" disabled={loading} className="btn-gold disabled:opacity-40">
              {loading ? "Creating…" : "Create Tour"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
