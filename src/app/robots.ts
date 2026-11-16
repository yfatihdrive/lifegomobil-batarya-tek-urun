import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/yonetim", "/api/", "/siparis-onay"],
      },
    ],
    sitemap: "https://lifegomobil.com/sitemap.xml",
  };
}
