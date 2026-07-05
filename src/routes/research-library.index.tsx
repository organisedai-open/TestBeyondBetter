import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import productTube from "@/assets/hero-berberine-product.png";
import logoLeaf from "@/assets/logo-leaf.webp";
import { ARTICLES } from "@/data/articles";
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Droplets,
  FileText,
  Clock,
  Plus,
  Minus,
  Instagram,
  Facebook,
  BookOpen,
  Activity,
  Atom,
  Sparkles,
  Mail,
} from "lucide-react";

export const Route = createFileRoute("/research-library/")({
  head: () => ({
    meta: [
      { title: "Research Library — Berberine Science | Beyond Better" },
      {
        name: "description",
        content:
          "Evidence-based research on berberine, blood sugar, AMPK activation, purity testing, and metabolic health from Beyond Better.",
      },
      { property: "og:title", content: "Research Library — Berberine Science | Beyond Better" },
      {
        property: "og:description",
        content:
          "Science-backed education on berberine, metabolic health and supplement quality.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://betterhealthlabs.in/research-library" },
    ],
    links: [{ rel: "canonical", href: "https://betterhealthlabs.in/research-library" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Research Library",
          description:
            "Evidence-based research on berberine supplements, blood sugar, AMPK activation, and metabolic health.",
          publisher: { "@type": "Organization", name: "Beyond Better" },
        }),
      },
    ],
  }),
  component: ResearchLibraryPage,
});

// Articles are sourced from src/data/articles.ts

const FAQS = [
  {
    q: "What is berberine used for?",
    a: "Berberine is a plant-derived alkaloid widely studied for supporting healthy blood sugar levels, insulin sensitivity, lipid balance and overall metabolic function through activation of the AMPK pathway.",
  },
  {
    q: "Is berberine good for blood sugar support?",
    a: "Yes — multiple peer-reviewed clinical studies have examined berberine's role in supporting healthy glucose metabolism and post-meal glucose response in adults.",
  },
  {
    q: "Can berberine support weight management?",
    a: "Research suggests berberine may influence metabolic rate, lipid metabolism and insulin signaling — pathways closely linked with healthy weight regulation when combined with diet and exercise.",
  },
  {
    q: "When should I take berberine?",
    a: "Berberine is commonly taken with meals, typically 500 mg two to three times daily, to align with post-meal glucose response and improve absorption.",
  },
  {
    q: "How much berberine should I take daily?",
    a: "Most clinical studies use 900–1500 mg per day, divided into two or three doses. Always consult a qualified healthcare professional for personalized dosage.",
  },
  {
    q: "How is Beyond Better berberine different?",
    a: "Beyond Better publishes 97%+ HPLC-verified purity, uses water-only extraction, and provides third-party Certificates of Analysis for every batch — full transparency over marketing claims.",
  },
  {
    q: "Why does purity matter in supplements?",
    a: "Lower purity means more plant residues and by-products per capsule, reducing the active dose. Verified high purity ensures a precise, reliable dose of the compound studied in research.",
  },
  {
    q: "Are herbal extracts better than synthetic alternatives?",
    a: "When produced to pharmaceutical standards with verified purity, well-extracted herbal compounds offer a clean, research-grade profile that mirrors the molecule studied in clinical trials.",
  },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
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
        backgroundColor: scrolled ? "color-mix(in oklab, var(--ivory) 78%, transparent)" : "transparent",
        borderBottom: scrolled
          ? "1px solid color-mix(in oklab, var(--charcoal) 8%, transparent)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoLeaf} alt="" className="h-7 w-7 object-contain" />
          <span className="font-display text-base tracking-tight" style={{ color: "var(--forest)" }}>
            Beyond Better
          </span>
        </Link>
        <nav
          className="hidden items-center gap-8 text-sm md:flex"
          style={{ color: "var(--forest)" }}
        >
          <Link to="/" className="hover:opacity-60 transition">Home</Link>
          <Link to="/" hash="science" className="hover:opacity-60 transition">Science</Link>
          <Link to="/research-library" className="hover:opacity-60 transition" style={{ opacity: 0.7 }}>
            Research
          </Link>
          <Link to="/" hash="faq" className="hover:opacity-60 transition">FAQ</Link>
        </nav>
        <Link
          to="/"
          hash="shop"
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm transition hover:opacity-90"
          style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
        >
          Shop <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28"
      style={{ background: "linear-gradient(180deg, #F7F4ED 0%, var(--cream) 100%)" }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
        <Reveal>
          <div
            className="text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "var(--forest)" }}
          >
            Science Backed Education
          </div>
          <h1
            className="mt-5 font-display text-[2.6rem] leading-[1.05] sm:text-5xl lg:text-[4rem]"
            style={{ color: "var(--forest)" }}
          >
            The Science Behind <em className="italic opacity-90">Better</em> Health.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Understand how berberine works inside your body, why purity matters, and what modern
            research says about metabolic health.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#articles"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition hover:opacity-90"
              style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
            >
              Explore Research <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/"
              hash="shop"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm transition hover:bg-white"
              style={{ borderColor: "color-mix(in oklab, var(--forest) 25%, transparent)", color: "var(--forest)" }}
            >
              Shop Berberine
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            {/* Editorial collage */}
            <div
              className="absolute left-0 top-0 h-[58%] w-[58%] overflow-hidden rounded-3xl shadow-[0_30px_80px_-30px_rgba(23,61,36,0.35)]"
              style={{ animation: "floatY 8s ease-in-out infinite" }}
            >
              <img
                src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=700&q=70"
                alt="Molecular science"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className="absolute right-0 top-[8%] h-[42%] w-[44%] overflow-hidden rounded-3xl shadow-[0_30px_80px_-30px_rgba(23,61,36,0.3)]"
              style={{ animation: "floatY 9s ease-in-out infinite", animationDelay: "-2s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=70"
                alt="Berberine root and herbs"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-0 right-[6%] h-[44%] w-[52%] overflow-hidden rounded-3xl shadow-[0_30px_80px_-30px_rgba(23,61,36,0.35)]"
              style={{ animation: "floatY 10s ease-in-out infinite", animationDelay: "-4s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=70"
                alt="Supplement capsules"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-[10%] left-[4%] h-[34%] w-[36%] overflow-hidden rounded-2xl border bg-white/80 p-4 shadow-[0_20px_60px_-25px_rgba(23,61,36,0.25)] backdrop-blur"
              style={{ borderColor: "color-mix(in oklab, var(--forest) 12%, transparent)" }}
            >
              <FileText className="h-4 w-4" style={{ color: "var(--forest)" }} />
              <div className="mt-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--forest)" }}>
                Research Paper
              </div>
              <div className="mt-1 font-display text-xs leading-tight" style={{ color: "var(--forest)" }}>
                Berberine &amp; AMPK Activation
              </div>
              <div className="mt-3 space-y-1">
                <div className="h-1 w-full rounded bg-[color:var(--forest)]/15" />
                <div className="h-1 w-4/5 rounded bg-[color:var(--forest)]/15" />
                <div className="h-1 w-3/5 rounded bg-[color:var(--forest)]/15" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedArticle() {
  return (
    <section className="px-6 py-20 lg:px-10 lg:py-28" style={{ backgroundColor: "#F7F4ED" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div
            className="grid overflow-hidden rounded-[28px] border bg-white shadow-[0_30px_80px_-40px_rgba(23,61,36,0.25)] lg:grid-cols-2"
            style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
          >
            <div className="relative aspect-[4/3] lg:aspect-auto">
              <img
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=75"
                alt="Berberine research"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-14">
              <span
                className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em]"
                style={{ backgroundColor: "color-mix(in oklab, var(--forest) 8%, transparent)", color: "var(--forest)" }}
              >
                Featured Research
              </span>
              <h2
                className="mt-5 font-display text-3xl leading-tight lg:text-[2.4rem]"
                style={{ color: "var(--forest)" }}
              >
                Why Berberine Is Becoming The Most Studied Natural Compound For Metabolic Health
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Berberine has emerged as one of the most researched plant compounds for supporting
                blood sugar regulation, insulin sensitivity, and long-term metabolic wellness.
                Scientists are increasingly comparing its mechanisms with pharmaceutical
                interventions.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> 8 min read
              </div>
              <Link
                to="/research-library/$slug"
                params={{ slug: "berberine-metabolic-health" }}
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm transition hover:opacity-90"
                style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
              >
                Read Full Research <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ArticleGrid() {
  return (
    <section id="articles" className="px-6 py-20 lg:px-10 lg:py-28" style={{ backgroundColor: "var(--ivory)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--forest)" }}>
                The Library
              </div>
              <h2 className="mt-3 font-display text-4xl lg:text-5xl" style={{ color: "var(--forest)" }}>
                Evidence. Distilled.
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              In-depth articles on berberine supplements, dosing, purity testing and the modern
              science of metabolic health.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 0.08}>
              <Link
                to="/research-library/$slug"
                params={{ slug: a.slug }}
                className="group flex h-full flex-col overflow-hidden rounded-[22px] border bg-white shadow-[0_20px_60px_-40px_rgba(23,61,36,0.25)] transition hover:shadow-[0_30px_80px_-40px_rgba(23,61,36,0.4)]"
                style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
              >
                <div className="relative aspect-[5/3.2] overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span
                    className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.22em]"
                    style={{
                      backgroundColor: "color-mix(in oklab, var(--forest) 8%, transparent)",
                      color: "var(--forest)",
                    }}
                  >
                    {a.tag}
                  </span>
                  <h3
                    className="mt-4 font-display text-xl leading-snug"
                    style={{ color: "var(--forest)" }}
                  >
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {a.readTime}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs transition group-hover:gap-2"
                      style={{ color: "var(--forest)" }}
                    >
                      Read Full Research <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const items = [
    { icon: ShieldCheck, title: "97% Purity Verified", desc: "Every batch undergoes advanced purity testing." },
    { icon: FlaskConical, title: "Japanese Standard HPLC Testing", desc: "Precision verification beyond industry standards." },
    { icon: Droplets, title: "Water Only Extraction", desc: "No chemical solvent contamination." },
    { icon: FileText, title: "Full Transparency", desc: "Every product backed by verifiable quality reports." },
  ];
  return (
    <section className="px-6 py-24 lg:px-10 lg:py-32" style={{ backgroundColor: "#F7F4ED" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--forest)" }}>
              Quality Obsession
            </div>
            <h2 className="mt-4 font-display text-4xl lg:text-5xl" style={{ color: "var(--forest)" }}>
              Why We Obsess Over Quality.
            </h2>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <div
                className="flex h-full flex-col rounded-[22px] border bg-white p-7 shadow-[0_20px_60px_-40px_rgba(23,61,36,0.25)]"
                style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
                >
                  <it.icon className="h-5 w-5" style={{ color: "var(--forest)" }} />
                </div>
                <h3 className="mt-6 font-display text-xl" style={{ color: "var(--forest)" }}>
                  {it.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Infographic() {
  const steps = [
    { n: "01", icon: Atom, title: "Supports AMPK Activation", desc: "Switches on the body's master metabolic enzyme." },
    { n: "02", icon: Activity, title: "Improves Glucose Uptake", desc: "Helps cells absorb glucose efficiently." },
    { n: "03", icon: Sparkles, title: "Supports Insulin Sensitivity", desc: "Improves how cells respond to insulin." },
    { n: "04", icon: BookOpen, title: "Supports Metabolic Function", desc: "Promotes balanced long-term metabolic health." },
  ];
  return (
    <section className="px-6 py-24 lg:px-10 lg:py-32" style={{ backgroundColor: "var(--ivory)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--forest)" }}>
              Mechanism Of Action
            </div>
            <h2 className="mt-4 font-display text-4xl lg:text-5xl" style={{ color: "var(--forest)" }}>
              How Berberine Works Inside The Body
            </h2>
          </div>
        </Reveal>

        <div className="relative mt-20">
          {/* Connecting line for desktop */}
          <div
            className="absolute left-0 right-0 top-7 hidden h-px lg:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--forest) 30%, transparent), transparent)",
            }}
            aria-hidden
          />
          <div className="grid gap-10 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div className="relative flex flex-col items-center text-center">
                  <div
                    className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border bg-white shadow-[0_10px_30px_-10px_rgba(23,61,36,0.3)]"
                    style={{ borderColor: "color-mix(in oklab, var(--forest) 20%, transparent)" }}
                  >
                    <s.icon className="h-5 w-5" style={{ color: "var(--forest)" }} />
                  </div>
                  <div
                    className="mt-5 text-[10px] uppercase tracking-[0.28em]"
                    style={{ color: "var(--forest)", opacity: 0.6 }}
                  >
                    Step {s.n}
                  </div>
                  <h3 className="mt-2 font-display text-xl" style={{ color: "var(--forest)" }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-6 py-24 lg:px-10 lg:py-32" style={{ backgroundColor: "#F7F4ED" }}>
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--forest)" }}>
              Answers
            </div>
            <h2 className="mt-4 font-display text-4xl lg:text-5xl" style={{ color: "var(--forest)" }}>
              Frequently Asked Questions About Berberine
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.03}>
                <div
                  className="overflow-hidden rounded-2xl border bg-white"
                  style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-[color:var(--cream)]"
                  >
                    <span
                      className="font-display text-base sm:text-lg"
                      style={{ color: "var(--forest)" }}
                    >
                      {f.q}
                    </span>
                    {isOpen ? (
                      <Minus className="h-4 w-4 flex-shrink-0" style={{ color: "var(--forest)" }} />
                    ) : (
                      <Plus className="h-4 w-4 flex-shrink-0" style={{ color: "var(--forest)" }} />
                    )}
                  </button>
                  <div
                    className="grid transition-all duration-500"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </section>
  );
}

function Newsletter() {
  return (
    <section className="px-6 py-24 lg:px-10" style={{ backgroundColor: "var(--ivory)" }}>
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div
            className="overflow-hidden rounded-[28px] px-8 py-16 text-center shadow-[0_30px_80px_-40px_rgba(23,61,36,0.4)] lg:px-16"
            style={{
              background:
                "linear-gradient(135deg, var(--forest) 0%, color-mix(in oklab, var(--forest) 80%, black) 100%)",
              color: "var(--ivory)",
            }}
          >
            <div className="text-[11px] uppercase tracking-[0.32em] opacity-70">
              The Research Circle
            </div>
            <h2 className="mt-4 font-display text-4xl lg:text-5xl">
              Stay Ahead Of The Science.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed opacity-80">
              Get evidence-based health education, research updates, and supplement science
              delivered weekly.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  className="w-full rounded-full border border-white/20 bg-white/10 px-12 py-3.5 text-sm placeholder:text-white/60 outline-none transition focus:border-white/50"
                />
              </div>
              <button
                type="submit"
                className="rounded-full px-6 py-3.5 text-sm transition hover:opacity-90"
                style={{ backgroundColor: "var(--ivory)", color: "var(--forest)" }}
              >
                Join The Research Circle
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden px-6 py-24 lg:px-10 lg:py-32"
      style={{ background: "linear-gradient(180deg, #F7F4ED 0%, var(--cream) 100%)" }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--forest)" }}>
            The Standard
          </div>
          <h2
            className="mt-4 font-display text-5xl leading-[1.02] lg:text-6xl"
            style={{ color: "var(--forest)" }}
          >
            Better Was Never <em className="italic">Enough.</em>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Science-backed wellness starts with uncompromising quality.
          </p>
          <Link
            to="/"
            hash="shop"
            className="mt-9 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm transition hover:opacity-90"
            style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
          >
            Shop Beyond Better <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center">
            <div
              className="absolute inset-[14%] rounded-full blur-3xl"
              style={{ background: "color-mix(in oklab, var(--forest) 22%, transparent)" }}
              aria-hidden
            />
            <img
              src={productTube}
              alt="Beyond Better Berberine"
              loading="lazy"
              className="relative max-h-[460px] w-auto object-contain drop-shadow-[0_40px_60px_rgba(23,61,36,0.35)]"
              style={{ animation: "floatY 7s ease-in-out infinite" }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-10 border-b pb-12 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={logoLeaf} alt="" className="h-7 w-7 object-contain" />
              <span className="font-display text-base" style={{ color: "var(--forest)" }}>
                Beyond Better
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The transparent berberine standard. Verified purity. Independent testing. Published proof.
            </p>
          </div>
          <div className="flex gap-10 text-sm">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Shop</div>
              <ul className="mt-4 space-y-2">
                <li><Link to="/" hash="shop" className="hover:opacity-60">Berberine HCL</Link></li>
                <li><Link to="/" hash="lab" className="hover:opacity-60">Lab Report</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Learn</div>
              <ul className="mt-4 space-y-2">
                <li><Link to="/research-library" className="hover:opacity-60">Research Library</Link></li>
                <li><Link to="/" hash="science" className="hover:opacity-60">Science</Link></li>
                <li><Link to="/" hash="faq" className="hover:opacity-60">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Beyond Better. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
          </div>
          <p className="opacity-70">
            *These statements have not been evaluated by any food or drug authority. This product is
            not intended to diagnose, treat, cure or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}

function StickyShop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <Link
      to="/"
      hash="shop"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm shadow-[0_20px_50px_-15px_rgba(23,61,36,0.6)] transition"
      style={{
        backgroundColor: "var(--forest)",
        color: "var(--ivory)",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      Shop Now <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  );
}

function ResearchLibraryPage() {
  return (
    <div style={{ backgroundColor: "var(--ivory)" }}>
      <Header />
      <main>
        <Hero />
        <FeaturedArticle />
        <ArticleGrid />
        <TrustSection />
        <Infographic />
        <FaqAccordion />
        <Newsletter />
        <FinalCTA />
      </main>
      <Footer />
      <StickyShop />
    </div>
  );
}
