"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Radio,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  X,
  FileText,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

type LegalType = "kvkk" | "mesafeli" | "garanti" | null;

export default function Footer() {
  const { siteConfig, buildWhatsAppUrl } = useCart();
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);

  return (
    <>
      <footer className="bg-[#070A10] text-slate-400 border-t border-slate-800/90 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
            {/* Brand Column (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-black text-white tracking-tight">
                    LIFEGO<span className="text-orange-500">MOBİL</span>
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    {siteConfig.brandTagline}
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-400">
                LifeGo Mobil; araba, motosiklet, yolcu otobüsü, tır çekicisi,
                kamyon, tekne/yat, lojistik konteyner, değerli nesne ve kişi
                takibi için montaj gerektirmeyen{" "}
                <strong>mıknatıslı araç, motosiklet, tekne, nesne takip cihazı</strong>{" "}
                ve{" "}
                <strong>
                  bataryalı araç, tekne, motosiklet, nesne, kişi takip cihazı ve sistemi
                </strong>{" "}
                sunar. 3.000 mAh, 6.000 mAh, 10.000 mAh ve 20.000 mAh olmak üzere
                4 farklı Bataryalı Takip Cihazı modelimiz dahili mikrofonlu ve
                M2M SIM kartı tanımlı olarak sevk edilir.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <a
                  href={buildWhatsAppUrl(
                    `Merhaba ${siteConfig.brandName}, ${siteConfig.productModel} hakkında bilgi almak istiyorum.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>7/24 WhatsApp Destek</span>
                </a>
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold transition"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <span>{siteConfig.phoneDisplay}</span>
                </a>
              </div>
            </div>

            {/* Quick Links (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Hızlı Erişim &amp; Ürün
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    href="/#urun-secimi"
                    className="hover:text-orange-400 transition"
                  >
                    LG-500 Pro Paketler &amp; Fiyatlar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#canli-demo"
                    className="hover:text-orange-400 transition"
                  >
                    Canlı Mobil Uygulama Simülatörü
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#montaj-rehberi"
                    className="hover:text-orange-400 transition"
                  >
                    Otomobil &amp; Motosiklet Pratik Montaj Rehberi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#batarya-hesapla"
                    className="hover:text-orange-400 transition"
                  >
                    6.000 mAh Batarya Ömrü Hesaplayıcı
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sepet"
                    className="hover:text-orange-400 transition"
                  >
                    Alışveriş Sepetim
                  </Link>
                </li>
                <li>
                  <Link
                    href="/siparis-takip"
                    className="hover:text-orange-400 transition text-orange-400 font-bold"
                  >
                    Sipariş Durumu Sorgulama
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-orange-400 transition text-white font-bold"
                  >
                    Life GO Mobil Blogu &amp; 300 Rehber
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Guarantees (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Kurumsal &amp; Yasal
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveLegal("mesafeli")}
                    className="hover:text-orange-400 transition text-left cursor-pointer"
                  >
                    Mesafeli Satış Sözleşmesi
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveLegal("garanti")}
                    className="hover:text-orange-400 transition text-left cursor-pointer"
                  >
                    2 Yıl Garanti &amp; İade Koşulları
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveLegal("kvkk")}
                    className="hover:text-orange-400 transition text-left cursor-pointer"
                  >
                    KVKK &amp; Gizlilik Politikası
                  </button>
                </li>
                <li>
                  <Link
                    href="/yonetim"
                    className="hover:text-slate-200 transition text-slate-500"
                  >
                    Bayi / Yönetici Girişi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                İletişim &amp; Teknik Merkez
              </h3>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400">
                      Müşteri Hizmetleri &amp; Sipariş Hattı:
                    </span>
                    <a
                      href={`tel:${siteConfig.phoneRaw}`}
                      className="text-white font-bold hover:text-orange-400"
                    >
                      {siteConfig.phoneDisplay}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400">E-Posta:</span>
                    <span className="text-white font-medium">
                      {siteConfig.email}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>{siteConfig.address}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{siteConfig.workingHours}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} {siteConfig.brandName} — Tüm Hakları
              Saklıdır. BTK Onaylı M2M Life GO Mobil Altyapısı.
            </p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                256-Bit SSL Güvenli Sipariş
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />2 Yıl
                Birebir Değişim Garantisi
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      {activeLegal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[82vh] flex flex-col text-white shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0F1623]">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-orange-500" />
                <h3 className="text-base font-black">
                  {activeLegal === "mesafeli" && "Mesafeli Satış Sözleşmesi"}
                  {activeLegal === "garanti" &&
                    "2 Yıl Resmi Garanti ve 14 Gün İade Koşulları"}
                  {activeLegal === "kvkk" &&
                    "KVKK Aydınlatma Metni ve Konum Verisi Gizliliği"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLegal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
              {activeLegal === "garanti" && (
                <>
                  <p>
                    <strong>1. 2 Yıl Birebir Değişim Garantisi:</strong> Satın
                    aldığınız {siteConfig.productFullName}, fatura tarihinden
                    itibaren 2 (iki) yıl boyunca üretim, batarya hücresi ve
                    anakart arızalarına karşı {siteConfig.brandName} garantisi
                    altındadır.
                  </p>
                  <p>
                    <strong>2. 14 Gün Koşulsuz İade Hakkı:</strong> 6502 sayılı
                    Tüketicinin Korunması Hakkında Kanun kapsamında, teslim
                    tarihinden itibaren 14 gün içerisinde kutu içeriğine zarar
                    vermeden iade veya değişim talebinde bulunabilirsiniz.
                  </p>
                  <p>
                    <strong>3. Ücretsiz Uzaktan Aktivasyon Desteği:</strong>{" "}
                    Cihazınız adresinize ulaştığında teknik destek ekibimiz
                    mobil uygulama kurulumunu sizinle birlikte adım adım
                    tamamlar.
                  </p>
                </>
              )}
              {activeLegal === "mesafeli" && (
                <>
                  <p>
                    İşbu Mesafeli Satış Sözleşmesi, {siteConfig.brandName} ile
                    sipariş formunu dolduran Alıcı arasında, 6502 sayılı Kanun
                    ve Mesafeli Sözleşmeler Yönetmeliği hükümlerine uygun olarak
                    elektronik ortamda kurulmuştur.
                  </p>
                  <p>
                    Sipariş edilen ürün(ler), seçilen paket adedince M2M SIM
                    kartı takılı, 12 aylık sunucu kullanımı tanımlı ve ücretsiz
                    sigortalı kargo ile Alıcı&apos;nın belirttiği adrese sevk
                    edilir.
                  </p>
                </>
              )}
              {activeLegal === "kvkk" && (
                <>
                  <p>
                    <strong>%100 Şifreli Konum Gizliliği:</strong> LG-500 Pro
                    cihazınızın ürettiği GPS koordinatları ve geçmiş rota
                    kayıtları uçtan uca şifrelenerek yalnızca sizin kullanıcı
                    adınız ve şifrenizle erişilebilen bulut hesabınızda tutulur.
                    Üçüncü şahıslarla kesinlikle paylaşılmaz.
                  </p>
                  <p>
                    6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
                    uyarınca sipariş teslimatı için alınan ad, telefon ve adres
                    bilgileriniz yalnızca kargo gönderimi ve faturalandırma
                    amacıyla işlenmektedir.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
