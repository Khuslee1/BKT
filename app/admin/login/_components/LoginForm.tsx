"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      localStorage.setItem("bkt_is_admin", "1");
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--black)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div
            className="w-12 h-12 border mx-auto flex items-center justify-center mb-6"
            style={{ borderColor: "var(--gold)" }}
          >
            <span className="font-condensed font-bold text-sm tracking-wider" style={{ color: "var(--gold)" }}>
              BKT
            </span>
          </div>
          <p className="section-eyebrow mb-3">Admin Access</p>
          <h1 className="font-display text-3xl text-parchment">
            Sidecar <em className="text-gold">Saga</em>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block font-condensed text-[11px] tracking-widest uppercase text-gold mb-2">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm outline-none transition-colors"
              style={{
                background: "var(--charcoal)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--parchment)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          <div>
            <label className="block font-condensed text-[11px] tracking-widest uppercase text-gold mb-2">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm outline-none transition-colors"
              style={{
                background: "var(--charcoal)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--parchment)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm border border-red-400/20 bg-red-400/5 px-4 py-3">
              ⚠ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold disabled:opacity-40 mt-2 justify-center"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
