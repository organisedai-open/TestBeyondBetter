#!/usr/bin/env node
// Regenerates public/sitemap.xml from the actual route list + Research Library article data
// (src/data/articles.ts) so it can never go stale again — the file it replaces was hand
// maintained with a fixed lastmod date across every URL. Runs as a build step (see
// package.json "build" script), using Vite's own SSR module loader so it reads the real
// ARTICLES array (including its .webp asset imports) rather than re-parsing the file by hand.
import { createServer } from "vite";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "https://bebeyondbetter.com";

const STATIC_ROUTES = [
  { loc: `${SITE_URL}/`, priority: "1.0" },
  { loc: `${SITE_URL}/research-library`, priority: "0.8" },
  { loc: `${SITE_URL}/products/berberine-hcl`, priority: "0.9" },
];

async function main() {
  const server = await createServer({
    root: ROOT,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });

  let articles, toIsoDate;
  try {
    ({ ARTICLES: articles } = await server.ssrLoadModule("/src/data/articles.ts"));
    ({ toIsoDate } = await server.ssrLoadModule("/src/lib/dates.ts"));
  } finally {
    await server.close();
  }

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const urls = [
    ...STATIC_ROUTES.map((r) => ({ loc: r.loc, lastmod: today, priority: r.priority })),
    ...articles.map((a) => ({
      loc: `${SITE_URL}/research-library/${a.slug}`,
      lastmod: toIsoDate(a.publishedDate),
      priority: "0.7",
    })),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`)
      .join("\n") +
    `\n</urlset>\n`;

  writeFileSync(path.join(ROOT, "public/sitemap.xml"), xml, "utf-8");
  console.log(`[generate-sitemap] wrote public/sitemap.xml with ${urls.length} URLs`);
}

main().catch((err) => {
  console.error("[generate-sitemap] failed:", err);
  process.exit(1);
});
