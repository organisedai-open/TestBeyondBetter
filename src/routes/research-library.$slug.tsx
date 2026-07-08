import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import productTube from "@/assets/hero-berberine-product.png";
import logoLeaf from "@/assets/logo-leaf.webp";
import {
  ArrowUpRight,
  ArrowRight,
  Clock,
  Calendar,
  ShieldCheck,
  Share2,
  BookOpen,
  Instagram,
  Facebook,
  ChevronLeft,
} from "lucide-react";
import { getArticleBySlug, getRelatedArticles, ARTICLE_AUTHOR, type Article } from "@/data/articles";

export const Route = createFileRoute("/research-library/$slug")({
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article Not Found — Beyond Better" }],
      };
    }
    const url = `https://betterhealthlabs.in/research-library/${params.slug}`;
    return {
      meta: [
        { title: loaderData.seoTitle },
        { name: "description", content: loaderData.seoDescription },
        { property: "og:title", content: loaderData.seoTitle },
        { property: "og:description", content: loaderData.seoDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: loaderData.image },
        { property: "article:published_time", content: loaderData.publishedDate },
        { property: "article:author", content: ARTICLE_AUTHOR },
        { property: "article:section", content: loaderData.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.seoTitle },
        { name: "twitter:description", content: loaderData.seoDescription },
        { name: "twitter:image", content: loaderData.image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: loaderData.title,
            description: loaderData.seoDescription,
            image: [loaderData.image],
            datePublished: loaderData.publishedDate,
            author: { "@type": "Organization", name: ARTICLE_AUTHOR },
            publisher: {
              "@type": "Organization",
              name: "Beyond Better",
              logo: {
                "@type": "ImageObject",
                url: "https://betterhealthlabs.in/favicon.ico",
              },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            articleSection: loaderData.category,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: loaderData.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://betterhealthlabs.in/" },
              { "@type": "ListItem", position: 2, name: "Research Library", item: "https://betterhealthlabs.in/research-library" },
              { "@type": "ListItem", position: 3, name: loaderData.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: ArticlePage,
  errorComponent: ({ error }) => {
    console.error(error);
    return (
      <div className="flex min-h-screen items-center justify-center p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Something went wrong. Please try again or go back home.
        </p>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-10 text-center">
      <h1 className="font-display text-3xl" style={{ color: "var(--forest)" }}>
        Article not found
      </h1>
      <Link to="/research-library" className="text-sm underline">
        Back to Research Library
      </Link>
    </div>
  ),
});

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
        backgroundColor: scrolled
          ? "color-mix(in oklab, var(--ivory) 82%, transparent)"
          : "color-mix(in oklab, var(--ivory) 60%, transparent)",
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
          <Link to="/research-library" className="hover:opacity-60 transition">Research</Link>
          <Link to="/" hash="faq" className="hover:opacity-60 transition">FAQ</Link>
        </nav>
        <a
          href="/coming-soon"
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm transition hover:opacity-90"
          style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
        >
          Shop <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px]"
      style={{ backgroundColor: "transparent" }}
      aria-hidden
    >
      <div
        className="h-full transition-[width] duration-150"
        style={{ width: `${progress}%`, backgroundColor: "var(--forest)" }}
      />
    </div>
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
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <a
        href="/coming-soon"
        className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm shadow-[0_20px_50px_-15px_rgba(23,61,36,0.45)] transition hover:opacity-90"
        style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
      >
        Shop Berberine <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function ShareButton({ title }: { title: string }) {
  const onClick = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
        return;
      } catch {
        /* user cancelled */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        /* ignore */
      }
    }
  };
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition hover:bg-white"
      style={{
        borderColor: "color-mix(in oklab, var(--forest) 20%, transparent)",
        color: "var(--forest)",
      }}
    >
      <Share2 className="h-3.5 w-3.5" /> Share
    </button>
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
                <li><a href="/coming-soon" className="hover:opacity-60">Berberine HCL</a></li>
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
          <p className="opacity-70 max-w-md">
            *These statements have not been evaluated by any food or drug authority. This product is
            not intended to diagnose, treat, cure or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}

function ArticlePage() {
  const article = Route.useLoaderData() as Article;
  const related = getRelatedArticles(article.relatedSlugs);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F4ED" }}>
      <ReadingProgress />
      <Header />

      {/* HERO */}
      <article>
        <section className="px-6 pt-32 pb-10 lg:px-10 lg:pt-40">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <nav className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
                <Link to="/" className="hover:opacity-60">Home</Link>
                <span>/</span>
                <Link to="/research-library" className="hover:opacity-60">Research Library</Link>
                <span>/</span>
                <span style={{ color: "var(--forest)" }}>{article.category}</span>
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em]"
                  style={{
                    backgroundColor: "color-mix(in oklab, var(--forest) 10%, transparent)",
                    color: "var(--forest)",
                  }}
                >
                  {article.category}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em]"
                  style={{
                    borderColor: "color-mix(in oklab, var(--forest) 20%, transparent)",
                    color: "var(--forest)",
                  }}
                >
                  <ShieldCheck className="h-3 w-3" /> Peer Reviewed Research Analysis
                </span>
              </div>

              <h1
                className="mt-7 font-display text-[2.2rem] leading-[1.08] sm:text-5xl lg:text-[3.4rem]"
                style={{ color: "var(--forest)" }}
              >
                {article.title}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> {ARTICLE_AUTHOR}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {article.publishedDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {article.readTime}
                </span>
                <ShareButton title={article.title} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* HERO IMAGE */}
        <section className="px-6 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div
                className="overflow-hidden rounded-[28px] shadow-[0_40px_120px_-50px_rgba(23,61,36,0.45)]"
                style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ aspectRatio: "16/9" }}
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* BODY */}
        <section className="px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_240px]">
            <div className="max-w-2xl">
              {article.sections.map((section, i) => (
                <Reveal key={section.heading} delay={i * 0.03}>
                  <div className="mb-12">
                    <h2
                      className="font-display text-2xl leading-tight sm:text-3xl"
                      style={{ color: "var(--forest)" }}
                    >
                      {section.heading}
                    </h2>
                    <div className="mt-5 space-y-5">
                      {section.paragraphs.map((p, j) => (
                        <p key={j} className="text-[15px] leading-[1.85] text-charcoal/85" style={{ color: "color-mix(in oklab, var(--charcoal) 88%, transparent)" }}>
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}

              {/* Key Takeaways */}
              <Reveal>
                <div
                  className="mt-4 rounded-[22px] border bg-white p-8 shadow-[0_20px_60px_-40px_rgba(23,61,36,0.25)]"
                  style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
                >
                  <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--forest)" }}>
                    Key Takeaways
                  </div>
                  <ul className="mt-5 space-y-3">
                    {article.keyTakeaways.map((t) => (
                      <li key={t} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        <span
                          className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: "var(--forest)" }}
                        />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* FAQ */}
              {article.faqs.length > 0 && (
                <Reveal>
                  <div className="mt-12">
                    <h2 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--forest)" }}>
                      Frequently Asked Questions
                    </h2>
                    <div className="mt-6 space-y-3">
                      {article.faqs.map((f) => (
                        <details
                          key={f.q}
                          className="group overflow-hidden rounded-2xl border bg-white"
                          style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
                        >
                          <summary
                            className="cursor-pointer list-none px-6 py-4 font-display text-base transition hover:bg-[color:var(--cream)]"
                            style={{ color: "var(--forest)" }}
                          >
                            {f.q}
                          </summary>
                          <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                            {f.a}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* References */}
              <Reveal>
                <div className="mt-14 border-t pt-10" style={{ borderColor: "color-mix(in oklab, var(--forest) 12%, transparent)" }}>
                  <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--forest)" }}>
                    Scientific References
                  </div>
                  <ol className="mt-5 space-y-3 text-sm text-muted-foreground">
                    {article.references.map((r, i) => (
                      <li key={i} className="leading-relaxed">
                        <span style={{ color: "var(--forest)" }}>[{i + 1}]</span>{" "}
                        <span className="font-medium" style={{ color: "var(--forest)" }}>{r.title}</span>
                        {" — "}
                        <em>{r.source}</em>, {r.year}.
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>

              {/* Citation block */}
              <Reveal>
                <div
                  className="mt-10 rounded-2xl border bg-[color:var(--cream)] p-6"
                  style={{ borderColor: "color-mix(in oklab, var(--forest) 12%, transparent)" }}
                >
                  <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--forest)" }}>
                    How To Cite This Article
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {ARTICLE_AUTHOR}. ({new Date(article.publishedDate).getFullYear()}). {article.title}. Beyond Better Research Library. Retrieved from https://betterhealthlabs.in/research-library/{article.slug}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* SIDEBAR */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 space-y-6">
                <div
                  className="rounded-2xl border bg-white p-6"
                  style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
                >
                  <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--forest)" }}>
                    In This Article
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {article.sections.map((s) => (
                      <li key={s.heading} className="text-xs leading-relaxed text-muted-foreground hover:text-[color:var(--forest)]">
                        {s.heading}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="overflow-hidden rounded-2xl p-6 text-center"
                  style={{
                    background:
                      "linear-gradient(160deg, var(--forest) 0%, color-mix(in oklab, var(--forest) 75%, black) 100%)",
                    color: "var(--ivory)",
                  }}
                >
                  <img
                    src={productTube}
                    alt="Beyond Better Berberine"
                    loading="lazy"
                    className="mx-auto h-32 w-auto object-contain"
                  />
                  <div className="mt-4 font-display text-lg">Beyond Better Berberine</div>
                  <p className="mt-2 text-xs opacity-80">
                    97% HPLC verified purity. Water extraction. Independent testing.
                  </p>
                  <a
                    href="/coming-soon"
                    className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs transition hover:opacity-90"
                    style={{ backgroundColor: "var(--ivory)", color: "var(--forest)" }}
                  >
                    Shop Now <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="px-6 py-20 lg:px-10 lg:py-24" style={{ backgroundColor: "var(--ivory)" }}>
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <div className="mb-10">
                  <div className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--forest)" }}>
                    Related Research
                  </div>
                  <h2 className="mt-3 font-display text-3xl lg:text-4xl" style={{ color: "var(--forest)" }}>
                    Continue Reading.
                  </h2>
                </div>
              </Reveal>
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r, i) => (
                  <Reveal key={r.slug} delay={i * 0.08}>
                    <Link
                      to="/research-library/$slug"
                      params={{ slug: r.slug }}
                      className="group flex h-full flex-col overflow-hidden rounded-[22px] border bg-white shadow-[0_20px_60px_-40px_rgba(23,61,36,0.25)] transition hover:shadow-[0_30px_80px_-40px_rgba(23,61,36,0.4)]"
                      style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
                    >
                      <div className="relative aspect-[5/3.2] overflow-hidden">
                        <img
                          src={r.image}
                          alt={r.title}
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
                          {r.tag}
                        </span>
                        <h3 className="mt-4 font-display text-lg leading-snug" style={{ color: "var(--forest)" }}>
                          {r.title}
                        </h3>
                        <div className="mt-auto flex items-center justify-between pt-6 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> {r.readTime}
                          </span>
                          <span className="inline-flex items-center gap-1 transition group-hover:gap-2" style={{ color: "var(--forest)" }}>
                            Read <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FINAL CTA */}
        <section
          className="relative overflow-hidden px-6 py-24 lg:px-10 lg:py-28"
          style={{ background: "linear-gradient(180deg, #F7F4ED 0%, var(--cream) 100%)" }}
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--forest)" }}>
                Experience Science Backed Supplementation
              </div>
              <h2
                className="mt-4 font-display text-4xl leading-[1.05] lg:text-5xl"
                style={{ color: "var(--forest)" }}
              >
                Better Was Never <em className="italic">Enough.</em>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                97% HPLC verified purity. Water-only extraction. Full transparency at every batch.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/coming-soon"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition hover:opacity-90"
                  style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
                >
                  Shop Beyond Better <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/research-library"
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm transition hover:bg-white"
                  style={{
                    borderColor: "color-mix(in oklab, var(--forest) 25%, transparent)",
                    color: "var(--forest)",
                  }}
                >
                  <ChevronLeft className="h-4 w-4" /> All Articles
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center">
                <div
                  className="absolute inset-[14%] rounded-full blur-3xl"
                  style={{ background: "color-mix(in oklab, var(--forest) 22%, transparent)" }}
                  aria-hidden
                />
                <img
                  src={productTube}
                  alt="Beyond Better Berberine"
                  loading="lazy"
                  className="relative max-h-[420px] w-auto object-contain drop-shadow-[0_40px_60px_rgba(23,61,36,0.35)]"
                  style={{ animation: "floatY 7s ease-in-out infinite" }}
                />
              </div>
            </Reveal>
          </div>
        </section>
      </article>

      <Footer />
      <StickyShop />
    </div>
  );
}
