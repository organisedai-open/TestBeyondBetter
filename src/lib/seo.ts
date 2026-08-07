import logoLeaf from "@/assets/logo-leaf.webp";

// Shared SEO/structured-data building blocks for standalone pages (currently the five
// legal/policy pages). Organization and WebSite objects are intentionally identical to the
// ones defined inline in routes/index.tsx — search engines and LLMs treat repeated,
// consistent entity facts across a site as a trust signal, so these must never drift from
// the homepage's copies.

export const SITE_URL = "https://www.bebeyondbetter.com";
export const SITE_NAME = "Beyond Better";
export const SUPPORT_EMAIL = "care@bebeyondbetter.com";
export const POLICIES_HUB_PATH = "/policies";
export const POLICIES_HUB_LABEL = "Policies";

// Single source of truth for the five legal pages — the footer, the in-page "related
// policies" links, each page's own breadcrumb, and the /policies hub all read from this
// list so a URL or label never has to be kept in sync by hand across multiple files.
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
    "Beyond Better manufactures Japanese Standard Berberine — Berberine HCl assayed to Japanese Pharmacopoeia HPLC methodology at 97% verified purity, screened against a 545-pesticide residue panel, extracted with water only, third-party tested, with a public Certificate of Analysis published for every batch.",
  email: SUPPORT_EMAIL,
  contactPoint: {
    "@type": "ContactPoint",
    email: SUPPORT_EMAIL,
    contactType: "customer service",
    // Beyond Better ships worldwide, not only within India — this must stay in sync with
    // that fact rather than implying support is restricted to one country.
    areaServed: "Worldwide",
    availableLanguage: ["en"],
  },
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

/**
 * Only used on the Refund Policy page. Kept narrow and literal: schema.org's return-policy
 * vocabulary is built around ordinary change-of-mind return windows, which Beyond Better does
 * not offer — refunds are conditional on a delivery fault (wrong/damaged/lost) reported within
 * 48 hours. `merchantReturnDays: 2` reflects that 48-hour reporting window; fields this policy
 * doesn't actually specify (who pays return shipping, method of return) are left out rather
 * than guessed, since fabricated policy fields here would misrepresent the business to search
 * engines and shopping surfaces that read this schema.
 *
 * `applicableCountry`/`returnPolicyCountry` are deliberately omitted rather than set to a
 * single country: Beyond Better ships worldwide, and asserting "IN" only would misrepresent
 * the policy's actual scope to anything reading this schema.
 */
export function buildMerchantReturnPolicyJsonLd() {
  return {
    "@type": "MerchantReturnPolicy",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 2,
    refundType: "https://schema.org/FullRefund",
    returnPolicyDescription:
      "Refunds are available only if the wrong product is delivered, the product arrives damaged, or the shipment is confirmed lost by the courier. Customers must contact us within 48 hours of delivery.",
  } as const;
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
  /** Refund Policy only. */
  includeMerchantReturnPolicy?: boolean;
}

/**
 * Builds the full `head()` return value (meta/links/scripts) for a standalone legal page:
 * unique title/description, canonical, Open Graph + Twitter Card, and JSON-LD for
 * Organization, WebSite, WebPage and a three-level BreadcrumbList (Home > Policies > Page)
 * (plus FAQPage when faqs are supplied, and MerchantReturnPolicy on the refund page).
 */
export function buildPolicyPageHead({
  path,
  title,
  description,
  breadcrumbName,
  faqs,
  includeMerchantReturnPolicy,
}: PolicyHeadOptions) {
  const url = `${SITE_URL}${path}`;
  const ogImage = `${SITE_URL}${logoLeaf}`;

  const organizationJsonLd = includeMerchantReturnPolicy
    ? { ...ORGANIZATION_JSON_LD, hasMerchantReturnPolicy: buildMerchantReturnPolicyJsonLd() }
    : ORGANIZATION_JSON_LD;

  const scripts = [
    { type: "application/ld+json", children: JSON.stringify(organizationJsonLd) },
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
          { name: POLICIES_HUB_LABEL, path: POLICIES_HUB_PATH },
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

/** head() for the /policies hub itself — a two-level breadcrumb (Home > Policies). */
export function buildPoliciesHubHead() {
  const title = "Policies — Beyond Better";
  const description =
    "Beyond Better's privacy, terms, refund, cancellation and shipping policies in one place.";
  const url = `${SITE_URL}${POLICIES_HUB_PATH}`;
  const ogImage = `${SITE_URL}${logoLeaf}`;

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
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(ORGANIZATION_JSON_LD) },
      { type: "application/ld+json", children: JSON.stringify(WEBSITE_JSON_LD) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildWebPageJsonLd({ path: POLICIES_HUB_PATH, name: title, description }),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: POLICIES_HUB_LABEL, path: POLICIES_HUB_PATH },
          ]),
        ),
      },
    ],
  };
}
