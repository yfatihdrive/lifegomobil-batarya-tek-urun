"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Settings,
  Package,
  Save,
  CheckCircle2,
  MessageCircle,
  ArrowLeft,
  RefreshCw,
  Video,
  BookOpen,
  Calendar,
  Clock,
  Search,
  Filter,
  Eye,
  Check,
  Send,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";
import { useCart, formatTRY } from "@/context/CartContext";
import type { StoredOrder } from "@/app/api/orders/route";

interface AdminBlogArticleSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  vehicleType: string;
  region: string;
  recommendedModel: string;
  recommendedMah: string;
  recommendedPrice: string;
  author: string;
  scheduledAt: string;
  status: "published" | "scheduled" | "draft";
  isLiveNow: boolean;
  wordCount: number;
  readTimeMinutes: number;
  imagesCount: number;
  coverImage: string;
}

interface BlogStats {
  totalCount: number;
  liveCount: number;
  scheduledCount: number;
  draftCount: number;
  totalWords: number;
  totalImages: number;
  nextScheduledDate: string | null;
  nextScheduledTitle: string | null;
  nextScheduledId: number | null;
}

export default function AdminPanelPage() {
  const { siteConfig, updateSiteConfig, localOrders, buildWhatsAppOrderUrl } =
    useCart();

  // Active Tab: "orders" | "blog" | "settings"
  const [activeTab, setActiveTab] = useState<"orders" | "blog" | "settings">("blog");

  // Orders State
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Blog Management State
  const [blogArticles, setBlogArticles] = useState<AdminBlogArticleSummary[]>([]);
  const [blogStats, setBlogStats] = useState<BlogStats | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogSearch, setBlogSearch] = useState("");
  const [blogCategoryFilter, setBlogCategoryFilter] = useState("all");
  const [blogStatusFilter, setBlogStatusFilter] = useState<"all" | "live" | "scheduled">("all");
  const [blogPage, setBlogPage] = useState(1);
  const itemsPerPage = 12;

  // Settings State
  const [phoneDisplay, setPhoneDisplay] = useState(siteConfig.phoneDisplay);
  const [phoneRaw, setPhoneRaw] = useState(siteConfig.phoneRaw);
  const [whatsappRaw, setWhatsappRaw] = useState(siteConfig.whatsappRaw);
  const [whatsappDisplay, setWhatsappDisplay] = useState(siteConfig.whatsappDisplay);
  const [discountPercent, setDiscountPercent] = useState(
    siteConfig.bankTransferDiscountPercent
  );
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState(
    siteConfig.youtubeVideoUrl || ""
  );
  const [savedNotice, setSavedNotice] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchAllOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.orders) && data.orders.length > 0) {
          setOrders(data.orders);
          return;
        }
      }
    } catch {
      // fallback
    }
    setOrders(localOrders);
  };

  const fetchBlogArticles = async () => {
    setBlogLoading(true);
    try {
      const res = await fetch("/api/blog?mode=admin");
      if (res.ok) {
        const data = await res.json();
        setBlogArticles(data.articles || []);
        setBlogStats(data.stats || null);
      }
    } catch (err) {
      console.error("Failed to load blog articles:", err);
    } finally {
      setBlogLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    fetchBlogArticles();
  }, [localOrders]);

  useEffect(() => {
    setPhoneDisplay(siteConfig.phoneDisplay);
    setPhoneRaw(siteConfig.phoneRaw);
    setWhatsappRaw(siteConfig.whatsappRaw);
    setWhatsappDisplay(siteConfig.whatsappDisplay);
    setDiscountPercent(siteConfig.bankTransferDiscountPercent);
    setYoutubeVideoUrl(siteConfig.youtubeVideoUrl || "");
  }, [siteConfig]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteConfig({
      phoneDisplay,
      phoneRaw,
      whatsappRaw,
      whatsappDisplay,
      bankTransferDiscountPercent: Number(discountPercent) || 5,
      youtubeVideoUrl: youtubeVideoUrl.trim(),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleOrderStatusChange = async (
    orderCode: string,
    status: StoredOrder["status"]
  ) => {
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode, status }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.orderCode === orderCode ? { ...o, status } : o))
      );
    } catch {
      // ignore
    }
  };

  // Blog Actions
  const handlePublishNow = async (id: number) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetch("/api/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "published", scheduledAt: today }),
      });
      if (res.ok) {
        setActionNotice(`Makale #${id} başarıyla şimdi yayına alındı!`);
        setTimeout(() => setActionNotice(null), 3500);
        fetchBlogArticles();
      }
    } catch {
      // ignore
    }
  };

  const handlePublishNext = async () => {
    try {
      const res = await fetch("/api/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish_next" }),
      });
      if (res.ok) {
        const data = await res.json();
        setActionNotice(`Sıradaki makale yayına alındı: ${data.publishedTitle}`);
        setTimeout(() => setActionNotice(null), 3500);
        fetchBlogArticles();
      }
    } catch {
      // ignore
    }
  };

  const handleRecalculateSchedule = async () => {
    if (
      !confirm(
        "Tüm zamanlanmış makaleler bugünden itibaren her gün 1 makale yayınlanacak şekilde takvime dizilecektir. Onaylıyor musunuz?"
      )
    ) {
      return;
    }
    try {
      const res = await fetch("/api/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recalculate_daily_schedule" }),
      });
      if (res.ok) {
        setActionNotice("300 makale günde 1 yayın takvimine göre senkronize edildi!");
        setTimeout(() => setActionNotice(null), 3500);
        fetchBlogArticles();
      }
    } catch {
      // ignore
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderCode.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer.phone.includes(orderSearch) ||
        o.customer.city.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus =
        orderStatusFilter === "all" || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Blog Articles
  const filteredArticles = useMemo(() => {
    return blogArticles.filter((a) => {
      const q = blogSearch.toLowerCase();
      const matchesSearch =
        !blogSearch ||
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.vehicleType.toLowerCase().includes(q) ||
        a.recommendedMah.toLowerCase().includes(q);
      const matchesCategory =
        blogCategoryFilter === "all" || a.category === blogCategoryFilter;
      const matchesStatus =
        blogStatusFilter === "all"
          ? true
          : blogStatusFilter === "live"
          ? a.isLiveNow
          : !a.isLiveNow;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogArticles, blogSearch, blogCategoryFilter, blogStatusFilter]);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (blogPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, blogPage]);

  // Order stats
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "Yeni Sipariş").length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Mağazaya / Siteye Dön</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
              <span>LifeGo Mobil — Yönetici &amp; Operasyon Paneli</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                SQL&apos;siz JSON Motoru
              </span>
            </h1>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab("blog")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeTab === "blog"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>300 Blog &amp; Otomatik Yayın</span>
              {blogStats && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px]">
                  {blogStats.liveCount}/{blogStats.totalCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeTab === "orders"
                  ? "bg-slate-950 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Siparişler</span>
              {orders.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[10px]">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeTab === "settings"
                  ? "bg-slate-950 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site &amp; Video Ayarları</span>
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {actionNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: 300 BLOG & AUTOMATIC DAILY PUBLISHER */}
        {/* ======================================================== */}
        {activeTab === "blog" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Toplam Hazır Makale
                </span>
                <div className="text-2xl font-black text-slate-950 flex items-center justify-between">
                  <span>{blogStats?.totalCount || 300}</span>
                  <BookOpen className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-[11px] text-slate-500">
                  900 Görsel • ~628.282 Kelime
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-emerald-50/80 border border-emerald-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-emerald-800 uppercase">
                  Şu An Yayında Olan
                </span>
                <div className="text-2xl font-black text-emerald-700 flex items-center justify-between">
                  <span>{blogStats?.liveCount || 0}</span>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-[11px] text-emerald-700">
                  Sitemap &amp; Google robotlarına açık
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-amber-800 uppercase">
                  Sıradaki Otomatik Makale
                </span>
                <div className="text-sm font-black text-amber-900 flex items-center justify-between">
                  <span>{blogStats?.nextScheduledDate || "Yarın"}</span>
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-[11px] text-amber-800 truncate">
                  {blogStats?.nextScheduledTitle || "Sıradaki konu"}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-blue-50/80 border border-blue-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-blue-800 uppercase">
                  Otomatik Yayın Periyodu
                </span>
                <div className="text-xl font-black text-blue-900 flex items-center justify-between">
                  <span>Günde 1 Makale</span>
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-[11px] text-blue-700">
                  Her gece 00:01 &apos;de cron&apos;suz otomatik
                </p>
              </div>
            </div>

            {/* Quick Action Bar for Blog Publisher */}
            <div className="p-4 rounded-3xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Otomatik Günlük Yayın Sistemi Devrede
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kullanıcılar veya botlar siteye her girdiğinde bugünün makalesi anında canlıya çıkar.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePublishNext}
                  className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Sıradaki Makaleyi Hemen Yayına Al</span>
                </button>
                <button
                  type="button"
                  onClick={handleRecalculateSchedule}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>300 Makalelik Takvimi Sıfırla / Diz</span>
                </button>
                <Link
                  href="/blog"
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Canlı Blog Sayfası</span>
                </Link>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Makale başlığı, araç türü veya mAh ara..."
                    value={blogSearch}
                    onChange={(e) => {
                      setBlogSearch(e.target.value);
                      setBlogPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <select
                  value={blogStatusFilter}
                  onChange={(e) => {
                    setBlogStatusFilter(e.target.value as any);
                    setBlogPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="live">Sadece Yayında Olanlar</option>
                  <option value="scheduled">Sadece Zamanlanmışlar</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 font-bold">
                Filtrelenen: {filteredArticles.length} / {blogArticles.length} Makale
              </div>
            </div>

            {/* Articles Table */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">#ID</th>
                      <th className="px-4 py-3">Makale Başlığı &amp; Detay</th>
                      <th className="px-4 py-3">Kategori &amp; Araç</th>
                      <th className="px-4 py-3">Önerilen Model</th>
                      <th className="px-4 py-3">Yayın Tarihi</th>
                      <th className="px-4 py-3">Durum</th>
                      <th className="px-4 py-3 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-mono font-bold text-slate-400">
                          #{art.id}
                        </td>
                        <td className="px-4 py-3 max-w-md">
                          <Link
                            href={`/blog/${art.slug}?preview=1`}
                            target="_blank"
                            className="font-bold text-slate-900 hover:text-orange-600 transition block truncate"
                          >
                            {art.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {art.wordCount} Kelime • 3 Görsel • {art.readTimeMinutes} dk okuma
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] block w-fit">
                            {art.category}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {art.vehicleType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <strong className="text-orange-600 font-mono">
                            {art.recommendedMah}
                          </strong>
                          <span className="text-[11px] text-slate-400 block">
                            {art.recommendedPrice}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">
                          {art.scheduledAt}
                        </td>
                        <td className="px-4 py-3">
                          {art.isLiveNow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              YAYINDA
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                              <Clock className="w-3 h-3 text-amber-600" />
                              ZAMANLANDI
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/blog/${art.slug}?preview=1`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                              title="Önizle"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>

                            {!art.isLiveNow && (
                              <button
                                type="button"
                                onClick={() => handlePublishNow(art.id)}
                                className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition cursor-pointer"
                              >
                                Hemen Yayınla
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Sayfa <strong>{blogPage}</strong> / <strong>{totalPages}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={blogPage <= 1}
                    onClick={() => setBlogPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={blogPage >= totalPages}
                    onClick={() => setBlogPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ORDER MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Order KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Toplam Sipariş
                </span>
                <div className="text-2xl font-black text-slate-950 flex items-center justify-between">
                  <span>{orders.length}</span>
                  <Package className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-[11px] text-slate-500">Tüm gelen talepler</p>
              </div>

              <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-amber-800 uppercase">
                  Yeni / Bekleyen Sipariş
                </span>
                <div className="text-2xl font-black text-amber-700 flex items-center justify-between">
                  <span>{pendingOrdersCount}</span>
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-[11px] text-amber-800">İşlem bekliyor</p>
              </div>

              <div className="p-5 rounded-3xl bg-emerald-50/80 border border-emerald-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-emerald-800 uppercase">
                  Toplam Sipariş Hacmi
                </span>
                <div className="text-2xl font-black text-emerald-700 flex items-center justify-between">
                  <span>{formatTRY(totalRevenue)}</span>
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-[11px] text-emerald-800">KDV Dahil Toplam</p>
              </div>

              <div className="p-5 rounded-3xl bg-blue-50/80 border border-blue-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-blue-800 uppercase">
                  Depolama Altyapısı
                </span>
                <div className="text-lg font-black text-blue-900 flex items-center justify-between">
                  <span>JSON + Tarayıcı</span>
                  <Save className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-[11px] text-blue-700">Sıfır SQL bağımlılığı</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Sipariş kodu, müşteri adı, telefon veya şehir..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="Yeni Sipariş">Yeni Sipariş</option>
                  <option value="Onaylandı">Onaylandı</option>
                  <option value="Kargoda">Kargoda</option>
                  <option value="Teslim Edildi">Teslim Edildi</option>
                  <option value="İptal">İptal</option>
                </select>
              </div>

              <button
                type="button"
                onClick={fetchAllOrders}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Yenile</span>
              </button>
            </div>

            {/* Orders Listing */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-2">
                <Package className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">
                  Henüz Eşleşen Sipariş Bulunmuyor
                </h3>
                <p className="text-xs text-slate-500">
                  Siteden verilen siparişler anında bu ekrana ve data/orders.json dosyasına düşer.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.orderCode}
                    className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-orange-600">
                            #{ord.orderCode}
                          </span>
                          <span className="text-xs text-slate-400">
                            • {ord.createdAt}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-950">
                          {ord.customer.fullName} ({ord.customer.phone})
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleOrderStatusChange(
                              ord.orderCode,
                              e.target.value as StoredOrder["status"]
                            )
                          }
                          className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold"
                        >
                          <option value="Yeni Sipariş">Yeni Sipariş</option>
                          <option value="Onaylandı">Onaylandı</option>
                          <option value="Kargoda">Kargoda</option>
                          <option value="Teslim Edildi">Teslim Edildi</option>
                          <option value="İptal">İptal</option>
                        </select>
                        <span className="text-base font-mono font-black text-slate-950">
                          {formatTRY(ord.totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 grid sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                      <div>
                        <strong>Teslimat Adresi:</strong> {ord.customer.address} (
                        {ord.customer.district} / {ord.customer.city})
                      </div>
                      <div>
                        <strong>Paket / Ürünler:</strong>{" "}
                        {ord.items
                          .map((i) => `${i.packageName} x${i.quantity}`)
                          .join(", ")}{" "}
                        • <strong>Araç:</strong> {ord.customer.vehicleType}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-slate-500 font-mono">
                        Ödeme Yöntemi: {ord.paymentMethod === "havale" ? "Havale / EFT" : "Kapıda Ödeme / Kart"}
                      </span>
                      <a
                        href={buildWhatsAppOrderUrl(ord)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Müşteriyle WhatsApp&apos;ta İletişime Geç</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SITE SETTINGS, YOUTUBE & WHATSAPP */}
        {/* ======================================================== */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 text-base font-black text-slate-950 border-b border-slate-100 pb-3">
              <Settings className="w-5 h-5 text-orange-500" />
              <span>İletişim, YouTube &amp; WhatsApp Ayarları</span>
            </div>

            {savedNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ayarlar başarıyla güncellendi ve kaydedildi!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-extrabold text-red-700">
                  <Video className="w-4 h-4" />
                  <span>Ürün Görseli İçindeki YouTube Video Linki / Kodu</span>
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... veya Video ID"
                  value={youtubeVideoUrl}
                  onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-red-300 bg-white text-xs font-mono"
                />
                <p className="text-[11px] text-slate-600">
                  Klasördeki <strong>lifego-bataryali-takip-60sn.mp4</strong>{" "}
                  videosunu YouTube&apos;a yükledikten sonra linkini veya
                  embed kodunu buraya yapıştırabilirsiniz. Boş bırakılırsa yerel
                  60 sn Full HD MP4 oynatılır.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Numarası (Ülke Koduyla: 90...)
                </label>
                <input
                  type="text"
                  value={whatsappRaw}
                  onChange={(e) => setWhatsappRaw(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Görünen Numara
                </label>
                <input
                  type="text"
                  value={whatsappDisplay}
                  onChange={(e) => setWhatsappDisplay(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telefon Görünen Numara
                </label>
                <input
                  type="text"
                  value={phoneDisplay}
                  onChange={(e) => setPhoneDisplay(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Havale / EFT İndirim Oranı (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
              >
                <Save className="w-4 h-4 text-orange-400" />
                <span>TÜM AYARLARI KAYDET</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
