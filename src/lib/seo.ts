import logoLeaf from "@/assets/logo-leaf.webp";

// Shared SEO/structured-data building blocks for standalone pages (currently the five
// legal/policy pages). Organization and WebSite objects are intentionally identical to the
// ones defined inline in routes/index.tsx — search engines and LLMs treat repeated,
// consistent entity facts across a site as a trust signal, so these must never drift from
// the homepage's copies.

export const SITE_URL = "https://www.bebeyondbetter.com";
export const SITE_NAME = "Beyond Better";
export const SUPPORT_EMAIL = "care@bebeyondbetter.com";

// Single source of truth for the five legal pages — the footer, the in-page "related
// policies" links, and each page's own breadcrumb all read from this list so a URL or
// label never has to be kept in sync by hand across multiple files.
export const POLICY_PAGES = [
  { path: "/privacy-policy", label: "Privacy Policy" },
  { path: "/terms-and-conditions", label: "Terms & Conditions" },
  { path: "/refund-policy", label: "Refund Policy" },
  { path: "/cancellation-policy", label: "Cancellation Policy" },
  { path: "/shipping-policy", label: "Shipping Policy" },
] as const;

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}${logoLeaf}`,
  description:
    "Beyond Better manufactures HPLC-verified, third-party tested Berberine HCL supplements using water-only extraction, with a published Certificate of Analysis for every batch.",
  email: SUPPORT_EMAIL,
} as const;

export const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: SITE_NAME,
} as const;

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

export function buildBreadcrumbJsonLd(entries: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.name,
      item: `${SITE_URL}${entry.path}`,
    })),
  };
}

export function buildWebPageJsonLd(opts: { path: string; name: string; description: string }) {
  const url = `${SITE_URL}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@type": "WebSite", url: SITE_URL, name: SITE_NAME },
    inLanguage: "en-IN",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(items: QuestionAnswer[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

interface PolicyHeadOptions {
  /** e.g. "/privacy-policy" */
  path: string;
  /** Document <title> and og:title/twitter:title. Keep unique per page. */
  title: string;
  description: string;
  breadcrumbName: string;
  /** Rendered visually as Q&A on the page — only pass real, matching on-page content. */
  faqs?: QuestionAnswer[];
}

/**
 * Builds the full `head()` return value (meta/links/scripts) for a standalone legal page:
 * unique title/description, canonical, Open Graph + Twitter Card, and JSON-LD for
 * Organization, WebSite, WebPage and BreadcrumbList (plus FAQPage when faqs are supplied).
 */
export function buildPolicyPageHead({
  path,
  title,
  description,
  breadcrumbName,
  faqs,
}: PolicyHeadOptions) {
  const url = `${SITE_URL}${path}`;
  const ogImage = `${SITE_URL}${logoLeaf}`;

  const scripts = [
    { type: "application/ld+json", children: JSON.stringify(ORGANIZATION_JSON_LD) },
    { type: "application/ld+json", children: JSON.stringify(WEBSITE_JSON_LD) },
    {
      type: "application/ld+json",
      children: JSON.stringify(buildWebPageJsonLd({ path, name: title, description })),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify(
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: breadcrumbName, path },
        ]),
      ),
    },
  ];

  if (faqs && faqs.length > 0) {
    scripts.push({ type: "application/ld+json", children: JSON.stringify(buildFaqJsonLd(faqs)) });
  }

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}
