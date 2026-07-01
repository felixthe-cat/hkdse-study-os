import type { Metadata } from "next";
import { Pixelify_Sans, VT323 } from "next/font/google";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixel-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const vt323 = VT323({
  variable: "--font-pixel-body",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "StudyOS",
  description: "HKDSE study tracker",
};

const NAV_LINKS = [
  { href: "/", label: "🏠 Farm", sub: "Dashboard" },
  { href: "/papers", label: "📜 Quests", sub: "Past Papers" },
  { href: "/scores", label: "⭐ Harvest", sub: "Score Log" },
  { href: "/syllabus", label: "🌱 Crops", sub: "Syllabus" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pixelifySans.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col sv-sky">
        <nav className="sv-nav">
          <span className="sv-nav-title">StudyOS</span>
          <div className="sv-nav-links">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="sv-nav-link">
                {link.label}
              </a>
            ))}
          </div>
        </nav>
        <main className="flex-1 p-6 max-w-5xl w-full mx-auto">{children}</main>
      </body>
    </html>
  );
}
