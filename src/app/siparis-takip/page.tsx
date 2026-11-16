"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  PackageSearch,
  Search,
  CheckCircle2,
  Truck,
  Clock,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { useCart, formatTRY } from "@/context/CartContext";
import type { StoredOrder } from "@/app/api/orders/route";

function OrderTrackContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const { localOrders, buildWhatsAppOrderUrl, siteConfig } = useCart();
  const [query, setQuery] = useState(initialCode);
  const [foundOrder, setFoundOrder] = useState<StoredOrder | null>(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (codeOrPhone: string) => {
    const clean = codeOrPhone.trim();
    if (!clean) return;
    setSearched(true);

    // 1. Check localOrders first
    const localMatch = localOrders.find(
      (o) =>
        o.orderCode.toUpperCase() === clean.replace(/^#/, "").toUpperCase() ||
        o.customer.phone.replace(/\D/g, "").endsWith(clean.replace(/\D/g, "").slice(-10))
    );
    if (localMatch) {
      setFoundOrder(localMatch);
      return;
    }

    // 2. Check JSON API
    try {
      const isCode = clean.toUpperCase().startsWith("LGM") || clean.startsWith("#");
      const param = isCode
        ? `code=${encodeURIComponent(clean.replace(/^#/, ""))}`
        : `phone=${encodeURIComponent(clean)}`;
      const res = await fetch(`/api/orders?${param}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setFoundOrder(data.order);
          return;
        }
        if (Array.isArray(data.orders) && data.orders.length > 0) {
          setFoundOrder(data.orders[0]);
          return;
        }
      }
    } catch {
      // ignore
    }
    setFoundOrder(null);
  };

  useEffect(() => {
    if (initialCode) {
      handleLookup(initialCode);
    } else if (localOrders.length > 0) {
      setFoundOrder(localOrders[0]);
    }
  }, [initialCode, localOrders]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Mağazaya Dön</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
          Sipariş &amp; Kargo Durumu Sorgulama
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Sipariş kodunuzu (Örn: <strong>LGM-849201</strong>) veya sipariş
          verirken kullandığınız cep telefonu numaranızı girerek sorgulayın:
        </p>
      </div>

      {/* Search Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLookup(query);
        }}
        className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs"
      >
        <div className="flex-1 flex items-center gap-2.5 px-3">
          <PackageSearch className="w-5 h-5 text-orange-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sipariş Kodu (LGM-XXXXXX) veya Cep Telefonu (05XX...)"
            className="w-full py-2.5 text-sm font-medium focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>SİPARİŞİ SORGULA</span>
        </button>
      </form>

      {/* Result Card */}
      {foundOrder ? (
        <div className="rounded-3xl bg-[#0B0F17] text-white p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-orange-400 font-bold">
                SİPARİŞ KODU: #{foundOrder.orderCode}
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                {foundOrder.customer.fullName} — {foundOrder.customer.city} /{" "}
                {foundOrder.customer.district}
              </h2>
              <span className="text-xs text-slate-400">
                Sipariş Tarihi: {foundOrder.createdAt}
              </span>
            </div>

            <span className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black">
              Durum: {foundOrder.status}
            </span>
          </div>

          {/* Progress Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-black text-white">1. Sipariş Alındı</div>
                <div className="text-[11px] text-emerald-300">
                  Kayıt tamamlandı
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-orange-500/40 flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <div className="font-black text-white">
                  2. SIM &amp; Panel Aktivasyonu
                </div>
                <div className="text-[11px] text-orange-300">
                  Teknik ekip hazırlıyor
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <Truck className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <div className="font-black text-white">3. Sigortalı Kargo</div>
                <div className="text-[11px] text-slate-400">
                  Aynı gün sevk edilir
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <div className="text-slate-400">Sipariş Edilen Paket:</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {foundOrder.items.map((i) => `${i.packageName} (x${i.quantity})`).join(", ")}
              </div>
              <div className="text-orange-400 font-mono font-bold mt-1">
                Toplam Tutar: {formatTRY(foundOrder.totalAmount)}
              </div>
            </div>

            <a
              href={buildWhatsAppOrderUrl(foundOrder)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp&apos;tan Kargo Barkodu İste</span>
            </a>
          </div>
        </div>
      ) : searched ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center space-y-3">
          <h3 className="text-base font-black text-slate-900">
            Eşleşen Sipariş Bulunamadı
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Lütfen sipariş kodunuzu kontrol edin veya doğrudan{" "}
            <strong>{siteConfig.whatsappDisplay}</strong> numaralı WhatsApp
            destek hattımızdan müşteri temsilcimize ulaşın.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <div className="min-h-[80vh] bg-slate-50">
      <Suspense fallback={<div className="p-12 text-center">Yükleniyor...</div>}>
        <OrderTrackContent />
      </Suspense>
    </div>
  );
}
