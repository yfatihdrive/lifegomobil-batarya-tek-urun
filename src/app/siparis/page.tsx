"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Building2,
  Banknote,
  CreditCard,
  MessageCircle,
  ArrowLeft,
  Lock,
  Sparkles,
  Check,
} from "lucide-react";
import { useCart, formatTRY } from "@/context/CartContext";
import { PRODUCT_PACKAGES, PRODUCT_ADDONS } from "@/data/product";
import type { StoredOrder } from "@/app/api/orders/route";

const TURKISH_CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Kocaeli",
  "Mersin",
  "Kayseri",
  "Eskişehir",
  "Samsun",
  "Denizli",
  "Şanlıurfa",
  "Sakarya",
  "Muğla",
  "Tekirdağ",
  "Manisa",
  "Balıkesir",
  "Trabzon",
  "Diyarbakır",
  "Aydın",
  "Hatay",
  "Diğer İl",
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    addToCart,
    subtotal,
    bankTransferTotal,
    bankTransferDiscount,
    siteConfig,
    saveOrder,
    clearCart,
    buildWhatsAppOrderUrl,
  } = useCart();

  // Fallback package if visitor came directly to /siparis with empty cart
  const [fallbackPkgId, setFallbackPkgId] = useState(PRODUCT_PACKAGES[0].id);
  const [fallbackAddonIds, setFallbackAddonIds] = useState<string[]>([]);

  // Customer Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("İstanbul");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [vehicleType, setVehicleType] = useState("Otomobil / SUV");
  const [orderNote, setOrderNote] = useState("");
  const [invoiceType, setInvoiceType] = useState<"bireysel" | "kurumsal">(
    "bireysel"
  );
  const [companyName, setCompanyName] = useState("");
  const [taxOffice, setTaxOffice] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "havale" | "kapida" | "kredi_karti"
  >("havale");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasCartItems = items.length > 0;
  const fallbackPkg =
    PRODUCT_PACKAGES.find((p) => p.id === fallbackPkgId) || PRODUCT_PACKAGES[0];
  const fallbackAddons = PRODUCT_ADDONS.filter((a) =>
    fallbackAddonIds.includes(a.id)
  );

  const effectiveSubtotal = hasCartItems
    ? subtotal
    : fallbackPkg.price + fallbackAddons.reduce((s, a) => s + a.price, 0);

  const effectiveDiscount =
    paymentMethod === "havale"
      ? Math.round(
          effectiveSubtotal * (siteConfig.bankTransferDiscountPercent / 100)
        )
      : 0;

  const effectiveTotal = effectiveSubtotal - effectiveDiscount;

  const buildOrderPayload = (): StoredOrder => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderCode = `LGM-${randomNum}`;
    const nowStr = new Date().toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const orderItems = hasCartItems
      ? items.map((it) => ({
          packageId: it.pkg.id,
          packageName: it.pkg.name,
          unitCount: it.pkg.unitCount,
          quantity: it.quantity,
          unitPrice: it.pkg.price,
          addons: it.addons.map((a) => ({
            id: a.id,
            name: a.name,
            price: a.price,
          })),
        }))
      : [
          {
            packageId: fallbackPkg.id,
            packageName: fallbackPkg.name,
            unitCount: fallbackPkg.unitCount,
            quantity: 1,
            unitPrice: fallbackPkg.price,
            addons: fallbackAddons.map((a) => ({
              id: a.id,
              name: a.name,
              price: a.price,
            })),
          },
        ];

    return {
      orderCode,
      createdAt: nowStr,
      status: "Yeni Sipariş",
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        city,
        district: district.trim(),
        address: address.trim(),
        vehicleType,
        orderNote: orderNote.trim() || undefined,
        invoiceType,
        companyName: invoiceType === "kurumsal" ? companyName.trim() : undefined,
        taxOffice: invoiceType === "kurumsal" ? taxOffice.trim() : undefined,
        taxNumber: invoiceType === "kurumsal" ? taxNumber.trim() : undefined,
      },
      items: orderItems,
      paymentMethod,
      subtotal: effectiveSubtotal,
      discountAmount: effectiveDiscount,
      totalAmount: effectiveTotal,
    };
  };

  const validateForm = () => {
    if (fullName.trim().length < 3) {
      setErrorMsg("Lütfen adınızı ve soyadınızı eksiksiz giriniz.");
      return false;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setErrorMsg("Lütfen geçerli bir cep telefonu numarası giriniz (Örn: 0532...).");
      return false;
    }
    if (district.trim().length < 2 || address.trim().length < 8) {
      setErrorMsg("Lütfen kargo teslimatı için ilçe ve açık adresinizi giriniz.");
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleSubmitOrder = async (e: React.FormEvent, alsoOpenWhatsApp = false) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const order = buildOrderPayload();
    await saveOrder(order);
    clearCart();

    if (alsoOpenWhatsApp) {
      const waUrl = buildWhatsAppOrderUrl(order);
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }

    router.push(`/siparis-onay?code=${order.orderCode}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 mb-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Mağazaya Geri Dön</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
              Güvenli Sipariş &amp; Teslimat Formu
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Güvenli Sipariş • Ücretsiz Sigortalı Kargo</span>
          </div>
        </div>

        <form
          onSubmit={(e) => handleSubmitOrder(e, false)}
          className="grid lg:grid-cols-12 gap-8 items-start"
        >
          {/* LEFT: Customer Info & Payment Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* If Cart is empty, let user pick their package directly here */}
            {!hasCartItems && (
              <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>1. Sipariş Edilecek Paketi Seçin</span>
                  </h2>
                  <span className="text-xs font-bold text-emerald-600">
                    M2M SIM &amp; 12 Ay Panel Dahil
                  </span>
                </div>

                <div className="space-y-2.5">
                  {PRODUCT_PACKAGES.map((pkg) => {
                    const active = pkg.id === fallbackPkgId;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setFallbackPkgId(pkg.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-3 ${
                          active
                            ? "border-orange-500 bg-orange-50/40"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              active
                                ? "border-orange-500 bg-orange-500 text-white"
                                : "border-slate-400"
                            }`}
                          >
                            {active && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900">
                              {pkg.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {pkg.shortDesc}
                            </div>
                          </div>
                        </div>
                        <span className="text-base font-black text-slate-950 font-mono shrink-0">
                          {formatTRY(pkg.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 space-y-2">
                  <div className="text-xs font-bold text-slate-600">
                    İsteğe Bağlı Ekstralar:
                  </div>
                  {PRODUCT_ADDONS.map((addon) => {
                    const checked = fallbackAddonIds.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className="flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setFallbackAddonIds((prev) =>
                                prev.includes(addon.id)
                                  ? prev.filter((id) => id !== addon.id)
                                  : [...prev, addon.id]
                              )
                            }
                            className="rounded accent-orange-500"
                          />
                          <span className="font-bold text-slate-800">
                            {addon.name}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-orange-600">
                          +{formatTRY(addon.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step: Delivery Information */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
              <h2 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-3">
                Alıcı ve Kargo Teslimat Bilgileri
              </h2>

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ahmet Yılmaz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Cep Telefonu Numaranız *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    İl *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-orange-500"
                  >
                    {TURKISH_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    İlçe *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Kadıköy"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Açık Teslimat Adresi *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mahalle, Cadde/Sokak, Bina No, Daire No (veya Kargo Şubesi Teslim Notu)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Cihazı Kullanacağınız Araç Tipi (Ön Ayar İçin)
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Otomobil / SUV (Şasi veya Kabin İçi)">
                      Otomobil / SUV (Şasi veya Kabin İçi Ses Kayıt)
                    </option>
                    <option value="Motosiklet / Scooter / Kurye">
                      Motosiklet / Scooter / Kurye
                    </option>
                    <option value="Yolcu Otobüsü / Servis Aracı">
                      Yolcu Otobüsü / Servis Aracı
                    </option>
                    <option value="Tır Çekicisi / Kamyon / Ağır Vasıta">
                      Tır Çekicisi / Kamyon / Ağır Vasıta
                    </option>
                    <option value="Tekne / Yat / Bot (Marin)">
                      Tekne / Yat / Bot (Marin)
                    </option>
                    <option value="Lojistik Konteyner / Dorse">
                      Lojistik Konteyner / Dorse
                    </option>
                    <option value="Değerli Nesne / Ekipman / Kişi Takibi">
                      Değerli Nesne / Ekipman / Kişi Takibi
                    </option>
                  </select>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Teknik ekibimiz sarsıntı ve uyku hassasiyetini aracınıza göre
                    optimize ederek gönderir.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Sipariş / Kargo Notunuz (İsteğe Bağlı)
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Aras/Yurtiçi şubeden teslim alacağım"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Invoice Type */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-700 mb-3">
                  <span>Fatura Tipi:</span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="invoiceType"
                      checked={invoiceType === "bireysel"}
                      onChange={() => setInvoiceType("bireysel")}
                      className="accent-orange-500"
                    />
                    <span>Bireysel Fatura</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="invoiceType"
                      checked={invoiceType === "kurumsal"}
                      onChange={() => setInvoiceType("kurumsal")}
                      className="accent-orange-500"
                    />
                    <span>Kurumsal (Şirket) Faturası</span>
                  </label>
                </div>

                {invoiceType === "kurumsal" && (
                  <div className="grid sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <input
                      type="text"
                      placeholder="Firma Ünvanı"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Vergi Dairesi"
                      value={taxOffice}
                      onChange={(e) => setTaxOffice(e.target.value)}
                      className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Vergi Numarası"
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                      className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step: Payment Method Selection */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-3">
                Ödeme Yöntemi Seçimi
              </h2>

              <div className="space-y-3">
                {/* Option 1: Havale / EFT (%5 Discount) */}
                <div
                  onClick={() => setPaymentMethod("havale")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === "havale"
                      ? "border-emerald-500 bg-emerald-50/40"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-slate-900">
                            Havale / FAST / EFT ile Ödeme
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black">
                            %{siteConfig.bankTransferDiscountPercent} ANINDA İNDİRİM
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Sipariş onay ekranında şirket IBAN bilgilerimiz
                          gösterilir.
                        </p>
                      </div>
                    </div>
                    <span className="text-base font-black text-emerald-700 font-mono shrink-0">
                      {formatTRY(
                        effectiveSubtotal -
                          Math.round(
                            effectiveSubtotal *
                              (siteConfig.bankTransferDiscountPercent / 100)
                          )
                      )}
                    </span>
                  </div>
                </div>

                {/* Option 2: Kapıda Ödeme */}
                <div
                  onClick={() => setPaymentMethod("kapida")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === "kapida"
                      ? "border-orange-500 bg-orange-50/40"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-orange-600 shrink-0" />
                      <div>
                        <span className="text-sm font-black text-slate-900 block">
                          Kapıda Nakit veya Kredi Kartı ile Ödeme
                        </span>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Ürününüzü kargo görevlisinden teslim alırken kapıda
                          ödeyin.
                        </p>
                      </div>
                    </div>
                    <span className="text-base font-black text-slate-900 font-mono shrink-0">
                      {formatTRY(effectiveSubtotal)}
                    </span>
                  </div>
                </div>

                {/* Option 3: Online Kredi Kartı */}
                <div
                  onClick={() => setPaymentMethod("kredi_karti")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === "kredi_karti"
                      ? "border-orange-500 bg-orange-50/40"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-sky-600 shrink-0" />
                      <div>
                        <span className="text-sm font-black text-slate-900 block">
                          Kredi Kartı (3D Secure Ödeme Linki / Taksit)
                        </span>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Sipariş sonrası 3D güvenli ödeme bağlantısı SMS/WhatsApp
                          ile iletilir.
                        </p>
                      </div>
                    </div>
                    <span className="text-base font-black text-slate-900 font-mono shrink-0">
                      {formatTRY(effectiveSubtotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Sticky Order Summary & Submit Buttons (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0B0F17] text-white p-6 sm:p-8 border border-slate-800 space-y-6 lg:sticky lg:top-28 shadow-2xl">
            <h2 className="text-lg font-black border-b border-slate-800 pb-3">
              Sipariş Özeti &amp; Onay
            </h2>

            {/* Item Summary */}
            <div className="space-y-3">
              {(hasCartItems
                ? items
                : [
                    {
                      id: "fallback",
                      pkg: fallbackPkg,
                      quantity: 1,
                      addons: fallbackAddons,
                    },
                  ]
              ).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900 border border-slate-800"
                >
                  <img
                    src="/images/product-studio-main.jpg"
                    alt={item.pkg.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-extrabold text-white">
                      {item.pkg.name} (x{item.quantity})
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {item.pkg.unitCount * item.quantity} Adet Cihaz + Aktif
                      M2M SIM Kart
                    </div>
                    {item.addons.length > 0 && (
                      <div className="text-[11px] text-emerald-400 mt-1">
                        + {item.addons.map((a) => a.name).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm pt-2 border-t border-slate-800">
              <div className="flex justify-between text-slate-400">
                <span>Ara Toplam</span>
                <span className="font-mono font-bold text-white">
                  {formatTRY(effectiveSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Sigortalı Kargo &amp; SIM Aktivasyonu</span>
                <span className="font-bold text-emerald-400">ÜCRETSİZ</span>
              </div>
              {effectiveDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>
                    Havale / EFT İndirimi (%{siteConfig.bankTransferDiscountPercent})
                  </span>
                  <span className="font-mono">
                    -{formatTRY(effectiveDiscount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-3 border-t border-slate-800">
                <span className="text-base font-extrabold text-white">
                  Ödenecek Toplam
                </span>
                <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                  {formatTRY(effectiveTotal)}
                </span>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 transition cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {submitting
                    ? "SİPARİŞİNİZ KAYDEDİLİYOR..."
                    : "SİPARİŞİ ONAYLA VE TAMAMLA"}
                </span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={(e) => handleSubmitOrder(e, true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>KAYDET VE WHATSAPP&apos;TAN HIZLI ONAYLA</span>
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>
                  Saat 16:00&apos;a kadar verilen siparişler bugün kargoya
                  teslim edilir.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  2 Yıl {siteConfig.brandName} Birebir Değişim Garantisi &amp;
                  Faturalı Gönderim.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
