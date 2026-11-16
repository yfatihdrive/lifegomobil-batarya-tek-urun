import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Güvenli Sipariş & Ödeme | LifeGo Mobil Bataryalı Takip Cihazı",
  description:
    "Mıknatıslı ve bataryalı araç, motosiklet, tekne, nesne takip cihazınızı aynı gün ücretsiz sigortalı kargo ve %5 Havale/EFT indirimiyle sipariş verin.",
  alternates: { canonical: "https://lifegomobil.com/siparis" },
};

export default function SiparisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
