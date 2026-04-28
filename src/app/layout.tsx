import type { Metadata, Viewport } from "next";
import { Inter, Amiri_Quran, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/nav/sidebar";
import { MobileNav } from "@/components/nav/mobile-nav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const amiri = Amiri_Quran({ subsets: ["arabic"], weight: ["400"], variable: "--font-amiri", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant", display: "swap" });

export const metadata: Metadata = {
  title: "Noor — Read, Listen, Memorize the Quran",
  description: "A modern, calm Quran experience with multi-Qira'at comparison and a voice-driven Hifz trainer.",
  applicationName: "Noor",
  keywords: ["Quran", "Hifz", "Qira'at", "Tafsir", "Recitation", "Memorization"],
};

export const viewport: Viewport = {
  themeColor: "#0a0907",
  width: "device-width",
  initialScale: 1,
};

// Inline script that runs synchronously before paint to apply the persisted theme
// from localStorage — prevents a light/dark flash on first load.
// Default is dark (matches the original brand design); user can toggle to light.
const themeBootstrap = `
(function () {
  try {
    var raw = localStorage.getItem('noor-prefs');
    var theme = 'dark';
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.state && parsed.state.theme) theme = parsed.state.theme;
    }
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (_) {
    document.documentElement.classList.add('dark');
  }
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${amiri.variable} ${cormorant.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen overflow-x-hidden">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-noise opacity-[0.04] mix-blend-overlay" />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-64 pb-24 lg:pb-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">{children}</div>
          </main>
        </div>
        <MobileNav />
        <Toaster />
      </body>
    </html>
  );
}
