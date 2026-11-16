"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShoppingBag,
  Phone,
  MessageCircle,
  Truck,
  Menu,
  X,
  PackageSearch,
  Magnet,
  Radio,
} from "lucide-react";
import { useCart, formatTRY } from "@/context/CartContext";

export default function Header() {
  const {
    cartCount,
    subtotal,
    openDrawer,
    siteConfig,
    buildWhatsAppUrl,
  } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const quickWhatsappUrl = buildWhatsAppUrl(
    `Merhaba ${siteConfig.brandName}, ${siteConfig.productModel} mıknatıslı araç ve motosiklet takip cihazı hakkında bilgi almak istiyorum.`
  );

  return (
    <>
      {/* Top Announcement & Telemetry Bar */}
      <div className="bg-[#070A10] text-slate-300 border-b border-slate-800/80 text-xs relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              STOKTAN AYNI GÜN ÜCRETSİZ KARGO
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400">
              <Magnet className="w-3.5 h-3.5 text-orange-500" />
              3000 / 6000 / 10000 / 20000 mAh • Dahili Mikrofon (Ses Kayıt) • 2 Yıl SIM Dahil
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              href="/siparis-takip"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-orange-400 transition font-medium"
            >
              <PackageSearch className="w-3.5 h-3.5 text-orange-500" />
              <span>Sipariş Takip</span>
            </Link>
            <span className="text-slate-700">|</span>
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="inline-flex items-center gap-1.5 text-white hover:text-orange-400 transition font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-orange-500" />
              <span>{siteConfig.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 border border-orange-400/30 group-hover:scale-105 transition shrink-0">
              <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                  LIFEGO<span className="text-orange-500">MOBİL</span>
                </span>
                <span className="hidden xs:inline-block sm:inline-block text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                  {siteConfig.productModel}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Mıknatıslı &amp; Bataryalı Araç, Tekne, Moto, Nesne Takip Cihazı
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <Link
              href="/#urun-secimi"
              className="hover:text-orange-400 transition"
            >
              Paketler &amp; Fiyat
            </Link>
            <Link
              href="/#tanitim-videosu"
              className="hover:text-orange-400 transition flex items-center gap-1.5 text-orange-400"
            >
              <span>🎬 60 Sn Video</span>
            </Link>
            <Link
              href="/#canli-demo"
              className="hover:text-orange-400 transition flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Canlı Harita Demo
            </Link>
            <Link
              href="/#montaj-rehberi"
              className="hover:text-orange-400 transition"
            >
              Araç &amp; Motor Montaj
            </Link>
            <Link
              href="/#batarya-hesapla"
              className="hover:text-orange-400 transition"
            >
              Batarya Süresi
            </Link>
            <Link
              href="/#teknik-ozellikler"
              className="hover:text-orange-400 transition"
            >
              Teknik Özellikler
            </Link>
            <Link
              href="/blog"
              className="hover:text-orange-400 transition flex items-center gap-1.5 text-white bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              Blog &amp; Rehber
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={quickWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-500/20 shrink-0" />
              <span className="hidden xl:inline">WhatsApp Destek</span>
            </a>

            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 whitespace-nowrap"
              aria-label="Sepeti Aç"
            >
              <ShoppingBag className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Sepet</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] sm:text-[11px] font-black leading-none shrink-0">
                  {cartCount}
                </span>
              )}
              {subtotal > 0 && (
                <span className="hidden md:inline text-slate-300 font-mono text-xs border-l border-slate-700 pl-2">
                  {formatTRY(subtotal)}
                </span>
              )}
            </button>

            <Link
              href="/siparis"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-orange-500/20 transition shrink-0"
            >
              <span>Hemen Al</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white shrink-0"
              aria-label="Menüyü Aç/Kapat"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B0F17] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                href="/#urun-secimi"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
              >
                📦 Paketler &amp; Fiyat
              </Link>
              <Link
                href="/#canli-demo"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400"
              >
                🛰️ Canlı Harita Demo
              </Link>
              <Link
                href="/#montaj-rehberi"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
              >
                🧲 Araç &amp; Motor Montaj
              </Link>
              <Link
                href="/#batarya-hesapla"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
              >
                🔋 Batarya Hesaplayıcı
              </Link>
              <Link
                href="/#teknik-ozellikler"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
              >
                ⚙️ Teknik Özellikler
              </Link>
              <Link
                href="/siparis-takip"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-orange-400"
              >
                🔍 Sipariş Sorgula
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-400"
              >
                📚 Blog &amp; Rehberler
              </Link>
            </div>
            <div className="flex gap-2 pt-2">
              <Link
                href="/siparis"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-3 rounded-xl bg-orange-500 text-white text-center font-black text-sm"
              >
                Siparişi Tamamla
              </Link>
              <a
                href={quickWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-center font-black text-sm flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Hattı
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
