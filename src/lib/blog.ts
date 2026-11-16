import fs from "fs";
import path from "path";

export interface BlogImage {
  src: string;
  alt: string;
  caption: string;
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogTelemetryRow {
  param: string;
  val: string;
}

export interface BlogFaqItem {
  q: string;
  a: string;
}

export interface BlogArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  vehicleType: string;
  region: string;
  hub: string;
  recommendedModel: string;
  recommendedMah: string;
  recommendedPrice: string;
  author: string;
  authorRole: string;
  scheduledAt: string; // YYYY-MM-DD
  status: "published" | "scheduled" | "draft";
  wordCount: number;
  readTimeMinutes: number;
  images: BlogImage[];
  keyTakeaways: string[];
  sections: BlogSection[];
  telemetryTable: BlogTelemetryRow[];
  faqs: BlogFaqItem[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
}

const BLOG_DATA_FILE = path.join(process.cwd(), "data", "blog-articles.json");

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isArticleLive(
  article: Pick<BlogArticle, "status" | "scheduledAt">,
  todayStr: string = getTodayDateString()
): boolean {
  if (article.status === "published") return true;
  if (article.status === "scheduled" && article.scheduledAt <= todayStr) {
    return true;
  }
  return false;
}

export function readAllBlogArticles(): BlogArticle[] {
  try {
    if (!fs.existsSync(BLOG_DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(BLOG_DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BlogArticle[]) : [];
  } catch (err) {
    console.error("Failed to read blog-articles.json:", err);
    return [];
  }
}

export function writeAllBlogArticles(articles: BlogArticle[]): boolean {
  try {
    const dir = path.dirname(BLOG_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify(articles, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to write blog-articles.json:", err);
    return false;
  }
}

export function getLiveBlogArticles(): BlogArticle[] {
  const todayStr = getTodayDateString();
  const all = readAllBlogArticles();
  return all
    .filter((a) => isArticleLive(a, todayStr))
    .sort((a, b) => {
      if (a.scheduledAt !== b.scheduledAt) {
        return b.scheduledAt.localeCompare(a.scheduledAt);
      }
      return a.id - b.id;
    });
}

export function getUpcomingScheduledArticles(limit = 10): BlogArticle[] {
  const todayStr = getTodayDateString();
  const all = readAllBlogArticles();
  return all
    .filter((a) => !isArticleLive(a, todayStr) && a.status === "scheduled")
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
    .slice(0, limit);
}

export function getBlogArticleBySlug(
  slug: string,
  includePreview = false
): BlogArticle | null {
  const todayStr = getTodayDateString();
  const all = readAllBlogArticles();
  const found = all.find((a) => a.slug === slug);
  if (!found) return null;
  if (includePreview) return found;
  if (isArticleLive(found, todayStr)) return found;
  // Also allow direct slug visits to render with full SEO so no link is ever broken
  return found;
}

export function getRelatedBlogArticles(
  currentArticle: BlogArticle,
  limit = 4
): BlogArticle[] {
  const live = getLiveBlogArticles();
  const sameCategory = live.filter(
    (a) => a.id !== currentArticle.id && a.category === currentArticle.category
  );
  const others = live.filter(
    (a) => a.id !== currentArticle.id && a.category !== currentArticle.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getBlogCategories(): string[] {
  const all = readAllBlogArticles();
  const set = new Set<string>();
  for (const a of all) {
    set.add(a.category);
  }
  return Array.from(set);
}
