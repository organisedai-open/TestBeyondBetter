import { createFileRoute, Link } from "@tanstack/react-router";
import { getArticleBySlug } from "@/data/articles";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { PriceDisplay } from "@/components/PriceDisplay";
import { CancellationNote } from "@/components/CancellationNote";
import { StarRating } from "@/components/StarRating";
import { TESTIMONIALS, AVERAGE_RATING, REVIEW_COUNT } from "@/data/testimonials";
import { PURITY_PCT, PESTICIDES_SCREENED } from "@/lib/quality";
import { useMagicCheckout } from "@/lib/checkout/useMagicCheckout";
import { usePreorderStatus } from "@/lib/checkout/usePreorderStatus";
import { RESTOCK_DATE_ISO, getActivePriceInr } from "@/lib/pricing";
import { PRODUCT_CATALOG } from "@/lib/product";
import { trackMetaEvent } from "@/lib/analytics/trackMetaEvent";
import logoLeaf from "@/assets/logo-leaf.webp";
import innerBottle from "@/assets/shop-berberine.webp";
import berberineBenefits from "@/assets/Berberine Benefits.webp";
import berberineSugarControl from "@/assets/Berberine Sugar Control.webp";
import berberineIngredientInfo from "@/assets/Berberine Ingredient info.webp";
import berberineDirectionToUse from "@/assets/Berberine Direction to use.webp";
import berberineCapsule from "@/assets/berberine-capsule.webp";
import transparencyHero from "@/assets/transparency-hero.webp";
import { ArrowUpRight, ArrowRight, Instagram, Facebook, ShoppingBag } from "lucide-react";
import { POLICY_PAGES } from "@/lib/seo";

const SITE_URL = "https://www.bebeyondbetter.com";
const PAGE_URL = `${SITE_URL}/products/berberine-hcl`;

function ProductJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Beyond Better Japanese Standard Berberine HCl — 500mg, 97% HPLC Verified, 545 Pesticides Screened",
    image: PRODUCT_CATALOG.imageUrl,
    description: PRODUCT_CATALOG.description,
    brand: { "@type": "Brand", name: "Beyond Better" },
    sku: PRODUCT_CATALOG.sku,
    // Machine-readable anchors for the quality claims made in prose elsewhere on this page —
    // gives crawlers and AI retrieval systems structured facts to cite, not just text to parse.
    // Numbers come from lib/quality.ts so schema can't drift from the visible copy.
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Testing Standard",
        value: "Japanese Pharmacopoeia (JP) HPLC Methodology",
      },
      {
        "@type": "PropertyValue",
        name: "Verified Purity",
        value: `${PURITY_PCT}% berberine HCl by HPLC assay`,
      },
      {
        "@type": "PropertyValue",
        name: "Pesticide Residue Screening",
        value: `Screened against a ${PESTICIDES_SCREENED}-pesticide residue panel`,
      },
      {
        "@type": "PropertyValue",
        name: "Third-Party Testing",
        value: "Independent third-party laboratory, batch-specific Certificate of Analysis",
      },
      {
        "@type": "PropertyValue",
        name: "Extraction Method",
        value: "Water-only extraction, no chemical solvents",
      },
    ],
    offers: {
      "@type": "Offer",
      url: PAGE_URL,
      priceCurrency: PRODUCT_CATALOG.currency,
      // Derived, not hardcoded: a stale price in structured data is what makes Google show a
      // price in search results that no longer matches the page — a Merchant Center mismatch.
      price: String(getActivePriceInr()),
      availability: "https://schema.org/PreOrder",
      availabilityStarts: RESTOCK_DATE_ISO,
      priceValidUntil: RESTOCK_DATE_ISO,
    },
    // Sourced from src/data/testimonials.ts, the same array the visible testimonial cards and
    // star rating render from — this must mirror on-page content, never a separately-tracked
    // number, or it drifts into exactly the kind of fabricated rating Google's review-snippet
    // policy exists to catch.
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(AVERAGE_RATING),
      reviewCount: String(REVIEW_COUNT),
    },
    review: TESTIMONIALS.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewRating: { "@type": "Rating", ratingValue: String(t.rating), bestRating: "5" },
      reviewBody: t.quote,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

function BreadcrumbJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Berberine HCL", item: PAGE_URL },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export const Route = createFileRoute("/products/berberine-hcl")({
  head: () => ({
    meta: [
      {
        title: "Japanese Standard Berberine HCl 500mg — 545 Pesticides Screened | Beyond Better",
      },
      {
        name: "description",
        content:
          "Japanese Standard Berberine HCl, 500mg per capsule, 60 capsules. 97% HPLC verified purity, screened against 545 pesticide residues, water-only extraction, third-party tested with a public Certificate of Analysis per batch.",
      },
      {
        property: "og:title",
        content: "Japanese Standard Berberine HCl 500mg — 545 Pesticides Screened | Beyond Better",
      },
      {
        property: "og:description",
        content:
          "97% HPLC verified purity, screened against 545 pesticide residues, water-only extraction, third-party tested. Public Certificate of Analysis for every batch.",
      },
      { property: "og:image", content: PRODUCT_CATALOG.imageUrl },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: ProductPage,
});

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { openCheckout, isLoading } = useMagicCheckout();
  const { ctaLabel } = usePreorderStatus();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backdropFilter: scrolled ? "blur(14px)" : "none",
        backgroundColor: scrolled
          ? "color-mix(in oklab, var(--ivory) 78%, transparent)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid color-mix(in oklab, var(--charcoal) 8%, transparent)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoLeaf} alt="" className="h-7 w-7 object-contain" />
          <span
            className="font-display text-base tracking-tight"
            style={{ color: "var(--forest)" }}
          >
            Beyond Better
          </span>
        </Link>
        <nav
          className="hidden items-center gap-8 text-sm md:flex"
          style={{ color: "var(--forest)" }}
        >
          <Link to="/" className="hover:opacity-60 transition">
            Home
          </Link>
          <Link to="/research-library" className="hover:opacity-60 transition">
            Research
          </Link>
          <Link to="/" hash="faq" className="hover:opacity-60 transition">
            FAQ
          </Link>
        </nav>
        <button
          type="button"
          onClick={openCheckout}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
        >
          {ctaLabel} <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}

function ProductIntro() {
  const { openCheckout, isLoading } = useMagicCheckout();
  const { ctaLabel } = usePreorderStatus();

  const galleryImages = [
    {
      src: innerBottle,
      alt: "Beyond Better Japanese Standard Berberine bottle with capsules",
      thumbnailAlt: "Bottle front view",
      width: 384,
      height: 576,
    },
    {
      src: berberineBenefits,
      alt: "Japanese Standard Berberine benefits — 97% HPLC verified purity",
      thumbnailAlt: "Benefits visual",
      width: 384,
      height: 576,
    },
    {
      src: berberineSugarControl,
      alt: "Beyond Better berberine for healthy blood sugar support",
      thumbnailAlt: "Sugar control visual",
      width: 384,
      height: 576,
    },
    {
      src: berberineIngredientInfo,
      alt: "Berberine HCl ingredient detail — water-only extraction, no fillers",
      thumbnailAlt: "Ingredient information visual",
      width: 384,
      height: 576,
    },
    {
      src: berberineDirectionToUse,
      alt: "How to take Beyond Better berberine — 500mg twice daily with meals",
      thumbnailAlt: "Directions to use visual",
      width: 384,
      height: 576,
    },
  ];

  return (
    <section
      className="px-6 pt-32 pb-16 lg:px-10 lg:pt-40 lg:pb-24"
      style={{ backgroundColor: "var(--ivory)" }}
    >
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <ProductImageGallery images={galleryImages} className="mx-auto max-w-full" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="text-center lg:text-left">
            <p
              className="text-[11px] uppercase tracking-[0.3em]"
              style={{ color: "var(--forest)" }}
            >
              Beyond Better · Japanese Standard Berberine
            </p>
            <h1
              className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl lg:text-[3.4rem]"
              style={{ color: "var(--forest)" }}
            >
              Herbal Berberine HCL Extract
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2 lg:justify-start">
              <StarRating rating={Math.round(AVERAGE_RATING)} />
              <span className="text-sm font-medium" style={{ color: "var(--forest)" }}>
                {AVERAGE_RATING}/5
              </span>
              <span className="text-xs text-muted-foreground">(early tester reviews)</span>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              Japanese Standard Berberine — 500mg per capsule, 60 capsules. 97% HPLC verified
              purity, screened against 545 pesticide residues, water-only extraction, third-party
              tested with a public Certificate of Analysis for every batch.
            </p>
            <p
              className="mt-2 text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "color-mix(in oklab, var(--forest) 70%, transparent)" }}
            >
              60 Capsules · 30 Day Supply
            </p>

            <div className="mt-8 flex justify-center lg:justify-start">
              <PriceDisplay variant="block" align="left" />
            </div>

            <div className="mt-7 flex justify-center lg:justify-start">
              <button
                type="button"
                onClick={openCheckout}
                disabled={isLoading}
                className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full px-9 py-5 text-[15px] font-medium tracking-wide transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  backgroundColor: "var(--forest)",
                  color: "var(--ivory)",
                  boxShadow: "0 14px 30px -10px rgba(30,55,35,0.45)",
                }}
              >
                {ctaLabel} <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex justify-center lg:justify-start">
              <CancellationNote className="mt-2" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SpecBullets() {
  const stats = [
    { n: "97%", l: "HPLC verified purity" },
    { n: "545", l: "Pesticides screened" },
    { n: "0", l: "Fillers" },
  ];
  return (
    <section className="px-6 py-16 lg:px-10 lg:py-20" style={{ backgroundColor: "#F8F5EF" }}>
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <dl
            className="grid grid-cols-3 gap-6 border-t border-b py-8"
            style={{ borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)" }}
          >
            {stats.map((s) => (
              <div key={s.l} className="text-center">
                <dt
                  className="font-display text-3xl md:text-4xl"
                  style={{ color: "var(--gold-deep)" }}
                >
                  {s.n}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function IngredientBreakdown() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <Reveal>
          <img
            src={berberineCapsule}
            alt="97% HPLC verified Japanese Standard Berberine HCl capsule"
            className="w-full object-contain"
            width={700}
            height={700}
            loading="lazy"
            decoding="async"
            style={{ aspectRatio: "1 / 1" }}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Inside the bottle
            </p>
            <h2 className="mt-4 font-display text-3xl leading-[1.1] md:text-5xl">
              One ingredient. Done right.
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
              Pure Berberine HCL — extracted with water, verified at 97% by Japanese HPLC Standard
              assay, and screened against 545 pesticide residues. Nothing else.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Most extractors use solvents to hit purity targets faster and cheaper. We use a
              water-only extraction process — slower, more expensive, and free of chemical residue.
              Capsules are HPMC (vegetarian/vegan), and every batch is Non-GMO.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CoaSection() {
  return (
    <section id="lab" className="bg-background">
      <Reveal>
        <div
          className="relative hidden w-full overflow-hidden md:block"
          style={{ aspectRatio: "1920 / 1071" }}
        >
          <img
            src={transparencyHero}
            alt="Beyond Better Japanese Standard Berberine Certificate of Analysis — third-party batch report"
            className="absolute inset-0 h-full w-full select-none object-cover"
            width={1920}
            height={1071}
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute z-10 flex flex-col justify-center"
            style={{
              left: "5%",
              top: "8%",
              right: "55%",
              bottom: "8%",
              gap: "clamp(10px, 1.2vw, 16px)",
            }}
          >
            <div
              style={{
                fontSize: "clamp(9px, 1vw, 14px)",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#8a6b50",
                fontWeight: 500,
              }}
            >
              Certificate of Analysis
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(20px, 4.2vw, 54px)",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "#1a1a1a",
                maxWidth: "450px",
              }}
            >
              97% actual tested purity.
              <br />
              <span style={{ color: "var(--forest)" }}>Third-party verified.</span>
            </h2>
            <p
              style={{
                maxWidth: "450px",
                fontSize: "clamp(12px, 0.95vw, 14px)",
                lineHeight: 1.6,
                color: "#355142",
              }}
            >
              This is a real Certificate of Analysis from a recent production batch — Japanese HPLC
              Standard assay, heavy metals screening, microbial profile, and screening against 545
              pesticide residues, every result published. The same report ships with every batch.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/berberine-coa.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition hover:opacity-85"
                style={{
                  backgroundColor: "var(--forest)",
                  color: "var(--ivory)",
                  width: "fit-content",
                }}
              >
                View the full lab report <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                to="/research-library/$slug"
                params={{ slug: "berberine-hplc-purity-testing" }}
                className="text-sm underline"
                style={{ color: "#355142" }}
              >
                How HPLC testing works
              </Link>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="relative w-full">
            <img
              src={transparencyHero}
              alt="Beyond Better Japanese Standard Berberine Certificate of Analysis — third-party batch report"
              className="block w-full h-auto select-none"
              width={1920}
              height={1071}
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-6 pb-6 pt-16"
              style={{
                background:
                  "linear-gradient(to top, rgba(241,236,226,0.95) 0.65%, rgba(241,236,226,0.75) 0.3%, rgba(241,236,226,0) 100%)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#8a6b50",
                  fontWeight: 500,
                }}
              >
                Certificate of Analysis
              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: "26px",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  color: "#1a1a1a",
                }}
              >
                97% actual tested purity.
                <br />
                <span style={{ color: "var(--forest)" }}>Third-party verified.</span>
              </h2>
              <p style={{ marginTop: 6, fontSize: "12px", lineHeight: 1.55, color: "#355142" }}>
                A real Certificate of Analysis from a recent batch — Japanese HPLC Standard assay,
                heavy metals, microbial profile, and 545 pesticide residues screened.
              </p>
              <a
                href="/berberine-coa.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs transition hover:opacity-85"
                style={{
                  backgroundColor: "var(--forest)",
                  color: "var(--ivory)",
                  width: "fit-content",
                  pointerEvents: "auto",
                }}
              >
                View the full lab report <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  const { openCheckout, isLoading } = useMagicCheckout();
  const { ctaLabel } = usePreorderStatus();
  return (
    <footer className="bg-background py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 border-b pb-10 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={logoLeaf} alt="" className="h-7 w-7 object-contain" />
              <span className="font-display text-base" style={{ color: "var(--forest)" }}>
                Beyond Better
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The transparent berberine standard.
            </p>
          </div>
          <div className="flex gap-10 text-sm">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Shop</div>
              <ul className="mt-4 space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={openCheckout}
                    disabled={isLoading}
                    className="hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {ctaLabel}
                  </button>
                </li>
                <li>
                  <a href="#lab" className="hover:opacity-60">
                    Lab Report
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Learn</div>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/research-library" className="hover:opacity-60">
                    Research Library
                  </Link>
                </li>
                <li>
                  <Link to="/" hash="faq" className="hover:opacity-60">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Legal</div>
              <ul className="mt-4 space-y-2">
                {POLICY_PAGES.map((p) => (
                  <li key={p.path}>
                    <Link to={p.path} className="hover:opacity-60">
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Beyond Better. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {}}
              aria-label="Instagram"
              className="bg-transparent border-none p-0 cursor-pointer"
            >
              <Instagram className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {}}
              aria-label="Facebook"
              className="bg-transparent border-none p-0 cursor-pointer"
            >
              <Facebook className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-[10px] opacity-70 md:text-left">
          *These statements have not been evaluated by any food or drug authority. Not intended to
          diagnose, treat or cure any disease.
        </p>
      </div>
    </footer>
  );
}

function StickyBuy() {
  const { openCheckout, isLoading } = useMagicCheckout();
  const { ctaLabel } = usePreorderStatus();
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t px-4 py-3 md:hidden"
      style={{
        backgroundColor: "color-mix(in oklab, var(--ivory) 96%, transparent)",
        backdropFilter: "blur(14px)",
        borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Berberine HCL
          </span>
          <span className="font-display text-lg" style={{ color: "var(--forest)" }}>
            <PriceDisplay variant="inline" />
          </span>
        </div>
        <button
          type="button"
          onClick={openCheckout}
          disabled={isLoading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-[13px] transition active:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
        >
          <ShoppingBag className="h-4 w-4 shrink-0" /> {ctaLabel}
        </button>
      </div>
      <CancellationNote className="pt-2 text-center" />
    </div>
  );
}

function ResearchLink() {
  return (
    <section
      className="px-6 py-16 lg:px-10 lg:py-20 text-center"
      style={{ backgroundColor: "#F8F5EF" }}
    >
      <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        Backed by science
      </p>
      <h2 className="mt-4 font-display text-2xl md:text-3xl" style={{ color: "var(--forest)" }}>
        Read the research behind berberine.
      </h2>
      <div className="mt-8">
        <Link
          to="/research-library"
          className="inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm transition hover:opacity-80"
          style={{ borderColor: "var(--forest)", color: "var(--forest)" }}
        >
          View Research Library <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function ProductPage() {
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      customData: {
        content_ids: [PRODUCT_CATALOG.id],
        content_type: "product",
        value: getActivePriceInr(),
        currency: PRODUCT_CATALOG.currency,
      },
    });
  }, []);

  return (
    // pb clears the mobile-only StickyBuy bar (price/CTA + cancellation badge ≈ 122px) so the end
    // of the footer isn't stranded behind it. md:pb-0 because the bar is md:hidden.
    <div className="bg-background text-foreground pb-36 md:pb-0">
      <ProductJsonLd />
      <BreadcrumbJsonLd />
      <Header />
      <main>
        <ProductIntro />
        <SpecBullets />
        <IngredientBreakdown />
        <CoaSection />
        <ResearchLink />
      </main>
      <Footer />
      <StickyBuy />
    </div>
  );
}
