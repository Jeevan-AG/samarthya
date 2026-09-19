import type { Metadata } from "next";
import { Outfit, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LenisProvider from "@/components/LenisProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SAMARTHYA | ECE Department Club",
    template: "%s | SAMARTHYA",
  },
  description:
    "SAMARTHYA — The official technical club of the ECE Department. Empowering students through innovation, collaboration, and hands-on technical excellence.",
  keywords: [
    "SAMARTHYA",
    "ECE",
    "Electronics",
    "Communication",
    "Engineering",
    "Club",
    "Technical",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <body className="grain-overlay">
        <LenisProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
