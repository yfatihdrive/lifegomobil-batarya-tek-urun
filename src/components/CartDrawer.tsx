"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useCart, formatTRY } from "@/context/CartContext";
import { PRODUCT_ADDONS, PRODUCT_PACKAGES } from "@/data/product";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    addToCart,
    updateQuantity,
    removeItem,
    toggleItemAddon,
    subtotal,
    bankTransferTotal,
    bankTransferDiscount,
    totalUnits,
    siteConfig,
    buildWhatsAppCartUrl,
    toastMessage,
    dismissToast,
  } = useCart();

  return (
    <>
      {/* Global Add-to-Cart Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 z-[90] max-w-sm bg-[#0B0F17] text-white border border-emerald-500/40 rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-white truncate">
              {toastMessage}
            </p>
            <p className="text-[11px] text-slate-400">
              Ücretsiz kargo ve 2 yıl garanti dahildir.
            </p>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Bildirimi Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Backdrop & Slide-over Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={closeDrawer}
          />

          <div className="relative z-10 w-full max-w-md bg-[#0B0F17] text-white border-l border-slate-800 h-full flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-[#0F1623]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight text-white">
                    Alışveriş Sepetiniz
                  </h2>
                  <p className="text-xs text-slate-400">
                    {totalUnits > 0
                      ? `Toplam ${totalUnits} Adet LG-500 Pro Cihaz + Aktif SIM`
                      : "Sepetinizde henüz ürün bulunmuyor"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition cursor-pointer"
                aria-label="Sepeti Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Indicator */}
            <div className="bg-emerald-950/50 border-b border-emerald-500/20 px-6 py-2.5 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Ücretsiz Sigortalı Kargo &amp; SIM Aktivasyonu Hazır Gönderim!
              </span>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {items.length === 0 ? (
                <div className="text-center py-10 space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-extrabold text-white">
                      Sepetiniz Şu An Boş
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Aracınız veya motosikletiniz için kullanıma hazır LG-500
                      Pro paketlerinden birini hemen ekleyebilirsiniz.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2 text-left">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
                      Hızlı Paket Seçimi
                    </p>
                    {PRODUCT_PACKAGES.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 transition flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-extrabold text-white">
                            {pkg.name}
                          </div>
                          <div className="text-[11px] text-orange-400 font-mono font-bold mt-0.5">
                            {formatTRY(pkg.price)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(pkg.id, 1, [], false)}
                          className="px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shrink-0 cursor-pointer"
                        >
                          + Sepete Ekle
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {items.map((item) => {
                    const addonsTotal = item.addons.reduce(
                      (s, a) => s + a.price,
                      0
                    );
                    const lineTotal =
                      (item.pkg.price + addonsTotal) * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <img
                            src="/images/product-studio-main.jpg"
                            alt={item.pkg.name}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-extrabold text-white leading-snug">
                                {item.pkg.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="text-slate-500 hover:text-red-400 p-1 transition cursor-pointer"
                                aria-label="Ürünü Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {item.pkg.unitCount * item.quantity} Adet Cihaz •
                              M2M SIM &amp; 12 Ay Panel Dahil
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="inline-flex items-center rounded-lg bg-slate-950 border border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                                  aria-label="Azalt"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-xs font-extrabold font-mono">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                                  aria-label="Artır"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="text-right">
                                <div className="text-base font-black text-orange-400 font-mono">
                                  {formatTRY(lineTotal)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Optional Add-ons inside Cart Item */}
                        <div className="pt-3 border-t border-slate-800/80 space-y-2">
                          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-orange-400" />
                            <span>Opsiyonel Ekstra Koruma &amp; Süre Uzatma:</span>
                          </div>
                          {PRODUCT_ADDONS.map((addon) => {
                            const checked = item.addons.some(
                              (a) => a.id === addon.id
                            );
                            return (
                              <label
                                key={addon.id}
                                className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                                  checked
                                    ? "bg-orange-500/10 border-orange-500/40 text-white"
                                    : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() =>
                                      toggleItemAddon(item.id, addon.id)
                                    }
                                    className="rounded accent-orange-500"
                                  />
                                  <span className="truncate font-medium">
                                    {addon.name}
                                  </span>
                                </div>
                                <span className="font-mono font-bold text-orange-400 shrink-0">
                                  +{formatTRY(addon.price)}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-slate-800 bg-[#0F1623] space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Ara Toplam</span>
                    <span className="font-mono font-semibold text-white">
                      {formatTRY(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Sigortalı Kargo &amp; SIM Aktivasyonu</span>
                    <span className="font-bold text-emerald-400">ÜCRETSİZ</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                    <span className="font-semibold">
                      Havale / EFT ile Ödemede (%{siteConfig.bankTransferDiscountPercent} İndirim)
                    </span>
                    <span className="font-mono font-black text-sm text-emerald-400">
                      {formatTRY(bankTransferTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
                    <span className="text-sm font-bold text-white">
                      Genel Toplam
                    </span>
                    <span className="text-xl font-black text-orange-400 font-mono">
                      {formatTRY(subtotal)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Link
                    href="/siparis"
                    onClick={closeDrawer}
                    className="w-full py-4 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition"
                  >
                    <span>SİPARİŞİ TAMAMLA</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={buildWhatsAppCartUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>SEPETİ WHATSAPP&apos;TAN SİPARİŞ VER</span>
                  </a>

                  <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-slate-400">
                    <Link
                      href="/sepet"
                      onClick={closeDrawer}
                      className="underline hover:text-white"
                    >
                      Tam Sayfa Sepete Git
                    </Link>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />2
                      Yıl Resmi Garanti
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
