"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    localStorage.removeItem("bkt_is_admin");
    window.location.href = "/admin/login";
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className="flex items-center px-4 py-2.5 font-condensed text-sm tracking-wide uppercase transition-all duration-200 rounded-sm"
      style={{
        color: isActive(href) ? "var(--gold)" : "var(--stone)",
        background: isActive(href) ? "rgba(201,144,42,0.08)" : "transparent",
        borderLeft: isActive(href) ? "2px solid var(--gold)" : "2px solid transparent",
      }}
    >
      {label}
    </Link>
  );

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-64 flex flex-col"
      style={{
        background: "var(--charcoal)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo / Brand */}
      <div
        className="p-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-8 h-8 flex items-center justify-center flex-shrink-0"
            style={{ border: "1px solid var(--gold)" }}
          >
            <span
              className="font-condensed font-bold text-xs tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              BKT
            </span>
          </div>
          <div>
            <p className="font-display text-base text-parchment leading-none">
              Sidecar <em className="text-gold">Saga</em>
            </p>
            <p className="font-condensed text-[9px] tracking-widest uppercase text-stone mt-0.5">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        {/* Main */}
        <NavLink href="/admin" label="Dashboard" />

        {/* Edit Content section */}
        <div className="mt-5 mb-2 px-4">
          <p
            className="font-condensed text-[9px] tracking-widest uppercase"
            style={{ color: "rgba(138,125,104,0.5)" }}
          >
            Edit Content
          </p>
        </div>
        <NavLink href="/admin/tours" label="Tours" />
        <NavLink href="/admin/rentals" label="Sidecar Rentals" />
      </nav>

      {/* Sign out */}
      <div
        className="p-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-stone text-xs truncate mb-3 px-2">{email}</p>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 font-condensed text-xs tracking-widest uppercase transition-all duration-200 text-left"
          style={{
            color: "var(--stone)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)";
            (e.currentTarget as HTMLElement).style.color = "var(--gold)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLElement).style.color = "var(--stone)";
          }}
        >
          ← Sign Out
        </button>
      </div>
    </aside>
  );
}
