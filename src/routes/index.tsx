import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { PowderParticles } from "@/components/PowderParticles";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import productTube from "@/assets/hero-berberine-product.webp";
import innerBottle from "@/assets/shop-berberine.webp";
import berberineBenefits from "@/assets/Berberine Benefits.webp";
import berberineComparison from "@/assets/Berberine Comparison.webp";
import berberineIndustrySolution from "@/assets/Berberine Industry Solution.webp";
import berberineSugarControl from "@/assets/Berberine Sugar Control.webp";
import berberineIngredientInfo from "@/assets/Berberine Ingredient info.webp";
import berberineDirectionToUse from "@/assets/Berberine Direction to use.webp";
import shopSectionBackground from "@/assets/Berberine Shop background.webp";
import berberineCapsule from "@/assets/berberine-capsule.webp";
import logoLeaf from "@/assets/logo-leaf.webp";
import { useMagicCheckout } from "@/lib/checkout/useMagicCheckout";
import { usePreorderStatus } from "@/lib/checkout/usePreorderStatus";
import { PriceDisplay } from "@/components/PriceDisplay";
import { CancellationNote } from "@/components/CancellationNote";
import { RestockCountdown } from "@/components/RestockCountdown";
import { StarRating } from "@/components/StarRating";
import { TESTIMONIALS, AVERAGE_RATING } from "@/data/testimonials";
import { PREORDER_RESTOCK_CAPTION, getActivePriceInr } from "@/lib/pricing";
import { POLICY_PAGES } from "@/lib/seo";
import { PRODUCT_CATALOG } from "@/lib/product";
import { trackMetaEvent } from "@/lib/analytics/trackMetaEvent";

import heroSectionImage from "@/assets/Berberine Herosection.webp";
import mobileHeroSectionImage from "@/assets/Berberine Mobile Hero.webp";
import transparencyHero from "@/assets/transparency-hero.webp";
import {
  ArrowUpRight,
  ArrowRight,
  FlaskConical,
  Mountain,
  Droplet,
  Shield,
  Leaf,
  Plus,
  Minus,
  Instagram,
  Facebook,
  Check,
  X,
  ShoppingBag,
  BadgeCheck,
} from "lucide-react";

const SITE_URL = "https://www.bebeyondbetter.com";
const SHOW_TESTIMONIALS = true;

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "What is berberine?",
    a: "A plant compound studied for healthy glucose, lipid balance and energy metabolism.",
  },
  {
    q: "What is Japanese Standard Berberine?",
    a: "Japanese Standard Berberine is berberine HCl whose identity and purity have been verified against the Japanese Pharmacopoeia (JP) HPLC assay method — an official, published reference standard comparable in role to the United States Pharmacopeia (USP). It means the purity figure comes from an independent reference methodology rather than a manufacturer's own internal benchmark. Beyond Better's berberine is assayed to this standard for every production batch, verified at 97% purity, and the Certificate of Analysis is published publicly.",
  },
  {
    q: "Why does purity actually matter?",
    a: "Berberine HCl below 97% purity often contains residual solvents, fillers, or degraded compound left over from cheaper extraction methods. Most drugstore — and even many premium — brands sit between 70–90% purity without disclosing it. Ours is tested to the Japanese HPLC Standard (high-performance liquid chromatography aligned with the Japanese Pharmacopoeia), the same rigor used in pharmaceutical testing, and every batch result is published, not just claimed.",
  },
  {
    q: "What does 545 pesticides screened mean?",
    a: "It means the raw material is tested against a multi-residue analytical panel covering 545 individual pesticide compounds, rather than a handful of common ones. Berberine is extracted from Berberis aristata root — an agricultural crop — so residue screening tests what the plant absorbed before it ever reached the extractor. Beyond Better screens against a 545-pesticide panel in addition to the Japanese HPLC Standard purity assay, heavy metals and microbial testing.",
  },
  {
    q: "Why does pesticide screening matter for herbal supplements?",
    a: "A purity assay answers how much of the active compound is present; it does not answer what else came along with it. Because herbal extracts start as farmed botanicals, pesticide residues are a separate contamination pathway that a purity number alone will never reveal. Screening the two independently — purity by HPLC, residues by a multi-residue panel — is what makes a quality claim complete rather than partial.",
  },
  {
    q: "Why does Japanese HPLC testing matter?",
    a: "High-performance liquid chromatography separates and quantifies the individual compounds in a sample, so it can confirm the specific molecule present rather than just the total weight of extract used. Running that assay against the Japanese Pharmacopoeia method means the result is measured against an external, published standard — so the number can be checked rather than taken on trust.",
  },
  {
    q: "How do I take it?",
    a: "500 mg, two times daily with meals.",
  },
  {
    q: "Is it third-party tested?",
    a: "Yes. Every batch is independently verified. A Certificate of Analysis is published for each lot.",
  },
  {
    q: "Is it safe long-term?",
    a: "Berberine has a long safety record in clinical research. Consult your physician if on medication.",
  },
  {
    q: "When will I feel results?",
    a: "Most customers notice changes in 4–8 weeks of consistent daily use.",
  },
  {
    q: "Who should not take berberine?",
    a: "Berberine should be avoided or used only under medical supervision by pregnant or breastfeeding women, people taking diabetes medication (due to hypoglycemia risk), people on anticoagulants, and children. Speak with your doctor first if any of these apply to you.",
  },
  {
    q: "Does berberine interact with any medications?",
    a: "Yes. It can intensify the effect of diabetes medications, raising hypoglycemia risk, and may interact with anticoagulants such as warfarin — worth mentioning to your doctor if you're on either.",
  },
  {
    q: "Can I take berberine with metformin?",
    a: "Berberine and metformin lower blood glucose through overlapping mechanisms, so taking them together can increase hypoglycemia risk. Worth discussing with your doctor before combining them.",
  },
  {
    q: "What does 97% HPLC purity actually mean, in plain terms?",
    a: "It means 97% of the tested material is confirmed, via Japanese HPLC Standard testing (high-performance liquid chromatography), to be actual berberine HCl — not fillers, solvents, or degraded compound. Most drugstore brands test between 70–90% and don't publish the number.",
  },
  {
    q: "How is Beyond Better's berberine different from other brands?",
    a: "Every batch is verified to 97% purity via the Japanese HPLC Standard, and the Certificate of Analysis is published, not just claimed. Extraction is water-only, not solvent-based, and testing is done by an independent third party.",
  },
  {
    q: "Where is Beyond Better's berberine manufactured and tested?",
    a: "Manufactured in India from Berberis aristata root. Every batch is HPLC-tested and third-party verified before release, with the Certificate of Analysis published for that batch.",
  },
  {
    q: "Can I cancel my order?",
    a: "Yes — orders can be canceled for a full refund any time before your batch ships. The current batch ships August 20, 2026. To cancel, email care@bebeyondbetter.com. Once your order has shipped, it's no longer eligible for cancellation or refund.",
  },
  {
    q: "How should I store the capsules?",
    a: "Store in a cool, dry place away from direct sunlight, with the cap closed. Shelf life is 3 years from the manufacture date printed on the bottle.",
  },
  {
    q: "Is this suitable for vegetarians/vegans?",
    a: "Yes. The capsules are HPMC — plant-based, not gelatin — so they're suitable for vegetarians and vegans.",
  },
  {
    q: "Can I take this alongside other supplements?",
    a: "Generally yes. Berberine's main interactions are with medications that affect blood sugar or blood clotting (see above), not with most other supplements.",
  },
];

function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

function OrgJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Beyond Better",
    url: SITE_URL,
    logo: `${SITE_URL}${logoLeaf}`,
    description:
      "Beyond Better manufactures Japanese Standard Berberine — Berberine HCl assayed to Japanese Pharmacopoeia HPLC methodology at 97% verified purity, screened against a 545-pesticide residue panel, extracted with water only, third-party tested, with a public Certificate of Analysis published for every batch.",
    // TODO(founder): add sameAs (real social handles) and contactPoint (support
    // email/phone) once available — intentionally omitted rather than filled with
    // placeholders.
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: "Beyond Better",
    // No potentialAction/SearchAction — the site has no on-site search to point it at.
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Japanese Standard Berberine — 545 Pesticides Screened | Beyond Better" },
      {
        name: "description",
        content:
          "Japanese Standard Berberine, 97% HPLC verified and screened against 545 pesticide residues. Third-party tested with a public COA for every batch.",
      },
      {
        name: "keywords",
        content:
          "Japanese Standard Berberine, 545 pesticides screened, Japanese HPLC berberine, 97% HPLC berberine, third party tested berberine, public COA berberine, premium berberine HCl",
      },
      {
        property: "og:title",
        content: "Japanese Standard Berberine — 545 Pesticides Screened | Beyond Better",
      },
      {
        property: "og:description",
        content:
          "97% HPLC verified purity, screened against 545 pesticide residues, third-party tested. Every batch, every number, in the open.",
      },
      { property: "og:image", content: `${SITE_URL}${productTube}` },
      { property: "og:url", content: SITE_URL },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + "/" },
      { rel: "preconnect", href: "https://scripts.clarity.ms" },
      { rel: "preconnect", href: "https://connect.facebook.net" },
      // The hero is the LCP element and is painted as a CSS background, so the
      // browser can't discover it from markup — preload it explicitly. `media`
      // keeps each viewport from fetching the hero it will never show.
      {
        rel: "preload",
        as: "image",
        href: heroSectionImage,
        media: "(min-width: 768px)",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        href: mobileHeroSectionImage,
        media: "(max-width: 767.98px)",
        fetchPriority: "high",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
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
      <OrgJsonLd />
      <WebSiteJsonLd />
      <FaqJsonLd />
      <Nav />
      <main>
        <Hero />
        <Comparison />
        <FinalCTA />
        <Benefits />
        <LabReport />
        {SHOW_TESTIMONIALS ? <Testimonials /> : null}
        <Ingredients />
        <ResearchSimple />
        <FAQ />
      </main>
      <Footer />
      <StickyBuy />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{children}</p>;
}

function CTAButton({
  children,
  href,
  onClick,
  disabled,
  variant = "solid",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "solid" | "ghost";
}) {
  if (variant === "ghost") {
    const className =
      "inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm transition hover:opacity-80";
    const style = { borderColor: "var(--forest)", color: "var(--forest)" };
    return href ? (
      <a href={href} className={className} style={style}>
        {children} <ArrowRight className="h-4 w-4" />
      </a>
    ) : (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
        style={style}
      >
        {children} <ArrowRight className="h-4 w-4" />
      </button>
    );
  }
  const className =
    "inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm transition hover:opacity-90";
  const style = { backgroundColor: "var(--forest)", color: "var(--ivory)" };
  return href ? (
    <a href={href} className={className} style={style}>
      {children} <ArrowUpRight className="h-4 w-4" />
    </a>
  ) : (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
      style={style}
    >
      {children} <ArrowUpRight className="h-4 w-4" />
    </button>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev === y > 24 ? prev : y > 24));

      if (y > lastY && y > 80) {
        setHidden(true);
        setOpen(false);
      } else if (y < lastY) {
        setHidden(false);
      }

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#shop", label: "Shop" },
    { href: "#benefits", label: "Benefits" },
    { href: "#lab", label: "Transparency" },
    ...(SHOW_TESTIMONIALS ? [{ href: "#reviews", label: "Reviews" }] : []),
    { href: "/research-library", label: "Research Library" },
    { href: "#faq", label: "FAQ" },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (open) {
      setOpen(false);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        backdropFilter: scrolled || open ? "blur(14px)" : "none",
        backgroundColor:
          scrolled || open ? "color-mix(in oklab, var(--ivory) 78%, transparent)" : "transparent",
        borderBottom:
          scrolled || open
            ? "1px solid color-mix(in oklab, var(--charcoal) 8%, transparent)"
            : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-10">
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setOpen(false);
          }}
          className="flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer"
        >
          <img src={logoLeaf} alt="" className="h-5 w-5 object-contain" />
          <span
            className="font-display text-[13px] tracking-tight"
            style={{ color: "var(--forest)" }}
          >
            Beyond Better
          </span>
        </button>
        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col items-end gap-[5px] p-2"
        >
          <span
            className="block h-px w-5 transition-transform"
            style={{
              background: "var(--forest)",
              transform: open ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block h-px w-5 transition-opacity"
            style={{ background: "var(--forest)", opacity: open ? 0 : 1 }}
          />
          <span
            className="block h-px w-5 transition-transform"
            style={{
              background: "var(--forest)",
              transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-out"
        style={{ maxHeight: open ? 400 : 0, position: "relative", zIndex: 51 }}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 pb-6 pt-2 lg:px-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={handleClick}
              className="font-display py-2 text-[18px] tracking-tight transition-opacity hover:opacity-60"
              style={{ color: "var(--forest)" }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <>
      <h1 className="sr-only">
        Beyond Better — Japanese Standard Berberine HCl, 97% HPLC Verified and Screened for 545
        Pesticide Residues
      </h1>
      <DesktopHero />
      <MobileHero />
    </>
  );
}

function DesktopHero() {
  const { openCheckout, isLoading } = useMagicCheckout();
  const { ctaLabel, isPreorderActive: preorder } = usePreorderStatus();
  return (
    <section
      className="relative hidden md:block w-full overflow-hidden pointer-events-none"
      style={{
        minHeight: "100svh",
        backgroundImage: `url(${heroSectionImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="relative z-10 flex h-full w-full items-center justify-between pointer-events-none"
        style={{
          minHeight: "100svh",
          paddingLeft: "1vw",
          paddingRight: "1vw",
          pointerEvents: "none",
        }}
      >
        <div className="max-w-[42%] min-w-[320px]" style={{ color: "#1f3a2a" }}>
          <p
            style={{
              fontSize: 8,
              letterSpacing: "0.28em",
              fontWeight: 500,
              opacity: 0.85,
              marginBottom: 16,
            }}
          >
            BEYOND BETTER · JAPANESE STANDARD BERBERINE
          </p>
          <p
            className="font-display"
            role="presentation"
            style={{
              fontWeight: 500,
              fontSize: "clamp(33px, 3.3vw, 54px)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            Better was
            <br />
            never enough.
          </p>
          <p
            style={{
              marginTop: 16,
              fontSize: 11,
              lineHeight: 1.6,
              opacity: 0.9,
              maxWidth: 315,
            }}
          >
            Japanese Standard Berberine — 97% HPLC verified, 545 pesticides screened, every batch
            report published.
          </p>
          <div className="flex items-center gap-5" style={{ marginTop: 28 }}>
            <button
              type="button"
              onClick={openCheckout}
              disabled={isLoading}
              className="flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                height: 52,
                padding: "0 28px",
                borderRadius: 12,
                background: "#1f3a2a",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.05em",
                pointerEvents: "auto",
              }}
            >
              {ctaLabel} <span className="ml-2">↗</span>
            </button>
            <a
              href="#science"
              style={{
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "#1f3a2a",
                pointerEvents: "auto",
              }}
            >
              Explore the Science ↗
            </a>
          </div>
          {preorder && (
            <div style={{ marginTop: 22, pointerEvents: "auto" }}>
              <RestockCountdown variant="hero" />
              <p
                style={{
                  marginTop: 10,
                  fontSize: 10.5,
                  lineHeight: 1.5,
                  opacity: 0.82,
                  maxWidth: 280,
                }}
              >
                {PREORDER_RESTOCK_CAPTION}
              </p>
              <CancellationNote style={{ marginTop: 12 }} />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center shrink-0" style={{ color: "#1f3a2a" }}>
          {[
            {
              icon: "droplet",
              title: (
                <>
                  Supports Healthy
                  <br />
                  Blood Sugar
                </>
              ),
              sub: "Daily Glucose Support",
            },
            { icon: "mountain", title: "Japanese HPLC Standard", sub: "545 Pesticides Screened" },
            {
              icon: "leaf-shield",
              title: (
                <>
                  Supports Healthy
                  <br />
                  Metabolism
                </>
              ),
              sub: "Metabolic Wellness",
            },
          ].map(({ icon, title, sub }, i) => (
            <div
              key={sub}
              className="group flex flex-col items-center"
              style={{ pointerEvents: "auto" }}
            >
              {i > 0 && (
                <div
                  aria-hidden
                  style={{
                    width: 1,
                    height: 34,
                    background: "rgba(30,75,54,0.12)",
                    marginTop: 16,
                    marginBottom: 16,
                  }}
                />
              )}
              <div
                className="flex items-center justify-center rounded-full text-[#1E4B36] transition-[transform,box-shadow,color] duration-300 group-hover:-translate-y-[2px] group-hover:text-[#2D6248] group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.08),0_1px_2px_rgba(255,255,255,0.9)_inset]"
                style={{
                  width: 50,
                  height: 50,
                  background: "rgba(255,252,247,0.88)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(25,70,45,0.08)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05), 0 1px 2px rgba(255,255,255,0.8) inset",
                }}
              >
                {icon === "droplet" ? (
                  <Droplet style={{ width: 24, height: 24 }} strokeWidth={1.55} />
                ) : icon === "mountain" ? (
                  <Mountain style={{ width: 24, height: 24 }} strokeWidth={1.55} />
                ) : (
                  <span className="relative inline-flex" style={{ width: 24, height: 24 }}>
                    <Shield className="h-full w-full" strokeWidth={1.45} />
                    <Leaf
                      className="absolute left-1/2 top-1/2 h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2"
                      strokeWidth={1.75}
                    />
                  </span>
                )}
              </div>
              <div
                className="text-center"
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  lineHeight: 1.25,
                  color: "#173F2F",
                }}
              >
                {title}
              </div>
              <div
                className="text-center"
                style={{
                  marginTop: 10,
                  fontSize: 11,
                  fontWeight: 400,
                  color: "#5C645D",
                  letterSpacing: "0.01em",
                  lineHeight: 1.35,
                }}
              >
                {sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileHero() {
  return (
    <section
      className="relative md:hidden w-full overflow-hidden pointer-events-none"
      style={{
        minHeight: "90svh",
        backgroundImage: `url(${mobileHeroSectionImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="relative z-10 mx-auto flex w-full max-w-[440px] flex-col items-center px-5 text-center pointer-events-none"
        style={{ paddingTop: 76, paddingBottom: 16, minHeight: "90svh", pointerEvents: "none" }}
      >
        <p
          className="font-display"
          role="presentation"
          style={{
            color: "#1f3a2a",
            fontWeight: 500,
            fontSize: "clamp(40px, 11.5vw, 60px)",
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
          }}
        >
          Better was
          <br />
          never enough.
        </p>
        <p
          style={{
            marginTop: 12,
            color: "#1f3a2a",
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: "0.01em",
            lineHeight: 1.6,
            maxWidth: 330,
          }}
        >
          Japanese Standard Berberine — 97% HPLC verified, 545 pesticides screened, every batch
          report published.
        </p>
        <a
          href="#science"
          style={{
            marginTop: 12,
            color: "#1f3a2a",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.08em",
            pointerEvents: "auto",
          }}
        >
          Explore Science ↗
        </a>
        <div style={{ flex: 1, minHeight: "49svh" }} />
        <div
          className="flex w-full items-start justify-between"
          style={{ marginTop: 12, color: "#1f3a2a" }}
        >
          {[
            {
              icon: "droplet",
              title: (
                <>
                  Supports Healthy
                  <br />
                  Blood Sugar
                </>
              ),
              sub: "Daily Glucose Support",
            },
            { icon: "mountain", title: "Japanese HPLC Standard", sub: "545 Pesticides Screened" },
            {
              icon: "leaf-shield",
              title: (
                <>
                  Supports Healthy
                  <br />
                  Metabolism
                </>
              ),
              sub: "Metabolic Wellness",
            },
          ].map(({ icon, title, sub }, i) => (
            <React.Fragment key={sub}>
              {i > 0 && (
                <div
                  aria-hidden
                  style={{
                    width: 22,
                    height: 1,
                    background: "rgba(30,75,54,0.12)",
                    alignSelf: "center",
                    marginTop: 26,
                    flexShrink: 0,
                  }}
                />
              )}
              <div
                className="group flex flex-1 flex-col items-center text-center px-1"
                style={{ pointerEvents: "auto" }}
              >
                <div
                  className="flex items-center justify-center rounded-full text-[#1E4B36] transition-[transform,box-shadow,color] duration-300 group-hover:-translate-y-[2px] group-hover:text-[#2D6248] group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.08),0_1px_2px_rgba(255,255,255,0.9)_inset]"
                  style={{
                    width: 50,
                    height: 50,
                    background: "rgba(255,252,247,0.88)",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(25,70,45,0.08)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.05), 0 1px 2px rgba(255,255,255,0.8) inset",
                  }}
                >
                  {icon === "droplet" ? (
                    <Droplet style={{ width: 24, height: 24 }} strokeWidth={1.55} />
                  ) : icon === "mountain" ? (
                    <Mountain style={{ width: 24, height: 24 }} strokeWidth={1.55} />
                  ) : (
                    <span className="relative inline-flex" style={{ width: 24, height: 24 }}>
                      <Shield className="h-full w-full" strokeWidth={1.45} />
                      <Leaf
                        className="absolute left-1/2 top-1/2 h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2"
                        strokeWidth={1.75}
                      />
                    </span>
                  )}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    lineHeight: 1.25,
                    color: "#173F2F",
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    marginTop: 9,
                    fontSize: 9,
                    fontWeight: 400,
                    color: "#5C645D",
                    letterSpacing: "0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  {sub}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const badges = [
    { icon: FlaskConical, title: "545 PESTICIDES SCREENED" },
    { icon: Mountain, title: "JAPANESE HPLC STANDARD" },
    { icon: null, label: "97%", title: "VERIFIED PURITY" },
  ];
  return (
    <section className="relative" style={{ background: "#F8F5EF" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 -top-24 md:-top-48 h-24 md:h-48 z-30"
        style={{
          background:
            "linear-gradient(to bottom, rgba(248,245,239,0) 0%, rgba(248,245,239,0.08) 30%, rgba(248,245,239,0.28) 55%, rgba(248,245,239,0.65) 80%, rgba(248,245,239,0.92) 94%, #F8F5EF 100%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-10 lg:px-10">
        <Reveal>
          <div className="flex flex-row items-center justify-center gap-6 sm:gap-16 md:gap-24">
            {badges.map((b) => (
              <div key={b.title} className="flex flex-col items-center text-center">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full border"
                  style={{ borderColor: "#B68D40", color: "#B68D40" }}
                >
                  {b.icon ? (
                    <b.icon className="h-5 w-5" strokeWidth={1.25} />
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 500 }}>{b.label}</span>
                  )}
                </span>
                <h3
                  className="mt-3 font-display text-[10px] sm:text-[11px]"
                  style={{ color: "#1E1E1E", fontWeight: 500, letterSpacing: "0.18em" }}
                >
                  {b.title}
                </h3>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Comparison() {
  // `slug` turns a row label into a contextual link to the article explaining that claim —
  // the rows a visitor is most likely to want substantiated are the ones worth linking.
  const rows: { k: string; us: boolean; them: boolean; slug?: string }[] = [
    { k: "97% HPLC Verified Purity", us: true, them: false },
    {
      k: "545 Pesticides Screened",
      us: true,
      them: false,
      slug: "berberine-pesticide-screening",
    },
    {
      k: "Third-Party Tested",
      us: true,
      them: false,
      slug: "third-party-vs-manufacturer-testing",
    },
    { k: "Public Batch COA", us: true, them: false },
    { k: "Water-Only Extraction", us: true, them: false },
    { k: "Japanese HPLC Standard", us: true, them: false, slug: "berberine-hplc-purity-testing" },
  ];
  return (
    <section
      className="py-20 md:py-28"
      style={{ background: "var(--forest)", color: "var(--ivory)" }}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <div className="text-center lg:text-left">
                <p
                  className="text-[11px] uppercase tracking-[0.3em]"
                  style={{ color: "color-mix(in oklab, var(--ivory) 70%, transparent)" }}
                >
                  The difference
                </p>
                <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">
                  What makes Beyond Better different.
                </h2>
                <p
                  className="mt-5 max-w-md text-sm leading-relaxed"
                  style={{ color: "color-mix(in oklab, var(--ivory) 78%, transparent)" }}
                >
                  Every batch is assayed to the Japanese HPLC Standard, screened against a
                  545-pesticide residue panel, verified by an independent third-party lab, and
                  published as a Certificate of Analysis you can open before you buy.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <table
                className="mt-12 block w-full overflow-hidden rounded-2xl"
                style={{ background: "color-mix(in oklab, var(--ivory) 10%, transparent)" }}
              >
                <caption className="sr-only">
                  Comparison of Beyond Better Berberine HCL against other brands
                </caption>
                <thead className="block">
                  <tr
                    className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 px-5 py-4 text-[10px] uppercase tracking-[0.18em] md:px-8 md:text-xs"
                    style={{
                      borderBottom: "1px solid color-mix(in oklab, var(--ivory) 18%, transparent)",
                      color: "color-mix(in oklab, var(--ivory) 70%, transparent)",
                    }}
                  >
                    <th scope="col" className="text-left font-normal"></th>
                    <th
                      scope="col"
                      className="text-center font-medium"
                      style={{ color: "var(--ivory)" }}
                    >
                      Beyond Better
                    </th>
                    <th scope="col" className="text-center font-normal">
                      Others
                    </th>
                  </tr>
                </thead>
                <tbody className="block">
                  {rows.map((r) => (
                    <tr
                      key={r.k}
                      className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 px-5 py-4 text-sm md:px-8 md:py-5"
                      style={{
                        borderBottom:
                          "1px solid color-mix(in oklab, var(--ivory) 10%, transparent)",
                      }}
                    >
                      <th
                        scope="row"
                        className="text-left font-normal"
                        style={{ color: "color-mix(in oklab, var(--ivory) 92%, transparent)" }}
                      >
                        {r.slug ? (
                          <Link
                            to="/research-library/$slug"
                            params={{ slug: r.slug }}
                            className="underline decoration-dotted underline-offset-4 hover:opacity-80"
                          >
                            {r.k}
                          </Link>
                        ) : (
                          r.k
                        )}
                      </th>
                      <td className="flex justify-center">
                        <Check
                          className="h-5 w-5"
                          style={{ color: "var(--gold-soft)" }}
                          strokeWidth={2.5}
                        />
                        <span className="sr-only">Yes</span>
                      </td>
                      <td
                        className="flex justify-center"
                        style={{ color: "color-mix(in oklab, var(--ivory) 40%, transparent)" }}
                      >
                        <X className="h-5 w-5" strokeWidth={1.5} />
                        <span className="sr-only">No</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div
              className="mx-auto w-full max-w-[440px] overflow-hidden rounded-[28px] border"
              style={{
                borderColor: "color-mix(in oklab, var(--ivory) 16%, transparent)",
                background: "color-mix(in oklab, var(--ivory) 6%, transparent)",
                boxShadow: "0 30px 70px -40px rgba(0,0,0,0.45)",
              }}
            >
              <img
                src={berberineComparison}
                alt="Japanese Standard Berberine compared against ordinary berberine supplements on purity and testing"
                className="block h-full w-full object-cover"
                width={880}
                height={1100}
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const { openCheckout, isLoading } = useMagicCheckout();
  const { ctaLabel } = usePreorderStatus();
  const items = [
    "Most supplement brands blend, dilute, or round up their purity numbers, because nobody checks.",
    "Beyond Better is assayed to the Japanese HPLC Standard and screened against 545 pesticide residues — then the batch report is published.",
    "Better was never enough. We wanted proof.",
  ];
  return (
    <section id="benefits" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
          <div className="order-2 lg:order-1">
            <Reveal delay={0.12}>
              <div
                className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[30px] border"
                style={{ borderColor: "color-mix(in oklab, var(--charcoal) 8%, transparent)" }}
              >
                <img
                  src={berberineIndustrySolution}
                  alt="Beyond Better Japanese Standard Berberine — 97% HPLC verified purity and 545 pesticides screened"
                  className="block h-full w-full object-cover"
                  width={900}
                  height={1100}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Reveal>
          </div>

          <div className="order-1 text-center lg:order-2 lg:text-left">
            <Reveal>
              <SectionLabel>Benefits</SectionLabel>
              <h2 className="mt-4 font-display text-3xl leading-[1.1] md:text-5xl">
                Berberine isn&apos;t the problem.
                <br />
                <em style={{ color: "var(--gold-deep)" }}>The industry&apos;s honesty is.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ul
                className="mx-auto mt-12 max-w-md divide-y lg:mx-0"
                style={{
                  borderTop: "1px solid color-mix(in oklab, var(--charcoal) 10%, transparent)",
                  borderBottom: "1px solid color-mix(in oklab, var(--charcoal) 10%, transparent)",
                  borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)",
                }}
              >
                {items.map((t) => (
                  <li key={t} className="flex items-center gap-4 py-4 text-left text-[15px]">
                    <Check
                      className="h-4 w-4 shrink-0"
                      style={{ color: "var(--gold-deep)" }}
                      strokeWidth={2}
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 lg:mt-12">
                <CTAButton onClick={openCheckout} disabled={isLoading}>
                  {ctaLabel}
                </CTAButton>
                <CancellationNote className="mt-3" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function LabReport() {
  return (
    <section id="lab" className="bg-background">
      <Reveal>
        {/* Desktop / tablet: overlay layout */}
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
              Why Beyond Better
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
              Nothing hidden.
              <br />
              <span style={{ color: "var(--forest)" }}>Every batch verified.</span>
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
              Standard assay, heavy metals, microbial profile, and screening against 545 pesticide
              residues. Not a stock photo, not a summary. The same report ships with every batch.
            </p>
            <div>
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
            </div>
          </div>
        </div>

        {/* Mobile: text overlaid on image, button centered below */}
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
                Why Beyond Better
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
                Nothing hidden.
                <br />
                <span style={{ color: "var(--forest)" }}>Every batch verified.</span>
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

function Testimonials() {
  const { openCheckout, isLoading } = useMagicCheckout();
  const { ctaLabel } = usePreorderStatus();
  return (
    <section id="reviews" className="py-20 md:py-28" style={{ background: "#F8F5EF" }}>
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Customer Stories</SectionLabel>
            <h2
              className="mt-4 font-display text-3xl leading-tight md:text-5xl"
              style={{ color: "var(--forest)" }}
            >
              Trusted by customers who value quality.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Real experiences from people who chose Beyond Better as part of their daily wellness
              routine.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2.5">
              <StarRating rating={Math.round(AVERAGE_RATING)} />
              <span className="text-sm font-medium" style={{ color: "var(--forest)" }}>
                {AVERAGE_RATING}/5
              </span>
              <span className="text-sm text-muted-foreground">· Early tester feedback</span>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.08}>
              <figure
                className="mb-6 break-inside-avoid rounded-[22px] border bg-white p-7 shadow-[0_20px_60px_-40px_rgba(23,61,36,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(23,61,36,0.4)]"
                style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
              >
                <StarRating rating={t.rating} size="h-3.5 w-3.5" />
                <blockquote
                  className="mt-4 text-[15px] leading-[1.75]"
                  style={{ color: "color-mix(in oklab, var(--charcoal) 85%, transparent)" }}
                >
                  &quot;{t.quote}&quot;
                </blockquote>
                <figcaption
                  className="mt-5 flex items-center justify-between gap-3 border-t pt-4"
                  style={{ borderColor: "color-mix(in oklab, var(--forest) 8%, transparent)" }}
                >
                  <span className="font-display text-sm" style={{ color: "var(--forest)" }}>
                    {t.name}
                  </span>
                  <span
                    className="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.1em]"
                    style={{
                      backgroundColor: "color-mix(in oklab, var(--forest) 8%, transparent)",
                      color: "var(--forest)",
                    }}
                  >
                    <BadgeCheck className="h-3 w-3" /> Verified Tester
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-4 flex flex-col items-center gap-3">
            <CTAButton onClick={openCheckout} disabled={isLoading}>
              {ctaLabel}
            </CTAButton>
            <CancellationNote />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Ingredients() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <Reveal>
          <img
            src={berberineCapsule}
            alt="97% HPLC verified Beyond Better berberine HCl capsules, water-only extraction"
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
            <SectionLabel>Inside the bottle</SectionLabel>
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
              It&apos;s the difference between a number on a label and a number you can actually
              stand behind.
            </p>
            <dl
              className="mt-10 grid grid-cols-3 gap-6 border-t pt-6"
              style={{ borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)" }}
            >
              {[
                { n: "97%", l: "Purity" },
                { n: "500mg", l: "Per capsule" },
                { n: "0", l: "Fillers" },
              ].map((s) => (
                <div key={s.l}>
                  <dt
                    className="font-display text-2xl md:text-3xl"
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ResearchSimple() {
  const studies = [
    { t: "Glucose Metabolism", d: "Supports healthy glucose response." },
    { t: "Cardiovascular Health", d: "Supports healthy lipid profiles." },
    { t: "Metabolic Health", d: "Supports AMPK — the body's energy switch." },
  ];
  return (
    <section id="science" className="py-20 md:py-28" style={{ background: "#F8F5EF" }}>
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
        <Reveal>
          <SectionLabel>Backed by science</SectionLabel>
          <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">
            42 clinical studies
            <br />
            <em style={{ color: "var(--gold-deep)" }}>support berberine.</em>
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {studies.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08}>
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Study 0{i + 1}
                </p>
                <h3 className="mt-3 font-display text-xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="mt-12">
            <CTAButton href="/research-library" variant="ghost">
              View Research Library
            </CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">
              Questions, answered.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div
            className="mt-12 divide-y"
            style={{
              borderTop: "1px solid color-mix(in oklab, var(--charcoal) 10%, transparent)",
              borderBottom: "1px solid color-mix(in oklab, var(--charcoal) 10%, transparent)",
              borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)",
            }}
          >
            {FAQ_ITEMS.map((it, i) => {
              const isOpen = open === i;
              return (
                <div key={it.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="font-display text-base leading-snug md:text-lg">{it.q}</span>
                    <span className="shrink-0">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div
                    className="grid overflow-hidden transition-all duration-500 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="min-h-0">
                      <p className="pb-6 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { openCheckout, isLoading } = useMagicCheckout();
  const { ctaLabel, isPreorderActive: preorder } = usePreorderStatus();
  const bullets = [
    "500mg per capsule, verified by Japanese HPLC Standard assay — not a proprietary blend hiding the real number",
    "97% HPLC verified purity — most berberine on the market sits between 70–90%",
    "Screened against 545 pesticide residues, with the third-party Certificate of Analysis published for every batch",
  ];
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
      id="shop"
      className="relative overflow-hidden py-24 md:py-32 lg:py-16"
      style={{
        backgroundImage: `url(${shopSectionBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <PowderParticles count={16} />
      <div className="relative mx-auto max-w-xl px-6 text-center lg:max-w-6xl lg:px-10">
        <div className="lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12">
          <div className="lg:flex lg:flex-col lg:justify-center lg:py-4 lg:text-left">
            <Reveal>
              <SectionLabel>SHOP</SectionLabel>
              <h2
                className="mt-4 font-display text-[34px] leading-[1.08] md:text-5xl lg:max-w-[560px] lg:text-[64px] lg:leading-[1.02]"
                style={{ color: "var(--forest)" }}
              >
                Supports Better Metabolism.
                <br />
                <span style={{ color: "#8B6B2E" }}>Less Cravings. More Energy.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-4 flex items-center justify-center gap-2 lg:justify-start">
                <StarRating rating={Math.round(AVERAGE_RATING)} />
                <span className="text-sm font-medium" style={{ color: "var(--forest)" }}>
                  {AVERAGE_RATING}/5
                </span>
                <span
                  className="text-xs"
                  style={{ color: "color-mix(in oklab, var(--forest) 70%, transparent)" }}
                >
                  (early tester reviews)
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <ul
                className="mx-auto mt-7 flex max-w-sm flex-col gap-2.5 text-[14px] md:text-[15px] lg:mx-0 lg:mt-9 lg:max-w-[560px] lg:gap-4"
                style={{ color: "color-mix(in oklab, var(--forest) 88%, transparent)" }}
              >
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-center justify-center gap-2.5 lg:items-start lg:justify-start lg:gap-3 lg:text-left lg:leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px]"
                      style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
                    >
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:ml-auto lg:w-full lg:max-w-[620px]">
            <Reveal delay={0.15}>
              <ProductImageGallery
                images={galleryImages}
                className="mx-auto mt-10 max-w-full lg:mt-0"
              />
            </Reveal>

            <Reveal delay={0.2}>
              <p
                className="mt-4 text-[11px] uppercase tracking-[0.22em] lg:mt-3"
                style={{ color: "color-mix(in oklab, var(--forest) 70%, transparent)" }}
              >
                60 Capsules · 30 Day Supply
              </p>
            </Reveal>

            {preorder && (
              <Reveal delay={0.22}>
                <div className="mt-6 flex flex-col items-center gap-2 lg:mt-4">
                  <RestockCountdown variant="hero" className="justify-center" />
                  <p
                    className="text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "color-mix(in oklab, var(--forest) 72%, transparent)" }}
                  >
                    Until the first batch ships
                  </p>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-col items-center gap-3 lg:mt-5">
                <PriceDisplay variant="block" align="center" />
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <button
                type="button"
                onClick={openCheckout}
                disabled={isLoading}
                className="mt-7 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full px-9 py-5 text-[15px] font-medium tracking-wide transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 lg:mt-4 lg:max-w-[360px]"
                style={{
                  backgroundColor: "var(--forest)",
                  color: "var(--ivory)",
                  boxShadow: "0 14px 30px -10px rgba(30,55,35,0.45)",
                }}
              >
                {ctaLabel} <ArrowUpRight className="h-4 w-4" />
              </button>
              <CancellationNote className="mt-2" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function StickyBuy() {
  const { openCheckout, isLoading } = useMagicCheckout();
  const { ctaLabel } = usePreorderStatus();
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t md:hidden"
      style={{
        backgroundColor: "color-mix(in oklab, var(--ivory) 96%, transparent)",
        backdropFilter: "blur(14px)",
        borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)",
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
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
      <CancellationNote className="pb-2 text-center" />
    </div>
  );
}

function Footer() {
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
                  <Link to="/products/berberine-hcl" className="hover:opacity-60">
                    Berberine HCL
                  </Link>
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
                  <a href="#science" className="hover:opacity-60">
                    Science
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:opacity-60">
                    FAQ
                  </a>
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
