import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, FileText, RotateCcw, Ban, Truck } from "lucide-react";

import {
  PolicyPageShell,
  PolicyHero,
  PolicyContent,
  WhoWeAreBlock,
  TrustBadges,
} from "@/components/PolicyPage";
import { POLICY_PAGES, buildPoliciesHubHead } from "@/lib/seo";

const POLICY_ICONS: Record<string, typeof Shield> = {
  "/privacy-policy": Shield,
  "/terms-and-conditions": FileText,
  "/refund-policy": RotateCcw,
  "/cancellation-policy": Ban,
  "/shipping-policy": Truck,
};

export const Route = createFileRoute("/policies")({
  head: () => buildPoliciesHubHead(),
  component: PoliciesHubPage,
});

function PoliciesHubPage() {
  return (
    <PolicyPageShell>
      <PolicyHero
        eyebrow="Legal"
        title="Policies"
        lastUpdated="August 2026"
        readingTime="1 min read"
        intro="Everything covering how Beyond Better handles your data, orders, refunds, cancellations and shipping — in one place."
        breadcrumbLabel="Policies"
      />
      <PolicyContent>
        <div className="mb-11">
          <TrustBadges />
        </div>
        <WhoWeAreBlock />

        <div className="grid gap-4 sm:grid-cols-2">
          {POLICY_PAGES.map((p) => {
            const Icon = POLICY_ICONS[p.path];
            return (
              <Link
                key={p.path}
                to={p.path}
                className="group flex items-center justify-between gap-4 rounded-[22px] border bg-white p-6 transition hover:shadow-[0_20px_60px_-40px_rgba(23,61,36,0.35)]"
                style={{ borderColor: "color-mix(in oklab, var(--forest) 12%, transparent)" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "color-mix(in oklab, var(--forest) 10%, transparent)",
                    }}
                  >
                    <Icon className="h-[18px] w-[18px]" style={{ color: "var(--forest)" }} />
                  </div>
                  <span className="font-display text-lg" style={{ color: "var(--forest)" }}>
                    {p.label}
                  </span>
                </div>
                <ArrowRight
                  className="h-4 w-4 flex-shrink-0 transition group-hover:translate-x-1"
                  style={{ color: "var(--forest)" }}
                />
              </Link>
            );
          })}
        </div>
      </PolicyContent>
    </PolicyPageShell>
  );
}
