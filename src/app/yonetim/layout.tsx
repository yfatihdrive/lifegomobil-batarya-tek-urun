import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim Paneli | LifeGo Mobil",
  robots: { index: false, follow: false },
};

export default function YonetimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
