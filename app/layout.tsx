import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Origine in Movimento — Numerologia e trattamenti energetici",
  description:
    "Numerologia, trattamenti energetici e riequilibrio degli spazi. Uno spazio per ascoltarti in profondità e rimettere in movimento ciò che è fermo. Online e in presenza.",
  openGraph: {
    title: "Origine in Movimento",
    description:
      "Numerologia, trattamenti energetici e riequilibrio degli spazi. Online e in presenza.",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
