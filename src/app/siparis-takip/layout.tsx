import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sipariş Takip & Kargo Sorgulama | LifeGo Mobil",
  description:
    "LifeGo Mobil bataryalı takip cihazı siparişinizin kargo durumunu sipariş kodunuz veya telefon numaranız ile anında sorgulayın.",
  alternates: { canonical: "https://lifegomobil.com/siparis-takip" },
};

export default function SiparisTakipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
