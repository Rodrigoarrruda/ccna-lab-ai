import type { MetadataRoute } from "next";

const siteUrl = "https://olive-fox-987195.hostingersite.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
