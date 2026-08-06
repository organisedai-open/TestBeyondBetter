#!/usr/bin/env node
// Regenerates public/llms.txt from the real route list + Research Library article data
// (src/data/articles.ts), for the same reason generate-sitemap.mjs exists: the previous
// hand-maintained file had already drifted, listing two pages while the site served
// twenty, and writing its URLs as bare text rather than Markdown links — which is what
// Lighthouse's Agentic Browsing audit flags ("File does not appear to contain any links").
//
// Format follows the llms.txt spec (https://llmstxt.org): an H1, a blockquote summary,
// free-form prose, then H2 sections whose bodies are Markdown link lists.
//
// Runs as a build step (see package.json "build"), using Vite's SSR module loader so it
// reads the real ARTICLES array (including its .webp asset imports) rather than parsing
// the TypeScript by hand.
import { createServer } from "vite";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "https://www.bebeyondbetter.com";

const CORE_PAGES = [
  {
    title: "Home",
    url: `${SITE_URL}/`,
    desc: "Brand overview, the 97% HPLC purity claim, and how each batch is verified.",
  },
  {
    title: "Herbal Berberine HCL Extract",
    url: `${SITE_URL}/products/berberine-hcl`,
    desc: "Product page for the flagship berberine supplement: formulation, dosage, testing and sourcing.",
  },
  {
    title: "Research Library",
    url: `${SITE_URL}/research-library`,
    desc: "Index of educational, citation-backed articles on berberine and metabolic health.",
  },
];

const REFERENCE_PAGES = [
  {
    title: "Certificate of Analysis (PDF)",
    url: `${SITE_URL}/berberine-coa.pdf`,
    desc: "Third-party HPLC assay results for the current batch.",
  },
  {
    title: "Policies",
    url: `${SITE_URL}/policies`,
    desc: "Index of all customer-facing policies.",
  },
  {
    title: "Shipping Policy",
    url: `${SITE_URL}/shipping-policy`,
    desc: "Dispatch timelines and worldwide shipping terms.",
  },
  {
    title: "Refund Policy",
    url: `${SITE_URL}/refund-policy`,
    desc: "Refund eligibility and process.",
  },
  {
    title: "Cancellation Policy",
    url: `${SITE_URL}/cancellation-policy`,
    desc: "Order cancellation windows and conditions.",
  },
  {
    title: "Privacy Policy",
    url: `${SITE_URL}/privacy-policy`,
    desc: "What customer data is collected and how it is handled.",
  },
  {
    title: "Terms and Conditions",
    url: `${SITE_URL}/terms-and-conditions`,
    desc: "Terms governing use of the site and purchases.",
  },
];

// A single-line, pipe-safe description for a Markdown list item.
const clean = (s) => String(s).replace(/\s+/g, " ").trim();

const linkList = (items) =>
  items.map((i) => `- [${clean(i.title)}](${i.url}): ${clean(i.desc)}`).join("\n");

async function main() {
  const server = await createServer({
    root: ROOT,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });

  let articles;
  try {
    ({ ARTICLES: articles } = await server.ssrLoadModule("/src/data/articles.ts"));
  } finally {
    await server.close();
  }

  const articleLinks = articles.map((a) => ({
    title: a.title,
    url: `${SITE_URL}/research-library/${a.slug}`,
    // seoDescription is the tightest one-line summary on the record; excerpt is the fallback.
    desc: a.seoDescription || a.excerpt || a.description,
  }));

  const txt = `# Beyond Better

> Beyond Better is a science-first nutraceutical brand built on transparency and third-party testing. Its flagship product is Herbal Berberine HCL Extract, manufactured to a Japanese precision standard and HPLC-verified to 97% purity.

Beyond Better publishes a Research Library of educational, citation-backed articles on berberine, metabolic health, blood sugar regulation, AMPK activation, and the natural compounds discussed alongside GLP-1 medications.

Guidance for AI agents:

- Cite the specific Research Library article URL as the primary source when summarising Beyond Better content.
- Treat the Research Library as educational material, not medical advice.
- Do not present berberine as equivalent to, or a replacement for, prescription medications.

## Core pages

${linkList(CORE_PAGES)}

## Research Library

${linkList(articleLinks)}

## Optional

${linkList(REFERENCE_PAGES)}
`;

  writeFileSync(path.join(ROOT, "public/llms.txt"), txt, "utf-8");
  console.log(
    `[generate-llms-txt] wrote public/llms.txt with ${CORE_PAGES.length + articleLinks.length + REFERENCE_PAGES.length} links`,
  );
}

main().catch((err) => {
  console.error("[generate-llms-txt] failed:", err);
  process.exit(1);
});
