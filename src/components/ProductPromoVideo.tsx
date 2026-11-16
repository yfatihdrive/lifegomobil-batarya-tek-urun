"use client";

import React, { useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  HardDriveDownload,
  ShieldAlert,
  Radar,
  Mic,
  Compass,
  Cpu,
  BatteryCharging,
  Sparkles,
} from "lucide-react";

const VIDEO_CHAPTERS = [
  {
    start: 0,
    end: 10,
    timeLabel: "00:00 - 00:10",
    title: "1. Mıknatıslı & Bataryalı 4.5G Takip",
    desc: "N54 mıknatıs ile kablo kesmeden saniyeler içinde metale tutunur",
  },
  {
    start: 10,
    end: 20,
    timeLabel: "00:10 - 00:20",
    title: "2. Araba, Moto, Otobüs, Çekici & Kamyon",
    desc: "Hareket halindeki kara araçlarında 7/24 canlı hız ve rota izleme",
  },
  {
    start: 20,
    end: 30,
    timeLabel: "00:20 - 00:30",
    title: "3. Tekne, Yat, Konteyner & Nesne Takibi",
    desc: "IP67 su geçirmez zırhlı gövde ile denizde ve lojistikte tam koruma",
  },
  {
    start: 30,
    end: 40,
    timeLabel: "00:30 - 00:40",
    title: "4. Araç İçi Dahili Mikrofon Özelliği",
    desc: "Kabin içine yerleştirildiğinde 360° net ses algılama ve ses kayıt",
  },
  {
    start: 40,
    end: 50,
    timeLabel: "00:40 - 00:50",
    title: "5. 3000 • 6000 • 10000 • 20000 mAh 4 Model",
    desc: "4 farklı batarya kapasitesi, hesaplanmış pil süreleri ve fiyatlar",
  },
  {
    start: 50,
    end: 60,
    timeLabel: "00:50 - 01:00",
    title: "6. Sökülme Alarmı & 1 Yıllık SIM Dahil",
    desc: "Optik sabotaj sensörü, hazır M2M hat ve Türkçe mobil uygulama",
  },
];

export default function ProductPromoVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const jumpToChapter = (seconds: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = seconds;
    v.play();
    setIsPlaying(true);
  };

  const handleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) {
      v.requestFullscreen();
    }
  };

  const activeChapterIdx = VIDEO_CHAPTERS.findIndex(
    (ch) => currentTime >= ch.start && currentTime < ch.end
  );

  return (
    <section
      id="tanitim-videosu"
      className="py-16 md:py-24 bg-[#080C14] text-white border-b border-slate-800/90"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-extrabold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              60 SANİYEDE TÜRKÇE SESLİ ÜRÜN &amp; 4 MODEL TANITIM FİLMİ
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Bataryalı Takip Cihazı Nasıl Çalışır?{" "}
              <span className="text-orange-500">60 Saniyede Keşfedin.</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Araba, motosiklet, otobüs, çekici, kamyon, tekne ve konteyner
              takibini; araç içi dahili mikrofon (ses kayıt etme) özelliğini ve{" "}
              <strong>3.000 mAh, 6.000 mAh, 10.000 mAh, 20.000 mAh</strong>{" "}
              olmak üzere 4 farklı batarya modelimizi 60 saniyelik sesli tanıtım
              videomuzda izleyin.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={togglePlay}
              className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-orange-500/25 transition cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Videoyu Duraklat</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Sesli Tanıtımı Başlat (60 Sn)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition cursor-pointer"
              aria-label="Sesi Aç / Kapat"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Video Player + 6 Interactive Chapters Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Main 16:9 Full HD Video Player (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl bg-[#0D1320] border border-slate-800 overflow-hidden shadow-2xl relative group">
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                src="/videos/lifego-bataryali-takip-60sn.mp4?v=3"
                poster="/videos/lifego-bataryali-takip-60sn-poster.jpg?v=3"
                playsInline
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) =>
                  setCurrentTime(e.currentTarget.currentTime)
                }
                className="w-full h-full object-contain"
              />

              {/* Big Center Play Button Overlay when Paused */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/40 hover:bg-black/30 transition flex flex-col items-center justify-center gap-3 cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xl shadow-orange-500/50 ring-8 ring-orange-500/25 hover:scale-105 transition">
                    <Play className="w-9 h-9 fill-white ml-1" />
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-[#0B0F17]/90 border border-slate-700 text-xs font-extrabold text-white shadow-lg">
                    🔊 Türkçe Sesli Tanıtımı İzle (01:00 • 4 Model &amp; Tüm Araçlar)
                  </span>
                </button>
              )}
            </div>

            {/* Bottom Video Status Bar */}
            <div className="p-4 bg-[#0B0F17] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 font-mono font-bold">
                  1080p FULL HD
                </span>
                <span className="text-slate-300 font-bold">
                  {VIDEO_CHAPTERS[Math.max(0, activeChapterIdx)]?.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400">
                  {Math.floor(currentTime)
                    .toString()
                    .padStart(2, "0")}{" "}
                  / 60 sn
                </span>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-semibold cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Tam Ekran</span>
                </button>
              </div>
            </div>
          </div>

          {/* 6 Clickable Video Chapters (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl bg-[#0D1320] border border-slate-800 p-5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                VİDEO BÖLÜMLERİ (TIKLA &amp; İZLE)
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                6 Sahne • 60 Sn
              </span>
            </div>

            {VIDEO_CHAPTERS.map((ch, idx) => {
              const isCurrent = activeChapterIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => jumpToChapter(ch.start)}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-start justify-between gap-3 cursor-pointer ${
                    isCurrent
                      ? "bg-orange-500/15 border-orange-500 text-white"
                      : "bg-slate-900/70 border-slate-800/90 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-black text-white truncate">
                      {ch.title}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {ch.desc}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 ${
                      isCurrent
                        ? "bg-orange-500 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {ch.timeLabel.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            4 ADVANCED ENGINEERING VISUAL CARDS
        ========================================================= */}
        <div className="pt-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold mb-2">
              <Cpu className="w-3.5 h-3.5" />
              ENDÜSTRİYEL BATARYALI TAKİP CİHAZI AKILLI GÜVENLİK MİMARİSİ
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              Kör Nokta Hafızası, Geo-Fence Çiti &amp; Çoklu Sensör Kalkanı
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1: Network Blind Areas GPS Data Retransmission */}
            <div className="rounded-3xl bg-[#0D1422] border border-slate-800 p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-extrabold">
                  32 + 32 Mb DAHİLİ BELLEK
                </span>
                <HardDriveDownload className="w-6 h-6 text-sky-400" />
              </div>

              <h4 className="text-lg sm:text-xl font-black text-white">
                Şebeke Kör Noktalarında (Tünel &amp; Otopark) Veri Kaydını Kaçırmaz
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Araç, tekne veya motosiklet GSM sinyalinin çekmediği bir tünele,
                yeraltı otoparkına veya açık denize girdiğinde cihaz uydu
                koordinatlarını <strong>32+32 Mb dahili hafızasına</strong>{" "}
                kaydeder. Şebeke sinyali geri geldiği saniyede tüm geçmiş rotayı
                sunucuya otomatik yükler.
              </p>

              {/* Visual Diagram */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 flex items-center justify-between gap-2 text-[11px] font-mono">
                <div className="text-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block mb-1" />
                  <div className="text-emerald-400 font-bold">4G Aktif</div>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-amber-500 text-center pt-1 text-amber-400 font-bold">
                  Tünel: Hafızaya Kayıt
                </div>
                <div className="text-center">
                  <span className="w-3 h-3 rounded-full bg-sky-400 inline-block mb-1" />
                  <div className="text-sky-400 font-bold">Buluta Aktarım</div>
                </div>
              </div>
            </div>

            {/* Card 2: Geo-Fence Alarm (200m - 1000m Safe Area vs Alarm Area) */}
            <div className="rounded-3xl bg-[#0D1422] border border-slate-800 p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                  200m – 1000m ELEKTRONİK ÇİT
                </span>
                <Radar className="w-6 h-6 text-emerald-400" />
              </div>

              <h4 className="text-lg sm:text-xl font-black text-white">
                Güvenli Bölge (Geo-Fence) Giriş &amp; Çıkış Alarmı
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Mobil uygulama üzerinden evinizin, iş yerinizin, marinanın veya
                otoparkın etrafına <strong>200 metre ile 1000 metre</strong>{" "}
                arasında <strong>Güvenli Alan (Safe Area)</strong> çizin.
                Aracınız, tekneniz veya motosikletiniz bu sınırın dışına çıktığı
                anda telefonunuza anlık ihlal bildirimi düşer.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30">
                  <div className="font-extrabold text-sky-400">
                    🛡️ Güvenli Alan (Safe Area)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Park alanı içinde 7/24 sessiz nöbet
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30">
                  <div className="font-extrabold text-red-400">
                    🚨 İhlal Alanı (Alarm Area)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Sınır aşımında saniyesinde mobil uyarı
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Vibrate, Collision, Prying & Tow Alarm */}
            <div className="rounded-3xl bg-[#0D1422] border border-slate-800 p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-extrabold">
                  3 EKSENLİ G-SENSÖR + OPTİK SENSÖR
                </span>
                <ShieldAlert className="w-6 h-6 text-amber-400" />
              </div>

              <h4 className="text-lg sm:text-xl font-black text-white">
                Sarsıntı, Kapı Zorlama, Çarpışma &amp; Çekici Alarmı
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Park halindeki aracınıza başka bir aracın çarpması, kapı/kontak
                zorlanması, motosikletinizin yerinden oynatılması veya{" "}
                <strong>çekiciye yüklenmesi</strong> durumunda anormal titreşimi
                algılar ve saniyeler içinde telefonunuza alarm gönderir.
              </p>

              <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-center">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300">
                  💥 Park Çarpışma
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-red-300">
                  🔓 Kapı / Sökülme
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-orange-300">
                  🛻 Çekici Yükleme
                </div>
              </div>
            </div>

            {/* Card 4: 360 Angle Update, Voice Recording & Multi-Function */}
            <div className="rounded-3xl bg-[#0D1422] border border-slate-800 p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-extrabold">
                  12&apos;Lİ MULTI-FONKSİYON DONANIM
                </span>
                <Compass className="w-6 h-6 text-orange-400" />
              </div>

              <h4 className="text-lg sm:text-xl font-black text-white">
                360° Viraj Açısı Algılama, Ses Kayıt Etme &amp; FOTA
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Angle Update (360° Viraj Sensörü)</strong> sayesinde
                araç sokak dönüşlerinde ekstra konum noktası göndererek haritada
                kusursuz rota çizer. Ayrıca{" "}
                <strong>Dahili Mikrofon ile Ses Kayıt Etme</strong>, Düşük Pil
                Alarmı ve uzaktan yazılım güncelleme (FOTA) sunar.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-bold text-slate-200">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>360° Viraj Raporu</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Ses Kayıt Etme</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>60µA Derin Uyku</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
