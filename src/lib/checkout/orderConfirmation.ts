// Hand-off between the checkout handler and the /order-confirmed page.
//
// Deliberately sessionStorage rather than a server lookup: the site has no customer accounts,
// so an "fetch order by id" endpoint would let anyone holding (or guessing) a Razorpay order
// id read another customer's order. Everything shown on the confirmation page is already
// known to this browser at the moment payment succeeds, so passing it in-session exposes
// nothing new and adds no endpoint to defend.
//
// Session-scoped on purpose: the confirmation survives the redirect and a refresh, and is gone
// when the tab closes.

export const ORDER_CONFIRMED_PATH = "/order-confirmed";

const STORAGE_KEY = "bb:confirmed-order";

export interface ConfirmedOrder {
  orderId: string;
  paymentId?: string;
  quantity: number;
  /** Order total in paise, as returned by createRazorpayOrder. */
  amountPaise: number;
  currency: string;
  /** COD orders reach the handler with no payment id — nothing is captured upfront. */
  paymentMethod: "prepaid" | "cod";
}

export function storeConfirmedOrder(order: ConfirmedOrder): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Private mode / storage disabled. The redirect still happens; the page falls back to its
    // generic confirmation rather than failing after the customer has already paid.
  }
}

export function readConfirmedOrder(): ConfirmedOrder | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConfirmedOrder;
    return parsed && typeof parsed.orderId === "string" ? parsed : null;
  } catch {
    return null;
  }
}
