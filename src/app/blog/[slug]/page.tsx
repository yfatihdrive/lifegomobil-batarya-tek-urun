import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBlogArticleBySlug,
  getRelatedBlogArticles,
  readAllBlogArticles,
} from "@/lib/blog";
import {
  Calendar,
  Clock,
  User,
  Cpu,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Compass,
  BookOpen,
} from "lucide-react";
import AccordionList from "@/components/AccordionList";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug, true);
  if (!article) {
    return {
      title: "Makale Bulunamadı | LifeGo Mobil",
    };
  }

  const ogImage =
    article.images?.[0]?.src || "/images/blog/makale-001-gorsel-1.svg";

  const cleanTitle = article.seoTitle.replace(/\s*\|\s*LifeGo Mobil\s*$/i, "");

  return {
    title: `${cleanTitle} | LifeGo Mobil`,
    description: article.seoDescription,
    keywords: article.tags,
    alternates: {
      canonical: `https://lifegomobil.com/blog/${article.slug}`,
    },
    openGraph: {
      title: cleanTitle,
      description: article.seoDescription,
      url: `https://lifegomobil.com/blog/${article.slug}`,
      type: "article",
      publishedTime: article.scheduledAt,
      authors: [article.author],
      tags: article.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 675,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: article.seoDescription,
      images: [ogImage],
    },
  };
}

export default async function BlogArticleDetailPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const article = getBlogArticleBySlug(slug, preview === "1");

  if (!article) {
    notFound();
  }

  const related = getRelatedBlogArticles(article, 3);

  // Schema.org Structured Data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.images.map((img) => `https://lifegomobil.com${img.src}`),
    datePublished: article.scheduledAt,
    dateModified: article.scheduledAt,
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "LifeGo Mobil Telematik Sistemleri",
      url: "https://lifegomobil.com",
      logo: {
        "@type": "ImageObject",
        url: "https://lifegomobil.com/images/product-studio-main.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lifegomobil.com/blog/${article.slug}`,
    },
    keywords: article.tags.join(", "),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: "https://lifegomobil.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog & Rehber",
        item: "https://lifegomobil.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://lifegomobil.com/blog/${article.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data Script Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-[#070A10] text-slate-100">
        {/* Top Header & Breadcrumb */}
        <section className="border-b border-slate-800/80 bg-gradient-to-b from-[#0F1623] to-[#070A10] py-10 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Link href="/" className="hover:text-orange-400 transition">
                Ana Sayfa
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <Link href="/blog" className="hover:text-orange-400 transition">
                Blog &amp; Rehber
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-orange-400 font-bold truncate max-w-xs">
                {article.category}
              </span>
            </nav>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-black uppercase">
                  {article.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                  Hedef: {article.vehicleType}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1.5 ml-auto">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {article.scheduledAt}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                {article.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Author and Read Meta */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-black">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      {article.author}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {article.authorRole}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    {article.readTimeMinutes} Dakika Okuma
                  </span>
                  <span>•</span>
                  <span className="font-mono">{article.wordCount} Kelime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          {/* AI / GEO Key Takeaways Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-[#0A101D] border border-orange-500/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-sm font-black text-orange-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Özet Mühendislik Bulguları — GEO &amp; Hızlı İnceleme</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
              {article.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual #1 */}
          {article.images[0] && (
            <figure className="space-y-2 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
              <div className="relative h-64 sm:h-96 w-full">
                <Image
                  src={article.images[0].src}
                  alt={article.images[0].alt}
                  fill
                  className="object-contain"
                />
              </div>
              <figcaption className="text-center text-xs text-slate-400 italic pt-1">
                Görsel 1: {article.images[0].caption}
              </figcaption>
            </figure>
          )}

          {/* Table of Contents */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              İçindekiler &amp; Makale Akışı
            </h3>
            <ol className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {article.sections.map((sec, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="font-mono font-bold text-orange-400">
                    0{idx + 1}.
                  </span>
                  <span className="truncate">{sec.heading}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Sections 1 & 2 */}
          <div className="space-y-8 text-sm sm:text-base text-slate-300 leading-relaxed">
            {article.sections.slice(0, 2).map((sec, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-white border-b border-slate-800 pb-2">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Visual #2 - Battery & Models Infographic */}
          {article.images[1] && (
            <figure className="space-y-2 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
              <div className="relative h-64 sm:h-96 w-full">
                <Image
                  src={article.images[1].src}
                  alt={article.images[1].alt}
                  fill
                  className="object-contain"
                />
              </div>
              <figcaption className="text-center text-xs text-slate-400 italic pt-1">
                Görsel 2: {article.images[1].caption}
              </figcaption>
            </figure>
          )}

          {/* Product Purchase Conversion Card */}
          <div className="rounded-3xl bg-gradient-to-r from-orange-600 to-amber-600 p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider">
                Makale Tavsiyesi
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                {article.recommendedModel} ({article.recommendedMah})
              </h3>
              <p className="text-xs sm:text-sm text-orange-100 max-w-md">
                Bu kullanım senaryosuna en uygun modelimiz: Dahili N54 neodimyum mıknatıs,
                2 yıl M2M SIM kartı, kabin içi ses kayıt modülü ve mobil uygulama dahil!
              </p>
            </div>
            <div className="text-center md:text-right shrink-0 space-y-3">
              <div className="text-3xl font-black font-mono">
                {article.recommendedPrice}
              </div>
              <Link
                href="/#urun-secimi"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-sm shadow-xl transition"
              >
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span>Modeli İncele &amp; Satın Al</span>
              </Link>
            </div>
          </div>

          {/* Sections 3 & 4 */}
          <div className="space-y-8 text-sm sm:text-base text-slate-300 leading-relaxed">
            {article.sections.slice(2, 4).map((sec, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-white border-b border-slate-800 pb-2">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Technical Telemetry Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-orange-400" />
              <span>Teknik Telematik Parametre Tablosu</span>
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-300">
                    <th className="px-4 py-3 font-bold">Mühendislik Parametresi</th>
                    <th className="px-4 py-3 font-bold">Test Değeri &amp; Saha Spesifikasyonu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {article.telemetryTable.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900/40">
                      <td className="px-4 py-2.5 font-medium text-slate-400">
                        {row.param}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-orange-300 font-semibold">
                        {row.val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sections 5 & 6 */}
          <div className="space-y-8 text-sm sm:text-base text-slate-300 leading-relaxed">
            {article.sections.slice(4).map((sec, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-white border-b border-slate-800 pb-2">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Visual #3 - Mounting Guide */}
          {article.images[2] && (
            <figure className="space-y-2 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
              <div className="relative h-64 sm:h-96 w-full">
                <Image
                  src={article.images[2].src}
                  alt={article.images[2].alt}
                  fill
                  className="object-contain"
                />
              </div>
              <figcaption className="text-center text-xs text-slate-400 italic pt-1">
                Görsel 3: {article.images[2].caption}
              </figcaption>
            </figure>
          )}

          {/* Technical Deep-Dive Accordion Explanations */}
          {article.accordionDetails && article.accordionDetails.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-800/80">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>Teknik Detaylar &amp; Saha Açıklamaları (Akordiyon)</span>
              </h3>
              <AccordionList
                items={article.accordionDetails.map((d, i) => ({
                  badge: `DETAY 0${i + 1}`,
                  title: d.title,
                  content: d.content,
                }))}
                theme="dark"
                defaultOpenIndex={0}
              />
            </div>
          )}

          {/* FAQ Accordion Block */}
          <div className="space-y-4 pt-6 border-t border-slate-800/80">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-orange-400" />
              <span>Sıkça Sorulan Sorular &amp; Uzman Cevapları</span>
            </h3>
            <AccordionList
              items={article.faqs.map((faq) => ({
                badge: "SORU",
                title: faq.q,
                content: faq.a,
              }))}
              theme="dark"
              defaultOpenIndex={0}
            />
          </div>

          {/* Internal & External Authority Links */}
          <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-slate-800/80">
            {article.internalLinks && article.internalLinks.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>İlgili Site İçi Rehberler &amp; Araçlar</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  {article.internalLinks.map((lnk, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={lnk.href}
                        className="text-slate-200 hover:text-orange-400 transition font-semibold underline decoration-slate-700 hover:decoration-orange-400 underline-offset-2"
                      >
                        → {lnk.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {article.externalLinks && article.externalLinks.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Resmi Standartlar &amp; Dış Referanslar</span>
                </h4>
                <ul className="space-y-2.5 text-xs">
                  {article.externalLinks.map((ext, eIdx) => (
                    <li key={eIdx}>
                      <a
                        href={ext.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-200 hover:text-emerald-300 transition font-semibold flex items-start justify-between gap-2 group"
                      >
                        <span>
                          {ext.title}
                          <span className="block text-[11px] text-slate-400 font-normal">
                            {ext.topic} ({ext.domain})
                          </span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 mt-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-800/80">
            <span className="text-xs font-bold text-slate-400 mr-2">Etiketler:</span>
            {article.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Internal Links & Navigation Back */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tüm Blog Makalelerine Dön</span>
            </Link>
            <div className="flex items-center gap-3 text-xs">
              <Link href="/#batarya-hesapla" className="text-slate-400 hover:text-white">
                Batarya Hesaplayıcı
              </Link>
              <span>•</span>
              <Link href="/#montaj-rehberi" className="text-slate-400 hover:text-white">
                Montaj Kılavuzu
              </Link>
              <span>•</span>
              <Link href="/#urun-secimi" className="text-slate-400 hover:text-white">
                Fiyat Listesi
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="space-y-4 pt-10 border-t border-slate-800">
              <h3 className="text-lg font-black text-white">
                Benzer Telematik &amp; Takip Makaleleri
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/40 transition block space-y-2 group"
                  >
                    <span className="text-[10px] text-orange-400 font-bold uppercase">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition line-clamp-2">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 block">
                      {rel.recommendedMah} • {rel.readTimeMinutes} dk okuma
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
