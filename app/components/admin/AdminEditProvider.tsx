"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────

type DrawerState = { sectionId: string; data: Record<string, unknown> } | null;

interface EditCtx {
  isEditMode: boolean;
  toggleEditMode: () => void;
  openDrawer: (sectionId: string, data: Record<string, unknown>) => void;
  closeDrawer: () => void;
}

// ── Context ───────────────────────────────────────────────────────

export const EditContext = createContext<EditCtx | null>(null);

export function useEditMode() {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error("Must be inside AdminEditProvider");
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────

export default function AdminEditProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [drawer, setDrawer] = useState<DrawerState>(null);

  const toggleEditMode = useCallback(() => setIsEditMode((p) => !p), []);
  const openDrawer = useCallback(
    (sectionId: string, data: Record<string, unknown>) =>
      setDrawer({ sectionId, data }),
    []
  );
  const closeDrawer = useCallback(() => setDrawer(null), []);

  return (
    <EditContext.Provider value={{ isEditMode, toggleEditMode, openDrawer, closeDrawer }}>
      {children}

      {/* Floating admin edit toggle */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {isEditMode && (
          <span
            className="font-condensed text-[10px] tracking-widest uppercase px-3 py-2 animate-slide-right"
            style={{
              background: "rgba(201,144,42,0.1)",
              border: "1px solid rgba(201,144,42,0.35)",
              color: "var(--gold)",
            }}
          >
            ● Edit Mode
          </span>
        )}
        <button
          onClick={toggleEditMode}
          className="w-11 h-11 flex items-center justify-center text-lg transition-all duration-200"
          style={{
            background: isEditMode ? "var(--gold)" : "var(--charcoal)",
            border: `1px solid ${isEditMode ? "var(--gold)" : "rgba(255,255,255,0.12)"}`,
            color: isEditMode ? "var(--black)" : "var(--stone)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
          title={isEditMode ? "Exit edit mode" : "Edit page content"}
        >
          ✎
        </button>
      </div>

      {/* Drawer */}
      {drawer && (
        <Drawer sectionId={drawer.sectionId} data={drawer.data} onClose={closeDrawer} />
      )}
    </EditContext.Provider>
  );
}

// ── Shared field components ───────────────────────────────────────

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label
        className="block font-condensed text-[10px] tracking-widest uppercase mb-2"
        style={{ color: "var(--gold)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputBase =
  "w-full px-4 py-3 text-sm outline-none transition-colors";
const inputStyle = {
  background: "var(--black)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "var(--parchment)",
};
const focusGold = (e: React.FocusEvent<HTMLElement>) =>
  (e.currentTarget.style.borderColor = "var(--gold)");
const blurGray = (e: React.FocusEvent<HTMLElement>) =>
  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)");

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputBase}
      style={inputStyle}
      onFocus={focusGold}
      onBlur={blurGray}
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`${inputBase} resize-vertical`}
      style={inputStyle}
      onFocus={focusGold}
      onBlur={blurGray}
    />
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="font-condensed text-sm text-stone uppercase tracking-wide">
        {label}
      </span>
      <button
        onClick={() => onChange(!value)}
        className="w-11 h-6 relative transition-colors duration-200 flex-shrink-0"
        style={{
          background: value ? "var(--gold)" : "rgba(255,255,255,0.1)",
          borderRadius: "12px",
        }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200"
          style={{ left: value ? "calc(100% - 20px)" : "4px" }}
        />
      </button>
    </div>
  );
}

function SaveBtn({
  onClick,
  loading,
  saved,
}: {
  onClick: () => void;
  loading: boolean;
  saved: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="btn-gold disabled:opacity-40 w-full justify-center mt-2"
    >
      {loading ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
    </button>
  );
}

// ── Save site content helper ──────────────────────────────────────

async function saveSiteContent(key: string, value: unknown) {
  await fetch(`/api/admin/site-content/${key}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value: JSON.stringify(value) }),
  });
}

// ── Drawer shell ──────────────────────────────────────────────────

function getSectionLabel(id: string) {
  if (id === "hero") return "Hero Carousel";
  if (id === "about") return "About Section";
  if (id === "stats") return "Stats Bar";
  if (id.startsWith("tour:")) return "Tour";
  if (id.startsWith("rental:")) return "Rental";
  return "Section";
}

function Drawer({
  sectionId,
  data,
  onClose,
}: {
  sectionId: string;
  data: Record<string, unknown>;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-screen w-full max-w-lg z-50 flex flex-col animate-slide-right"
        style={{
          background: "var(--charcoal)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <p className="section-eyebrow text-[9px] mb-1">Admin · Edit Content</p>
            <h2 className="font-display text-xl text-parchment">
              {getSectionLabel(sectionId)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-stone hover:text-parchment transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <DrawerContent sectionId={sectionId} data={data} onClose={onClose} />
        </div>
      </div>
    </>
  );
}

// ── Drawer content router ─────────────────────────────────────────

function DrawerContent({
  sectionId,
  data,
  onClose,
}: {
  sectionId: string;
  data: Record<string, unknown>;
  onClose: () => void;
}) {
  if (sectionId === "hero")
    return <HeroEditor data={data} onClose={onClose} />;
  if (sectionId === "about")
    return <AboutEditor data={data} onClose={onClose} />;
  if (sectionId === "stats")
    return <StatsEditor data={data} onClose={onClose} />;
  if (sectionId.startsWith("tour:"))
    return <TourEditor id={sectionId.slice(5)} data={data} onClose={onClose} />;
  if (sectionId.startsWith("rental:"))
    return <RentalEditor id={sectionId.slice(7)} data={data} onClose={onClose} />;
  return null;
}

// ── Hero Editor ───────────────────────────────────────────────────

export type SlideData = {
  eyebrow: string;
  heading: string;
  sub: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

function HeroEditor({
  data,
  onClose,
}: {
  data: Record<string, unknown>;
  onClose: () => void;
}) {
  const router = useRouter();
  const [slides, setSlides] = useState<SlideData[]>(
    (data.slides as SlideData[]) ?? []
  );
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (i: number, field: keyof SlideData, val: string) =>
    setSlides((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s))
    );

  const save = async () => {
    setLoading(true);
    await saveSiteContent("homepage_hero", { slides });
    setLoading(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const s = slides[active];
  if (!s) return <p className="text-stone text-sm">No slide data.</p>;

  return (
    <div className="flex flex-col gap-5">
      {/* Slide tabs */}
      <div className="flex gap-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="flex-1 py-2 font-condensed text-xs tracking-widest uppercase transition-colors"
            style={{
              background: active === i ? "rgba(201,144,42,0.1)" : "transparent",
              border: `1px solid ${active === i ? "var(--gold)" : "rgba(255,255,255,0.08)"}`,
              color: active === i ? "var(--gold)" : "var(--stone)",
            }}
          >
            Slide {i + 1}
          </button>
        ))}
      </div>

      <Field label="Eyebrow text">
        <Input value={s.eyebrow} onChange={(v) => update(active, "eyebrow", v)} />
      </Field>
      <Field label="Main heading">
        <Input value={s.heading} onChange={(v) => update(active, "heading", v)} />
      </Field>
      <Field label="Italic sub-heading (gold)">
        <Input value={s.sub} onChange={(v) => update(active, "sub", v)} />
      </Field>
      <Field label="Body text">
        <Textarea value={s.body} onChange={(v) => update(active, "body", v)} rows={3} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary button">
          <Input value={s.ctaLabel} onChange={(v) => update(active, "ctaLabel", v)} />
        </Field>
        <Field label="Primary link">
          <Input value={s.ctaHref} onChange={(v) => update(active, "ctaHref", v)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Secondary button">
          <Input value={s.secondaryLabel} onChange={(v) => update(active, "secondaryLabel", v)} />
        </Field>
        <Field label="Secondary link">
          <Input value={s.secondaryHref} onChange={(v) => update(active, "secondaryHref", v)} />
        </Field>
      </div>

      <SaveBtn onClick={save} loading={loading} saved={saved} />
    </div>
  );
}

// ── About Editor ──────────────────────────────────────────────────

type AboutData = {
  title: string;
  titleEm: string;
  para1: string;
  para2: string;
  para3: string;
};

function AboutEditor({
  data,
  onClose,
}: {
  data: Record<string, unknown>;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<AboutData>(
    (data.about as AboutData) ?? {
      title: "Born in the",
      titleEm: "Steppe",
      para1: "",
      para2: "",
      para3: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (field: keyof AboutData, val: string) =>
    setForm((p) => ({ ...p, [field]: val }));

  const save = async () => {
    setLoading(true);
    await saveSiteContent("homepage_about", form);
    setLoading(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Heading">
          <Input value={form.title} onChange={(v) => set("title", v)} />
        </Field>
        <Field label="Italic word (gold)">
          <Input value={form.titleEm} onChange={(v) => set("titleEm", v)} />
        </Field>
      </div>
      <Field label="Paragraph 1">
        <Textarea value={form.para1} onChange={(v) => set("para1", v)} rows={3} />
      </Field>
      <Field label="Paragraph 2">
        <Textarea value={form.para2} onChange={(v) => set("para2", v)} rows={3} />
      </Field>
      <Field label="Paragraph 3">
        <Textarea value={form.para3} onChange={(v) => set("para3", v)} rows={3} />
      </Field>
      <SaveBtn onClick={save} loading={loading} saved={saved} />
    </div>
  );
}

// ── Stats Editor ──────────────────────────────────────────────────

type StatItem = { num: string; label: string };

function StatsEditor({
  data,
  onClose,
}: {
  data: Record<string, unknown>;
  onClose: () => void;
}) {
  const router = useRouter();
  const [items, setItems] = useState<StatItem[]>(
    (data.items as StatItem[]) ?? []
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (i: number, field: keyof StatItem, val: string) =>
    setItems((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s))
    );

  const save = async () => {
    setLoading(true);
    await saveSiteContent("homepage_stats", { items });
    setLoading(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-2 gap-3">
          <Field label={`Stat ${i + 1} — Number`}>
            <Input value={item.num} onChange={(v) => update(i, "num", v)} placeholder="6+" />
          </Field>
          <Field label="Label">
            <Input value={item.label} onChange={(v) => update(i, "label", v)} />
          </Field>
        </div>
      ))}
      <SaveBtn onClick={save} loading={loading} saved={saved} />
    </div>
  );
}

// ── Tour Editor ───────────────────────────────────────────────────

function TourEditor({
  id,
  data,
  onClose,
}: {
  id: string;
  data: Record<string, unknown>;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: String(data.title ?? ""),
    subtitle: String(data.subtitle ?? ""),
    description: String(data.description ?? ""),
    price: String(data.price ?? ""),
    days: String(data.days ?? ""),
    region: String(data.region ?? ""),
    published: Boolean(data.published),
    featured: Boolean(data.featured),
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (field: string, val: string | boolean) =>
    setForm((p) => ({ ...p, [field]: val }));

  const save = async () => {
    setLoading(true);
    await fetch(`/api/admin/tours/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        price: Number(form.price),
        days: Number(form.days),
        region: form.region,
        published: form.published,
        featured: form.featured,
      }),
    });
    setLoading(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4">
      <Field label="Title">
        <Input value={form.title} onChange={(v) => set("title", v)} />
      </Field>
      <Field label="Subtitle / tagline">
        <Input value={form.subtitle} onChange={(v) => set("subtitle", v)} />
      </Field>
      <Field label="Description">
        <Textarea value={form.description} onChange={(v) => set("description", v)} rows={5} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Price ($)">
          <Input value={form.price} onChange={(v) => set("price", v)} />
        </Field>
        <Field label="Days">
          <Input value={form.days} onChange={(v) => set("days", v)} />
        </Field>
        <Field label="Region">
          <Input value={form.region} onChange={(v) => set("region", v)} />
        </Field>
      </div>
      <div
        className="flex flex-col gap-1 pt-2 px-4 py-3"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Toggle label="Published (visible to public)" value={form.published} onChange={(v) => set("published", v)} />
        <Toggle label="Featured on homepage" value={form.featured} onChange={(v) => set("featured", v)} />
      </div>
      <SaveBtn onClick={save} loading={loading} saved={saved} />
    </div>
  );
}

// ── Rental Editor ─────────────────────────────────────────────────

function RentalEditor({
  id,
  data,
  onClose,
}: {
  id: string;
  data: Record<string, unknown>;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: String(data.name ?? ""),
    description: String(data.description ?? ""),
    pricePerDay: String(data.pricePerDay ?? ""),
    available: Boolean(data.available ?? true),
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (field: string, val: string | boolean) =>
    setForm((p) => ({ ...p, [field]: val }));

  const save = async () => {
    setLoading(true);
    await fetch(`/api/admin/rentals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        pricePerDay: Number(form.pricePerDay),
        available: form.available,
      }),
    });
    setLoading(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4">
      <Field label="Name">
        <Input value={form.name} onChange={(v) => set("name", v)} />
      </Field>
      <Field label="Description">
        <Textarea value={form.description} onChange={(v) => set("description", v)} rows={5} />
      </Field>
      <Field label="Price per day ($)">
        <Input value={form.pricePerDay} onChange={(v) => set("pricePerDay", v)} />
      </Field>
      <div
        className="px-4 py-3"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Toggle
          label="Available for booking"
          value={form.available}
          onChange={(v) => set("available", v)}
        />
      </div>
      <SaveBtn onClick={save} loading={loading} saved={saved} />
    </div>
  );
}
