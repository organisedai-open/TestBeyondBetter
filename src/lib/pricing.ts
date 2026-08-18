// Single source of truth for product pricing.
//
// The product is live and sold at one fixed price. There is deliberately no date-based
// transition here: the previous pre-order system flipped price and copy automatically on a
// restock timestamp, which meant the amount charged depended on when the request ran. That
// is gone — PRICE_INR is the price, everywhere, until this line is edited.

export const CURRENCY = "INR";

/** Printed MRP. Shown struck through beside the live price, never as the headline. */
export const MRP_INR = 1900;

/**
 * The live selling price, in rupees.
 *
 * Server-authoritative: checkout.functions.ts derives the Razorpay order amount from this
 * constant on the server, so the figure the client renders is display only and a tampered
 * client cannot change what is actually charged.
 */
export const PRICE_INR = 1695;

/** Purchase CTA copy, shared by every buy button on the site. */
export const CTA_LABEL = "Buy Now";

/** Dispatch promise shown beside the price and on the order confirmation. */
export const DISPATCH_NOTE = "Orders dispatched within 1–2 business days.";

/** en-IN grouping: 1695 -> "₹1,695". */
export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
