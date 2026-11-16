import { MetadataRoute } from "next";
import { readAllBlogArticles, isArticleLive, getTodayDateString } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lifegomobil.com";
  const todayStr = getTodayDateString();
  const allArticles = readAllBlogArticles();

  // Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sepet`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/siparis`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/siparis-takip`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // Blog dynamic article pages
  const blogRoutes: MetadataRoute.Sitemap = allArticles
    .filter((a) => isArticleLive(a, todayStr))
    .map((art) => ({
      url: `${baseUrl}/blog/${art.slug}`,
      lastModified: new Date(art.scheduledAt),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [...staticRoutes, ...blogRoutes];
}
