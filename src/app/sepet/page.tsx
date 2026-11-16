"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";
import { useCart, formatTRY } from "@/context/CartContext";
import { PRODUCT_ADDONS, PRODUCT_PACKAGES } from "@/data/product";

export default function CartPage() {
  const {
    items,
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
  } = useCart();

  return (
    <div className="min-h-[80vh] bg-slate-50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ürüne Geri Dön</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
              Alışveriş Sepetim
            </h1>
          </div>
          {totalUnits > 0 && (
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>
                Toplam {totalUnits} Adet LG-500 Pro • Ücretsiz Sigortalı Kargo
              </span>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl font-black text-slate-900">
                Sepetinizde Henüz Ürün Yok
              </h2>
              <p className="text-sm text-slate-600">
                Aşağıdaki kullanıma hazır LG-500 Pro paketlerinden birini
                seçerek hemen siparişinizi oluşturabilirsiniz:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left pt-2">
              {PRODUCT_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4"
                >
                  <div>
                    {pkg.badge && (
                      <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded bg-orange-500 text-white mb-2">
                        {pkg.badge}
                      </span>
                    )}
                    <h3 className="text-sm font-black text-slate-900">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {pkg.shortDesc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-base font-black text-slate-950 font-mono">
                      {formatTRY(pkg.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(pkg.id, 1, [], false)}
                      className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold cursor-pointer"
                    >
                      + Sepete Ekle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
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
                    className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 space-y-5 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src="/images/product-studio-main.jpg"
                          alt={item.pkg.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-wider">
                            {siteConfig.productModel} • TAK-ÇALIŞTIR SET
                          </span>
                          <h2 className="text-base sm:text-lg font-black text-slate-950 mt-0.5">
                            {item.pkg.name}
                          </h2>
                          <p className="text-xs text-slate-500 mt-1">
                            Toplam {item.pkg.unitCount * item.quantity} Adet
                            Cihaz • Dahili M2M SIM Kart &amp; 12 Ay Mobil Panel
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                        <div className="text-xl font-black text-slate-950 font-mono">
                          {formatTRY(lineTotal)}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center rounded-xl bg-slate-100 border border-slate-200">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-950 cursor-pointer"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-9 text-center font-mono font-black text-sm">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-950 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                            aria-label="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Addons Selection */}
                    <div className="pt-4 border-t border-slate-100 space-y-2.5">
                      <div className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                        <span>Bu Pakete Eklenebilecek Avantajlı Opsiyonlar:</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {PRODUCT_ADDONS.map((addon) => {
                          const checked = item.addons.some(
                            (a) => a.id === addon.id
                          );
                          return (
                            <label
                              key={addon.id}
                              className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                                checked
                                  ? "bg-orange-50/70 border-orange-500 text-slate-950"
                                  : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
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
                                <span className="font-bold truncate">
                                  {addon.name}
                                </span>
                              </div>
                              <span className="font-mono font-black text-orange-600 shrink-0">
                                +{formatTRY(addon.price)}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Column (4 cols) */}
            <div className="lg:col-span-4 rounded-3xl bg-[#0B0F17] text-white p-6 sm:p-7 border border-slate-800 space-y-5 lg:sticky lg:top-28 shadow-xl">
              <h2 className="text-lg font-black border-b border-slate-800 pb-3">
                Sipariş Özeti
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Ürünler Toplamı ({totalUnits} Cihaz)</span>
                  <span className="font-mono font-bold text-white">
                    {formatTRY(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sigortalı Kargo &amp; SIM Kurulumu</span>
                  <span className="font-bold text-emerald-400">ÜCRETSİZ</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 space-y-1">
                  <div className="flex justify-between items-center text-xs font-extrabold text-emerald-300">
                    <span>
                      Havale / EFT İndirimi (%{siteConfig.bankTransferDiscountPercent})
                    </span>
                    <span className="font-mono">
                      -{formatTRY(bankTransferDiscount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black text-emerald-400 pt-1">
                    <span>Havale ile Ödenecek:</span>
                    <span className="font-mono">
                      {formatTRY(bankTransferTotal)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-800">
                  <span className="text-sm font-bold text-white">
                    Standart Toplam
                  </span>
                  <span className="text-2xl font-black text-orange-400 font-mono">
                    {formatTRY(subtotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/siparis"
                  className="w-full py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 transition"
                >
                  <span>TESLİMAT &amp; ÖDEMEYE GEÇ</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={buildWhatsAppCartUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WHATSAPP İLE HIZLI SİPARİŞ VER</span>
                </a>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2 Yıl Resmi Garanti &amp; 14 Gün İade Güvencesi</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
