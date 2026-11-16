"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  ShoppingBag,
  X,
  Send,
  Sparkles,
} from "lucide-react";
import { useCart, formatTRY } from "@/context/CartContext";
import { PRODUCT_PACKAGES } from "@/data/product";

const QUICK_QUESTIONS = [
  "Motosikletim için uygun mu, aküye bağlanır mı?",
  "İçinde SIM kart hazır mı geliyor, ek ücret var mı?",
  "Şarjı günlük kullanımda kaç gün gidiyor?",
  "Kapıda ödeme veya Havale indirimi ile nasıl sipariş veririm?",
];

export default function FloatingWidgets() {
  const { addToCart, siteConfig, buildWhatsAppUrl } = useCart();
  const [waOpen, setWaOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const mainPkg = PRODUCT_PACKAGES[0];

  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 680);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Floating WhatsApp Concierge Widget (Bottom Right) */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-[80] flex flex-col items-end">
        {waOpen && (
          <div className="mb-3 w-80 sm:w-88 rounded-3xl bg-[#0B0F17] border border-emerald-500/40 shadow-2xl overflow-hidden text-white animate-in fade-in slide-in-from-bottom-3">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center relative">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-emerald-700 absolute -bottom-0.5 -right-0.5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">
                    {siteConfig.brandName} Uzman Hattı
                  </div>
                  <div className="text-[11px] text-emerald-100">
                    Ortalama yanıt süresi: ~1 Dakika
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWaOpen(false)}
                className="text-emerald-100 hover:text-white p-1 cursor-pointer"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 bg-[#0F1623]">
              <div className="p-3 rounded-2xl rounded-tl-xs bg-slate-800/90 border border-slate-700 text-xs text-slate-200 leading-relaxed">
                Merhaba 👋 <strong>{siteConfig.productModel}</strong> mıknatıslı
                araç ve motosiklet takip cihazımız hakkında aklınıza takılan
                soruyu seçin, hemen WhatsApp&apos;tan yanıtlayalım:
              </div>

              <div className="space-y-1.5">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <a
                    key={idx}
                    href={buildWhatsAppUrl(
                      `Merhaba ${siteConfig.brandName}, "${q}" konusunda bilgi alabilir miyim?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2.5 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-200 hover:text-emerald-300 transition flex items-center justify-between gap-2"
                  >
                    <span>{q}</span>
                    <Send className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </a>
                ))}
              </div>

              <a
                href={buildWhatsAppUrl(
                  `Merhaba ${siteConfig.brandName}, ${siteConfig.productModel} sipariş vermek istiyorum.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Sohbeti Başlat ({siteConfig.whatsappDisplay})</span>
              </a>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setWaOpen(!waOpen)}
          className={`relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-2xl shadow-emerald-600/40 border border-emerald-400/40 transition active:scale-95 cursor-pointer ${
            !waOpen ? "animate-wa-jump" : ""
          }`}
        >
          <span className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-60" />
            <MessageCircle className="relative w-5 h-5 fill-white/20" />
          </span>
          <span>WhatsApp Sipariş &amp; Destek</span>
        </button>
      </div>

      {/* Sticky Bottom Quick-Buy Bar on Mobile/Scroll */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-[70] bg-[#0B0F17]/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 md:hidden shadow-2xl">
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            <div>
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span>LG-500 Pro Tam Set</span>
              </div>
              <div className="text-base font-black text-white font-mono">
                {formatTRY(mainPkg.price)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addToCart(mainPkg.id, 1, [], true)}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Sepete Ekle</span>
              </button>
              <Link
                href="/siparis"
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-extrabold"
              >
                Hemen Al
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
