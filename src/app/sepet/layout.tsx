import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alışveriş Sepetim | LifeGo Mobil Bataryalı Takip Cihazı",
  description:
    "Seçtiğiniz mıknatıslı ve bataryalı GPS takip cihazı modellerini inceleyin, Havale/EFT %5 indirim avantajıyla güvenli sipariş oluşturun.",
  alternates: { canonical: "https://lifegomobil.com/sepet" },
};

export default function SepetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
