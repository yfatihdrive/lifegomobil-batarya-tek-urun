import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700", "800"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Mıknatıslı Araç, Motosiklet, Tekne, Nesne Takip Cihazı | Bataryalı Araç, Tekne, Motosiklet, Nesne, Kişi Takip Cihazı ve Sistemi - LifeGo Mobil",
  description:
    "Mıknatıslı araç, motosiklet, tekne, nesne takip cihazı ve bataryalı araç, tekne, motosiklet, nesne, kişi takip cihazı ve sistemi. Araç içi ses kayıt etme (dahili mikrofon) özelliği ve 3.000 mAh, 6.000 mAh, 10.000 mAh, 20.000 mAh 4 farklı bataryalı takip cihazı modeli.",
  keywords: [
    "mıknatıslı araç takip cihazı",
    "mıknatıslı motosiklet takip cihazı",
    "mıknatıslı tekne takip cihazı",
    "mıknatıslı nesne takip cihazı",
    "bataryalı takip cihazı",
    "bataryalı araç takip cihazı",
    "bataryalı tekne takip cihazı",
    "bataryalı motosiklet takip cihazı",
    "bataryalı nesne takip cihazı",
    "bataryalı kişi takip cihazı",
    "bataryalı araç tekne motosiklet nesne kişi takip cihazı ve sistemi",
    "ses kayıt özellikli araç takip cihazı",
    "mikrofonlu araç takip cihazı",
    "kablosuz konteyner takip cihazı",
    "lifego mobil",
  ],
  openGraph: {
    title:
      "Mıknatıslı Araç, Motosiklet, Tekne, Nesne Takip Cihazı | Bataryalı Takip Cihazı ve Sistemi",
    description:
      "Araç içi ses kayıt etme (dahili mikrofon), N54 mıknatıs ve 3.000 / 6.000 / 10.000 / 20.000 mAh 4 farklı model seçeneğiyle Bataryalı Takip Cihazı.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "LifeGo Mobil Mıknatıslı & Bataryalı Araç, Tekne, Motosiklet, Nesne ve Kişi Takip Cihazı Sistemi",
    description:
      "Dahili hassas mikrofonu ile araç içi ses kayıt etme özelliğine sahip, kablo gerektirmeyen N54 mıknatıslı, 3.000 mAh, 6.000 mAh, 10.000 mAh ve 20.000 mAh 4 farklı batarya modeline sahip 4.5G LTE GPS Bataryalı Takip Cihazı.",
    brand: {
      "@type": "Brand",
      name: "LifeGo Mobil",
    },
    AggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1480",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "TRY",
      lowPrice: "6950",
      highPrice: "14950",
      offerCount: "4",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <html
      lang="tr"
      className={`${jakarta.variable} ${jetbrains.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          <Header />
          <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingWidgets />
        </CartProvider>
      </body>
    </html>
  );
}
