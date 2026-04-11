import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-parchment-dark">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border border-gold flex items-center justify-center">
                <span className="font-condensed font-bold text-gold text-sm tracking-wider">
                  BKT
                </span>
              </div>
              <div>
                <div className="font-display text-dark-brown text-sm">
                  Bulgan Khangai Travel
                </div>
                <div className="font-condensed text-ash text-[10px] tracking-[0.2em] uppercase mt-0.5">
                  Mongolia
                </div>
              </div>
            </div>
            <p className="text-stone text-sm leading-relaxed max-w-xs mt-4">
              Authentic sidecar adventures through the Mongolian wilderness.
              Locally owned, responsibly operated.
            </p>
            <div className="mt-6">
              <p className="section-eyebrow mb-1">Sidecar Saga</p>
              <p className="text-dark-brown text-sm italic font-display">
                Into the Mongolian Wilderness
              </p>
            </div>
          </div>

          <div>
            <p className="section-eyebrow mb-5">Explore</p>
            <div className="flex flex-col gap-3">
              {["Tours", "Sidecar Rental", "About BKT", "Contact"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    className="text-stone text-sm hover:text-gold transition-colors"
                  >
                    {item}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div>
            <p className="section-eyebrow mb-5">Contact</p>
            <div className="flex flex-col gap-3 text-sm text-stone">
              <p>Ulaanbaatar, Mongolia</p>
              <a
                href="mailto:info@bktravel.mn"
                className="hover:text-gold transition-colors"
              >
                info@bktravel.mn
              </a>
              <a
                href="tel:+97699001234"
                className="hover:text-gold transition-colors"
              >
                +976 9900 1234
              </a>
              <div className="flex gap-4 mt-2">
                {["Facebook", "Instagram", "YouTube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="font-condensed text-xs tracking-wider uppercase hover:text-gold transition-colors"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="gold-line my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone font-condensed tracking-wider">
          <p>
            © {new Date().getFullYear()} Bulgan Khangai Travel. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gold transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
