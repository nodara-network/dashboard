import type { MetadataRoute } from "next";

const baseUrl = "https://www.nodara.network";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: baseUrl,
  };
}