export interface ProductPackage {
  id: string;
  modelCode: string;
  mah: number;
  name: string;
  badge?: string;
  shortDesc: string;
  activeDaysText: string;
  standbyDaysText: string;
  dimensionsText: string;
  unitCount: number;
  price: number;
  oldPrice: number;
  unitPrice: number;
  savings: number;
  popular?: boolean;
  features: string[];
}

export interface ProductAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
}

export interface MountingPoint {
  id: string;
  vehicleType: "otomobil" | "motosiklet" | "ticari";
  title: string;
  locationLabel: string;
  x: number;
  y: number;
  gpsSignal: string;
  stealthLevel: string;
  magnetSurface: string;
  description: string;
  proTip: string;
}

export interface TechnicalSpecGroup {
  category: string;
  specs: { label: string; value: string; highlight?: boolean }[];
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  vehicle: string;
  vehicleCategory:
    | "Otomobil"
    | "Motosiklet"
    | "Tekne & Yat"
    | "Kamyon / Çekici / Filo"
    | "Karavan & Konteyner";
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
  usageDuration: string;
}

export interface SiteConfig {
  brandName: string;
  brandTagline: string;
  productModel: string;
  productFullName: string;
  phoneDisplay: string;
  phoneRaw: string;
  whatsappRaw: string;
  whatsappDisplay: string;
  email: string;
  address: string;
  workingHours: string;
  bankTransferDiscountPercent: number;
  codFee: number;
  youtubeVideoUrl?: string;
  bankAccounts: {
    bankName: string;
    accountHolder: string;
    iban: string;
  }[];
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: "LifeGo Mobil",
  brandTagline:
    "Mıknatıslı & Bataryalı Araç, Motosiklet, Tekne, Nesne ve Kişi Takip Sistemleri",
  productModel: "LG-Serisi Pro",
  productFullName:
    "LifeGo Mıknatıslı & Bataryalı 4G GPS Araç, Motosiklet, Tekne, Nesne ve Kişi Takip Cihazı (Ses Kayıt Özellikli)",
  phoneDisplay: "+90 216 825 10 87",
  phoneRaw: "+902168251087",
  whatsappRaw: "902168251087",
  whatsappDisplay: "+90 216 825 10 87",
  email: "destek@lifegomobil.com",
  address: "Teknopark Bulvarı No: 1/4C, Kurtköy / Pendik — İstanbul",
  workingHours:
    "Pazartesi - Cumartesi: 09:00 - 20:00 (7/24 WhatsApp Teknik Destek)",
  bankTransferDiscountPercent: 5,
  codFee: 0,
  youtubeVideoUrl: "",
  bankAccounts: [
    {
      bankName: "Garanti BBVA",
      accountHolder: "LİFEGO MOBİL TEKNOLOJİ VE TELEMATİK SİSTEMLERİ",
      iban: "TR42 0006 2000 4120 0006 2984 10",
    },
    {
      bankName: "Ziraat Bankası",
      accountHolder: "LİFEGO MOBİL TEKNOLOJİ VE TELEMATİK SİSTEMLERİ",
      iban: "TR89 0001 0021 4589 6321 4500 01",
    },
  ],
};

export const PRODUCT_IMAGES = [
  {
    id: "studio",
    src: "/images/product-studio-main.jpg",
    alt: "Bataryalı Takip Cihazı — Mıknatıslı Araç, Motosiklet, Tekne ve Nesne Takip Cihazı",
    caption:
      "N54 Mıknatıslı & Dahili Mikrofonlu Zırhlı Gövde — 3.000 / 6.000 / 10.000 / 20.000 mAh Seçenekleriyle",
    badge: "Ses Kayıt + N54 Mıknatıs",
  },
  {
    id: "chassis",
    src: "/images/product-chassis-mount.jpg",
    alt: "Mıknatıslı Araç Takip Cihazı Şasi Altı ve Araç İçi Montaj",
    caption:
      "Araç İçinde Ses Kayıt Etme veya Şasi Altında Pratik Takip — 0 Kablo, 0 Montaj",
    badge: "18.4 kg Manyetik Tutuş",
  },
  {
    id: "motorcycle",
    src: "/images/product-motorcycle-mount.jpg",
    alt: "Bataryalı Motosiklet, Tekne ve Nesne Takip Cihazı",
    caption:
      "Motosiklet, Tekne, Kamyon, Otobüs, Çekici ve Konteyner İçin Kablosuz Güç",
    badge: "Garantiyi Kesinlikle Bozmaz",
  },
  {
    id: "xray",
    src: "/images/product-xray-dimensions.svg",
    alt: "Bataryalı Takip Cihazı Mühendislik Şeması ve Mikrofon Mimarisi",
    caption:
      "Donanım Mimarisi — Yüksek Hassasiyetli Ses Kayıt Mikrofonu, Anti-Tamper Sensör & IP67 Zırh",
    badge: "Teknik Şema & Mikrofon",
  },
  {
    id: "package",
    src: "/images/product-package-contents.svg",
    alt: "Bataryalı Araç ve Motosiklet Takip Cihazı Kutu İçeriği",
    caption:
      "Eksiksiz Kutu İçeriği — M2M SIM Kartı Takılı, Kutudan Çıktığı An Aktif",
    badge: "Tak-Çalıştır Tam Set",
  },
  {
    id: "live-tracking",
    src: "/images/ozellik-canli-konum-takibi.png",
    alt: "Canlı Konum ve Rota Takibi — Mobil ve Web Üzerinden Araç İzleme",
    caption:
      "Canlı Konum ve Rota Takibi — 4G LTE ve GPS Uydusu ile Anlık Harita ve 180 Günlük Geçmiş Rota",
    badge: "Canlı Rota & Sokak Görünümü",
  },
  {
    id: "multi-function",
    src: "/images/ozellik-cok-fonksiyonlu-sistem.png",
    alt: "Çok Fonksiyonlu Akıllı Mıknatıslı Takip Cihazı Özellikleri",
    caption:
      "N54 Mıknatıs, Kabin İçi Ses Kayıt Etme, IP67 Zırh, Sarsıntı Alarmı ve Sanal Çit Bir Arada",
    badge: "Çok Fonksiyonlu Sistem",
  },
  {
    id: "waterproof-ip67",
    src: "/images/ozellik-ip67-su-gecirmezlik.png",
    alt: "IP67 Su ve Toz Geçirmez Gövde Zırhı — Şasi Altı ve Dış Ortam",
    caption:
      "IP67 Dayanıklılık — Şasi Altı, Yağmur, Tazyikli Yıkama ve Dış Ortam Şartlarına Karşı Tam Koruma",
    badge: "IP67 Su & Çamur Geçirmez",
  },
  {
    id: "removal-alarm",
    src: "/images/ozellik-sokulme-isik-sensör-alarmi.png",
    alt: "Optik Işık Sensörlü Sökülme ve Düşme Alarmı",
    caption:
      "Optik Işık Sensörü — Cihaz Yerinden Söküldüğünde veya Düştüğünde Telefona Anında Acil Uyarı",
    badge: "Sökülme & Düşme Uyarısı",
  },
  {
    id: "fleet-management",
    src: "/images/ozellik-filo-coklu-arac-yonetimi.png",
    alt: "Tek Ekranda Çoklu Araç ve Filo Yönetimi",
    caption:
      "Çoklu Araç ve Filo Yönetimi — Otomobil, Motosiklet, Tır, Tekne ve Konteynerleri Tek Ekranda İzleyin",
    badge: "Çoklu Araç & Filo Paneli",
  },
];

// 4 Battery Capacity Models: 3.000 mAh (6.950 TL), 6.000 mAh (7.950 TL), 10.000 mAh (9.950 TL), 20.000 mAh (14.950 TL)
export const PRODUCT_PACKAGES: ProductPackage[] = [
  {
    id: "model-3000mah",
    modelCode: "LG-300 Mini",
    mah: 3000,
    name: "3.000 mAh Bataryalı Takip Cihazı (LG-300 Mini)",
    badge: "KOMPAKT & ARAÇ İÇİ SES KAYIT",
    shortDesc:
      "Araç içi koltuk altı ses kayıt etme, motosiklet, scooter, kişi/çanta ve değerli nesne takibi için ultra hafif model.",
    activeDaysText: "7 – 15 Gün Aktif",
    standbyDaysText: "45 – 90 Gün Nöbet",
    dimensionsText: "68 × 46 × 22 mm • 115g",
    unitCount: 1,
    price: 6950,
    oldPrice: 8400,
    unitPrice: 6950,
    savings: 1450,
    popular: false,
    features: [
      "3.000 mAh Li-Polimer Batarya (7–15 Gün Aktif / 90 Gün Uyku)",
      "Yüksek Hassasiyetli Dahili Mikrofon (Araç İçi Ses Kayıt Etme)",
      "N54 Güçlü Mıknatıs + Sökülme (Anti-Tamper) & Sarsıntı Alarmı",
      "Dahili 4G M2M SIM Kart + 12 Ay Ücretsiz iOS/Android/Web Panel",
      "2 Yıl Birebir Değişim Garantisi & Ücretsiz Sigortalı Kargo",
    ],
  },
  {
    id: "model-6000mah",
    modelCode: "LG-600 Pro",
    mah: 6000,
    name: "6.000 mAh Bataryalı Takip Cihazı (LG-600 Pro)",
    badge: "EN ÇOK TERCİH EDİLEN MODEL",
    shortDesc:
      "Otomobil, motosiklet, tekne ve hafif ticari araçlar için hem araç içi ses kayıt etme hem şasi altı uzun ömürlü takip.",
    activeDaysText: "15 – 30 Gün Aktif",
    standbyDaysText: "90 – 180 Gün Nöbet",
    dimensionsText: "80 × 56 × 27 mm • 181g",
    unitCount: 1,
    price: 7950,
    oldPrice: 9600,
    unitPrice: 7950,
    savings: 1650,
    popular: true,
    features: [
      "6.000 mAh Li-Polimer Batarya (15–30 Gün Aktif / 180 Gün Uyku)",
      "Yüksek Hassasiyetli Dahili Mikrofon (Araç İçi Ses Kayıt Etme)",
      "N54 Endüstriyel Mıknatıs + IP67 Su Geçirmez Zırhlı Gövde",
      "Dahili 4G M2M SIM Kart + 12 Ay Ücretsiz iOS/Android/Web Panel",
      "32+32 Mb Tünel/Kör Nokta Hafızası & 2 Yıl Resmi Garanti",
    ],
  },
  {
    id: "model-10000mah",
    modelCode: "LG-1000 Max",
    mah: 10000,
    name: "10.000 mAh Bataryalı Takip Cihazı (LG-1000 Max)",
    badge: "UZUN YOL & AĞIR HİZMET",
    shortDesc:
      "Kamyon, otobüs, çekici, karavan, tekne/yat ve yoğun çalışan filo araçları için yüksek kapasiteli bataryalı sistem.",
    activeDaysText: "30 – 55 Gün Aktif",
    standbyDaysText: "180 – 365 Gün (1 Yıl) Nöbet",
    dimensionsText: "92 × 60 × 32 mm • 245g",
    unitCount: 1,
    price: 9950,
    oldPrice: 12000,
    unitPrice: 9950,
    savings: 2050,
    popular: false,
    features: [
      "10.000 mAh Dev Batarya (30–55 Gün Aktif / 365 Güne Kadar Nöbet)",
      "Kabin & Araç İçi Net Ses Kayıt Etme (Gürültü Filtreli Mikrofon)",
      "Çift Sıra N54 Neodimyum Mıknatıs + Anti-Tamper Sökülme Alarmı",
      "Dahili 4G M2M SIM Kart + 12 Ay Ücretsiz Filo & Mobil Panel",
      "90 Gün Geçmiş Sokak Rotası & 2 Yıl Resmi Değişim Garantisi",
    ],
  },
  {
    id: "model-20000mah",
    modelCode: "LG-2000 Ultra",
    mah: 20000,
    name: "20.000 mAh Bataryalı Takip Cihazı (LG-2000 Ultra)",
    badge: "MAKSİMUM KAPASİTE • 2 YIL BEKLEME",
    shortDesc:
      "Tır dorsesi, konteyner, iş makinesi, sezonluk bağlı tekneler ve aylarca şarja ulaşılamayan varlıklar için ekstrem güç.",
    activeDaysText: "60 – 110 Gün Aktif",
    standbyDaysText: "365 – 730 Gün (2 Yıl) Nöbet",
    dimensionsText: "112 × 68 × 38 mm • 360g",
    unitCount: 1,
    price: 14950,
    oldPrice: 17900,
    unitPrice: 14950,
    savings: 2950,
    popular: false,
    features: [
      "20.000 mAh Endüstriyel Batarya (60–110 Gün Aktif / 730 Gün Uyku!)",
      "Kabin İçi Akustik Ses Kayıt Etme Mikrofonu",
      "Ekstra Güçlendirilmiş N54 Mıknatıs + IP67 Zırhlı Yanmaz Kasa",
      "Dahili 4G M2M SIM Kart + 12 Ay Ücretsiz Kurumsal Web & Mobil Panel",
      "Öncelikli VIP WhatsApp Destek & 2 Yıl Birebir Değişim Garantisi",
    ],
  },
];

export const PRODUCT_ADDONS: ProductAddon[] = [
  {
    id: "addon-sim-ext",
    name: "+1 Yıl Ekstra M2M Hat & Sunucu Paketi (Toplam 24 Ay)",
    description:
      "İlk 12 aya ek olarak 2. yılın M2M SIM data ve bulut sunucu lisansını bugünkü indirimli fiyattan sabitleyin.",
    price: 1250,
    badge: "%40 İndirimli Uzatma",
  },
  {
    id: "addon-pouch",
    name: "Zırhlı Termal Koruma Kılıfı + Hızlı Type-C Duvar Adaptörü",
    description:
      "Ekstrem araç altı çamur/taş sıçramalarına karşı ekstra kevlar-dokulu kılıf ve akım korumalı 5V/2A şarj adaptörü.",
    price: 450,
  },
];

export const MOUNTING_POINTS: MountingPoint[] = [
  {
    id: "car-under-seat",
    vehicleType: "otomobil",
    title: "Koltuk Altı Metal Kızak & Torpido Arkası (Ses Kayıt + Konum)",
    locationLabel: "Araç İçi Ses Kayıt Etme İçin #1 En İdeal Nokta",
    x: 52,
    y: 48,
    gpsSignal: "%98 (Mükemmel)",
    stealthLevel: "%96 (Kompakt Yerleşim)",
    magnetSurface: "Koltuk Altı Çelik Ray & İskelet",
    description:
      "Cihazın dahili mikrofon özelliğinden faydalanarak araç içindeki sesleri net kayıt etmek ve algılamak istiyorsanız, sürücü veya yolcu koltuğunun altındaki çelik kızağa mıknatısla tutturun. Hem kabin içi akustik sesleri pürüzsüz alır hem de ayak altından uzak kalır.",
    proTip:
      "Cihaz tamamen sessiz ve ışıksız çalışır; ses kayıt etme sırasında araç içinde hiçbir uyarı sesi veya LED ışık yanmaz.",
  },
  {
    id: "car-rear-chassis",
    vehicleType: "otomobil",
    title: "Arka Şasi Travers & Tampon Demiri İçi (Dış Şasi Montaj)",
    locationLabel: "Korunaklı Bölge — En Yüksek Manyetik Tutuş",
    x: 22,
    y: 62,
    gpsSignal: "%96 (Çok Yüksek)",
    stealthLevel: "%100 (Tam Korunaklı)",
    magnetSurface: "4mm Kalınlığında Çelik Şasi Profili",
    description:
      "Arka tamponun hemen arkasındaki çelik travers veya şasi kolu, yerden yüksekliği ve düz metal yüzeyi sayesinde N54 mıknatısın tüm yüzeyiyle kilitlenmesini sağlar. Yoldan sıçrayan taşlardan korunaklıdır.",
    proTip:
      "Yapıştırmadan önce metal yüzeyi kuru bir bezle silin. Cihazın altındaki optik sökülme sensörünün metal yüzeye tam temas ettiğinden emin olun.",
  },
  {
    id: "car-spare-wheel",
    vehicleType: "otomobil",
    title: "Bagaj Stepne Havuzu & Arka Çamurluk İçi",
    locationLabel: "İç Mekanda Kuru & Güvenli Konum",
    x: 28,
    y: 44,
    gpsSignal: "%98 (Mükemmel)",
    stealthLevel: "%95 (İç Bölme Koruma)",
    magnetSurface: "Bagaj Taban Sacı / Çamurluk İç Sacı",
    description:
      "Cihazı dış ortam şartlarından tamamen izole etmek isterseniz bagaj halısının altındaki stepne havuzu sacına veya sağ/sol bagaj döşemesi içindeki metal gövdeye saniyeler içinde tutturabilirsiniz.",
    proTip:
      "İç mekanda kullanıldığında cihaz yağmur ve soğuktan etkilenmediği için batarya ömrü %15'e kadar daha uzun performans verir.",
  },
  {
    id: "car-front-subframe",
    vehicleType: "otomobil",
    title: "Ön Beşik / Karter Koruma Üstü Şasi Kolu",
    locationLabel: "SUV, Kamyonet & Çekici Noktası",
    x: 77,
    y: 60,
    gpsSignal: "%94 (Yüksek)",
    stealthLevel: "%98 (Yüksek Koruma)",
    magnetSurface: "Ön Şasi Kolu (Egzozdan Uzak Taraf)",
    description:
      "SUV, hafif ticari, kamyonet, çekici ve binek araçlarda ön şasi kolunun iç yüzeyine kilitlenir. N54 mıknatıs yüksek hızda ve çukurlarda dahi milim kayma yapmaz.",
    proTip:
      "Cihazı egzoz manifoldu gibi 70°C üzeri ısınan parçaların yanına değil, şasi kolunun serin tarafına sabitleyin.",
  },
  {
    id: "moto-under-seat",
    vehicleType: "motosiklet",
    title: "Sele Altı Kuyruk Şasisi / Akü Yanı Boşluğu",
    locationLabel: "Motosikletler İçin #1 En Güvenli Nokta",
    x: 34,
    y: 38,
    gpsSignal: "%99 (Maksimum Uydu Görüşü)",
    stealthLevel: "%98 (Anahtarla Açılan Bölme)",
    magnetSurface: "Kuyruk Şasi Borusu / Metal Akü Braketi",
    description:
      "Motosiklet selesinin altındaki çelik kuyruk profili veya metal braket üzerine doğrudan yapışır. Plastik sele kapağı GPS sinyallerini hiç kesmediği için <3 metre hassasiyetle çalışır ve aküden 0 elektrik çeker!",
    proTip:
      "Motosikletinizin aküsüne hiçbir kablo bağlanmadığı için Honda, Yamaha, BMW, Bajaj, CFMoto gibi sıfır motorlarda garanti kapsamını kesinlikle etkilemez.",
  },
  {
    id: "moto-fairing-frame",
    vehicleType: "motosiklet",
    title: "Yan Grenaj İçi Ana Şasi Gövdesi",
    locationLabel: "Yüksek Güvenlikli Şasi Konumu",
    x: 58,
    y: 45,
    gpsSignal: "%96 (Çok Yüksek)",
    stealthLevel: "%100 (Tam Korunaklı)",
    magnetSurface: "Ana Çelik Şasi / Radyatör Üst Braketi",
    description:
      "Sele altı dışında, yan plastik grenajın arkasındaki çelik şasi yüzeyine tutturulur. Sökülme (Anti-Tamper) sensörü sayesinde cihaz yerinden oynatıldığı an telefonunuz alarm verir.",
    proTip:
      "Titreşim alarmını mobil uygulamadan 'Yüksek Hassasiyet' moduna aldığınızda, park halindeki motorunuza birisi dokunduğu veya gidonu oynattığı an bildirim alırsınız.",
  },
  {
    id: "moto-topcase",
    vehicleType: "motosiklet",
    title: "Arka Çanta (Topcase) Altı Çelik Tabla",
    locationLabel: "Kurye & Touring Motorlar İçin Pratik",
    x: 18,
    y: 34,
    gpsSignal: "%99 (Açık Gökyüzü)",
    stealthLevel: "%94 (İç Bölme)",
    magnetSurface: "Çelik Çanta Taşıyıcı Tabla veya Çanta İçi",
    description:
      "Alüminyum veya plastik arka çanta kullanan touring ve kurye motosikletlerinde çelik taşıyıcı demirin alt yüzeyine veya çanta içi taban plakasına sabitlenir.",
    proTip:
      "IP67 su geçirmez gövdesi sayesinde motorunuzu basınçlı suyla yıkarken cihazı çıkarmanıza gerek yoktur.",
  },
  {
    id: "comm-trailer",
    vehicleType: "ticari",
    title: "Otobüs, Kamyon, Çekici, Tekne, Konteyner & Nesne Takibi",
    locationLabel: "10.000 mAh & 20.000 mAh Modellerle Yıllarca Güç",
    x: 45,
    y: 55,
    gpsSignal: "%97 (Yüksek)",
    stealthLevel: "%99 (Endüstriyel Koruma)",
    magnetSurface: "I-Kiriş Çelik Şasi / Tekne Motoru / Konteyner",
    description:
      "Otobüs bagaj/kabin içi, kamyon ve çekici şasisi, tır dorseleri, marin tekne ve yat motorları, konteynerler ve değerli kargo/nesneler için 10.000 mAh ve 20.000 mAh bataryalı modellerimiz aylarca şarja gerek duymadan kesintisiz takip ve ses kayıt etme imkanı sağlar.",
    proTip:
      "Tekne, dorse ve konteyner gibi uzun süre sabit kalan varlıklarda 20.000 mAh modeli seçerek nöbet modunda 2 yıla varan pil ömrü elde edebilirsiniz.",
  },
];

export const TECHNICAL_SPECS: TechnicalSpecGroup[] = [
  {
    category: "4 Farklı Batarya Kapasitesi & Model Seçenekleri",
    specs: [
      {
        label: "LG-300 Mini (3.000 mAh Model)",
        value: "7–15 Gün Aktif • 45–90 Gün Nöbet • 68×46×22 mm (6.950 ₺)",
        highlight: true,
      },
      {
        label: "LG-600 Pro (6.000 mAh Model)",
        value: "15–30 Gün Aktif • 90–180 Gün Nöbet • 80×56×27 mm (7.950 ₺)",
        highlight: true,
      },
      {
        label: "LG-1000 Max (10.000 mAh Model)",
        value: "30–55 Gün Aktif • 180–365 Gün Nöbet • 92×60×32 mm (9.950 ₺)",
        highlight: true,
      },
      {
        label: "LG-2000 Ultra (20.000 mAh Model)",
        value: "60–110 Gün Aktif • 365–730 Gün Nöbet • 112×68×38 mm (14.950 ₺)",
        highlight: true,
      },
      {
        label: "Çalışma & Derin Uyku Akımı",
        value: "Çalışma: 100µA ~ 100mA • Derin Uyku Bekleme: 60–100 µA/saat",
      },
      {
        label: "Şarj Girişi & Düşük Pil Uyarısı",
        value: "5V/2A USB Type-C Hızlı Şarj • %20 Seviyesinde Mobil Bildirim",
      },
    ],
  },
  {
    category: "Dahili Mikrofon (Araç İçi Ses Kayıt Etme) & Güvenlik",
    specs: [
      {
        label: "Dahili Mikrofon (Ses Kayıt)",
        value: "Yüksek Hassasiyetli Gürültü Filtreli Silikon Mikrofon (Araç İçi Ses Kayıt Etme)",
        highlight: true,
      },
      {
        label: "Ses Algılama Menzili",
        value: "Araç Kabini, Otobüs/Kamyon İçi veya Kabin İçinde 5–8 Metre Net Ses",
        highlight: true,
      },
      {
        label: "Sessiz Çalışma Prensibi",
        value: "Ses kayıt ve takip esnasında ses çıkarmaz, ışık yakmaz, bildirim göndermez",
      },
      {
        label: "Sökülme Alarmı (Anti-Tamper)",
        value: "Mıknatıs metal yüzeyden ayrıldığı saniyede mobil uygulama & SMS alarmı",
        highlight: true,
      },
      {
        label: "Sarsıntı, Çarpışma & Çekici Alarmı",
        value: "Kapı zorlama, darbe veya çekiciye yükleme anında saniyeler içinde uyarı",
      },
      {
        label: "Güvenli Bölge (Geo-Fence)",
        value: "200m – 1000m arası Güvenli Alan (Safe Area) giriş/çıkış ihlal bildirimi",
      },
    ],
  },
  {
    category: "Bağlantı & Uydu Konumlandırma (4G + 2G)",
    specs: [
      {
        label: "4G / 2G Çipset Mimarisi",
        value: "SIMCom LTE Cat.1 A7670 Serisi + AT6558R (GPS/BDS) + MTK6261",
        highlight: true,
      },
      {
        label: "4G LTE Frekans Bantları",
        value: "LTE-FDD B1/B2/B3/B4/B5/B7/B8/B28/B66 • LTE-TDD B34/B38/B39/B40/B41",
      },
      {
        label: "Uydu Kanal Sayısı & Hassasiyet",
        value: "66 Kanal Eşzamanlı • < 3–5 Metre CEP • İzleme: -165 dBm",
        highlight: true,
      },
      {
        label: "Kör Nokta Hafızası (32+32 Mb)",
        value: "Tünel/şebekesiz alanda GPS verisini kaydeder, sinyal gelince yükler",
        highlight: true,
      },
      {
        label: "360° Viraj Açısı Güncelleme",
        value: "Dönüşlerde otomatik açı bazlı konum atarak kusursuz rota çizimi",
      },
      {
        label: "İlk Konumlama (TTFF Açık Gökyüzü)",
        value: "Sıcak Başlatma ≤ 1 sn • Soğuk Başlatma ≤ 32 sn",
      },
    ],
  },
  {
    category: "Fiziksel Yapı, N54 Mıknatıs & Kullanım Alanları",
    specs: [
      {
        label: "Manyetik Tutuş Sistemi",
        value: "Entegre N54 Seviye Güçlü Neodimyum Mıknatıs (~18.4 kg Çekme)",
        highlight: true,
      },
      {
        label: "Gövde Malzemesi & Su Zırhı",
        value: "Yanmaz (Fireproof) ABS Zırhlı Gövde • IP67 Su ve Toz Geçirmez",
        highlight: true,
      },
      {
        label: "Uyumlu Araç & Varlıklar",
        value: "Araba, Motosiklet, Otobüs, Kamyon, Çekici, Tekne, Konteyner, Nesne & Kişi",
        highlight: true,
      },
      {
        label: "Anten Yapısı",
        value: "Dahili Dört Bant GSM Anteni + Yüksek Kazançlı GPS Seramik Anten",
      },
      {
        label: "Çalışma Sıcaklığı Aralığı",
        value: "-20°C ile +70°C Arası Ekstrem İklim Koşulları",
      },
      {
        label: "Mobil & Web Platformu",
        value: "Türkçe iOS (App Store), Android (Google Play) ve Web Filo Paneli",
      },
    ],
  },
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    author: "Murat K.",
    city: "İstanbul / Kadıköy",
    vehicle: "VW Tiguan & Yamaha Tracer 9 GT (6.000 mAh Model)",
    vehicleCategory: "Otomobil",
    rating: 5,
    date: "14 Ekim 2026",
    verified: true,
    title: "Koltuk altına koydum, araç içi ses kayıt özelliği çok başarılı!",
    comment:
      "6.000 mAh olan LG-600 Pro modelini aldım. Aracın içinde sürücü koltuğunun altındaki demire mıknatısıyla yapıştırdım. Hem dışarıdan bakınca kesinlikle görünmüyor hem de mikrofonu sayesinde araç içindeki sesleri net şekilde kayıt edip kontrol edebiliyorum. Motosikletime geçtiğimde 2 saniyede söküp sele altına koyuyorum.",
    usageDuration: "3 Aydır Kullanıyor",
  },
  {
    id: "rev-2",
    author: "Serkan D.",
    city: "Ankara / Çankaya",
    vehicle: "4 Adet Çekici Kamyon & Tır Dorsesi (20.000 mAh Model)",
    vehicleCategory: "Kamyon / Çekici / Filo",
    rating: 5,
    date: "28 Eylül 2026",
    verified: true,
    title: "20.000 mAh modeli dorselere taktık, aylardır şarja dokunmadık",
    comment:
      "Nakliye firmamızdaki çekici kamyonlar ve konteyner dorseleri için 20.000 mAh Ultra modelinden aldık. Dorsenin elektriği kesilse bile kendi dev bataryasıyla aylarca konum veriyor. Sürücü kabinine koyduğumuz cihazlarla da acil durumlarda kabin içi ses kayıt özelliğini kullanabiliyoruz. Mıknatısı şasiye kaynak olmuş gibi tutuyor.",
    usageDuration: "5 Aydır Kullanıyor",
  },
  {
    id: "rev-3",
    author: "Kaptan Levent B.",
    city: "Muğla / Bodrum",
    vehicle: "9.5m Marin Tekne & Dıştan Takma Motor (10.000 mAh Model)",
    vehicleCategory: "Tekne & Yat",
    rating: 5,
    date: "2 Kasım 2026",
    verified: true,
    title: "Tekne ve yat takibi için 10.000 mAh bataryalı model harika",
    comment:
      "Kışın marinada bağlı kalan teknem ve kıymetli dıştan takma motorum için 10.000 mAh bataryalı takip cihazını tercih ettim. IP67 su geçirmez olduğu için nemden ve deniz suyundan hiç etkilenmiyor. Tekne güvenli bölgeden (Geo-fence) 200 metre bile ayrılsa veya sarsıntı olsa telefonum anında bildirim veriyor.",
    usageDuration: "2 Aydır Kullanıyor",
  },
  {
    id: "rev-4",
    author: "Burak T.",
    city: "İzmir / Karşıyaka",
    vehicle: "Honda Africa Twin & Şehirlerarası Otobüs (3.000 & 10.000 mAh)",
    vehicleCategory: "Motosiklet",
    rating: 5,
    date: "19 Ekim 2026",
    verified: true,
    title: "Hem motosikletime 3000 mAh hem tur otobüsümüze 10000 mAh aldık",
    comment:
      "Motosikletimin sele altı dar olduğu için 3.000 mAh kompakt modeli seçtim, avuç içi kadar ve aküye hiç bağlanmadığı için garantiyi bozmadı. Turizm otobüsümüz için de 10.000 mAh modeli aldık. Tünelden geçerken bile kör nokta hafızası sayesinde rotayı eksiksiz çiziyor.",
    usageDuration: "4 Aydır Kullanıyor",
  },
];

export const FAQ_ITEMS = [
  {
    question:
      "Cihazda mikrofon var mı? Araç içine koyduğumda ses kayıt etme özelliği nasıl çalışır?",
    answer:
      "Evet! Tüm bataryalı takip cihazı modellerimizde (3.000 / 6.000 / 10.000 / 20.000 mAh) yüksek hassasiyetli gürültü filtreli dahili mikrofon (Ses Kayıt Etme) özelliği standart olarak bulunur. Cihazı otomobil, otobüs, kamyon veya çekici içerisine (örneğin koltuk altı metal kızağa, torpido arkasına veya çanta içine) yerleştirdiğinizde, mobil uygulama üzerinden ses kayıt özelliğini kullanarak araç içi akustik güvenlik kayıtlarını telefonunuzdan kontrol edebilirsiniz.",
  },
  {
    question:
      "3.000 mAh, 6.000 mAh, 10.000 mAh ve 20.000 mAh modelleri arasındaki fark nedir?",
    answer:
      "Dört modelimizin tamamında 4G LTE + 66 Kanal GPS uydu alıcısı, dahili ses kayıt mikrofonu, N54 mıknatıs, sökülme/sarsıntı alarmı ve M2M SIM kart standarttır. Aralarındaki tek fark batarya kapasitesi ve kullanım süresidir: 3.000 mAh model (6.950 ₺) kompakt boyutuyla araç içi ses kayıt, motosiklet ve çanta/kişi takibi için idealdir (7-15 gün aktif / 90 gün uyku). 6.000 mAh model (7.950 ₺) otomobil ve motosikletlerde en çok tercih edilen genel kullanım modelidir (15-30 gün aktif / 180 gün uyku). 10.000 mAh model (9.950 ₺) kamyon, otobüs, çekici ve tekneler için 30-55 gün aktif / 365 gün nöbet sunar. 20.000 mAh Ultra model (14.950 ₺) ise tır dorsesi, konteyner ve iş makinelerinde 60-110 gün aktif, nöbet modunda 2 yıla (730 gün) kadar kesintisiz güç sağlar.",
  },
  {
    question:
      "Araba, motosiklet dışında otobüs, kamyon, çekici, tekne ve konteynerde çalışır mı?",
    answer:
      "Kesinlikle! Cihazımız elektrik tesisatına veya aküye ihtiyaç duymayan bağımsız bir Bataryalı Takip Cihazı olduğu için; binek araba, motosiklet, şehirlerarası otobüs, kurtarıcı çekici, kamyon, marin tekne ve yat, uluslararası yük konteyneri, karavan, değerli kargo kolisi (nesne takibi) ve çanta içi kişi takibinde 81 ilde kesintisiz çalışır.",
  },
  {
    question:
      "Cihazı kurmak için oto elektrikçiye gitmem gerekiyor mu? Garantiyi bozar mı?",
    answer:
      "Hayır, oto elektrikçiye veya ustaya gitmenize hiç gerek yoktur. %100 kablosuz ve bataryalı olduğu için aracınızın veya motosikletinizin kablolarına dokunulmaz, sıfır araçların yetkili servis garantisini kesinlikle bozmaz. Tabanındaki N54 mıknatısla 3 saniyede metal yüzeye tutturup hemen kullanabilirsiniz.",
  },
  {
    question: "İçinde SIM kart var mı? Bayiden hat çıkarmam gerekiyor mu?",
    answer:
      "Cihazınızın içinde Türkiye genelinde tüm operatör altyapılarıyla tam uyumlu M2M Data SIM kartı takılı ve aktif olarak gönderilir. Operatör bayisine gitmenize, adınıza yeni faturalı hat açtırmanıza veya taahhüt vermenize gerek yoktur. İlk 12 aylık SIM kullanımı ve Türkçe iOS/Android uygulama lisansı fiyata dahildir.",
  },
  {
    question: "Birisi cihazı yerinden oynatırsa veya sökerse haberim olur mu?",
    answer:
      "Evet! Cihazın mıknatıslı tabanında özel bir Anti-Tamper (Sökülme / Işık ve Temas) sensörü yer alır. Cihaz yapıştırıldığı metal yüzeyden ayrıldığı saniyede mobil uygulamanıza yüksek öncelikli 'Sökülme Alarmı' ve son konum koordinatı gönderilir.",
  },
];
