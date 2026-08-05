import { classifyHttpFailure, withRetry } from "./retry";

// Razorpay REST client for the webhook path.
//
// Why we re-fetch the order instead of trusting the webhook body: the `order.paid` payload
// carries the *plain* order entity (id/amount/status/notes) — it does NOT include the
// `customer_details` block that Magic Checkout attaches, which is the only place the
// shipping address lives. `GET /v1/orders/:id` does return it. Re-fetching also means the
// address we ship to is read from Razorpay at fulfilment time rather than from a payload
// that could be a stale redelivery.

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

export interface RazorpayAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  name?: string;
  contact?: string;
  tag?: string;
  type?: string;
}

export interface RazorpayCustomerDetails {
  name?: string;
  email?: string;
  contact?: string;
  shipping_address?: RazorpayAddress;
  billing_address?: RazorpayAddress;
}

export interface RazorpayOrder {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt?: string;
  /** `paid` for prepaid Magic Checkout orders, `placed` for COD ones. */
  status: string;
  attempts: number;
  /** Razorpay returns `[]` (not `{}`) when there are no notes. */
  notes?: Record<string, string> | never[];
  created_at: number;
  line_items_total?: number;
  shipping_fee?: number;
  cod_fee?: number;
  customer_details?: RazorpayCustomerDetails;
}

export interface RazorpayPayment {
  id: string;
  entity: "payment";
  amount: number;
  currency: string;
  /** `captured` for prepaid, `pending` for COD. */
  status: string;
  order_id: string;
  /** `cod` | `upi` | `card` | `netbanking` | `wallet` */
  method: string;
  captured: boolean;
  email?: string;
  contact?: string;
  created_at: number;
}

export interface RazorpayWebhookEvent {
  entity: "event";
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    order?: { entity: RazorpayOrder };
    payment?: { entity: RazorpayPayment };
  };
  created_at: number;
}

export interface RazorpayCredentials {
  keyId: string;
  keySecret: string;
}

/**
 * Read credentials at call time, never at module scope — this codebase targets runtimes
 * (Cloudflare Workers via the default Nitro preset) where env binds per request, so a
 * module-level read resolves to undefined. See src/lib/config.server.ts.
 */
export function getRazorpayCredentials(): RazorpayCredentials {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not configured");
  }
  return { keyId, keySecret };
}

function authHeader({ keyId, keySecret }: RazorpayCredentials): string {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export async function fetchRazorpayOrder(
  orderId: string,
  credentials: RazorpayCredentials,
): Promise<RazorpayOrder> {
  return withRetry(
    async () => {
      const res = await fetch(`${RAZORPAY_API_BASE}/orders/${orderId}`, {
        headers: { Authorization: authHeader(credentials) },
      });

      if (!res.ok) {
        throw classifyHttpFailure(
          res.status,
          await res.text().catch(() => ""),
          "Razorpay order fetch",
        );
      }

      return (await res.json()) as RazorpayOrder;
    },
    { operation: "razorpay.fetchOrder", context: { razorpayOrderId: orderId } },
  );
}

/** Razorpay returns `[]` for empty notes, which breaks spreads — normalise to an object. */
export function normalizeNotes(notes: RazorpayOrder["notes"]): Record<string, string> {
  if (!notes || Array.isArray(notes)) return {};
  return notes;
}

/**
 * Writes fulfilment state back onto the Razorpay order's notes.
 *
 * This is what makes idempotency survive a cold start: the note is read back during the
 * order fetch we already perform, so a redelivery hours later still sees "already shipped"
 * without us running a database. `PATCH /v1/orders/:id` replaces the whole notes object,
 * so callers must pass the merged set, and Razorpay caps notes at 15 keys x 256 chars.
 *
 * Best-effort by design: if this write fails the order is already in Shiprocket, and
 * failing the webhook over a bookkeeping write would cause a pointless redelivery. The
 * duplicate-detection layer in shiprocket.ts is what actually guarantees no double
 * shipment, so losing this note degrades observability, not correctness.
 */
export async function patchRazorpayOrderNotes(
  orderId: string,
  notes: Record<string, string>,
  credentials: RazorpayCredentials,
): Promise<void> {
  const res = await fetch(`${RAZORPAY_API_BASE}/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      Authorization: authHeader(credentials),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  });

  if (!res.ok) {
    throw classifyHttpFailure(
      res.status,
      await res.text().catch(() => ""),
      "Razorpay order notes update",
    );
  }
}
