"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "/tours", label: "Tours & Sidecars" },
    { href: "/#about", label: "About" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-sm border-b border-charcoal-light"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 border border-gold flex items-center justify-center">
            <span className="font-condensed font-bold text-gold text-sm tracking-wider">
              BKT
            </span>
          </div>
          <div>
            <div className="font-display text-parchment text-sm leading-none">
              Bulgan Khangai
            </div>
            <div className="font-condensed text-stone text-[10px] tracking-[0.2em] uppercase mt-0.5">
              Travel · Mongolia
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-condensed text-sm tracking-[0.15em] uppercase text-stone hover:text-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/book"
          className="hidden md:inline-flex btn-gold text-xs px-5 py-2.5"
        >
          Book Now
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            className={`block w-6 h-px bg-parchment transition-all ${open ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-parchment transition-all ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-parchment transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-charcoal border-t border-charcoal-light px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-condensed text-sm tracking-[0.15em] uppercase text-stone hover:text-gold"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="btn-gold w-fit text-xs"
            onClick={() => setOpen(false)}
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
}
