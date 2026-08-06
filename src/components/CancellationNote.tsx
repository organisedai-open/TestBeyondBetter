import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";

import { usePreorderStatus } from "@/lib/checkout/usePreorderStatus";

// Risk-reversal microcopy shown beside every purchase CTA sitewide (Phase 3): full payment is
// taken today for an order that ships weeks later, so this is the only thing near the buy
// button telling a buyer they aren't stuck if they change their mind before then.
//
// Self-contained and pre-order-gated, same pattern as PriceDisplay: only rendered while
// isPreorderActive, because the "before Aug 20" claim becomes false the moment that date
// passes, and the cancellation terms for a later, in-stock order are not yet confirmed (see
// cancellation-policy.tsx) -- showing nothing is safer than showing a stale or invented claim.
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
    <p className={className} style={{ fontSize: 11, lineHeight: 1.5, opacity: 0.75, ...style }}>
      Free cancellation before Aug 20 ship date —{" "}
      <Link to="/cancellation-policy" className="underline hover:opacity-80">
        see policy →
      </Link>
    </p>
  );
}
