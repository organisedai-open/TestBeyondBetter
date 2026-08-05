import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, Instagram, Facebook, Mail } from "lucide-react";

import logoLeaf from "@/assets/logo-leaf.webp";
import { POLICY_PAGES, SUPPORT_EMAIL } from "@/lib/seo";

// Shared chrome for the five standalone legal pages. Every route file that renders these
// (privacy-policy.tsx, terms-and-conditions.tsx, refund-policy.tsx, cancellation-policy.tsx,
// shipping-policy.tsx) is new, so — unlike the per-page Header/Footer duplicated across the
// existing marketing routes — there was no existing convention to match here, and DRYing this
// across five near-identical pages avoids five copies drifting out of sync the next time a
// link changes.

const borderTint = "color-mix(in oklab, var(--forest) 12%, transparent)";
const forestTint = (pct: number) => `color-mix(in oklab, var(--forest) ${pct}%, transparent)`;

export function PolicyHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: "color-mix(in oklab, var(--ivory) 85%, transparent)",
        borderColor: borderTint,
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
          <Link to="/" className="transition hover:opacity-60">
            Home
          </Link>
          <Link to="/products/berberine-hcl" className="transition hover:opacity-60">
            Shop
          </Link>
          <Link to="/research-library" className="transition hover:opacity-60">
            Research Library
          </Link>
        </nav>
        <Link
          to="/products/berberine-hcl"
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm transition hover:opacity-90"
          style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
        >
          Shop Now <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
}

export function PolicyBreadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
      <Link to="/" className="hover:opacity-60">
        Home
      </Link>
      <span aria-hidden>/</span>
      <span style={{ color: "var(--forest)" }}>{current}</span>
    </nav>
  );
}

export function PolicyHero({
  eyebrow,
  title,
  lastUpdated,
  intro,
  breadcrumbLabel,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro?: string;
  breadcrumbLabel: string;
}) {
  return (
    <section className="px-6 pt-16 pb-12 lg:px-10 lg:pt-24 lg:pb-16">
      <div className="mx-auto max-w-3xl">
        <PolicyBreadcrumb current={breadcrumbLabel} />
        <div
          className="mt-8 text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "var(--forest)" }}
        >
          {eyebrow}
        </div>
        <h1
          className="mt-4 font-display text-[2.4rem] leading-[1.08] sm:text-5xl lg:text-[3.2rem]"
          style={{ color: "var(--forest)" }}
        >
          {title}
        </h1>
        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Last Updated: {lastUpdated}
        </p>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
        )}
      </div>
    </section>
  );
}

/** Comfortable-reading-width wrapper for the policy body content. */
export function PolicyContent({ children }: { children: ReactNode }) {
  return (
    <section className="px-6 pb-20 lg:px-10 lg:pb-28">
      <div className="mx-auto max-w-3xl">{children}</div>
    </section>
  );
}

export function PolicySection({
  id,
  heading,
  children,
}: {
  id?: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="mb-11 scroll-mt-28">
      <h2
        className="font-display text-2xl leading-tight sm:text-[1.7rem]"
        style={{ color: "var(--forest)" }}
      >
        {heading}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

/** Question-phrased sub-heading paired with the verbatim policy sentence(s) as its answer — used where the source text already reads as an answer, for AEO/LLM-answer readability. Not a rewrite: only the heading is new. */
export function PolicyAnswer({ question, children }: { question: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="font-display text-lg" style={{ color: "var(--forest)" }}>
        {question}
      </h3>
      <div className="mt-2 space-y-3">{children}</div>
    </div>
  );
}

export function PolicyParagraph({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[15px] leading-[1.85]"
      style={{ color: "color-mix(in oklab, var(--charcoal) 88%, transparent)" }}
    >
      {children}
    </p>
  );
}

export function PolicyList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-3 text-[15px] leading-[1.7]"
          style={{ color: "color-mix(in oklab, var(--charcoal) 88%, transparent)" }}
        >
          <span
            className="mt-2.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: "var(--forest)" }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SupportEmailLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className={`underline decoration-[color-mix(in_oklab,var(--forest)_35%,transparent)] underline-offset-2 hover:opacity-70 ${className}`}
      style={{ color: "var(--forest)" }}
    >
      {SUPPORT_EMAIL}
    </a>
  );
}

/** Internal-linking block at the foot of the content column: the other four policies. Kept short and unobtrusive per "don't overdo internal links." */
export function RelatedPolicies({ currentPath }: { currentPath: string }) {
  const others = POLICY_PAGES.filter((p) => p.path !== currentPath);
  return (
    <div className="mt-4 rounded-[22px] border bg-white p-8" style={{ borderColor: borderTint }}>
      <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--forest)" }}>
        Related Policies
      </div>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {others.map((p) => (
          <Link
            key={p.path}
            to={p.path}
            className="inline-flex items-center rounded-full border px-4 py-2 text-xs transition hover:bg-[color:var(--cream)]"
            style={{ borderColor: forestTint(20), color: "var(--forest)" }}
          >
            {p.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PolicyFooter() {
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
              The transparent berberine standard. Verified purity. Independent testing. Published
              proof.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm hover:opacity-60"
              style={{ color: "var(--forest)" }}
            >
              <Mail className="h-3.5 w-3.5" /> {SUPPORT_EMAIL}
            </a>
          </div>
          <div className="flex flex-wrap gap-10 text-sm">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Shop</div>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/products/berberine-hcl" className="hover:opacity-60">
                    Berberine HCL
                  </Link>
                </li>
                <li>
                  <Link to="/research-library" className="hover:opacity-60">
                    Research Library
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
          <p className="max-w-md">
            *These statements have not been evaluated by any food or drug authority. This product is
            not intended to diagnose, treat, cure or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PolicyPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F4ED" }}>
      <PolicyHeader />
      <main>{children}</main>
      <PolicyFooter />
    </div>
  );
}
