"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader, { UploadedImage } from "@/app/components/admin/ImageUploader";

interface RentalData {
  id: string;
  name: string;
  type: string;
  description: string;
  pricePerDay: number;
  available: boolean;
  specs: Record<string, string>;
  images: string[];
}

export default function RentalForm({ initial }: { initial: RentalData }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name:        initial.name,
    type:        initial.type,
    description: initial.description,
    pricePerDay: initial.pricePerDay,
    available:   initial.available,
  });

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    Object.entries(initial.specs ?? {}).map(([k, v]) => ({ key: k, value: String(v) })),
  );

  // Images are part of the rental record (String[])
  const [images, setImages] = useState<UploadedImage[]>(
    initial.images.map((url) => ({ url })),
  );

  const [loading, setLoading]   = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const updateSpec = (i: number, field: "key" | "value", val: string) =>
    setSpecs((p) => p.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  const removeSpec = (i: number) => setSpecs((p) => p.filter((_, idx) => idx !== i));
  const addSpec    = () => setSpecs((p) => [...p, { key: "", value: "" }]);

  const handleUploaded = (img: UploadedImage) =>
    setImages((prev) => [...prev, img]);

  const handleRemoveImage = (_img: UploadedImage, index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const specsObj = Object.fromEntries(
      specs.filter((s) => s.key).map((s) => [s.key, s.value]),
    );

    const res = await fetch(`/api/admin/rentals/${initial.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        specs: specsObj,
        images: images.map((i) => i.url),
      }),
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

  const inputCls = "w-full px-4 py-3 text-sm outline-none focus:border-gold transition-colors";
  const inputStyle = {
    background: "var(--cream)",
    border: "1px solid rgba(61,46,24,0.15)",
    color: "var(--dark-brown)",
  };
  const labelCls = "block font-condensed text-[11px] tracking-widest uppercase mb-2";
  const labelStyle = { color: "var(--gold)" };
  const sectionStyle = {
    background: "var(--warm-white)",
    border: "1px solid rgba(61,46,24,0.1)",
  };
  const sectionHeadingCls = "font-condensed text-sm tracking-widest uppercase mb-5";
  const sectionHeadingStyle = { color: "var(--dark-brown)" };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6 max-w-2xl">

        {/* ── Images ── */}
        <section className="p-6" style={sectionStyle}>
          <h2 className={sectionHeadingCls} style={sectionHeadingStyle}>Images</h2>
          <ImageUploader
            images={images}
            onUploaded={handleUploaded}
            onRemove={handleRemoveImage}
          />
          <p className="text-xs text-stone mt-3 font-condensed">
            Images are saved when you click Save Changes below.
          </p>
        </section>

        {/* ── Basic info ── */}
        <section className="p-6" style={sectionStyle}>
          <h2 className={sectionHeadingCls} style={sectionHeadingStyle}>Basic Info</h2>
          <div className="flex flex-col gap-5">
            <div>
              <label className={labelCls} style={labelStyle}>Vehicle Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div>
              <label className={labelCls} style={labelStyle}>Type</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className={inputCls}
                style={inputStyle}
              >
                <option value="ural_sidecar">Ural Sidecar</option>
                <option value="dnepr_sidecar">Dnepr Sidecar</option>
                <option value="solo_bike">Solo Bike</option>
              </select>
            </div>

            <div>
              <label className={labelCls} style={labelStyle}>Description</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className={inputCls + " resize-vertical"}
                style={inputStyle}
              />
            </div>

            <div>
              <label className={labelCls} style={labelStyle}>Price per Day (USD)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                required
                value={form.pricePerDay}
                onChange={(e) => set("pricePerDay", Number(e.target.value))}
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>
        </section>

        {/* ── Specs ── */}
        <section className="p-6" style={sectionStyle}>
          <h2 className={sectionHeadingCls} style={sectionHeadingStyle}>Specs</h2>
          <div className="flex flex-col gap-3">
            {specs.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  type="text"
                  placeholder="e.g. engine"
                  value={s.key}
                  onChange={(e) => updateSpec(i, "key", e.target.value)}
                  className={inputCls + " font-mono text-xs"}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="e.g. 749cc boxer twin"
                  value={s.value}
                  onChange={(e) => updateSpec(i, "value", e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => removeSpec(i)}
                  className="px-3 font-condensed text-xs text-stone border transition-colors hover:border-red-400 hover:text-red-400"
                  style={{ border: "1px solid rgba(61,46,24,0.15)" }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpec}
              className="self-start font-condensed text-[10px] tracking-widest uppercase text-stone border hover:border-gold hover:text-gold transition-colors px-3 py-1.5"
              style={{ border: "1px solid rgba(61,46,24,0.15)" }}
            >
              + Add Spec
            </button>
          </div>
        </section>

        {/* ── Availability ── */}
        <section className="p-6" style={sectionStyle}>
          <h2 className={sectionHeadingCls} style={sectionHeadingStyle}>Availability</h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => set("available", !form.available)}
              className="w-10 h-5 relative transition-colors flex-shrink-0"
              style={{
                background: form.available ? "var(--gold)" : "rgba(61,46,24,0.2)",
                borderRadius: "2px",
              }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 bg-white transition-all"
                style={{ left: form.available ? "calc(100% - 18px)" : "2px" }}
              />
            </button>
            <span className="font-condensed text-xs tracking-widest uppercase text-ash">
              {form.available ? "Available for booking" : "Unavailable"}
            </span>
          </div>
        </section>

        {error && (
          <p className="text-red-500 text-sm border border-red-400/20 bg-red-400/5 px-4 py-3">
            ⚠ {error}
          </p>
        )}

        <div className="pb-4">
          <button type="submit" disabled={loading} className="btn-gold disabled:opacity-40">
            {loading ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
