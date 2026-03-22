import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sidecar Saga — Bulgan Khangai Travel | Mongolia",
  description: "Authentic sidecar adventures through the Mongolian wilderness.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
