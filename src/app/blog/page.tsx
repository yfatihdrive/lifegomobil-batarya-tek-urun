import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getLiveBlogArticles,
  getBlogCategories,
} from "@/lib/blog";
import {
  BookOpen,
  Calendar,
  Sparkles,
  ChevronRight,
  PenTool,
  Clock,
  ArrowRight,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Mühendislik Kılavuzları | LifeGo Mobil Bataryalı Takip Cihazı",
  description:
    "Mıknatıslı araç, motosiklet, tekne, nesne takip cihazı ve bataryalı takip sistemleri üzerine teknik mühendislik makaleleri, pil ömrü testleri ve montaj rehberleri.",
  alternates: {
    canonical: "https://lifegomobil.com/blog",
  },
};

export default function BlogIndexPage() {
  const liveArticles = getLiveBlogArticles();
  const categories = getBlogCategories();

  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#0F1623] via-[#0B0F17] to-[#070A10] py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link href="/" className="hover:text-orange-400 transition">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-orange-400 font-bold">Blog &amp; Telematik Rehberi</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Telematik &amp; Takip Sistemleri Rehberi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Mıknatıslı &amp; Bataryalı Takip Sistemleri{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                Teknik Blog
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Araba, motosiklet, çekici, otobüs, tekne, konteyner ve değerli nesneler için
              3.000 mAh &apos;den 20.000 mAh &apos;e kadar batarya süresi hesaplamaları, N54 neodimyum
              mıknatıs montajı ve saha telematik verileri.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {liveArticles.length === 0 ? (
          <div className="p-12 sm:p-16 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center mx-auto">
              <PenTool className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white">
              Blog İçerikleri Hazırlanıyor
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Mühendislerimiz ve telematik uzmanlarımız tarafından hazırlanan %100 özgün,
              saha testlerine dayalı rehber ve teknik analizler yakında bu bölümde yayınlanacaktır.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition"
              >
                <span>Ürün Özelliklerini İncele</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveArticles.map((art) => (
              <article
                key={art.id}
                className="rounded-3xl bg-slate-900/60 border border-slate-800 p-5 space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="text-orange-400 font-bold">{art.category}</span>
                  <span>{art.scheduledAt}</span>
                </div>
                <h3 className="text-base font-bold text-white hover:text-orange-400 transition">
                  <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                </h3>
                <p className="text-xs text-slate-300 line-clamp-3">{art.excerpt}</p>
                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/blog/${art.slug}`}
                    className="text-xs font-bold text-orange-400 flex items-center gap-1"
                  >
                    <span>Oku</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
