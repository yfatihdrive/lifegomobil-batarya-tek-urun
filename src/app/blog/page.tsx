import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getLiveBlogArticles,
  getBlogCategories,
} from "@/lib/blog";
import AccordionList from "@/components/AccordionList";
import {
  BookOpen,
  Calendar,
  Sparkles,
  ChevronRight,
  Clock,
  ArrowRight,
  Layers,
  ExternalLink,
  Compass,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Life GO Mobil & Bataryalı Takip Rehberi (400 Makale) | LifeGo Mobil",
  description:
    "Mıknatıslı araç takip cihazı, bataryalı araç, motosiklet, tekne, nesne ve kişi takip cihazı rehberleri. 400 özgün teknik analiz 01.12.2026 tarihinde yayında.",
  keywords: [
    "mıknatıslı araç takip cihazı",
    "bataryalı araç takip cihazı",
    "bataryalı motosiklet takip cihazı",
    "mıknatıslı motosiklet takip cihazı",
    "bataryalı tekne takip cihazı",
    "bataryalı nesne takip cihazı",
    "kişi takip cihazı",
    "ses kayıt özellikli takip cihazı",
  ],
  alternates: {
    canonical: "https://lifegomobil.com/blog",
  },
  openGraph: {
    title: "Life GO Mobil & Bataryalı Takip Sistemleri Bilgi Merkezi | LifeGo Mobil",
    description:
      "Mıknatıslı ve bataryalı GPS takip cihazları, N54 mıknatıs montajı, IP67 su geçirmezlik ve 2 yıllık M2M SIM rehberleri.",
    url: "https://lifegomobil.com/blog",
    type: "website",
    locale: "tr_TR",
  },
};

const PRODUCT_GUIDE_ACCORDIONS = [
  {
    badge: "ARAÇ",
    title: "Mıknatıslı & Bataryalı Araç Takip Cihazı (Kablo Kesmeden 3 Sn Kurulum)",
    content:
      "Binek otomobil, SUV ve ticari araçlarda aracın elektrik tesisatına veya CAN-Bus beynine dokunmadan N54 neodimyum mıknatıs ile arka şasi traversine, stepne havuzuna veya koltuk altı metal kızağa 3 saniyede tutunur. Sıfır araç garantisini kesinlikle bozmaz, dahili MEMS mikrofonuyla kabin içi ses kayıt imkanı sunar.",
  },
  {
    badge: "MOTOSİKLET",
    title: "Bataryalı & Mıknatıslı Motosiklet Takip Cihazı (Akü Bitirmeyen Teknoloji)",
    content:
      "Kablolu takip cihazları kışın park halinde bekleyen motosikletlerin 7Ah-12Ah akülerini kısa sürede boşaltır. LifeGo Mobil LG-300 Mini (3.000 mAh) ve LG-600 Pro (6.000 mAh) kendi dahili bataryasıyla çalışır; sele altına veya grenaj içi şasiye yerleşir, sarsıntıda 3 saniyede bildirim verir.",
  },
  {
    badge: "TEKNE & YAT",
    title: "Bataryalı Tekne & Yat Takip Cihazı (IEC 60529 IP67 Deniz Suyu Zırhı)",
    content:
      "Marin ortamlarda nem, yağmur ve tuzlu deniz spreyine karşı tam yalıtımlı IP67 gövdeye sahiptir. Marinalarda bağlı kalan tekneler, yelkenliler ve dıştan takma motorlar için 200m–1000m sanal çit (Geo-Fence) ile demir tarama ve izinsiz hareket alarmı üretir.",
  },
  {
    badge: "NESNE & KİŞİ",
    title: "Bataryalı Nesne, Konteyner ve Kişi Takip Cihazı (2 Yıla Varan Güç)",
    content:
      "Değerli kargo kolileri, jeneratörler, iş makineleri ve uluslararası konteynerler için 20.000 mAh Ultra modelimiz tek şarjla 2 yıla (730 gün) kadar nöbet tutar. Kompakt 3.000 mAh modelimiz ise okul çantası, yaşlı yakını ve saha personeli takibinde güvenle kullanılır.",
  },
];

const INTERNAL_RESOURCES = [
  {
    title: "4 Farklı Batarya Modeli & Fiyatları",
    desc: "3.000, 6.000, 10.000 ve 20.000 mAh modelleri inceleyin",
    href: "/#urun-secimi",
  },
  {
    title: "Batarya Süresi Hesaplayıcı",
    desc: "Günlük kullanım saatinize göre pil ömrünü hesaplayın",
    href: "/#batarya-hesapla",
  },
  {
    title: "Otomobil & Motor Montaj Rehberi",
    desc: "Şasi altı, sele altı ve koltuk altı yerleşim şemaları",
    href: "/#montaj-rehberi",
  },
  {
    title: "Canlı Harita & Alarm Simülatörü",
    desc: "Sarsıntı, sökülme ve güvenli bölge alarmlarını test edin",
    href: "/#canli-demo",
  },
];

const EXTERNAL_AUTHORITY_LINKS = [
  {
    title: "BTK — M2M & IoT Haberleşme Standartları",
    url: "https://www.btk.gov.tr",
    domain: "btk.gov.tr",
  },
  {
    title: "IEC 60529 — IP67 Su & Toz Koruma Standardı",
    url: "https://www.iec.ch/ip-ratings",
    domain: "iec.ch",
  },
  {
    title: "GPS.gov — Küresel Uydu Konumlandırma Sistemi",
    url: "https://www.gps.gov",
    domain: "gps.gov",
  },
  {
    title: "6698 Sayılı KVKK Mevzuatı (Konum Gizliliği)",
    url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5",
    domain: "mevzuat.gov.tr",
  },
];

export default function BlogIndexPage() {
  const liveArticles = getLiveBlogArticles();
  const categories = getBlogCategories();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Life GO Mobil & Bataryalı Takip Rehberi",
    description:
      "Mıknatıslı ve bataryalı araç, motosiklet, tekne, nesne ve kişi takip cihazları hakkında 400 teknik mühendislik makalesi.",
    url: "https://lifegomobil.com/blog",
    inLanguage: "tr-TR",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRODUCT_GUIDE_ACCORDIONS.map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.content,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-[#070A10] text-slate-100">
        {/* Hero Header */}
        <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#0F1623] via-[#0B0F17] to-[#070A10] py-14 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
              <Link href="/" className="hover:text-orange-400 transition">
                Ana Sayfa
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-orange-400 font-bold">
                Blog &amp; Life GO Mobil Rehberi
              </span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Life GO Mobil &amp; Takip Sistemleri Bilgi Merkezi</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Mıknatıslı &amp; Bataryalı Takip Sistemleri{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                  Teknik Blog
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Araba, motosiklet, çekici, otobüs, tekne, konteyner, değerli
                nesne ve kişi takibi için 3.000 mAh&apos;den 20.000 mAh&apos;e
                kadar batarya süresi analizleri, N54 neodimyum mıknatıs montajı
                ve 2 yıllık M2M SIM saha Life GO Mobil verileri.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
          {liveArticles.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-400" />
                  <span>Yayındaki Rehberler ({liveArticles.length})</span>
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {categories.slice(0, 6).map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveArticles.map((art) => (
                  <article
                    key={art.id}
                    className="rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-orange-500/40 p-5 space-y-3 transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="text-orange-400 font-bold">
                          {art.category}
                        </span>
                        <span>{art.scheduledAt}</span>
                      </div>
                      <h3 className="text-base font-bold text-white hover:text-orange-400 transition">
                        <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-3">
                        {art.excerpt}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">
                        {art.recommendedMah} • {art.readTimeMinutes} dk
                      </span>
                      <Link
                        href={`/blog/${art.slug}`}
                        className="font-bold text-orange-400 flex items-center gap-1"
                      >
                        <span>Oku</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Product & Usage Guide Accordions (Always Visible for SEO & GEO) */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-400 uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  İNTERAKTİF ÜRÜN &amp; KULLANIM KILAVUZU
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Hangi Takip Cihazı Sizin İçin Doğru?
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Başlıklara tıklayarak teknik detayları açabilirsiniz
              </span>
            </div>

            <AccordionList
              items={PRODUCT_GUIDE_ACCORDIONS}
              theme="dark"
              defaultOpenIndex={0}
            />
          </section>

          {/* Internal & External Authority Links Grid */}
          <section className="grid lg:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sm font-black text-white">
                <Compass className="w-5 h-5 text-orange-400" />
                <span>Site İçi Hızlı Rehberler &amp; Araçlar</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {INTERNAL_RESOURCES.map((res) => (
                  <Link
                    key={res.href}
                    href={res.href}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/40 transition block space-y-1 group"
                  >
                    <div className="text-xs font-extrabold text-white group-hover:text-orange-400 transition">
                      {res.title}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {res.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sm font-black text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Resmi Standartlar &amp; Dış Referans Kaynakları</span>
              </div>
              <div className="space-y-2.5">
                {EXTERNAL_AUTHORITY_LINKS.map((ext) => (
                  <a
                    key={ext.url}
                    href={ext.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition">
                        {ext.title}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {ext.domain}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
