import type { Metadata } from "next";
import { Inter, Space_Grotesk, Crimson_Text } from "next/font/google";

import Header from "./components/Header";
import Footer from "./components/Footer";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IU-MiCert - Blockchain Certificate Verification",
  description:
    "Verify educational certificates and view learning journeys through blockchain technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full ${inter.variable} ${spaceGrotesk.variable} ${crimsonText.variable}`}
    >
      <body className="antialiased h-full relative overflow-hidden">
        {/* Full-screen content */}
        <main className="absolute inset-0">{children}</main>

        {/* Floating Header */}
        <Header />

        {/* Floating Footer */}
        <Footer />
      </body>
    </html>
  );
}
