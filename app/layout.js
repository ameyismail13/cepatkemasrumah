// ============================================================================
// FAIL: app/layout.js
// RUJUKAN LAB: 07-routing-lab/app/layout.js
// KONSEP: Root Layout yang membungkus keseluruhan aplikasi
// ============================================================================

import "./globals.css";

export const metadata = {
  title: "Cepat Kemas Rumah! — Smart Household Chore & Harmony Board",
  description:
    "Aplikasi papan tugasan rumah pintar berkonsepkan gamifikasi, ganjaran keluarga, dan JSON file database.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms" className="dark">
      <body className="antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}

