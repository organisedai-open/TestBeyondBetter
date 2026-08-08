import type { CSSProperties } from "react";
import { ShieldCheck } from "lucide-react";

import { usePreorderStatus } from "@/lib/checkout/usePreorderStatus";

// Risk-reversal badge shown beside every purchase CTA sitewide: full payment is taken today for
// an order that ships weeks later, so this is the thing near the buy button telling a buyer they
// aren't locked in. Styled as a highlighted pill rather than muted microcopy -- it is a reason to
// buy, not a footnote.
//
// Deliberately carries no link and no date. The full terms live on /cancellation-policy, which is
// linked from the footer of every page, and a hardcoded ship date here would go stale.
//
// Still pre-order gated, same pattern as PriceDisplay: cancellation terms for a later, in-stock
// order aren't confirmed yet (see cancellation-policy.tsx), so this renders nothing once the
// pre-order window closes rather than making a claim that hasn't been signed off.
//
// The outer element takes className/style for positioning only; the badge's own appearance is
// held inside so call-site spacing tweaks can't shrink or fade it.
export function CancellationNote({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const { isPreorderActive } = usePreorderStatus();
  if (!isPreorderActive) return null;

  return (
    <div className={className} style={style}>
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium uppercase leading-none tracking-[0.16em]"
        style={{
          backgroundColor: "color-mix(in oklab, var(--gold) 26%, transparent)",
          color: "var(--forest)",
        }}
      >
        <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
        Free Cancellation
      </span>
    </div>
  );
}
