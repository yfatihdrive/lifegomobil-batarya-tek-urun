import { NextRequest, NextResponse } from "next/server";
import {
  readAllBlogArticles,
  writeAllBlogArticles,
  getTodayDateString,
  isArticleLive,
  type BlogArticle,
} from "@/lib/blog";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "public";
  const idParam = searchParams.get("id");
  const todayStr = getTodayDateString();

  const all = readAllBlogArticles();

  if (idParam) {
    const idNum = Number(idParam);
    const found = all.find((a) => a.id === idNum);
    if (!found) {
      return NextResponse.json({ error: "Makale bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({
      article: {
        ...found,
        isLiveNow: isArticleLive(found, todayStr),
      },
    });
  }

  let liveCount = 0;
  let scheduledCount = 0;
  let draftCount = 0;
  let totalWords = 0;
  let totalImages = 0;

  for (const a of all) {
    totalWords += a.wordCount || 0;
    totalImages += Array.isArray(a.images) ? a.images.length : 0;
    if (isArticleLive(a, todayStr)) {
      liveCount++;
    } else if (a.status === "scheduled") {
      scheduledCount++;
    } else {
      draftCount++;
    }
  }

  const upcomingList = all
    .filter((a) => !isArticleLive(a, todayStr) && a.status === "scheduled")
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

  const nextScheduled = upcomingList.length > 0 ? upcomingList[0] : null;

  if (mode === "admin") {
    // Return lightweight summary of all 300 articles for fast admin management
    const summaries = all.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      vehicleType: a.vehicleType,
      region: a.region,
      recommendedModel: a.recommendedModel,
      recommendedMah: a.recommendedMah,
      recommendedPrice: a.recommendedPrice,
      author: a.author,
      scheduledAt: a.scheduledAt,
      status: a.status,
      isLiveNow: isArticleLive(a, todayStr),
      wordCount: a.wordCount,
      readTimeMinutes: a.readTimeMinutes,
      imagesCount: a.images?.length || 3,
      coverImage: a.images?.[0]?.src || "",
    }));

    return NextResponse.json({
      today: todayStr,
      stats: {
        totalCount: all.length,
        liveCount,
        scheduledCount,
        draftCount,
        totalWords,
        totalImages,
        nextScheduledDate: nextScheduled?.scheduledAt || null,
        nextScheduledTitle: nextScheduled?.title || null,
        nextScheduledId: nextScheduled?.id || null,
      },
      articles: summaries,
    });
  }

  // Public mode: return live articles
  const liveArticles = all
    .filter((a) => isArticleLive(a, todayStr))
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      vehicleType: a.vehicleType,
      region: a.region,
      recommendedModel: a.recommendedModel,
      recommendedMah: a.recommendedMah,
      recommendedPrice: a.recommendedPrice,
      author: a.author,
      authorRole: a.authorRole,
      scheduledAt: a.scheduledAt,
      wordCount: a.wordCount,
      readTimeMinutes: a.readTimeMinutes,
      images: a.images,
      tags: a.tags,
    }));

  return NextResponse.json({
    today: todayStr,
    totalLive: liveArticles.length,
    articles: liveArticles,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, status, scheduledAt, title, excerpt } = body;
    const all = readAllBlogArticles();
    const todayStr = getTodayDateString();

    if (action === "publish_next") {
      const upcoming = all
        .filter((a) => !isArticleLive(a, todayStr) && a.status === "scheduled")
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

      if (upcoming.length === 0) {
        return NextResponse.json(
          { error: "Sırada bekleyen zamanlanmış makale kalmadı." },
          { status: 400 }
        );
      }

      const targetId = upcoming[0].id;
      const updated = all.map((a) =>
        a.id === targetId
          ? { ...a, status: "published" as const, scheduledAt: todayStr }
          : a
      );
      writeAllBlogArticles(updated);
      return NextResponse.json({
        ok: true,
        publishedArticleId: targetId,
        publishedTitle: upcoming[0].title,
      });
    }

    if (action === "recalculate_daily_schedule") {
      // Keep already-live articles live, and schedule remaining articles 1 per day starting tomorrow
      const baseDate = new Date();
      let dayOffset = 1;
      const updated = all.map((a) => {
        if (isArticleLive(a, todayStr)) {
          return { ...a, status: "published" as const };
        }
        const d = new Date(baseDate);
        d.setDate(d.getDate() + dayOffset);
        dayOffset++;
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return {
          ...a,
          status: "scheduled" as const,
          scheduledAt: `${y}-${m}-${day}`,
        };
      });
      writeAllBlogArticles(updated);
      return NextResponse.json({
        ok: true,
        message:
          "Günlük otomatik yayın takvimi (her gün 1 makale) başarıyla yeniden senkronize edildi.",
      });
    }

    if (!id) {
      return NextResponse.json(
        { error: "Makale ID belirtilmedi." },
        { status: 400 }
      );
    }

    const numId = Number(id);
    let found = false;
    const updated = all.map((a) => {
      if (a.id !== numId) return a;
      found = true;
      return {
        ...a,
        status: status ?? a.status,
        scheduledAt: scheduledAt ?? a.scheduledAt,
        title: title !== undefined ? title : a.title,
        excerpt: excerpt !== undefined ? excerpt : a.excerpt,
      };
    });

    if (!found) {
      return NextResponse.json(
        { error: "Makale bulunamadı." },
        { status: 404 }
      );
    }

    writeAllBlogArticles(updated);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/blog error:", err);
    return NextResponse.json(
      { error: "İşlem sırasında hata oluştu." },
      { status: 500 }
    );
  }
}
