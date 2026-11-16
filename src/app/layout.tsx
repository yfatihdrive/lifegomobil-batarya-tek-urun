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
  metadataBase: new URL("https://lifegomobil.com"),
  title:
    "Mıknatıslı & Bataryalı Araç, Motosiklet, Tekne, Nesne ve Kişi Takip Cihazı | LifeGo Mobil",
  description:
    "Kablo kesmeden 3 saniyede takılan N54 mıknatıslı ve 2 yıl bataryalı araç, motosiklet, tekne, nesne ve kişi takip cihazı. Dahili ses kayıt mikrofonu ve 2 yıllık M2M SIM dahil.",
  keywords: [
    "mıknatıslı araç takip cihazı",
    "bataryalı araç takip cihazı",
    "bataryalı motosiklet takip cihazı",
    "mıknatıslı motosiklet takip cihazı",
    "bataryalı tekne takip cihazı",
    "bataryalı nesne takip cihazı",
    "kişi takip cihazı",
    "bataryalı takip cihazı",
    "ses kayıt özellikli araç takip cihazı",
    "mikrofonlu araç takip cihazı",
    "kablosuz konteyner takip cihazı",
    "lifego mobil",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title:
      "Mıknatıslı & Bataryalı Araç, Motosiklet, Tekne, Nesne ve Kişi Takip Cihazı",
    description:
      "Araç içi ses kayıt etme (dahili mikrofon), N54 mıknatıs, 2 yıllık M2M SIM ve 3.000 / 6.000 / 10.000 / 20.000 mAh 4 farklı Bataryalı Takip Cihazı modeli.",
    url: "https://lifegomobil.com",
    siteName: "LifeGo Mobil",
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mıknatıslı & Bataryalı GPS Takip Cihazı Sistemi | LifeGo Mobil",
    description:
      "Tek şarjla 2 yıla varan batarya süresi, N54 mıknatıs, IP67 su geçirmezlik ve 2 yıllık M2M SIM kart dahil.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "LifeGo Mobil",
        url: "https://lifegomobil.com",
        telephone: "+902168251087",
        email: "destek@lifegomobil.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Teknopark Bulvarı No: 1/4C, Kurtköy",
          addressLocality: "Pendik",
          addressRegion: "İstanbul",
          addressCountry: "TR",
        },
      },
      {
        "@type": "WebSite",
        name: "LifeGo Mobil",
        url: "https://lifegomobil.com",
        inLanguage: "tr-TR",
      },
      {
        "@type": "Product",
        name: "LifeGo Mobil Mıknatıslı & Bataryalı Araç, Tekne, Motosiklet, Nesne ve Kişi Takip Cihazı Sistemi",
        description:
          "Dahili hassas mikrofonu ile araç içi ses kayıt etme özelliğine sahip, kablo gerektirmeyen N54 mıknatıslı, 3.000 mAh, 6.000 mAh, 10.000 mAh ve 20.000 mAh 4 farklı batarya modeline sahip 4G LTE GPS Bataryalı Takip Cihazı.",
        sku: "LG-SERISI-PRO",
        brand: {
          "@type": "Brand",
          name: "LifeGo Mobil",
        },
        aggregateRating: {
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
      },
    ],
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
