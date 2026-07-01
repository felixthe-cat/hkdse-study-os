import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyOS",
  description: "HKDSE study tracker",
};

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/papers", label: "Past Papers" },
  { href: "/scores", label: "Score Log" },
  { href: "/syllabus", label: "Syllabus" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <nav className="border-b bg-white px-6 py-3 flex gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <main className="flex-1 p-6 max-w-5xl w-full mx-auto">{children}</main>
      </body>
    </html>
  );
}
