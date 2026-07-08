import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import logoLeaf from "@/assets/logo-leaf.webp";
import productPreview from "@/assets/hero-berberine-product.png";

export const Route = createFileRoute("/coming-soon")({
  head: () => ({
    meta: [
      { title: "Coming Soon | Beyond Better" },
      {
        name: "description",
        content:
          "Beyond Better is preparing its first premium nutraceutical collection. Join the waitlist to be notified when we launch.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Coming Soon | Beyond Better" },
      {
        property: "og:description",
        content:
          "Beyond Better is preparing its first premium nutraceutical collection. Join the waitlist to be notified when we launch.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://betterhealthlabs.in/coming-soon" },
    ],
    links: [{ rel: "canonical", href: "https://betterhealthlabs.in/coming-soon" }],
  }),
  component: ComingSoonPage,
});

function ComingSoonPage() {
  // Configure your deployed Google Apps Script Web App URL or your server endpoint here.
  // Recommended: set `VITE_WAITLIST_ENDPOINT` in your environment for builds.
  const WAITLIST_ENDPOINT = (import.meta as any).env?.VITE_WAITLIST_ENDPOINT ?? "REPLACE_WITH_WEBAPP_URL";

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitted(false);
    if (!WAITLIST_ENDPOINT || WAITLIST_ENDPOINT === "REPLACE_WITH_WEBAPP_URL") {
      setError("Waitlist endpoint not configured. Replace WAITLIST_ENDPOINT in the code or set VITE_WAITLIST_ENDPOINT.");
      return;
    }

    const form = event.currentTarget;
    const fd = new FormData(form);
    const firstName = (fd.get("firstName") as string | null)?.trim() ?? "";
    const email = (fd.get("email") as string | null)?.trim() ?? "";

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      // Use urlencoded form body to avoid a CORS preflight when calling a Google Apps Script web app.
      const body = new URLSearchParams({ firstName, email, page: window.location.pathname }).toString();
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      setSubmitted(true);
      form.reset();
    } catch (err: any) {
      setError(err?.message ?? "Submission failed. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        <header className="flex items-center justify-between py-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img src={logoLeaf} alt="" className="h-5 w-5 object-contain" />
            <span className="font-display text-sm tracking-tight" style={{ color: "var(--forest)" }}>
              Beyond Better
            </span>
          </Link>
          <Link
            to="/"
            className="text-sm transition hover:opacity-70"
            style={{ color: "var(--forest)" }}
          >
            Back home
          </Link>
        </header>

        <section className="flex flex-1 flex-col justify-center py-10 sm:py-14 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="fade-up">
              <p
                className="text-[11px] uppercase tracking-[0.34em]"
                style={{ color: "var(--forest)" }}
              >
                Coming Soon
              </p>
              <h1 className="mt-5 max-w-2xl text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
                Something Better Is Coming
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                We&apos;re preparing the first Beyond Better collection with uncompromising attention to quality,
                formulation, and experience. Join the waitlist and we&apos;ll let you know the moment it becomes available.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_20px_70px_-40px_rgba(23,61,36,0.32)] sm:p-7"
                style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="mb-2 block text-sm text-muted-foreground">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className="w-full rounded-full border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-[color:var(--gold)]"
                      placeholder="Alex"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm text-muted-foreground">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full rounded-full border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-[color:var(--gold)]"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ backgroundColor: "var(--gold)", color: "var(--charcoal)" }}
                >
                  {submitting ? (
                    <>
                      <span
                        aria-hidden
                        className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--charcoal)] border-t-transparent"
                      />
                      Adding you to the list...
                    </>
                  ) : (
                    "Join the Waitlist"
                  )}
                </button>

                {submitted && !error && (
                  <p
                    aria-live="polite"
                    className="mt-4 w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-sm"
                    style={{ color: "color-mix(in oklab, var(--forest) 90%, black)" }}
                  >
                    Added successfully. You are on the waitlist.
                  </p>
                )}

                {error && (
                  <p
                    role="alert"
                    className="mt-4 w-fit rounded-full bg-rose-50 px-3 py-1.5 text-sm"
                    style={{ color: "#9f1239" }}
                  >
                    Oops, that was a tiny hiccup. Please try again.
                  </p>
                )}

                {!submitted && !error && (
                  <p aria-live="polite" className="mt-4 text-sm text-muted-foreground">
                    No spam. Just first access when the collection launches.
                  </p>
                )}
              </form>

              <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
                Every formula is developed with transparency, rigorous testing, and carefully selected ingredients. No shortcuts. No unnecessary fillers. Just products designed to help you go Beyond Better.
              </p>
            </div>

            <div className="fade-up delay-1">
              <div
                className="rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_24px_80px_-42px_rgba(23,61,36,0.3)] sm:p-8"
                style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
              >
                <img
                  src={productPreview}
                  alt="Berberine product preview"
                  className="mx-auto h-72 w-auto object-contain sm:h-80"
                />
                <div className="mt-8 text-center">
                  <p className="text-[11px] uppercase tracking-[0.34em]" style={{ color: "var(--forest)" }}>
                    Beyond Better
                  </p>
                  <h2 className="mt-2 font-display text-2xl text-foreground">Berberine HCl 500 mg</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    97% Purity • HPLC Verified • 60 Capsules
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="my-6 h-px bg-black/10" />

        <section className="py-8 sm:py-10">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.34em]" style={{ color: "var(--forest)" }}>
              Why We&apos;re Taking Our Time
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">Thoughtful standards. Quiet confidence.</h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Quality First",
                body: "Every batch undergoes extensive quality verification before release.",
              },
              {
                title: "Thoughtful Formulation",
                body: "We prioritize effective ingredients and meaningful dosages over marketing trends.",
              },
              {
                title: "Worth Waiting For",
                body: "We&apos;re building an experience that reflects the same standards as the products themselves.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-black/5 bg-white p-6 text-left shadow-[0_16px_50px_-35px_rgba(23,61,36,0.24)] transition hover:-translate-y-0.5"
                style={{ borderColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
              >
                <h3 className="font-display text-xl" style={{ color: "var(--forest)" }}>
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="py-8 text-center text-sm text-muted-foreground">
          Better Was Never Enough.
        </footer>
      </div>
    </main>
  );
}
