"use client";

import React, { useState } from "react";
import {
  Magnet,
  ShieldCheck,
  Radio,
  Car,
  Bike,
  Truck,
  CheckCircle2,
  EyeOff,
  Wrench,
} from "lucide-react";
import { MOUNTING_POINTS, MountingPoint } from "@/data/product";

export default function MountingGuide() {
  const [activeVehicle, setActiveVehicle] =
    useState<MountingPoint["vehicleType"]>("otomobil");

  const filteredPoints = MOUNTING_POINTS.filter(
    (p) => p.vehicleType === activeVehicle
  );

  const [selectedPointId, setSelectedPointId] = useState<string>(
    filteredPoints[0]?.id || MOUNTING_POINTS[0].id
  );

  const handleVehicleSwitch = (type: MountingPoint["vehicleType"]) => {
    setActiveVehicle(type);
    const first = MOUNTING_POINTS.find((p) => p.vehicleType === type);
    if (first) setSelectedPointId(first.id);
  };

  const currentPoint =
    filteredPoints.find((p) => p.id === selectedPointId) || filteredPoints[0];

  return (
    <section
      id="montaj-rehberi"
      className="py-16 md:py-24 bg-white text-slate-900 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-extrabold mb-3">
              <Magnet className="w-3.5 h-3.5" />
              SIFIR KABLO • 3 SANİYEDE MANYETİK MONTAJ REHBERİ
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              Otomobil ve Motosiklette{" "}
              <span className="text-orange-600">Nereye Yerleştirilir?</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Oto elektrikçiye gitmenize veya aküden kablo çekmenize gerek yok.
              N54 sınıfı mıknatıs ile aracınızın veya motosikletinizin metal
              aksamına doğrudan kilitlenir. Noktalara tıklayarak inceleyin:
            </p>
          </div>

          {/* Vehicle Type Switcher */}
          <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleVehicleSwitch("otomobil")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeVehicle === "otomobil"
                  ? "bg-slate-950 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <Car className="w-4 h-4 text-orange-500" />
              <span>Otomobil &amp; SUV (4 Nokta)</span>
            </button>

            <button
              type="button"
              onClick={() => handleVehicleSwitch("motosiklet")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeVehicle === "motosiklet"
                  ? "bg-slate-950 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <Bike className="w-4 h-4 text-orange-500" />
              <span>Motosiklet &amp; Scooter (3 Nokta)</span>
            </button>

            <button
              type="button"
              onClick={() => handleVehicleSwitch("ticari")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeVehicle === "ticari"
                  ? "bg-slate-950 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <Truck className="w-4 h-4 text-orange-500" />
              <span>Karavan, Dorse &amp; Konteyner</span>
            </button>
          </div>
        </div>

        {/* Interactive Blueprint + Point Detail */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Vehicle X-Ray Diagram & Photo Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl bg-[#0B0F17] border border-slate-800 p-6 sm:p-8 relative overflow-hidden min-h-[340px] flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 relative z-10">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  ŞASİ &amp; METAL YÜZEY RÖNTGENİ ({activeVehicle.toUpperCase()})
                </span>
                <span className="px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[11px] font-bold">
                  Noktalara Tıklayın
                </span>
              </div>

              {/* Technical Vector Silhouette */}
              <div className="relative my-6 h-52 sm:h-60 w-full flex items-center justify-center">
                {activeVehicle === "otomobil" && (
                  <svg
                    viewBox="0 0 700 260"
                    className="w-full h-full max-w-[620px]"
                    fill="none"
                  >
                    {/* Car Body Wireframe */}
                    <path
                      d="M 70 175 L 95 115 L 210 65 L 440 65 L 555 115 L 635 135 L 645 180 L 58 180 Z"
                      fill="#1E293B"
                      fillOpacity="0.45"
                      stroke="#475569"
                      strokeWidth="2.5"
                    />
                    {/* Steel Chassis Frame Rail Highlight */}
                    <line
                      x1="115"
                      y1="172"
                      x2="585"
                      y2="172"
                      stroke="#F97316"
                      strokeWidth="5"
                      strokeDasharray="12 6"
                    />
                    {/* Wheels */}
                    <circle
                      cx="175"
                      cy="182"
                      r="42"
                      fill="#0F172A"
                      stroke="#64748B"
                      strokeWidth="4"
                    />
                    <circle
                      cx="175"
                      cy="182"
                      r="18"
                      fill="#1E293B"
                      stroke="#94A3B8"
                      strokeWidth="2"
                    />
                    <circle
                      cx="525"
                      cy="182"
                      r="42"
                      fill="#0F172A"
                      stroke="#64748B"
                      strokeWidth="4"
                    />
                    <circle
                      cx="525"
                      cy="182"
                      r="18"
                      fill="#1E293B"
                      stroke="#94A3B8"
                      strokeWidth="2"
                    />
                    <text
                      x="350"
                      y="245"
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      ARKA TAMPON / BAGAJ ← [ÇELİK ŞASİ HATTI] → ÖN MOTOR BEŞİĞİ
                    </text>
                  </svg>
                )}

                {activeVehicle === "motosiklet" && (
                  <svg
                    viewBox="0 0 700 260"
                    className="w-full h-full max-w-[620px]"
                    fill="none"
                  >
                    {/* Motorcycle Frame Silhouette */}
                    <path
                      d="M 135 110 L 260 95 L 360 115 L 470 72 L 535 145 L 390 175 L 220 170 Z"
                      fill="#1E293B"
                      fillOpacity="0.5"
                      stroke="#475569"
                      strokeWidth="2.5"
                    />
                    {/* Subframe Steel Rail */}
                    <line
                      x1="145"
                      y1="108"
                      x2="430"
                      y2="122"
                      stroke="#F97316"
                      strokeWidth="5"
                      strokeDasharray="10 5"
                    />
                    {/* Moto Wheels */}
                    <circle
                      cx="175"
                      cy="182"
                      r="46"
                      fill="#0F172A"
                      stroke="#64748B"
                      strokeWidth="4"
                    />
                    <circle
                      cx="525"
                      cy="182"
                      r="46"
                      fill="#0F172A"
                      stroke="#64748B"
                      strokeWidth="4"
                    />
                    <text
                      x="350"
                      y="245"
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      ARKA ÇANTA &amp; SELE ALTI ŞASİ ← [0 AKÜ BAĞLANTISI] → ÖN GRENAJ ŞASİSİ
                    </text>
                  </svg>
                )}

                {activeVehicle === "ticari" && (
                  <svg
                    viewBox="0 0 700 260"
                    className="w-full h-full max-w-[620px]"
                    fill="none"
                  >
                    <rect
                      x="90"
                      y="55"
                      width="480"
                      height="120"
                      rx="10"
                      fill="#1E293B"
                      fillOpacity="0.5"
                      stroke="#475569"
                      strokeWidth="2.5"
                    />
                    <line
                      x1="95"
                      y1="175"
                      x2="565"
                      y2="175"
                      stroke="#F97316"
                      strokeWidth="6"
                    />
                    <circle
                      cx="200"
                      cy="192"
                      r="34"
                      fill="#0F172A"
                      stroke="#64748B"
                      strokeWidth="4"
                    />
                    <circle
                      cx="280"
                      cy="192"
                      r="34"
                      fill="#0F172A"
                      stroke="#64748B"
                      strokeWidth="4"
                    />
                    <circle
                      cx="490"
                      cy="192"
                      r="34"
                      fill="#0F172A"
                      stroke="#64748B"
                      strokeWidth="4"
                    />
                    <text
                      x="335"
                      y="245"
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      ÇELİK I-KİRİŞ DORSE ŞASİSİ • KONTEYNER &amp; KARAVAN GÖVDESİ
                    </text>
                  </svg>
                )}

                {/* Interactive Hotspot Pins */}
                {filteredPoints.map((pt, idx) => {
                  const isSelected = pt.id === currentPoint.id;
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => setSelectedPointId(pt.id)}
                      style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full font-extrabold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-orange-500 text-white scale-110 shadow-xl shadow-orange-500/50 ring-4 ring-orange-500/30"
                          : "bg-slate-800/95 text-slate-200 border border-slate-600 hover:border-orange-400"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center font-mono text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="hidden sm:inline whitespace-nowrap">
                        {pt.title.split(" ")[0]} {pt.title.split(" ")[1]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Hotspot Selector Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative z-10 pt-2 border-t border-slate-800/80">
                {filteredPoints.map((pt, idx) => {
                  const active = pt.id === currentPoint.id;
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => setSelectedPointId(pt.id)}
                      className={`p-3 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        active
                          ? "bg-orange-500/15 border-orange-500 text-white"
                          : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-black shrink-0 ${
                          active
                            ? "bg-orange-500 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold truncate">
                        {pt.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Real-World Photo Reference Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center gap-3.5 p-3">
                <img
                  src="/images/product-chassis-mount.jpg"
                  alt="Araç Altı Şasiye Mıknatısla Montaj"
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                    GERÇEK OTOMOBİL UYGULAMASI
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900 mt-0.5">
                    Şasi Traversine Doğrudan Tutunma
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    18.4 kg çekme kuvvetli N54 mıknatıs kasislerde ve yüksek
                    hızda sarsılmaz.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center gap-3.5 p-3">
                <img
                  src="/images/product-motorcycle-mount.jpg"
                  alt="Motosiklet Sele Altı Kablosuz Montaj"
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                    GERÇEK MOTOSİKLET UYGULAMASI
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900 mt-0.5">
                    Sele Altı &amp; Grenaj İçi Sıfır Kablo
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Motosiklet aküsünü bitirmez, yetkili servis garantisini
                    bozmaz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Selected Mounting Point Engineering Card (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-950 text-white p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold">
                <EyeOff className="w-3.5 h-3.5" />
                {currentPoint.locationLabel}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-3 leading-snug">
                {currentPoint.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Uydu Sinyal Kalitesi</span>
                </div>
                <div className="text-sm font-black text-emerald-400 font-mono mt-1">
                  {currentPoint.gpsSignal}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>Koruma &amp; Kamuflaj Derecesi</span>
                </div>
                <div className="text-sm font-black text-orange-400 font-mono mt-1">
                  {currentPoint.stealthLevel}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-slate-400">
                Tutunduğu Metal Yüzey:
              </div>
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                <Magnet className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{currentPoint.magnetSurface}</span>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {currentPoint.description}
            </p>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
              <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                <Wrench className="w-4 h-4" />
                <span>Mühendis &amp; Usta Tavsiyesi:</span>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {currentPoint.proTip}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Dilediğiniz zaman 1 saniyede söküp başka bir araca veya
                motosiklete aktarabilirsiniz.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
