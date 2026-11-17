"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Magnet,
  BatteryCharging,
  Droplets,
  BellRing,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Check,
  Star,
  Truck,
  Smartphone,
  Cpu,
  Plus,
  Minus,
  CheckCircle2,
  XCircle,
  ChevronDown,
  PackageCheck,
  Sparkles,
  Award,
  Radio,
  Volume2,
  Mic,
  Anchor,
  Box,
  UserCheck,
  Car,
  Bike,
  Play,
  Video,
} from "lucide-react";
import {
  PRODUCT_IMAGES,
  SOLAR_PRODUCT_IMAGES,
  LG1000_PRODUCT_IMAGES,
  PRODUCT_PACKAGES,
  PRODUCT_ADDONS,
  TECHNICAL_SPECS,
  CUSTOMER_REVIEWS,
  FAQ_ITEMS,
} from "@/data/product";
import { useCart, formatTRY } from "@/context/CartContext";
import LiveTelemetryDemo from "@/components/LiveTelemetryDemo";
import MountingGuide from "@/components/MountingGuide";
import BatteryCalculator from "@/components/BatteryCalculator";
import ProductPromoVideo from "@/components/ProductPromoVideo";
import AccordionList from "@/components/AccordionList";

/**
 * Parses a YouTube URL, iframe code, or 11-char video ID into a clean embed URL.
 */
function getYouTubeEmbedUrl(rawInput?: string): string | null {
  if (!rawInput) return null;
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  // If user pasted full <iframe> code, extract src
  const iframeSrcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  const target = iframeSrcMatch ? iframeSrcMatch[1] : trimmed;

  // Match standard YouTube patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = target.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1`;
    }
  }
  return null;
}

export default function HomePage() {
  const router = useRouter();
  const { addToCart, siteConfig, buildWhatsAppUrl } = useCart();

  // Gallery State
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showGalleryVideo, setShowGalleryVideo] = useState(false);

  // Configurator State (default to 6.000 mAh popular model)
  const [selectedPkgId, setSelectedPkgId] = useState(
    PRODUCT_PACKAGES[1]?.id || PRODUCT_PACKAGES[0].id
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // FAQ State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const selectedPkg =
    PRODUCT_PACKAGES.find((p) => p.id === selectedPkgId) || PRODUCT_PACKAGES[0];
  const isSolarSelected = selectedPkg.id === "model-solar-10000mah";
  const isLg1000Selected = selectedPkg.id === "model-10000mah";
  const galleryImages = isSolarSelected
    ? SOLAR_PRODUCT_IMAGES
    : isLg1000Selected
    ? LG1000_PRODUCT_IMAGES
    : PRODUCT_IMAGES;
  const safeImageIdx =
    activeImageIdx < galleryImages.length ? activeImageIdx : 0;

  const handleSelectPackage = (pkgId: string) => {
    const prevGallery =
      selectedPkgId === "model-solar-10000mah"
        ? "solar"
        : selectedPkgId === "model-10000mah"
        ? "lg1000"
        : "default";
    const nextGallery =
      pkgId === "model-solar-10000mah"
        ? "solar"
        : pkgId === "model-10000mah"
        ? "lg1000"
        : "default";
    setSelectedPkgId(pkgId);
    if (prevGallery !== nextGallery) {
      setActiveImageIdx(0);
      setShowGalleryVideo(false);
    }
  };

  const addonsSum = PRODUCT_ADDONS.filter((a) =>
    selectedAddonIds.includes(a.id)
  ).reduce((sum, a) => sum + a.price, 0);

  const totalPrice = (selectedPkg.price + addonsSum) * quantity;
  const totalOldPrice = (selectedPkg.oldPrice + addonsSum) * quantity;
  const bankDiscountedPrice = Math.round(
    totalPrice * (1 - siteConfig.bankTransferDiscountPercent / 100)
  );

  const youtubeEmbedUrl = getYouTubeEmbedUrl(siteConfig.youtubeVideoUrl);

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBuyNow = () => {
    addToCart(selectedPkg.id, quantity, selectedAddonIds, false);
    router.push("/siparis");
  };

  const handleAddToCart = () => {
    addToCart(selectedPkg.id, quantity, selectedAddonIds, true);
  };

  const handleQuickModelOrder = (pkgId: string, directCheckout: boolean) => {
    setSelectedPkgId(pkgId);
    addToCart(pkgId, 1, selectedAddonIds, !directCheckout);
    if (directCheckout) {
      router.push("/siparis");
    }
  };

  const whatsappDirectProductUrl = buildWhatsAppUrl(
    [
      `Merhaba *${siteConfig.brandName}*, web sitenizden *${selectedPkg.name}* (${selectedPkg.mah} mAh Bataryalı Takip Cihazı - ${quantity} Adet) için bilgi almak / sipariş oluşturmak istiyorum.`,
      selectedAddonIds.length > 0
        ? `Ekstra Seçimlerim: ${PRODUCT_ADDONS.filter((a) =>
            selectedAddonIds.includes(a.id)
          )
            .map((a) => a.name)
            .join(", ")}`
        : "",
      `Toplam Tutar: ${formatTRY(totalPrice)} (Havale İndirimli: ${formatTRY(
        bankDiscountedPrice
      )})`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return (
    <div className="bg-white">
      {/* =========================================================
          1. HERO PRODUCT SHOWCASE & CONFIGURATOR (#urun-secimi)
      ========================================================= */}
      <section
        id="urun-secimi"
        className="bg-gradient-to-b from-[#0B0F17] via-[#0F1623] to-[#111827] text-white pt-6 pb-16 md:py-14 border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top Breadcrumb & Social Proof Strip */}
          <div className="flex flex-col gap-4 pb-6 mb-6 border-b border-slate-800/80">
            {/* Full-Width Glowing Animated Hero Headline Banner */}
            <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-orange-950/80 via-[#131C2E] to-orange-950/80 border-2 border-orange-500/70 px-4 py-4 sm:py-5 text-center animate-glow-box">
              {/* Sweeping Light Beam Effect */}
              <div className="pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent animate-light-sweep" />

              <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-[11px] sm:text-xs font-extrabold text-amber-300 uppercase tracking-widest mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>%100 KABLOSUZ • MONTAJSIZ • TAK-ÇALIŞTIR</span>
                </div>

                <div className="w-full flex flex-col items-center justify-center leading-tight tracking-tight font-black uppercase">
                  <span className="block w-full text-2xl sm:text-3xl md:text-4xl animate-neon-text">
                    MIKNATISLI &amp; BATARYALI
                  </span>
                  <span className="block w-full text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-[0_0_14px_rgba(251,146,60,0.75)] mt-0.5">
                    TAKİP CİHAZI SİSTEMİ
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-features & Rating Bar */}
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-2 w-full">
                <div className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-emerald-950/90 border border-emerald-400/60 shadow-lg shadow-emerald-500/15 text-center whitespace-nowrap overflow-hidden">
                  <BatteryCharging className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 animate-pulse" />
                  <span className="text-[11.5px] sm:text-sm md:text-base font-black text-emerald-300 tracking-tight">
                    2 YIL BATARYA SÜRESİ{" "}
                    <span className="text-white font-bold">
                      ( Tek şarj ile 2 yıl kullanım )
                    </span>
                  </span>
                </div>

                {/* Full-Width Glowing Animated Feature Banner: Microphone + 2 Years SIM */}
                <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-950/95 via-[#0F2922] to-emerald-950/95 border-2 border-emerald-400/80 px-2.5 py-2.5 text-center animate-emerald-glow">
                  <div className="pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent animate-light-sweep" />
                  <div className="relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0 animate-bounce" />
                    <span className="text-[11.5px] sm:text-base md:text-xl font-black tracking-tight animate-emerald-neon-text">
                      • Dahili Mikrofon (Ses Kayıt) + 2 Yıllık M2M SIM Dahil
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center sm:justify-end">
                <a
                  href="#musteri-yorumlari"
                  className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 px-3.5 py-2 rounded-full transition cursor-pointer group"
                >
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-extrabold text-white">4.9 / 5</span>
                  <span className="text-slate-400 group-hover:text-amber-300 transition underline decoration-slate-600 group-hover:decoration-amber-400 underline-offset-2">
                    (1.480+ Araç, Moto, Tekne &amp; Filo Kullanıcısı)
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT COLUMN: Product Gallery & Core Hardware Badges (6 cols) */}
            <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
              {/* Main Image or 60s YouTube / MP4 Video Frame */}
              <div className="relative rounded-3xl bg-[#070A10] border border-slate-800 overflow-hidden aspect-4/3 flex items-center justify-center group shadow-2xl">
                {showGalleryVideo ? (
                  youtubeEmbedUrl ? (
                    <iframe
                      src={youtubeEmbedUrl}
                      title="LifeGo Mobil Bataryalı Takip Cihazı 60 Saniye Tanıtım Videosu"
                      className="w-full h-full bg-black"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src="/videos/lifego-bataryali-takip-60sn.mp4?v=3"
                      poster="/videos/lifego-bataryali-takip-60sn-poster.jpg?v=3"
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  )
                ) : (
                  <>
                    <img
                      src={galleryImages[safeImageIdx].src}
                      alt={galleryImages[safeImageIdx].alt}
                      className={`w-full h-full transition-transform duration-500 group-hover:scale-[1.02] ${
                        isSolarSelected || isLg1000Selected
                          ? "object-contain bg-white"
                          : "object-cover"
                      }`}
                    />

                    {/* Top Left Hardware Badge */}
                    <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#0B0F17]/90 backdrop-blur-md border border-orange-500/40 text-orange-400 text-xs font-extrabold shadow-lg">
                      {galleryImages[safeImageIdx].badge}
                    </div>

                    {/* Top Right Watch 60s Video Button */}
                    <button
                      type="button"
                      onClick={() => setShowGalleryVideo(true)}
                      className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-black tracking-wide shadow-lg flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>60 Sn Tanıtım Videosu (4 Model)</span>
                    </button>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-10 flex items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-100">
                        {galleryImages[safeImageIdx].caption}
                      </p>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {safeImageIdx + 1} / {galleryImages.length}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              <div className="grid grid-cols-6 gap-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => {
                      setShowGalleryVideo(false);
                      setActiveImageIdx(idx);
                    }}
                    className={`relative rounded-2xl overflow-hidden aspect-4/3 border-2 transition cursor-pointer ${
                      !showGalleryVideo && safeImageIdx === idx
                        ? "border-orange-500 ring-2 ring-orange-500/30 scale-[1.02]"
                        : "border-slate-800 opacity-65 hover:opacity-100 hover:border-slate-600"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}

                {/* 6th Thumbnail: Play 60s Product Video / YouTube */}
                <button
                  type="button"
                  onClick={() => setShowGalleryVideo(true)}
                  className={`relative rounded-2xl overflow-hidden aspect-4/3 border-2 transition cursor-pointer bg-slate-900 flex flex-col items-center justify-center gap-1 ${
                    showGalleryVideo
                      ? "border-red-500 ring-2 ring-red-500/30 scale-[1.02]"
                      : "border-red-500/50 hover:border-red-500"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                    {youtubeEmbedUrl ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    )}
                  </div>
                  <span className="text-[10px] font-black text-red-400">
                    60sn VİDEO
                  </span>
                </button>
              </div>

              {/* 4 Pillar Hardware Specs under Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90">
                  <Mic className="w-5 h-5 text-orange-500 mb-1.5" />
                  <div className="text-xs font-extrabold text-white">
                    Ses Kayıt Etme
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Araç İçi Hassas Mikrofon
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90">
                  <BatteryCharging className="w-5 h-5 text-emerald-400 mb-1.5" />
                  <div className="text-xs font-extrabold text-white">
                    4 Batarya Modeli
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    3000•6000•10000•20000mAh
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90">
                  <Magnet className="w-5 h-5 text-sky-400 mb-1.5" />
                  <div className="text-xs font-extrabold text-white">
                    N54 Mıknatıslı
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    42 kg Çekim • 0 Kablo
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90">
                  <Droplets className="w-5 h-5 text-amber-400 mb-1.5" />
                  <div className="text-xs font-extrabold text-white">
                    IP67 &amp; Sabotaj
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Su Geçirmez &amp; Sökülme Alarmı
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Title, 4-Model Selector & Buy Box (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-extrabold mb-3">
                  <Radio className="w-3.5 h-3.5" />
                  MIKNATISLI ARAÇ, MOTOSİKLET, TEKNE &amp; NESNE TAKİP CİHAZI
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-[1.15]">
                  LifeGo Mobil{" "}
                  <span className="text-orange-500">
                    Bataryalı Araç, Tekne, Motosiklet, Nesne ve Kişi Takip Cihazı ve Sistemi
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                  Kablo kesmeden saniyeler içinde metal yüzeye tutunan{" "}
                  <strong>Mıknatıslı ve Bataryalı Takip Cihazı</strong>.{" "}
                  <strong>Dahili hassas mikrofonu</strong> sayesinde araç içine
                  konulduğunda kabin içindeki sesleri net şekilde kayıt
                  edebilir;{" "}
                  <strong>3.000 mAh, 6.000 mAh, 10.000 mAh ve 20.000 mAh</strong>{" "}
                  olmak üzere 4 farklı batarya kapasitesiyle araba, otobüs,
                  çekici, kamyon, tekne, motosiklet ve konteynerlerinizi 2 yıla
                  varan pil ömrüyle takip edebilirsiniz.
                </p>
              </div>

              {/* Price & Havale Discount Card */}
              <div className="p-5 rounded-3xl bg-slate-900/95 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      SEÇİLEN MODEL: {selectedPkg.mah.toLocaleString("tr-TR")} mAh BATARYALI TAKİP CİHAZI
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                        {formatTRY(totalPrice)}
                      </span>
                      <span className="text-base text-slate-500 line-through font-mono">
                        {formatTRY(totalOldPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                      {formatTRY(totalOldPrice - totalPrice)} Avantaj
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-1">
                      {selectedPkg.activeDaysText} • {selectedPkg.standbyDaysText}
                    </span>
                  </div>
                </div>

                {/* Bank Transfer 5% Discount Highlight */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                      %{siteConfig.bankTransferDiscountPercent}
                    </span>
                    <div>
                      <div className="text-xs font-extrabold text-emerald-300">
                        Havale / EFT ile Ödemede Anında İndirimli Fiyat:
                      </div>
                      <div className="text-[11px] text-emerald-400/80">
                        Kapıda Ödeme veya Kredi Kartı seçeneği de mevcuttur
                      </div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono shrink-0">
                    {formatTRY(bankDiscountedPrice)}
                  </div>
                </div>
              </div>

              {/* STEP 1: 4 Battery Capacity Model Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    1. BATARYA KAPASİTESİNİ SEÇİN (4 FARKLI MODEL MEVCUTTUR)
                  </label>
                  <span className="text-[11px] text-orange-400 font-semibold">
                    Dahili Mikrofon + 2 Yıllık M2M SIM Dahil
                  </span>
                </div>

                <div className="space-y-2.5">
                  {PRODUCT_PACKAGES.map((pkg) => {
                    const isSelected = pkg.id === selectedPkgId;
                    const isSolarPkg = pkg.id === "model-solar-10000mah";
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => handleSelectPackage(pkg.id)}
                        className={`p-4 rounded-2xl border-2 transition cursor-pointer ${
                          isSelected
                            ? isSolarPkg
                              ? "bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/15"
                              : "bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/10"
                            : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                                isSelected
                                  ? "border-orange-500 bg-orange-500 text-white"
                                  : "border-slate-600"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm sm:text-base font-black text-white">
                                  {pkg.name}
                                </span>
                                {pkg.badge && (
                                  <span
                                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                      pkg.popular
                                        ? "bg-orange-500 text-white"
                                        : isSolarPkg
                                        ? "bg-amber-400 text-slate-950 font-black"
                                        : "bg-slate-800 text-emerald-400 border border-slate-700"
                                    }`}
                                  >
                                    {pkg.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-300 mt-1">
                                {pkg.shortDesc}
                              </p>
                              {/* Calculated Battery Duration Pills */}
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-orange-300 border border-slate-700">
                                  ⚡ Canlı Takip: {pkg.activeDaysText}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                                  🔋 Bekleme/Nöbet: {pkg.standbyDaysText}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                                  🎙️ Ses Kayıt: Aktif
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-base sm:text-lg font-black text-white font-mono">
                              {formatTRY(pkg.price)}
                            </div>
                            <div className="text-[11px] text-slate-500 line-through font-mono">
                              {formatTRY(pkg.oldPrice)}
                            </div>
                          </div>
                        </div>

                        {/* Big Bold Solar Self-Charging Banner & 6-Image Gallery Preview when Selected */}
                        {isSelected && isSolarPkg && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4 pt-4 border-t border-amber-400/30 space-y-3"
                          >
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-emerald-500/20 border-2 border-amber-400/80 text-center space-y-1.5 shadow-lg">
                              <div className="text-base sm:text-xl font-black text-amber-300 leading-tight tracking-tight uppercase">
                                ☀️ GÜNEŞ ENERJİSİ İLE KENDİ KENDİNİ ŞARJ EDER!
                              </div>
                              <div className="text-sm sm:text-lg font-black text-white leading-snug">
                                BU SAYEDE YILLARCA ŞARJA TAKMADAN KESİNTİSİZ ÇALIŞIR
                              </div>
                              <p className="text-xs text-emerald-300 font-bold">
                                10.000 mAh Batarya + Entegre Solar Panel (GF70L) • Kablo &amp; Şarj Derdi Yok!
                              </p>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                              {SOLAR_PRODUCT_IMAGES.map((sImg, sIdx) => (
                                <button
                                  key={sImg.id}
                                  type="button"
                                  onClick={() => {
                                    setShowGalleryVideo(false);
                                    setActiveImageIdx(sIdx);
                                  }}
                                  className={`rounded-xl overflow-hidden border-2 aspect-4/3 bg-white cursor-pointer transition ${
                                    safeImageIdx === sIdx
                                      ? "border-amber-400 ring-2 ring-amber-400/40 scale-[1.03]"
                                      : "border-slate-700 opacity-85 hover:opacity-100"
                                  }`}
                                  title={sImg.caption}
                                >
                                  <img
                                    src={sImg.src}
                                    alt={sImg.alt}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 5-Image Gallery Preview when 10.000 mAh LG-1000 Max is Selected */}
                        {isSelected && pkg.id === "model-10000mah" && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4 pt-3 border-t border-orange-500/30 space-y-2.5"
                          >
                            <div className="text-xs font-extrabold text-orange-300">
                              📸 LG-1000 Max (GF60/60L) 10.000 mAh Ürün Görselleri:
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {LG1000_PRODUCT_IMAGES.map((lImg, lIdx) => (
                                <button
                                  key={lImg.id}
                                  type="button"
                                  onClick={() => {
                                    setShowGalleryVideo(false);
                                    setActiveImageIdx(lIdx);
                                  }}
                                  className={`rounded-xl overflow-hidden border-2 aspect-4/3 bg-white cursor-pointer transition ${
                                    safeImageIdx === lIdx
                                      ? "border-orange-400 ring-2 ring-orange-400/40 scale-[1.03]"
                                      : "border-slate-700 opacity-85 hover:opacity-100"
                                  }`}
                                  title={lImg.caption}
                                >
                                  <img
                                    src={lImg.src}
                                    alt={lImg.alt}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Optional Add-ons */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 block">
                  2. OPSİYONEL EKSTRA KORUMA &amp; SÜRE UZATMA (İSTEĞE BAĞLI)
                </label>

                {PRODUCT_ADDONS.map((addon) => {
                  const checked = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        checked
                          ? "bg-emerald-500/10 border-emerald-500/50"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="mt-1 rounded accent-emerald-500 pointer-events-none"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-extrabold text-white">
                              {addon.name}
                            </span>
                            {addon.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                {addon.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {addon.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-mono font-black text-emerald-400 shrink-0">
                        +{formatTRY(addon.price)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* STEP 3: Quantity & Action Buttons */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between sm:justify-start bg-slate-900 border border-slate-700 rounded-2xl px-3 h-14 sm:w-36 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                      aria-label="Miktarı Azalt"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-mono font-black text-base text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-xl hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                      aria-label="Miktarı Artır"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 h-14 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-black text-sm flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5 text-orange-400" />
                    <span>SEPETE EKLE</span>
                  </button>

                  {/* Direct Checkout Button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 h-14 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 transition active:scale-[0.99] cursor-pointer"
                  >
                    <span>HEMEN SİPARİŞ VER</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* WhatsApp Order / Ask Button */}
                <a
                  href={whatsappDirectProductUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 text-center shadow-lg shadow-emerald-600/20 transition"
                >
                  <MessageCircle className="w-5 h-5 fill-white/15 shrink-0" />
                  <span className="leading-snug">
                    WHATSAPP İLE SİPARİŞ VER VEYA UZMANA SOR ({siteConfig.whatsappDisplay})
                  </span>
                </a>
              </div>

              {/* Trust & Guarantee Micro-Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <Truck className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Aynı Gün Ücretsiz Kargo</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>iOS &amp; Android Türkçe Panel</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>2 Yıl Resmi Garanti</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          1.2. IN-CABIN MICROPHONE (VOICE LISTEN) & 8 VEHICLE/ASSET TYPES
      ========================================================= */}
      <section className="py-16 md:py-24 bg-[#0B0F17] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          {/* PART A: In-Cabin Voice Recording (Dahili Hassas Mikrofon) */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#111827] to-slate-950 border border-orange-500/40 p-5 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[11px] sm:text-xs font-extrabold max-w-full">
                  <Volume2 className="w-4 h-4 shrink-0" />
                  <span className="leading-tight">
                    DAHİLİ HASSAS MİKROFON (SES KAYIT ETME) ÖZELLİĞİ
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                  Araç İçine Konulduğunda{" "}
                  <span className="text-orange-500">
                    Kabin İçi Sesleri Net Şekilde Kayıt Edin ve Algılayın!
                  </span>
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  LifeGo Mobil <strong>Bataryalı Takip Cihazı</strong> modellerimizin
                  tamamında yüksek kazançlı, gürültü filtreli{" "}
                  <strong>Silikon MEMS Mikrofon</strong> yerleşik olarak bulunur.
                  Cihazı araç kabini içine (koltuk altındaki metal kızaklara,
                  torpido gözü arkasına, orta konsola veya bagaj içine)
                  yerleştirdiğinizde, mobil uygulama üzerinden{" "}
                  <strong>araç içindeki sesleri telefonunuzdan net olarak kayıt edebilir ve kontrol edebilirsiniz.</strong>
                </p>

                <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
                    <div className="text-xs font-black text-orange-400">
                      🎙️ 360° Net Ses Algılama (5–8 Metre)
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Yol ve motor uğultusunu süzerek kabin içindeki akustik sesleri
                      netleştiren DSP ses filtresi.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
                    <div className="text-xs font-black text-emerald-400">
                      🔇 %100 Sessiz ve Işıksız Çalışma
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ses kayıt esnasında cihaz üzerinde hiçbir ışık yanmaz, bip sesi
                      veya titreşim kesinlikle oluşmaz.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
                    <div className="text-xs font-black text-sky-400">
                      🧲 Koltuk Altı Metal Kızaklara 3 Sn&apos;de Tutunur
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      N54 mıknatısı sayesinde koltuk altındaki demir kızaklara
                      yapışır, araç sarsılsa bile düşmez.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
                    <div className="text-xs font-black text-amber-400">
                      📱 Tek Dokunuşla Mobil Uygulamadan Ses Kayıt
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      iOS ve Android Türkçe uygulama içindeki &ldquo;Ses Kayıt
                      Modülü&rdquo; butonuyla anında erişim.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acoustic Waveform Visual Card */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-[#070A10] border border-slate-800 p-6 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-extrabold tracking-wider text-white">
                        KABİN İÇİ SES KAYIT MODÜLÜ AKTİF
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                      HD MEMS MİKROFON
                    </span>
                  </div>

                  {/* Visual Equalizer Bars */}
                  <div className="py-6 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center gap-1.5 h-36">
                    {[
                      35, 65, 45, 85, 95, 60, 40, 75, 100, 80, 50, 90, 70, 45,
                      85, 60, 95, 55, 40, 75, 60, 35,
                    ].map((h, idx) => (
                      <div
                        key={idx}
                        style={{ height: `${h}%` }}
                        className={`w-2 rounded-full ${
                          idx % 3 === 0
                            ? "bg-orange-500"
                            : idx % 2 === 0
                            ? "bg-sky-400"
                            : "bg-emerald-400"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                      <span className="text-slate-400">Önerilen İç Konumlar:</span>
                      <span className="font-bold text-white">
                        Koltuk Altı Metal Kızak / Torpido Arkası
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                      <span className="text-slate-400">Ses Algılama Çapı:</span>
                      <span className="font-bold text-emerald-400">
                        Kabin İçi 360° (5 - 8 Metre)
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-400">Tüm Modellerde Mevcut mu?</span>
                      <span className="font-bold text-orange-400">
                        Evet (3000 / 6000 / 10000 / 20000 mAh)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PART B: 8 Vehicle, Vessel, Container, Object & Person Tracking Scenarios */}
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold mb-3">
                MIKNATISLI &amp; BATARYALI TAKİP CİHAZI KULLANIM ALANLARI
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Araba, Otobüs, Çekici, Kamyon, Tekne, Motosiklet, Konteyner ve Nesne Takibi
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2">
                Kablo bağlantısı gerektirmediği için saniyeler içinde istediğiniz
                araç, deniz aracı veya değerli nesneye yerleştirip takip
                edebilirsiniz:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Araba & SUV Takip Cihazı",
                  sub: "Koltuk Altı Ses Kayıt & Şasi Montaj",
                  desc: "Binek otomobil ve SUV araçlarda şasi altına mıknatısla veya kabin içine ses kayıt etme amaçlı saniyeler içinde yerleştirilir.",
                  modelRec: "Önerilen: 6.000 mAh / 10.000 mAh",
                  col: "border-orange-500/40",
                },
                {
                  title: "Motosiklet & Kurye Takip",
                  sub: "Akü Bitirmez • Garantiyi Bozmaz",
                  desc: "Motosiklet aküsüne bağlanmaz, aküyü asla bitirmez. Sele altına veya arka çanta içine yerleştirilir, sarsıntıda anında alarm verir.",
                  modelRec: "Önerilen: 3.000 mAh / 6.000 mAh",
                  col: "border-sky-500/40",
                },
                {
                  title: "Yolcu Otobüsü & Servis",
                  sub: "Şehirlerarası Rota & Kabin Takibi",
                  desc: "Yolcu otobüsleri, personel ve okul servislerinde durak saatlerini, hız limitlerini ve 90 günlük geçmiş güzergahı kaydeder.",
                  modelRec: "Önerilen: 10.000 mAh / 20.000 mAh",
                  col: "border-emerald-500/40",
                },
                {
                  title: "Tır Çekicisi & Dorseler",
                  sub: "Ağır Vasıta & Uzun Yol Filo Takibi",
                  desc: "Çekici kontak kapatsa veya dorse çekiciden ayrılsa bile kendi dev bataryasıyla aylarca kesintisiz konum bildirmeye devam eder.",
                  modelRec: "Önerilen: 10.000 mAh / 20.000 mAh",
                  col: "border-amber-500/40",
                },
                {
                  title: "Nakliye Kamyonu & Kamyonet",
                  sub: "Yük, Kasa & Yakıt Güvenliği",
                  desc: "Kamyon şasisine N54 mıknatısla kilitlenir. Bölge dışına çıkma (Coğrafi Çit) ve mesai dışı hareket alarmlarıyla tam kontrol sağlar.",
                  modelRec: "Önerilen: 10.000 mAh / 20.000 mAh",
                  col: "border-orange-500/40",
                },
                {
                  title: "Tekne, Yat & Dıştan Takma Motor",
                  sub: "IP67 Su Geçirmez Marin Takip Cihazı",
                  desc: "Deniz suyuna, neme ve yağmura dayanıklı IP67 zırhlı gövdesiyle tekne, yat ve botlarınızda koy içi çapa/hareket alarmı sunar.",
                  modelRec: "Önerilen: 10.000 mAh / 20.000 mAh",
                  col: "border-sky-500/40",
                },
                {
                  title: "Lojistik Konteyner & Yük",
                  sub: "2 Yıla Varan Nöbet & Sökülme Alarmı",
                  desc: "Demiryolu, deniz ve kara konteynerlerinin metal yüzeyine yapışır. 20.000 mAh model ile 730 güne kadar pil ömrü sağlar.",
                  modelRec: "Önerilen: 20.000 mAh Ekstra Güç",
                  col: "border-emerald-500/40",
                },
                {
                  title: "Nesne, Ekipman & Kişi Takibi",
                  sub: "Çanta, Jeneratör, Kovan & Saha Ekibi",
                  desc: "Sırt çantası, evrak çantası, jeneratör, iş makinesi, arı kovanı ve saha personeli için taşınabilir bataryalı takip sistemi.",
                  modelRec: "Önerilen: 3.000 mAh / 6.000 mAh",
                  col: "border-amber-500/40",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`rounded-3xl bg-slate-900/90 border ${item.col} p-5 flex flex-col justify-between space-y-3 hover:bg-slate-900 transition`}
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold text-orange-400 uppercase tracking-wider block">
                      {item.sub}
                    </span>
                    <h3 className="text-base font-black text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                    <span>{item.modelRec}</span>
                    <a
                      href="#urun-secimi"
                      className="text-white hover:text-orange-400 font-sans font-bold underline"
                    >
                      Seç →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          1.4. 4 BATTERY MODELS COMPARISON & DIRECT CART SECTION
      ========================================================= */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-extrabold mb-3">
              <BatteryCharging className="w-4 h-4" />
              3.000 mAh • 6.000 mAh • 10.000 mAh • 20.000 mAh (4 MODEL MEVCUTTUR)
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              4 Farklı Bataryalı Takip Cihazı Modeli ve Pil Süreleri
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Tüm modellerimizde <strong>N54 Mıknatıs</strong>,{" "}
              <strong>Dahili Hassas Mikrofon (Araç İçi Ses Kayıt Etme)</strong>,{" "}
              <strong>IP67 Su Geçirmezlik</strong> ve{" "}
              <strong>1 Yıllık M2M SIM Hat</strong> standart olarak dahildir.
              İhtiyacınız olan batarya süresine göre modelinizi doğrudan sepete
              ekleyebilirsiniz:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCT_PACKAGES.map((pkg) => {
              const isSelected = pkg.id === selectedPkgId;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-3xl bg-white border-2 p-6 flex flex-col justify-between transition shadow-sm hover:shadow-xl ${
                    pkg.popular
                      ? "border-orange-500 ring-4 ring-orange-500/10"
                      : isSelected
                      ? "border-slate-900"
                      : "border-slate-200"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-mono text-xs font-black">
                        {pkg.mah.toLocaleString("tr-TR")} mAh
                      </span>
                      {pkg.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                            pkg.popular
                              ? "bg-orange-500 text-white"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-950">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {pkg.shortDesc}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Canlı Aktif Takip:</span>
                        <span className="font-black text-slate-900">
                          {pkg.activeDaysText}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Derin Uyku / Nöbet:</span>
                        <span className="font-black text-emerald-600">
                          {pkg.standbyDaysText}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <span className="text-slate-500">Araç İçi Mikrofon:</span>
                        <span className="font-bold text-orange-600">
                          ✓ Ses Kayıt Etme
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Ölçü &amp; Ağırlık:</span>
                        <span className="font-mono text-[11px] font-bold text-slate-700">
                          {pkg.dimensionsText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          HER ŞEY DAHİL FİYAT
                        </span>
                        <span className="text-2xl font-black text-slate-950 font-mono">
                          {formatTRY(pkg.price)}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 line-through font-mono">
                        {formatTRY(pkg.oldPrice)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickModelOrder(pkg.id, false)}
                        className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                        <span>Sepete Ekle</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickModelOrder(pkg.id, true)}
                        className="py-3 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition"
                      >
                        <span>Hemen Al</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          1.5. 30-SECOND PRODUCT PROMO VIDEO (KEPT UNCHANGED AT BOTTOM AREA)
      ========================================================= */}
      <ProductPromoVideo />

      {/* =========================================================
          2. WHY LG-500 PRO VS. WIRED TRACKERS & BLUETOOTH TAGS
      ========================================================= */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-extrabold mb-3">
              <Award className="w-3.5 h-3.5 text-orange-600" />
              NEDEN KABLOSUZ MIKNATISLI &amp; BATARYALI TAKİP CİHAZI?
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              Kablolu Cihazların ve Bluetooth Tag&apos;lerin{" "}
              <span className="text-orange-600">Tüm Eksiklerini Kapatır</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Sıradan eşya etiketleri (AirTag vb.) yakında telefon yoksa konum
              gösteremez, ses kayıt edemez ve yabancı telefonlara bildirim
              gönderir. Kablolu cihazlar ise motosiklet aküsünü bitirir ve araç
              garantisini bozar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Column 1: Bluetooth Tag */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-7 space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                SIRADAN BLUETOOTH ETİKETLERİ
              </div>
              <h3 className="text-lg font-black text-slate-800">
                AirTag / SmartTag Tarzı Mini Etiketler
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 pt-2">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    İçinde GPS, SIM kart veya mikrofon yoktur; dağ başında veya
                    otoparkta yakınından telefon geçmezse{" "}
                    <strong>konum veremez.</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Yakındaki yabancı telefonlara{" "}
                    <strong>&quot;Yakınınızda bir etiket var&quot;</strong>{" "}
                    diye uyarı gönderir ve ses çıkarır!
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Kabin içi ses kayıt etme, canlı hız, geçmiş sokak rotası
                    veya sökülme alarmı yoktur.
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 2: Classic Wired GPS */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-7 space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                KLASİK KABLOLU ARAÇ TAKİP
              </div>
              <h3 className="text-lg font-black text-slate-800">
                Aküye Bağlanan Kablolu Cihazlar
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 pt-2">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Elektrik tesisatını kesip biçmeyi gerektirir; sıfır otomobil
                    ve motosikletlerde <strong>garantiyi bozar.</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Motosiklet veya tekne birkaç gün yatarsa{" "}
                    <strong>aküyü tamamen bitirir</strong>, yolda bırakır.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Başka bir araca, tekneye veya konteynere taşımak için her
                    seferinde sanayide sök-tak işçiliği gerekir.
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: LifeGo LG-500 Pro */}
            <div className="rounded-3xl bg-[#0B0F17] text-white border-2 border-orange-500 p-6 sm:p-7 space-y-4 shadow-2xl relative">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-black">
                4 MODEL • TAM PROFESYONEL ÇÖZÜM
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-orange-400">
                LIFEGO BATARYALI TAKİP CİHAZI (3000 - 20000 mAh)
              </div>
              <h3 className="text-lg font-black text-white">
                Mıknatıslı, Bataryalı, Ses Kayıt Özellikli 4G Uydu Cihazı
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200 pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Gerçek 4G SIM + Dahili Mikrofon:</strong> Hem &lt;2.5m
                    hassasiyetle canlı konum verir hem de araç içi sesleri
                    kayıt eder.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>%100 Sessiz &amp; Işıksız:</strong> Dışarıya ses,
                    ışık veya yabancı telefonlara bildirim kesinlikle göndermez.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>4 Farklı Batarya Kapasitesi:</strong> 3.000, 6.000,
                    10.000 ve 20.000 mAh seçenekleriyle 2 yıla varan pil ömrü.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. INTERACTIVE LIVE TELEMETRY DEMO (#canli-demo)
      ========================================================= */}
      <LiveTelemetryDemo />

      {/* =========================================================
          4. INTERACTIVE VEHICLE & MOTO MOUNTING GUIDE (#montaj-rehberi)
      ========================================================= */}
      <MountingGuide />

      {/* =========================================================
          5. INTERACTIVE BATTERY CALCULATOR (#batarya-hesapla)
      ========================================================= */}
      <BatteryCalculator />

      {/* =========================================================
          6. TECHNICAL SPECIFICATIONS & BOX CONTENTS (#teknik-ozellikler)
      ========================================================= */}
      <section
        id="teknik-ozellikler"
        className="py-16 md:py-24 bg-white border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-extrabold mb-3">
              <Cpu className="w-3.5 h-3.5 text-orange-600" />
              DONANIM &amp; TELEMETRİ VERİLERİ
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              Bataryalı Takip Cihazı Teknik Özellikler &amp; Kutu İçeriği
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Endüstriyel standartlarda üretilen 3.000 / 6.000 / 10.000 / 20.000
              mAh modellerimizin tüm donanım parametreleri:
            </p>
          </div>

          {/* Technical Spec Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {TECHNICAL_SPECS.map((group) => (
              <div
                key={group.category}
                className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-xs"
              >
                <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-extrabold">
                    {group.category}
                  </h3>
                  <span className="text-[11px] font-mono text-orange-400">
                    4 MODEL SERİSİ
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {group.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className={`px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm ${
                        spec.highlight ? "bg-orange-50/40" : ""
                      }`}
                    >
                      <span className="text-slate-500 font-medium">
                        {spec.label}
                      </span>
                      <span
                        className={`font-bold sm:text-right ${
                          spec.highlight ? "text-orange-600" : "text-slate-900"
                        }`}
                      >
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Box Contents Banner */}
          <div className="rounded-3xl bg-[#0B0F17] text-white p-6 sm:p-10 border border-slate-800 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <img
                src="/images/product-package-contents.svg"
                alt="LifeGo Bataryalı Takip Cihazı Kutu İçeriği"
                className="w-full rounded-2xl border border-slate-800"
              />
            </div>
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                <PackageCheck className="w-4 h-4" />
                EKSİKSİZ KUTU İÇERİĞİ • EKSTRA MASRAF YOK
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Kutuyu Açtığınız Dakika Takibe ve Ses Kaydına Hazır
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Kargodan çıkan paketin içinde seçtiğiniz mAh kapasiteli{" "}
                <strong>Bataryalı Takip Cihazı</strong> %100 şarjlı, M2M SIM
                kartı yuvasına takılı ve mobil uygulama kullanıcı bilgileriniz
                tanımlanmış olarak yer alır:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-orange-500 text-white font-mono font-black flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="font-bold text-white">
                    Seçilen mAh Mıknatıslı &amp; Mikrofonlu Ana Ünite
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-orange-500 text-white font-mono font-black flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="font-bold text-white">
                    Kurulu &amp; Aktif M2M Data SIM Kart
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-orange-500 text-white font-mono font-black flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="font-bold text-white">
                    USB Type-C Hızlı Şarj Kablosu
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-orange-500 text-white font-mono font-black flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span className="font-bold text-white">
                    12 Ay Mobil/Web Panel &amp; 2 Yıl Garanti Belgesi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. VERIFIED CUSTOMER REVIEWS (#musteri-yorumlari)
      ========================================================= */}
      <section
        id="musteri-yorumlari"
        className="py-16 md:py-24 bg-slate-50 border-b border-slate-200 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold mb-3">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                DOĞRULANMIŞ KULLANICI DENEYİMLERİ
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                Araç, Motosiklet, Tekne ve Filo Sahipleri Ne Diyor?
              </h2>
            </div>
            <div className="text-xs font-bold text-slate-600 bg-white px-4 py-2.5 rounded-2xl border border-slate-200">
              ⭐ 4.9 / 5 Ortalama Memnuniyet • %99.2 Tavsiye Oranı
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold">
                      ✓ Doğrulanmış Sipariş • {rev.vehicleCategory}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">
                    &ldquo;{rev.title}&rdquo;
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900">
                      {rev.author}
                    </span>{" "}
                    <span className="text-slate-400">({rev.city})</span>
                    <span className="block text-[11px] text-orange-600 font-semibold mt-0.5">
                      Araç: {rev.vehicle}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {rev.usageDuration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          8. FREQUENTLY ASKED QUESTIONS (#sss) & SEO FOOTER BLOCK
      ========================================================= */}
      <section id="sss" className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-xs font-extrabold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              MERAK EDİLEN SORULAR
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Bataryalı takip cihazı modellerimiz, araç içi ses kayıt etme ve
              batarya süreleri hakkında merak edilenler:
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition overflow-hidden ${
                    isOpen
                      ? "border-orange-500 bg-orange-50/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-orange-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SEO Rich Keyword Content Card + Interactive Category Accordion */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Kullanım Alanına Göre Mıknatıslı &amp; Bataryalı Takip Cihazı Rehberi
              </h3>
              <p className="mt-1.5">
                <strong>LifeGo Mobil</strong>; kablo kesmeye veya akü bağlantısına
                ihtiyaç duymayan 4 farklı batarya kapasitesiyle her araç ve
                varlık türü için özel güvenlik sağlar. Aşağıdaki başlıklardan
                ihtiyacınıza uygun çözümü inceleyebilirsiniz:
              </p>
            </div>

            <AccordionList
              theme="light"
              defaultOpenIndex={0}
              items={[
                {
                  badge: "OTOMOBİL",
                  title: "Mıknatıslı ve Bataryalı Araç Takip Cihazı (Şasi Altı & Kabin İçi)",
                  content:
                    "Binek otomobil, SUV ve ticari araçlarda arka şasi traversine N54 mıknatısla 3 saniyede tutunur veya koltuk altı metal kızağa yerleştirilir. Sıfır araç garantisini bozmaz; dahili mikrofonuyla araç içi ses kayıt kontrolü sunar.",
                },
                {
                  badge: "MOTOSİKLET",
                  title: "Bataryalı ve Mıknatıslı Motosiklet Takip Cihazı (Akü Bitirmez)",
                  content:
                    "Motosiklet aküsünden hiç akım çekmez. Sele altı veya yan grenaj içi metal şasiye sabitlenir; park halinde sarsıntı, eğim veya sökülme anında telefonunuza 3 saniyede acil alarm gönderir.",
                },
                {
                  badge: "TEKNE & YAT",
                  title: "Bataryalı Tekne, Yat ve Dıştan Takma Motor Takip Cihazı (IP67)",
                  content:
                    "IEC 60529 IP67 su geçirmez zırhlı gövdesi ile deniz suyu, nem ve yağmurdan etkilenmez. Marina demirleme alanında sanal çit (Geo-Fence) ihlalinde anında konum ve hareket uyarısı verir.",
                },
                {
                  badge: "NESNE & KİŞİ",
                  title: "Bataryalı Nesne, Konteyner ve Kişi Takip Cihazı",
                  content:
                    "Değerli kargo kolileri, jeneratörler, konteynerler ve iş makineleri için 20.000 mAh Ultra modelimiz tek şarjla 2 yıla kadar nöbet tutar. Kompakt 3.000 mAh model ise çanta içi kişi takibi ve yaşlı/çocuk güvenliği için idealdir.",
                },
              ]}
            />

            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 font-bold">
                <a href="#batarya-hesapla" className="text-orange-600 hover:underline">
                  → Batarya Süresi Hesapla
                </a>
                <a href="#montaj-rehberi" className="text-orange-600 hover:underline">
                  → Montaj Şemalarını Gör
                </a>
                <a href="/blog" className="text-slate-800 hover:text-orange-600 hover:underline">
                  → Life GO Mobil Bilgi Merkezi (400 Rehber)
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span>Standartlar:</span>
                <a
                  href="https://www.iec.ch/ip-ratings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-800 underline"
                >
                  IEC 60529 (IP67)
                </a>
                <a
                  href="https://www.btk.gov.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-800 underline"
                >
                  BTK M2M Uyumlu
                </a>
              </div>
            </div>
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQ_ITEMS.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: f.answer,
                  },
                })),
              }),
            }}
          />

          {/* Final Call-To-Action Card */}
          <div className="mt-10 rounded-3xl bg-[#0B0F17] text-white p-8 sm:p-10 border border-slate-800 text-center space-y-5 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-black">
              Aracınızı, Teknenizi ve Motosikletinizi Bugün Güvenceye Alın
            </h3>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Saat 16:00&apos;a kadar verilen siparişler aynı gün ücretsiz
              sigortalı kargo ile, SIM kartı aktif ve kullanıma hazır olarak
              gönderilir.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#urun-secimi"
                className="px-7 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-orange-500/25 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>MODEL SEÇ &amp; SİPARİŞ VER</span>
              </a>
              <a
                href={whatsappDirectProductUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WHATSAPP HIZLI SİPARİŞ HATTI</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
