import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sipariş Onayı | LifeGo Mobil",
  robots: { index: false, follow: false },
};

export default function SiparisOnayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
