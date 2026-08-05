// Single source of truth for pre-order pricing and the restock transition.
// Both the server (authoritative checkout amount) and the client (reactive display,
// countdown) derive everything from RESTOCK_AT_UTC — change this one line if the exact
// restock date/time needs to move, nothing else needs to change.
//
// 2026-08-20T00:00:00 IST (UTC+5:30) expressed as a fixed UTC instant so the comparison
// is correct regardless of the visitor's (or server's) local timezone.
export const RESTOCK_AT_UTC = new Date("2026-08-19T18:30:00.000Z");

// Calendar date (IST) for schema.org date fields — availabilityStarts / priceValidUntil.
export const RESTOCK_DATE_ISO = "2026-08-20";

export const CURRENCY = "INR";
export const MRP_INR = 1900;
export const PREORDER_PRICE_INR = 969;
export const POST_LAUNCH_PRICE_INR = 990;

/**
 * Derived, never hardcoded — the headline discount is the one number a customer can check
 * against the two prices shown next to it, so it must not be able to drift from them. Change
 * PREORDER_PRICE_INR above and every "Save X%" on the site follows.
 */
export const PREORDER_DISCOUNT_PCT = Math.round((1 - PREORDER_PRICE_INR / MRP_INR) * 100);

export const PREORDER_CTA_LABEL = `Pre-Order Now — Save ${PREORDER_DISCOUNT_PCT}%`;
export const IN_STOCK_CTA_LABEL = "Buy Now";
// Deliberately does NOT name the post-restock price: the badge sits directly beside the
// struck-through MRP and the live price, and a third number there read as clutter.
export const PREORDER_BADGE_LABEL = `Pre-Order · Save ${PREORDER_DISCOUNT_PCT}%`;
export const PREORDER_RESTOCK_CAPTION =
  "Restocking August 20 — pre-order now to guarantee yours from the first batch.";
export const PREORDER_FULL_PAYMENT_NOTE =
  "Charged in full today. Ships from the first batch, August 20, 2026.";

export function isPreorderActive(now: Date = new Date()): boolean {
  return now.getTime() < RESTOCK_AT_UTC.getTime();
}

export function getActivePriceInr(now: Date = new Date()): number {
  return isPreorderActive(now) ? PREORDER_PRICE_INR : POST_LAUNCH_PRICE_INR;
}

export function formatInr(amount: number): string {
  return `₹${amount}`;
}
