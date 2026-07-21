import { createFileRoute } from "@tanstack/react-router";
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
import { PRODUCT_PRICING, formatInr } from "@/lib/pricing";

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
  Star,
  ShoppingBag,
} from "lucide-react";

const SITE_URL = "https://bebeyondbetter.com";
const PRODUCT_NAME = "Herbal Berberine HCL Extract";
const PRICE = formatInr(PRODUCT_PRICING.sellingPrice);
const MRP = formatInr(PRODUCT_PRICING.mrp);
const SHOW_TESTIMONIALS = false;
const PriceTag = ({ className = "" }: { className?: string }) => (
  <span className={`inline-flex items-baseline gap-2 ${className}`}>
    <span className="opacity-60 line-through">{MRP}</span>
    <span>{PRICE}</span>
  </span>
);

const FAQ_ITEMS: { q: string; a: string }[] = [
  { q: "What is berberine?", a: "A plant compound studied for healthy glucose, lipid balance and energy metabolism." },
  {
    q: "Why does purity actually matter?",
    a: "Berberine HCl below 97% purity often contains residual solvents, fillers, or degraded compound left over from cheaper extraction methods. Most drugstore — and even many premium — brands sit between 70–90% purity without disclosing it. Ours is tested via HPLC (high-performance liquid chromatography), the same standard used in pharmaceutical testing, and every batch result is published, not just claimed.",
  },
  { q: "How do I take it?", a: "500 mg, two to three times daily with meals. Always consult your physician." },
  { q: "Is it third-party tested?", a: "Yes. Every batch is independently verified. A Certificate of Analysis is published for each lot." },
  { q: "Is it safe long-term?", a: "Berberine has a long safety record in clinical research. Consult your physician if on medication." },
  { q: "When will I feel results?", a: "Most customers notice changes in 4–8 weeks of consistent daily use." },
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function ProductJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT_NAME,
    brand: { "@type": "Brand", name: "Beyond Better" },
    description: "97% HPLC-verified Berberine HCL extract. Water-only extraction. Third-party tested in India.",
    image: [productTube],
    category: "DietarySupplement",
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "1024" },
    offers: {
      "@type": "Offer",
      priceCurrency: PRODUCT_PRICING.currency,
      price: String(PRODUCT_PRICING.sellingPrice),
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/#shop`,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function OrgJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Beyond Better",
    url: SITE_URL,
    logo: logoLeaf,
    sameAs: ["https://www.instagram.com/", "https://www.facebook.com/"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beyond Better — Berberine HCL 97% " },
      { name: "description", content: "97% HPLC-verified Berberine HCL. Water-only extraction. Third-party tested. India's transparent berberine standard." },
      { name: "keywords", content: "berberine, berberine HCL, best berberine India, HPLC berberine, metabolic health" },
      { property: "og:title", content: "Beyond Better — The Transparent Berberine Standard" },
      { property: "og:description", content: "97% HPLC-verified Berberine HCL. Third-party tested. Every batch, every number, in the open." },
      { property: "og:image", content: productTube },
      { property: "og:url", content: SITE_URL },
      { property: "og:type", content: "product" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "preload",
        as: "image",
        href: heroSectionImage,
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="bg-background text-foreground pb-20 md:pb-0">
      <OrgJsonLd />
      <ProductJsonLd />
      <FaqJsonLd />
      <Nav />
      <Hero />
      <Comparison />
      <FinalCTA />
      <Benefits />
      <LabReport />
      {SHOW_TESTIMONIALS ? <SocialProof /> : null}
      <Ingredients />
      <ResearchSimple />
      <FAQ />
      <Footer />
      <StickyBuy />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{children}</p>;
}

function CTAButton({ children, href = "/coming-soon", variant = "solid" }: { children: React.ReactNode; href?: string; variant?: "solid" | "ghost" }) {
  if (variant === "ghost") {
    return (
      <a
        href={href}
        className="inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm transition hover:opacity-80"
        style={{ borderColor: "var(--forest)", color: "var(--forest)" }}
      >
        {children} <ArrowRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm transition hover:opacity-90"
      style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
    >
      {children} <ArrowUpRight className="h-4 w-4" />
    </a>
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
      setScrolled((prev) => (prev === (y > 24) ? prev : y > 24));

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
        backgroundColor: scrolled || open ? "color-mix(in oklab, var(--ivory) 78%, transparent)" : "transparent",
        borderBottom: scrolled || open ? "1px solid color-mix(in oklab, var(--charcoal) 8%, transparent)" : "1px solid transparent",
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
          <span className="font-display text-[13px] tracking-tight" style={{ color: "var(--forest)" }}>
            Beyond Better
          </span>
        </button>
        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col items-end gap-[5px] p-2"
        >
          <span className="block h-px w-5 transition-transform" style={{ background: "var(--forest)", transform: open ? "translateY(6px) rotate(45deg)" : "none" }} />
          <span className="block h-px w-5 transition-opacity" style={{ background: "var(--forest)", opacity: open ? 0 : 1 }} />
          <span className="block h-px w-5 transition-transform" style={{ background: "var(--forest)", transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }} />
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
      <h1 className="sr-only">Beyond Better — 97% HPLC Verified Berberine HCL Supplement</h1>
      <DesktopHero />
      <MobileHero />
    </>
  );
}

function DesktopHero() {
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
        style={{ minHeight: "100svh", paddingLeft: "1vw", paddingRight: "1vw", pointerEvents: "none" }}
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
            BEYOND BETTER · BERBERINE HCL
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
            Better was<br />never enough.
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
            Most berberine brands ask you to trust the label. We publish the batch report instead.
          </p>
          <div className="flex items-center gap-5" style={{ marginTop: 28 }}>
            <a
              href="/coming-soon"
              className="flex items-center justify-center"
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
              Shop Now <span className="ml-2">↗</span>
            </a>
            <a
              href="#science"
              style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", color: "#1f3a2a", pointerEvents: "auto" }}
            >
              Explore the Science ↗
            </a>
          </div>
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
            { icon: "mountain", title: "Japanese Standard", sub: "Precision Tested" },
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
            <div key={sub} className="group flex flex-col items-center" style={{ pointerEvents: "auto" }}>
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
                    <Leaf className="absolute left-1/2 top-1/2 h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2" strokeWidth={1.75} />
                  </span>
                )}
              </div>
              <div
                className="text-center"
                style={{ marginTop: 12, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", lineHeight: 1.25, color: "#173F2F" }}
              >
                {title}
              </div>
              <div
                className="text-center"
                style={{ marginTop: 10, fontSize: 11, fontWeight: 400, color: "#6E766F", letterSpacing: "0.01em", lineHeight: 1.35 }}
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
          Better was<br />never enough.
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
          Most berberine brands ask you to trust the label. We publish the batch report instead.
        </p>
        <a
          href="#science"
          style={{ marginTop: 12, color: "#1f3a2a", fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", pointerEvents: "auto" }}
        >
          Explore Science ↗
        </a>
        <div style={{ flex: 1, minHeight: "49svh" }} />
        <div className="flex w-full items-start justify-between" style={{ marginTop: 12, color: "#1f3a2a" }}>
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
            { icon: "mountain", title: "Japanese Standard", sub: "Precision Tested" },
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
              <div className="group flex flex-1 flex-col items-center text-center px-1" style={{ pointerEvents: "auto" }}>
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
                      <Leaf className="absolute left-1/2 top-1/2 h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2" strokeWidth={1.75} />
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 12, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", lineHeight: 1.25, color: "#173F2F" }}>
                  {title}
                </div>
                <div style={{ marginTop: 9, fontSize: 9, fontWeight: 400, color: "#6E766F", letterSpacing: "0.01em", lineHeight: 1.3 }}>
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
    { icon: FlaskConical, title: "HPLC VERIFIED" },
    { icon: Mountain, title: "JAPANESE STANDARD" },
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
                <h3 className="mt-3 font-display text-[10px] sm:text-[11px]" style={{ color: "#1E1E1E", fontWeight: 500, letterSpacing: "0.18em" }}>
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
  const rows = [
    { k: "97% HPLC Purity", us: true, them: false },
    { k: "Third-Party Tested", us: true, them: false },
    { k: "Public COA Reports", us: true, them: false },
    { k: "Water-Only Extraction", us: true, them: false },
    { k: "Japanese HPLC Standard", us: true, them: false },
  ];
  return (
    <section className="py-20 md:py-28" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <div className="text-center lg:text-left">
                <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "color-mix(in oklab, var(--ivory) 70%, transparent)" }}>
                  The difference
                </p>
                <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">Why Beyond Better.</h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-12 overflow-hidden rounded-2xl" style={{ background: "color-mix(in oklab, var(--ivory) 10%, transparent)" }}>
                <div
                  className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 px-5 py-4 text-[10px] uppercase tracking-[0.18em] md:px-8 md:text-xs"
                  style={{ borderBottom: "1px solid color-mix(in oklab, var(--ivory) 18%, transparent)", color: "color-mix(in oklab, var(--ivory) 70%, transparent)" }}
                >
                  <span></span>
                  <span className="text-center font-medium" style={{ color: "var(--ivory)" }}>Beyond Better</span>
                  <span className="text-center">Others</span>
                </div>
                {rows.map((r) => (
                  <div
                    key={r.k}
                    className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 px-5 py-4 text-sm md:px-8 md:py-5"
                    style={{ borderBottom: "1px solid color-mix(in oklab, var(--ivory) 10%, transparent)" }}
                  >
                    <span style={{ color: "color-mix(in oklab, var(--ivory) 92%, transparent)" }}>{r.k}</span>
                    <span className="flex justify-center">
                      <Check className="h-5 w-5" style={{ color: "var(--gold-soft)" }} strokeWidth={2.5} />
                    </span>
                    <span className="flex justify-center" style={{ color: "color-mix(in oklab, var(--ivory) 40%, transparent)" }}>
                      <X className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                  </div>
                ))}
              </div>
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
                alt="Beyond Better berberine comparison visual"
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
  const items = [
    "Most supplement brands blend, dilute, or round up their purity numbers, because nobody checks.",
    "We built Beyond Better for the people who do — the ones who want the batch report, not just the buzzword.",
    "Better was never enough. We wanted proof.",
  ];
  return (
    <section id="benefits" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
          <div className="order-2 lg:order-1">
            <Reveal delay={0.12}>
              <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[30px] border" style={{ borderColor: "color-mix(in oklab, var(--charcoal) 8%, transparent)" }}>
                <img
                  src={berberineIndustrySolution}
                  alt="Beyond Better berberine industry solution visual"
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
              <ul className="mx-auto mt-12 max-w-md divide-y lg:mx-0" style={{ borderTop: "1px solid color-mix(in oklab, var(--charcoal) 10%, transparent)", borderBottom: "1px solid color-mix(in oklab, var(--charcoal) 10%, transparent)", borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)" }}>
                {items.map((t) => (
                  <li key={t} className="flex items-center gap-4 py-4 text-left text-[15px]">
                    <Check className="h-4 w-4 shrink-0" style={{ color: "var(--gold-deep)" }} strokeWidth={2} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 lg:mt-12">
                <CTAButton>Buy Now — <PriceTag /></CTAButton>
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
            alt="Beyond Better Berberine HCL — lab tested supplement"
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
            <div style={{ fontSize: "clamp(9px, 1vw, 14px)", letterSpacing: "0.28em", textTransform: "uppercase", color: "#8a6b50", fontWeight: 500 }}>
              Why Beyond Better
            </div>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(20px, 4.2vw, 54px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.01em", color: "#1a1a1a", maxWidth: "450px" }}
            >
              Nothing hidden.
              <br />
              <span style={{ color: "var(--forest)" }}>Every batch verified.</span>
            </h2>
            <p style={{ maxWidth: "450px", fontSize: "clamp(12px, 0.95vw, 14px)", lineHeight: 1.6, color: "#355142" }}>
              This is a real Certificate of Analysis from a recent production batch — not a stock photo, not a summary. The same report ships with every batch we sell.
            </p>
            <div>
              <a
                href="/coming-soon"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition hover:opacity-85"
                style={{ backgroundColor: "var(--forest)", color: "var(--ivory)", width: "fit-content" }}
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
              alt="Beyond Better Berberine HCL — lab tested supplement"
              className="block w-full h-auto select-none"
              width={1920}
              height={1071}
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-6 pb-6 pt-16"
              style={{
                background: "linear-gradient(to top, rgba(241,236,226,0.95) 0.65%, rgba(241,236,226,0.75) 0.3%, rgba(241,236,226,0) 100%)",
              }}
            >
              <div style={{ fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#8a6b50", fontWeight: 500 }}>
                Why Beyond Better
              </div>
              <h2 className="font-display" style={{ fontSize: "26px", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.01em", color: "#1a1a1a" }}>
                Nothing hidden.
                <br />
                <span style={{ color: "var(--forest)" }}>Every batch verified.</span>
              </h2>
              <p style={{ marginTop: 6, fontSize: "12px", lineHeight: 1.55, color: "#355142" }}>
                This is a real Certificate of Analysis from a recent production batch — not a stock photo, not a summary. The same report ships with every batch we sell.
              </p>
              <a
                href="/coming-soon"
                className="mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs transition hover:opacity-85"
                style={{ backgroundColor: "var(--forest)", color: "var(--ivory)", width: "fit-content", pointerEvents: "auto" }}
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


function SocialProof() {
  const featuredReview = { q: "Finally a brand I actually trust. The COA sealed it.", n: "Arjun M." };
  const reviews = [
    { q: "I noticed better energy levels within weeks.", n: "Priya R." },
    { q: "Quality feels far superior to anything else I've tried.", n: "Sneha K." },
  ];
  return (
    <section id="reviews" className="py-20 md:py-28" style={{ background: "#F8F5EF" }}>
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              This is a real Certificate of Analysis from a recent production batch — not a stock photo, not a summary. The same report ships with every batch we sell.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <figure className="mx-auto mt-10 max-w-3xl rounded-3xl border px-8 py-9 text-center shadow-[0_24px_60px_-40px_rgba(23,63,47,0.35)]" style={{ borderColor: "color-mix(in oklab, var(--forest) 14%, transparent)", background: "color-mix(in oklab, #fff 92%, var(--ivory) 8%)" }}>
            <div className="flex justify-center gap-1" style={{ color: "var(--gold-deep)" }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <blockquote className="mt-5 font-display text-2xl leading-tight md:text-3xl">&quot;{featuredReview.q}&quot;</blockquote>
            <figcaption className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">— {featuredReview.n}</figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-12 text-center">
            <div className="flex justify-center gap-1" style={{ color: "var(--gold-deep)" }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="mt-3 font-display text-2xl md:text-3xl">4.8 / 5</p>
            <p className="mt-1 text-sm text-muted-foreground">Trusted by 1,000+ customers</p>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {reviews.map((r, i) => (
            <Reveal key={r.n} delay={i * 0.08}>
              <figure className="text-center md:text-left">
                <div className="flex justify-center gap-0.5 md:justify-start" style={{ color: "var(--gold-deep)" }}>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 font-display text-lg leading-snug">"{r.q}"</blockquote>
                <figcaption className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">— {r.n}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="mt-14 flex justify-center">
            <CTAButton>Shop Now — <PriceTag /></CTAButton>
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
            alt="Berberine HCL extract"
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
            <h2 className="mt-4 font-display text-3xl leading-[1.1] md:text-5xl">One ingredient. Done right.</h2>
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
              Pure Berberine HCL — extracted with water, verified at 97% by HPLC. Nothing else.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Most extractors use solvents to hit purity targets faster and cheaper. We use a water-only extraction process — slower, more expensive, and free of chemical residue. It&apos;s the difference between a number on a label and a number you can actually stand behind.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t pt-6" style={{ borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)" }}>
              {[
                { n: "97%", l: "Purity" },
                { n: "500mg", l: "Per capsule" },
                { n: "0", l: "Fillers" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-2xl md:text-3xl" style={{ color: "var(--gold-deep)" }}>{s.n}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</dd>
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
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Study 0{i + 1}</p>
                <h3 className="mt-3 font-display text-xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="mt-12">
            <CTAButton href="/research-library" variant="ghost">View Research Library</CTAButton>
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
            <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">Questions, answered.</h2>
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
                    <span className="shrink-0">{isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
                  </button>
                  <div className="grid overflow-hidden transition-all duration-500 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
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
  const bullets = [
    "500mg HPLC-verified per capsule — not a proprietary blend hiding the real number",
    "97% purity, tested to Japanese HPLC standard — most berberine on the market sits between 70–90%",
    "No fillers, no binders, no rounding up — built for people who read the label before the reviews",
  ];
  const galleryImages = [
    {
      src: innerBottle,
      alt: "Beyond Better berberine bottle with capsules",
      thumbnailAlt: "Bottle front view",
      width: 384,
      height: 576,
    },
    {
      src: berberineBenefits,
      alt: "Beyond Better berberine benefits visual",
      thumbnailAlt: "Benefits visual",
      width: 384,
      height: 576,
    },
    {
      src: berberineSugarControl,
      alt: "Beyond Better berberine sugar control product visual",
      thumbnailAlt: "Sugar control visual",
      width: 384,
      height: 576,
    },
    {
      src: berberineIngredientInfo,
      alt: "Beyond Better berberine ingredient information visual",
      thumbnailAlt: "Ingredient information visual",
      width: 384,
      height: 576,
    },
    {
      src: berberineDirectionToUse,
      alt: "Beyond Better berberine directions to use visual",
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

            <Reveal delay={0.1}>
              <ul
                className="mx-auto mt-7 flex max-w-sm flex-col gap-2.5 text-[14px] md:text-[15px] lg:mx-0 lg:mt-9 lg:max-w-[560px] lg:gap-4"
                style={{ color: "color-mix(in oklab, var(--forest) 88%, transparent)" }}
              >
                {bullets.map((b) => (
                  <li key={b} className="flex items-center justify-center gap-2.5 lg:items-start lg:justify-start lg:gap-3 lg:text-left lg:leading-relaxed">
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
              <ProductImageGallery images={galleryImages} className="mx-auto mt-10 max-w-full lg:mt-0" />
            </Reveal>

            <Reveal delay={0.2}>
              <p
                className="mt-4 text-[11px] uppercase tracking-[0.22em] lg:mt-3"
                style={{ color: "color-mix(in oklab, var(--forest) 70%, transparent)" }}
              >
                60 Capsules · 60 Day Supply
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-col items-center gap-3 lg:mt-5">
                
                <div className="flex items-baseline justify-center gap-3">
                  <span
                    className="font-display text-[15px] line-through"
                    style={{ color: "color-mix(in oklab, var(--forest) 55%, transparent)" }}
                  >
                    {MRP}
                  </span>
                  <span className="font-display text-4xl md:text-5xl lg:text-[58px]" style={{ color: "var(--forest)" }}>
                    {PRICE}
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <a
                href="/coming-soon"
                className="mt-7 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full px-9 py-5 text-[15px] font-medium tracking-wide transition hover:opacity-95 active:scale-[0.99] lg:mt-4 lg:max-w-[360px]"
                style={{
                  backgroundColor: "var(--forest)",
                  color: "var(--ivory)",
                  boxShadow: "0 14px 30px -10px rgba(30,55,35,0.45)",
                }}
              >
                Balance Your Life <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}


function StickyBuy() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 border-t px-4 py-3 md:hidden"
      style={{
        backgroundColor: "color-mix(in oklab, var(--ivory) 96%, transparent)",
        backdropFilter: "blur(14px)",
        borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)",
      }}
    >
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Berberine HCL</span>
        <span className="font-display text-lg" style={{ color: "var(--forest)" }}><PriceTag /></span>
      </div>
      <a
        href="/coming-soon"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm transition active:opacity-80"
        style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
      >
        <ShoppingBag className="h-4 w-4" /> Buy Now
      </a>
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
              <span className="font-display text-base" style={{ color: "var(--forest)" }}>Beyond Better</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The transparent berberine standard.
            </p>
          </div>
          <div className="flex gap-10 text-sm">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Shop</div>
              <ul className="mt-4 space-y-2">
                <li><a href="/coming-soon" className="hover:opacity-60">Berberine HCL</a></li>
                <li><a href="#lab" className="hover:opacity-60">Lab Report</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Learn</div>
              <ul className="mt-4 space-y-2">
                <li><a href="#science" className="hover:opacity-60">Science</a></li>
                <li><a href="#faq" className="hover:opacity-60">FAQ</a></li>
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
        <p className="mt-4 text-center text-[10px] opacity-60 md:text-left">*These statements have not been evaluated by any food or drug authority. Not intended to diagnose, treat or cure any disease.</p>
      </div>
    </footer>
  );
}
