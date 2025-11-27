import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Bebas_Neue, Cal_Sans } from "next/font/google";
import "./globals.css";
import "prosemirror-view/style/prosemirror.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const calSans = Cal_Sans({
  variable: "--font-calsans",
  weight: "400",
  display: "swap",
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  weight: ['200', '300'],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gospel AI",
  description: "Generated for ChronicleHQ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${calSans.variable} ${inter.variable} ${bebas.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
