"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Printer,
  PackageSearch,
  Building2,
  Truck,
  ArrowLeft,
} from "lucide-react";
import { useCart, formatTRY } from "@/context/CartContext";
import type { StoredOrder } from "@/app/api/orders/route";

function OrderConfirmContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const { localOrders, siteConfig, buildWhatsAppOrderUrl } = useCart();

  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [copiedIban, setCopiedIban] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    const localFound = localOrders.find(
      (o) => o.orderCode.toUpperCase() === code.toUpperCase()
    );
    if (localFound) {
      setOrder(localFound);
      return;
    }

    fetch(`/api/orders?code=${encodeURIComponent(code)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.order) setOrder(data.order);
      })
      .catch(() => {});
  }, [code, localOrders]);

  const copyIban = (iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedIban(iban);
    setTimeout(() => setCopiedIban(null), 2500);
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-900">
          Sipariş Bilgisi Yükleniyor...
        </h1>
        <p className="text-sm text-slate-600">
          Sipariş Kodunuz: <strong className="font-mono">{code}</strong>
        </p>
        <Link
          href="/siparis-takip"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 text-white text-xs font-extrabold"
        >
          Sipariş Sorgulama Ekranına Git
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-8">
      {/* Success Banner */}
      <div className="rounded-3xl bg-[#0B0F17] text-white p-7 sm:p-10 border border-emerald-500/40 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                SİPARİŞİNİZ BAŞARIYLA ALINDI
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                Teşekkürler, {order.customer.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Cihazınızın M2M SIM aktivasyonu ve kargo hazırlığı başlatılmıştır.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-left sm:text-right shrink-0">
            <span className="text-[11px] text-slate-400 block">
              SİPARİŞ TAKİP KODUNUZ
            </span>
            <span className="text-xl font-mono font-black text-orange-400">
              #{order.orderCode}
            </span>
          </div>
        </div>

        {/* Instant WhatsApp Order Activation CTA */}
        <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-black text-emerald-300">
              📲 Hızlı Kargo &amp; Uygulama Şifresi İçin WhatsApp Onayı
            </h2>
            <p className="text-xs text-emerald-100/80">
              Sipariş özetinizi tek tıkla WhatsApp destek hattımıza ileterek kargo
              takip numaranızı ve mobil uygulama giriş bilgilerinizi hemen
              alabilirsiniz.
            </p>
          </div>
          <a
            href={buildWhatsAppOrderUrl(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-emerald-500/25 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>SİPARİŞİ WHATSAPP&apos;A GÖNDER</span>
          </a>
        </div>

        {/* If Payment Method is Havale/EFT, show IBAN Accounts */}
        {order.paymentMethod === "havale" && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-black text-white">
                <Building2 className="w-5 h-5 text-orange-400" />
                <span>
                  Havale / EFT / FAST Банka Hesap Bilgilerimiz (%
                  {siteConfig.bankTransferDiscountPercent} İndirimli)
                </span>
              </div>
              <span className="text-sm font-mono font-black text-emerald-400">
                Ödenecek Tutar: {formatTRY(order.totalAmount)}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Lütfen açıklama kısmına yalnızca sipariş kodunuz olan{" "}
              <strong className="text-white font-mono">#{order.orderCode}</strong>{" "}
              yazınız:
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {siteConfig.bankAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                >
                  <div className="text-xs font-extrabold text-orange-400">
                    {acc.bankName}
                  </div>
                  <div className="text-[11px] text-slate-300 font-semibold">
                    Alıcı: {acc.accountHolder}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <code className="text-xs font-mono text-white font-bold">
                      {acc.iban}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyIban(acc.iban)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedIban === acc.iban ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              TESLİMAT &amp; ARAÇ BİLGİLERİ
            </h3>
            <p>
              <span className="text-slate-400">Alıcı:</span>{" "}
              <strong className="text-white">{order.customer.fullName}</strong>
            </p>
            <p>
              <span className="text-slate-400">Telefon:</span>{" "}
              <strong className="text-white font-mono">
                {order.customer.phone}
              </strong>
            </p>
            <p>
              <span className="text-slate-400">Adres:</span>{" "}
              <span className="text-slate-200">
                {order.customer.address} ({order.customer.district} /{" "}
                {order.customer.city})
              </span>
            </p>
            <p>
              <span className="text-slate-400">Kullanılacak Araç:</span>{" "}
              <span className="text-orange-400 font-bold">
                {order.customer.vehicleType}
              </span>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              SİPARİŞ KALEMLERİ &amp; TUTAR
            </h3>
            {order.items.map((it, i) => (
              <div
                key={i}
                className="flex justify-between gap-2 border-b border-slate-800 pb-2"
              >
                <span className="text-slate-200 font-semibold">
                  {it.packageName} x{it.quantity}
                </span>
                <span className="font-mono text-white font-bold">
                  {formatTRY(
                    (it.unitPrice +
                      it.addons.reduce((s, a) => s + a.price, 0)) *
                      it.quantity
                  )}
                </span>
              </div>
            ))}
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Havale İndirimi:</span>
                <span className="font-mono">
                  -{formatTRY(order.discountAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-orange-400 pt-1">
              <span>Genel Toplam:</span>
              <span className="font-mono">{formatTRY(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Sipariş Fişini Yazdır</span>
            </button>
            <Link
              href={`/siparis-takip?code=${order.orderCode}`}
              className="px-4 py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 font-bold flex items-center gap-1.5"
            >
              <PackageSearch className="w-4 h-4" />
              <span>Sipariş Takip Sayfası</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-[80vh] bg-slate-50">
      <Suspense
        fallback={
          <div className="p-16 text-center text-sm font-bold text-slate-500">
            Sipariş detayları yükleniyor...
          </div>
        }
      >
        <OrderConfirmContent />
      </Suspense>
    </div>
  );
}
