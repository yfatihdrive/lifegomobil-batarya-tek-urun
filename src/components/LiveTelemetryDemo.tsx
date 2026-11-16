"use client";

import React, { useState, useEffect } from "react";
import {
  Navigation,
  BatteryCharging,
  Signal,
  ShieldAlert,
  BellRing,
  Play,
  RotateCcw,
  Car,
  Bike,
  Truck,
  MapPin,
  Lock,
  Radio,
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";

interface Scenario {
  id: "otomobil" | "motosiklet" | "ticari";
  label: string;
  plate: string;
  vehicleModel: string;
  locationName: string;
  coordinates: string;
  speed: number;
  battery: number;
  remainingDays: number;
  mountSpot: string;
  mode: string;
  signalDbm: string;
  accuracy: string;
  routePoints: { x: number; y: number; label: string; time: string }[];
}

const SCENARIOS: Record<Scenario["id"], Scenario> = {
  otomobil: {
    id: "otomobil",
    label: "Binek Otomobil / SUV",
    plate: "34 LFG 500",
    vehicleModel: "Volkswagen Tiguan — Şasi Altı Manyetik Montaj",
    locationName: "TEM Bağlantı Yolu • Ataşehir / İstanbul",
    coordinates: "40°59'32.4\"N 29°07'28.1\"E",
    speed: 78,
    battery: 88,
    remainingDays: 24,
    mountSpot: "Arka Şasi Travers İçi (N54 Mıknatıs Kilitli)",
    mode: "Canlı Akış (10 Sn Güncelleme)",
    signalDbm: "-65 dBm (4G LTE Cat.1)",
    accuracy: "2.1 Metre (9 Uydu Kilitli)",
    routePoints: [
      { x: 18, y: 72, label: "Kadıköy Başlangıç", time: "08:45" },
      { x: 36, y: 58, label: "Acıbadem Geçiş", time: "09:02" },
      { x: 58, y: 46, label: "Kozyatağı Kavşağı", time: "09:14" },
      { x: 78, y: 30, label: "Ataşehir Canlı Konum", time: "ŞİMDİ" },
    ],
  },
  motosiklet: {
    id: "motosiklet",
    label: "Motosiklet & Scooter",
    plate: "35 MTR 900",
    vehicleModel: "Yamaha Tracer 9 GT — Sele Altı Kuyruk Şasisi",
    locationName: "Alsancak Kordon • Konak / İzmir",
    coordinates: "38°26'14.8\"N 27°08'41.2\"E",
    speed: 0,
    battery: 94,
    remainingDays: 56,
    mountSpot: "Sele Altı Çelik Kuyruk Braketi (0 Kablo)",
    mode: "Park Koruma + Sarsıntı & Sökülme Nöbeti",
    signalDbm: "-69 dBm (4G LTE Cat.1)",
    accuracy: "1.8 Metre (11 Uydu Kilitli)",
    routePoints: [
      { x: 22, y: 35, label: "Karşıyaka İskele", time: "21:10" },
      { x: 48, y: 62, label: "Bayraklı Sahil Yolu", time: "21:25" },
      { x: 74, y: 52, label: "Alsancak Gece Park Noktası", time: "ŞİMDİ (PARK)" },
    ],
  },
  ticari: {
    id: "ticari",
    label: "Karavan, Dorse & Ticari",
    plate: "06 KRV 404",
    vehicleModel: "Çekme Karavan & Filo Dorsesi",
    locationName: "Kaş Çukurbağ Yarımadası • Antalya",
    coordinates: "36°11'48.2\"N 29°36'19.5\"E",
    speed: 0,
    battery: 91,
    remainingDays: 78,
    mountSpot: "Dorse I-Kiriş İç Gövde (Anti-Tamper Aktif)",
    mode: "Derin Uyku + Güvenli Bölge (250m Çit)",
    signalDbm: "-71 dBm (4G LTE Cat.1)",
    accuracy: "2.4 Metre (10 Uydu Kilitli)",
    routePoints: [
      { x: 25, y: 28, label: "Fethiye Çıkış", time: "Dün 15:00" },
      { x: 52, y: 48, label: "Kalkan Geçiş", time: "Dün 16:20" },
      { x: 76, y: 68, label: "Kaş Güvenli Kamp Alanı", time: "ŞİMDİ (UYKU)" },
    ],
  },
};

interface SimulatedAlert {
  type: "vibration" | "tamper" | "geofence" | "playback";
  title: string;
  body: string;
  time: string;
  color: string;
}

export default function LiveTelemetryDemo() {
  const [selectedId, setSelectedId] = useState<Scenario["id"]>("otomobil");
  const [activeAlert, setActiveAlert] = useState<SimulatedAlert | null>(null);
  const [playbackStep, setPlaybackStep] = useState<number | null>(null);

  const scenario = SCENARIOS[selectedId];

  useEffect(() => {
    if (playbackStep === null) return;
    if (playbackStep >= scenario.routePoints.length - 1) {
      const t = setTimeout(() => setPlaybackStep(null), 1800);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => {
      setPlaybackStep((prev) => (prev !== null ? prev + 1 : null));
    }, 900);
    return () => clearTimeout(timer);
  }, [playbackStep, scenario.routePoints.length]);

  const triggerSimulation = (type: SimulatedAlert["type"]) => {
    if (type === "vibration") {
      setActiveAlert({
        type: "vibration",
        title: "🚨 SARSINTI & HAREKET ALARMI!",
        body: `${scenario.plate} plakalı aracınızda/motosikletinizde park halinde darbe veya çekici hareketi algılandı. Konum: ${scenario.locationName}`,
        time: "Şimdi • Push & SMS Bildirimi",
        color: "border-amber-500/60 bg-amber-950/90 text-amber-200",
      });
    } else if (type === "tamper") {
      setActiveAlert({
        type: "tamper",
        title: "🔓 SÖKÜLME (ANTI-TAMPER) ALARMI!",
        body: `ACİL: LG-500 Pro cihazı ${scenario.mountSpot} yüzeyinden ayrıldı veya ışık sensörü tetiklendi! Anlık canlı takip 3 sn moduna alındı.`,
        time: "Şimdi • Yüksek Öncelikli Uyarı",
        color: "border-red-500/70 bg-red-950/95 text-red-200",
      });
    } else if (type === "geofence") {
      setActiveAlert({
        type: "geofence",
        title: "📍 GÜVENLİ BÖLGE (GEO-FENCE) ÇIKIŞI",
        body: `${scenario.plate} belirlediğiniz 250m çaplı Güvenli Park Alanı sınırından çıkış yaptı. Hız: 34 km/s.`,
        time: "Şimdi • Mobil Uygulama Uyarısı",
        color: "border-sky-500/60 bg-sky-950/90 text-sky-200",
      });
    } else if (type === "playback") {
      setPlaybackStep(0);
      setActiveAlert({
        type: "playback",
        title: "⏪ 90 GÜNLÜK GEÇMİŞ ROTA OYNATILIYOR",
        body: `${scenario.plate} için sokak-sokak hız, duraklama süresi ve km raporu bulut hafızadan oynatılıyor.`,
        time: "Bulut Arşivi • 90 Gün Kayıt",
        color: "border-emerald-500/60 bg-emerald-950/90 text-emerald-200",
      });
    }
  };

  const currentPin =
    playbackStep !== null
      ? scenario.routePoints[playbackStep]
      : scenario.routePoints[scenario.routePoints.length - 1];

  return (
    <section
      id="canli-demo"
      className="py-16 md:py-24 bg-[#070B12] text-white border-y border-slate-800/80 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              İNTERAKTİF CANLI PANEL SİMÜLATÖRÜ
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Telefonunuzdan Nasıl Görünür?{" "}
              <span className="text-orange-500">Canlı Test Edin.</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Aşağıdan araç veya motosiklet senaryosunu seçin; sarsıntı alarmını,
              mıknatıs sökülme sensörünü ve geçmiş rota oynatımını bizzat deneyin.
            </p>
          </div>

          {/* Scenario Switcher Tabs */}
          <div className="flex flex-wrap gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setSelectedId("otomobil");
                setActiveAlert(null);
                setPlaybackStep(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                selectedId === "otomobil"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Otomobil / SUV</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedId("motosiklet");
                setActiveAlert(null);
                setPlaybackStep(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                selectedId === "motosiklet"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Motosiklet</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedId("ticari");
                setActiveAlert(null);
                setPlaybackStep(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                selectedId === "ticari"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Karavan &amp; Filo</span>
            </button>
          </div>
        </div>

        {/* Main Telemetry Console Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Interactive Radar / Street Map Canvas (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0D1422] border border-slate-800 overflow-hidden flex flex-col justify-between relative min-h-[420px] sm:min-h-[480px] shadow-2xl">
            {/* Map Vector Background */}
            <svg
              className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
              viewBox="0 0 800 500"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="mapGridPattern"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="800" height="500" fill="url(#mapGridPattern)" />
              {/* Stylized Arterial Roads & Water */}
              <path
                d="M -20 420 Q 220 350 410 240 T 820 95"
                fill="none"
                stroke="#1E293B"
                strokeWidth="26"
                strokeLinecap="round"
              />
              <path
                d="M -20 420 Q 220 350 410 240 T 820 95"
                fill="none"
                stroke="#334155"
                strokeWidth="3"
                strokeDasharray="10 8"
              />
              <path
                d="M 110 -20 Q 280 210 520 310 T 830 430"
                fill="none"
                stroke="#1E293B"
                strokeWidth="18"
              />
              <path
                d="M 0 140 Q 320 180 650 60"
                fill="none"
                stroke="#0EA5E9"
                strokeOpacity="0.18"
                strokeWidth="44"
              />

              {/* Active Route Polyline */}
              <polyline
                points={scenario.routePoints
                  .map((pt) => `${pt.x * 8},${pt.y * 5}`)
                  .join(" ")}
                fill="none"
                stroke="#10B981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={scenario.routePoints
                  .map((pt) => `${pt.x * 8},${pt.y * 5}`)
                  .join(" ")}
                fill="none"
                stroke="#34D399"
                strokeWidth="8"
                strokeOpacity="0.2"
              />
            </svg>

            {/* Top Map HUD Bar */}
            <div className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-[#0B0F17]/95 to-transparent">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono font-black text-xs sm:text-sm text-white">
                    {scenario.plate}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-semibold truncate max-w-[230px] sm:max-w-xs">
                  {scenario.vehicleModel}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-emerald-400">
                <Compass className="w-3.5 h-3.5" />
                <span>{scenario.coordinates}</span>
              </div>
            </div>

            {/* Simulated Mobile Push Notification Banner */}
            {activeAlert && (
              <div
                className={`relative z-20 mx-4 sm:mx-6 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all ${activeAlert.color}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
                      <BellRing className="w-4 h-4 animate-bounce" />
                      <span>{activeAlert.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-95">
                      {activeAlert.body}
                    </p>
                    <div className="text-[10px] font-mono opacity-75 pt-0.5">
                      {activeAlert.time}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveAlert(null)}
                    className="text-xs font-bold underline opacity-80 hover:opacity-100 shrink-0 cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}

            {/* Route Waypoints & Live Pulsing Vehicle Marker */}
            <div className="relative z-10 flex-1 min-h-[220px]">
              {scenario.routePoints.map((pt, idx) => {
                const isCurrent =
                  pt.x === currentPin.x && pt.y === currentPin.y;
                return (
                  <div
                    key={idx}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                  >
                    {isCurrent ? (
                      <div className="relative flex items-center justify-center">
                        {/* Geo-Fence Circle */}
                        <div className="w-28 h-28 rounded-full border border-emerald-400/30 bg-emerald-500/10 animate-pulse absolute" />
                        <div className="w-11 h-11 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/40 border-2 border-white relative z-10">
                          <Navigation className="w-5 h-5" />
                        </div>
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#0B0F17]/95 border border-orange-500/50 text-[11px] font-bold text-white shadow-xl">
                          <span className="text-orange-400">{pt.label}</span> •{" "}
                          <span className="font-mono text-emerald-400">
                            {scenario.speed} km/s
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="group relative flex flex-col items-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0B0F17] shadow" />
                        <span className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] text-slate-300 whitespace-nowrap">
                          {pt.time} - {pt.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Map Status Strip */}
            <div className="relative z-10 p-4 sm:p-5 bg-[#090E18]/95 border-t border-slate-800/90 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Anlık Konum
                </span>
                <span className="font-bold text-white truncate block">
                  {scenario.locationName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Uydu Hassasiyeti
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {scenario.accuracy}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">
                  6000mAh Batarya
                </span>
                <span className="font-mono font-bold text-amber-400">
                  %{scenario.battery} (~{scenario.remainingDays} Gün)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">
                  N54 Mıknatıs &amp; Sensör
                </span>
                <span className="font-bold text-sky-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> KİLİTLİ &amp; AKTİF
                </span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Alarm Triggers & Telemetry Readout (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0D1422] border border-slate-800 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                    CANLI CİHAZ TELEMETRİSİ
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    {scenario.label} Kontrol Paneli
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                  ONLINE
                </span>
              </div>

              {/* Telemetry Specs Box */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>Montaj Noktası</span>
                  </div>
                  <div className="text-xs font-extrabold text-white leading-snug">
                    {scenario.mountSpot}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Signal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Şebeke &amp; SIM</span>
                  </div>
                  <div className="text-xs font-extrabold text-white font-mono">
                    {scenario.signalDbm}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                    <span>Çalışma Modu</span>
                  </div>
                  <div className="text-xs font-extrabold text-white leading-snug">
                    {scenario.mode}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Rota Arşivi</span>
                  </div>
                  <div className="text-xs font-extrabold text-white">
                    90 Gün Bulut Kaydı
                  </div>
                </div>
              </div>

              {/* Interactive Alarm Simulation Buttons */}
              <div className="pt-2 space-y-2.5">
                <div className="text-xs font-extrabold text-slate-300 flex items-center justify-between">
                  <span>🔔 Güvenlik Alarmlarını Şimdi Test Edin:</span>
                  <span className="text-[11px] text-orange-400 font-normal">
                    Butonlara tıklayın
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => triggerSimulation("vibration")}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/50 text-left transition group cursor-pointer"
                  >
                    <div className="text-xs font-extrabold text-amber-400 group-hover:text-amber-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>Sarsıntı Alarmı</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Park halinde dokunma / çekici uyarısını test et
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerSimulation("tamper")}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-500/50 text-left transition group cursor-pointer"
                  >
                    <div className="text-xs font-extrabold text-red-400 group-hover:text-red-300 flex items-center gap-1.5">
                      <Radio className="w-4 h-4 shrink-0" />
                      <span>Sökülme Sensörü</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Mıknatıs yüzeyden ayrılınca gelen acil alarm
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerSimulation("geofence")}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/50 text-left transition group cursor-pointer"
                  >
                    <div className="text-xs font-extrabold text-sky-400 group-hover:text-sky-300 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>Güvenli Bölge İhlali</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Belirlenen harita çitinden çıkış bildirimi
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerSimulation("playback")}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 text-left transition group cursor-pointer"
                  >
                    <div className="text-xs font-extrabold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1.5">
                      {playbackStep !== null ? (
                        <RotateCcw className="w-4 h-4 shrink-0 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 shrink-0" />
                      )}
                      <span>Geçmiş Rota Oynat</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Gidilen sokakları ve saatleri haritada izle
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Compatibility Note */}
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">
                  Türkçe <strong>iOS (iPhone)</strong>, <strong>Android</strong>{" "}
                  ve <strong>Web Bilgisayar</strong> paneli ücretsiz dahildir.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
