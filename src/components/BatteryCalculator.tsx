"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BatteryCharging,
  Zap,
  Moon,
  Clock,
  CheckCircle2,
  Bell,
  ShoppingBag,
  ArrowRight,
  Mic,
} from "lucide-react";
import { PRODUCT_PACKAGES } from "@/data/product";
import { useCart, formatTRY } from "@/context/CartContext";

export default function BatteryCalculator() {
  const router = useRouter();
  const { addToCart, siteConfig } = useCart();

  const [selectedPkgId, setSelectedPkgId] = useState<string>("model-6000mah");
  const [dailyHours, setDailyHours] = useState<number>(2);
  const [reportInterval, setReportInterval] = useState<
    "live10s" | "eco60s" | "sleep"
  >("live10s");
  const [voiceListenMinutes, setVoiceListenMinutes] = useState<number>(5);

  const selectedModel =
    PRODUCT_PACKAGES.find((p) => p.id === selectedPkgId) || PRODUCT_PACKAGES[1];

  // Realistic Li-Polymer autonomy calculation for 3.000 / 6.000 / 10.000 / 20.000 mAh:
  const calculateAutonomy = () => {
    const usableMah = selectedModel.mah * 0.93;
    let activeDrawPerHour = 42; // mA in 10s live mode
    if (reportInterval === "eco60s") activeDrawPerHour = 24;
    if (reportInterval === "sleep") activeDrawPerHour = 7.5;

    const sleepHours = Math.max(0, 24 - dailyHours);
    const sleepDrawPerHour = reportInterval === "sleep" ? 1.1 : 1.9;

    // Voice listen microphone draw (~55mA during active listening)
    const voiceDrawMahPerDay = (voiceListenMinutes / 60) * 55;

    const dailyConsumptionMah =
      dailyHours * activeDrawPerHour +
      sleepHours * sleepDrawPerHour +
      voiceDrawMahPerDay;

    const rawDays = Math.round(usableMah / dailyConsumptionMah);
    const maxCap =
      selectedModel.mah === 3000
        ? 90
        : selectedModel.mah === 6000
        ? 180
        : selectedModel.mah === 10000
        ? 365
        : 730;
    return Math.min(maxCap, Math.max(5, rawDays));
  };

  const estimatedDays = calculateAutonomy();
  const bankPrice = Math.round(
    selectedModel.price * (1 - siteConfig.bankTransferDiscountPercent / 100)
  );

  return (
    <section
      id="batarya-hesapla"
      className="py-16 md:py-24 bg-slate-50 text-slate-900 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Explanation & Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-extrabold mb-3">
                <BatteryCharging className="w-4 h-4" />
                3.000 • 6.000 • 10.000 • 20.000 mAh BATARYALI TAKİP CİHAZI HESAPLAYICI
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                4 Farklı Batarya Modeli:{" "}
                <span className="text-orange-600">
                  Sizin İçin Hangisi Uygun?
                </span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                İhtiyacınıza göre{" "}
                <strong>3.000 mAh, 6.000 mAh, 10.000 mAh veya 20.000 mAh</strong>{" "}
                bataryalı takip cihazı modelini seçin; günlük araç hareket
                süresine ve mikrofonla ses kayıt etme sıklığına göre pil ömrünü
                anında hesaplayın ve doğrudan sepete ekleyin.
              </p>
            </div>

            {/* Control 0: Select Battery Capacity Model (3000 / 6000 / 10000 / 20000 mAh) */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900">
                  1. Bataryalı Takip Cihazı Kapasitesini Seçin:
                </span>
                <span className="text-xs font-bold text-orange-600">
                  4 Model Mevcuttur
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRODUCT_PACKAGES.map((pkg) => {
                  const active = pkg.id === selectedPkgId;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer relative ${
                        active
                          ? "bg-slate-950 text-white border-orange-500 shadow-lg"
                          : "bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded bg-orange-500 text-white text-[9px] font-black">
                          POPÜLER
                        </span>
                      )}
                      <div className="text-sm sm:text-base font-black font-mono">
                        {pkg.mah.toLocaleString("tr-TR")} mAh
                      </div>
                      <div
                        className={`text-[11px] font-bold mt-0.5 ${
                          active ? "text-orange-400" : "text-slate-500"
                        }`}
                      >
                        {pkg.modelCode}
                      </div>
                      <div
                        className={`text-xs font-mono font-extrabold mt-2 pt-1.5 border-t ${
                          active
                            ? "border-slate-800 text-emerald-400"
                            : "border-slate-200 text-slate-900"
                        }`}
                      >
                        {formatTRY(pkg.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Control 1: Daily Driving Hours */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="daily-hours-range"
                  className="text-sm font-extrabold text-slate-900"
                >
                  2. Araç / Motosiklet / Tekne Günde Kaç Saat Hareket Ediyor?
                </label>
                <span className="px-3 py-1 rounded-xl bg-orange-500 text-white font-mono text-sm font-black">
                  Günde {dailyHours} Saat
                </span>
              </div>

              <input
                id="daily-hours-range"
                type="range"
                min={0.5}
                max={12}
                step={0.5}
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>0.5 Saat (Park / Tekne)</span>
                <span>2 Saat (Şehir İçi)</span>
                <span>6 Saat (Aktif Saha)</span>
                <span>12 Saat (Otobüs / Kamyon)</span>
              </div>
            </div>

            {/* Control 2: Microphone Voice Listen Usage & Reporting Mode */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-orange-500" />
                  <span>3. Çalışma &amp; Araç İçi Ses Kayıt Etme Modu:</span>
                </span>
                <select
                  value={voiceListenMinutes}
                  onChange={(e) =>
                    setVoiceListenMinutes(Number(e.target.value))
                  }
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
                >
                  <option value={0}>Ses Kayıt: Kapalı (0 dk/gün)</option>
                  <option value={5}>Ses Kayıt: Günde ~5 dk</option>
                  <option value={15}>Ses Kayıt: Günde ~15 dk</option>
                  <option value={30}>Ses Kayıt: Günde ~30 dk</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setReportInterval("live10s")}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    reportInterval === "live10s"
                      ? "bg-slate-950 text-white border-slate-950 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-extrabold">
                    <Zap className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Canlı Akış (10 Sn)</span>
                  </div>
                  <p
                    className={`text-[11px] mt-1.5 leading-relaxed ${
                      reportInterval === "live10s"
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    Hareket halindeyken her 10 saniyede bir sokak-sokak canlı
                    konum.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setReportInterval("eco60s")}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    reportInterval === "eco60s"
                      ? "bg-slate-950 text-white border-slate-950 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-extrabold">
                    <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dengeli Mod (1 Dk)</span>
                  </div>
                  <p
                    className={`text-[11px] mt-1.5 leading-relaxed ${
                      reportInterval === "eco60s"
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    Dakikada bir konum günceller, batarya ömrünü %45 uzatır.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setReportInterval("sleep")}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    reportInterval === "sleep"
                      ? "bg-slate-950 text-white border-slate-950 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-extrabold">
                    <Moon className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Derin Uyku / Nöbet</span>
                  </div>
                  <p
                    className={`text-[11px] mt-1.5 leading-relaxed ${
                      reportInterval === "sleep"
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    Sadece sarsıntı/sökülme anında veya günde 1-4 kez raporlar.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Result Readout & Direct Purchase Card (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0B0F17] text-white p-7 sm:p-8 border border-slate-800 shadow-2xl space-y-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                  SEÇİLEN MODEL PERFORMANSI
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {selectedModel.name}
                </h3>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 font-mono text-xs font-black shrink-0">
                {selectedModel.mah.toLocaleString("tr-TR")} mAh
              </span>
            </div>

            <div className="py-5 border-y border-slate-800 flex items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black text-orange-500 font-mono tracking-tight">
                  ~{estimatedDays}
                </span>
                <div>
                  <span className="text-xl font-black text-white block">
                    GÜN TEK ŞARJLA
                  </span>
                  <span className="text-xs text-slate-400">
                    Kesintisiz kablosuz takip &amp; ses kayıt
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Mic className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Araç İçi Ses Kayıt Etme:</strong> Koltuk altına
                  veya kabin içine konulduğunda içerideki sesleri net
                  kayıt edebilirsiniz.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Kapasite Özeti:</strong> {selectedModel.activeDaysText}{" "}
                  • {selectedModel.standbyDaysText} ({selectedModel.dimensionsText})
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Bell className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>M2M SIM Kart &amp; Uygulama Dahil:</strong> Kutudan
                  çıktığı an aktif, 12 ay sunucu ve uygulama ücretsizdir.
                </span>
              </div>
            </div>

            {/* Price & Direct Add to Cart inside Calculator */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">
                    Satış Fiyatı (KDV &amp; SIM Dahil)
                  </span>
                  <span className="text-2xl font-black text-white font-mono">
                    {formatTRY(selectedModel.price)}
                  </span>
                  <span className="text-xs text-slate-500 line-through font-mono ml-2">
                    {formatTRY(selectedModel.oldPrice)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-400 font-bold block">
                    Havale %{siteConfig.bankTransferDiscountPercent} İndirimli:
                  </span>
                  <span className="text-base font-mono font-black text-emerald-400">
                    {formatTRY(bankPrice)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => addToCart(selectedModel.id, 1, [], true)}
                  className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-orange-400" />
                  <span>SEPETE EKLE</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedModel.id, 1, [], false);
                    router.push("/siparis");
                  }}
                  className="py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/25 transition cursor-pointer"
                >
                  <span>HEMEN AL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
