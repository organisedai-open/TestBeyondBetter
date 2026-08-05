import { PRODUCT_CATALOG } from "@/lib/product";
import { getActivePriceInr } from "@/lib/pricing";

import {
  buildFulfilmentNotes,
  markProcessedInMemory,
  readFulfilmentMarker,
  wasProcessedInMemory,
} from "./idempotency";
import { describeError, log, maskEmail, maskName, maskPhone } from "./logger";
import {
  type RazorpayAddress,
  type RazorpayOrder,
  type RazorpayPayment,
  fetchRazorpayOrder,
  getRazorpayCredentials,
  normalizeNotes,
  patchRazorpayOrderNotes,
} from "./razorpay";
import { PermanentError } from "./retry";
import {
  type ShiprocketOrderPayload,
  createShiprocketOrder,
  getShiprocketPickupLocation,
} from "./shiprocket";

// Translates a paid Razorpay Magic Checkout order into a Shiprocket shipment.
//
// Everything about the shipment is derived from Razorpay's copy of the order rather than
// from the webhook body, so a redelivery days later still produces the correct address.

export type FulfilmentOutcome =
  | { status: "created"; shiprocketOrderId: number; shipmentId: number; awbCode?: string | null }
  | { status: "already_fulfilled"; via: "memory" | "razorpay_notes" | "shiprocket_duplicate" };

const paiseToRupees = (paise: number) => Math.round(paise) / 100;

/** Shiprocket wants a bare 10-digit Indian number; Razorpay hands back `+919100000000`. */
function normalizePhone(raw: string | undefined): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

/**
 * Razorpay returns ISO-ish country codes (`in`); Shiprocket expects the country *name*.
 * Only the codes this store can actually ship to need to resolve — anything else is passed
 * through so an unexpected value surfaces in Shiprocket's own validation error rather than
 * being silently rewritten to the wrong country.
 */
function toCountryName(code: string | undefined): string {
  const normalized = (code ?? "").trim().toLowerCase();
  if (!normalized) return "India";
  if (normalized === "in" || normalized === "ind" || normalized === "india") return "India";
  return code!.trim();
}

/** `KARNATAKA` -> `Karnataka`. Razorpay upper-cases states; Shiprocket matches on name. */
function toTitleCase(value: string | undefined): string {
  if (!value) return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function splitName(fullName: string | undefined): { first: string; last: string } {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

/**
 * Shiprocket's `order_date` is a naive local timestamp with no offset, and Shiprocket
 * operates in IST — formatting in UTC would backdate every evening order by a day.
 */
function formatOrderDateIst(unixSeconds: number): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(unixSeconds * 1000));

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

/**
 * Quantity is recorded in the order notes at checkout time (see checkout.functions.ts).
 * Orders placed before that existed fall back to dividing the line-item total by the unit
 * price that was active *when the order was created* — pricing is purely a function of
 * time, so this reconstructs the historical price correctly even across the restock
 * boundary, rather than using today's price and mis-deriving the count.
 */
function resolveQuantity(order: RazorpayOrder, notes: Record<string, string>): number {
  const fromNotes = Number.parseInt(notes.quantity ?? "", 10);
  if (Number.isFinite(fromNotes) && fromNotes > 0) return fromNotes;

  const lineItemsTotal = order.line_items_total;
  if (lineItemsTotal && lineItemsTotal > 0) {
    const unitPricePaise = getActivePriceInr(new Date(order.created_at * 1000)) * 100;
    const derived = Math.round(lineItemsTotal / unitPricePaise);
    if (derived > 0) return derived;
  }

  log.warn("fulfilment.quantity_fallback", { razorpayOrderId: order.id });
  return 1;
}

/** Goods value only — shipping and COD fees are declared separately on the Shiprocket payload. */
function resolveSubTotalRupees(order: RazorpayOrder): number {
  if (order.line_items_total && order.line_items_total > 0) {
    return paiseToRupees(order.line_items_total);
  }
  const fees = (order.shipping_fee ?? 0) + (order.cod_fee ?? 0);
  return paiseToRupees(Math.max(order.amount - fees, 0));
}

function resolvePaymentMethod(
  order: RazorpayOrder,
  payment: RazorpayPayment | undefined,
): "Prepaid" | "COD" {
  if (payment?.method === "cod") return "COD";
  // Magic Checkout leaves COD orders in `placed` with nothing paid; prepaid ones reach `paid`.
  if (order.status === "placed" || order.amount_paid === 0) return "COD";
  return "Prepaid";
}

function requireAddress(order: RazorpayOrder): RazorpayAddress {
  const details = order.customer_details;
  const address = details?.shipping_address ?? details?.billing_address;

  if (!address) {
    throw new PermanentError(
      `Razorpay order ${order.id} has no customer_details address — cannot create a shipment. ` +
        `This usually means the order was not placed through Magic Checkout.`,
    );
  }
  return address;
}

export function buildShiprocketPayload(
  order: RazorpayOrder,
  payment: RazorpayPayment | undefined,
): ShiprocketOrderPayload {
  const notes = normalizeNotes(order.notes);
  const address = requireAddress(order);
  const details = order.customer_details;

  const { first, last } = splitName(address.name ?? details?.name);
  const phone = normalizePhone(address.contact ?? details?.contact ?? payment?.contact);
  const email = details?.email ?? payment?.email ?? "";
  const pincode = (address.zipcode ?? "").trim();
  const quantity = resolveQuantity(order, notes);
  const subTotal = resolveSubTotalRupees(order);

  // Fail loudly and permanently on missing essentials. These can never be fixed by a retry,
  // and a shipment created with a blank pincode is worse than no shipment: it silently
  // becomes an undeliverable package instead of an alert.
  const missing: string[] = [];
  if (!first) missing.push("customer name");
  if (!address.line1) missing.push("address line1");
  if (!address.city) missing.push("city");
  if (!address.state) missing.push("state");
  if (pincode.length !== 6) missing.push("6-digit pincode");
  if (phone.length !== 10) missing.push("10-digit phone");

  if (missing.length > 0) {
    throw new PermanentError(
      `Razorpay order ${order.id} is missing required shipping fields: ${missing.join(", ")}`,
    );
  }

  const unitPrice = quantity > 0 ? subTotal / quantity : subTotal;

  return {
    order_id: order.id,
    order_date: formatOrderDateIst(order.created_at),
    pickup_location: getShiprocketPickupLocation(),
    comment: order.receipt ? `Razorpay receipt ${order.receipt}` : undefined,

    billing_customer_name: first,
    billing_last_name: last,
    billing_address: address.line1!,
    billing_address_2: address.line2 || undefined,
    billing_city: toTitleCase(address.city),
    billing_pincode: pincode,
    billing_state: toTitleCase(address.state),
    billing_country: toCountryName(address.country),
    billing_email: email,
    billing_phone: phone,
    shipping_is_billing: true,

    order_items: [
      {
        name: PRODUCT_CATALOG.name,
        sku: PRODUCT_CATALOG.sku,
        units: quantity,
        // Shiprocket types selling_price as a string and reads it as the per-unit price.
        selling_price: unitPrice.toFixed(2),
      },
    ],

    payment_method: resolvePaymentMethod(order, payment),
    shipping_charges: paiseToRupees(order.shipping_fee ?? 0),
    giftwrap_charges: 0,
    transaction_charges: paiseToRupees(order.cod_fee ?? 0),
    total_discount: 0,
    sub_total: subTotal,

    // Physical parcel, not the product itself — see PRODUCT_CATALOG.parcel.
    length: PRODUCT_CATALOG.parcel.lengthCm,
    breadth: PRODUCT_CATALOG.parcel.breadthCm,
    height: PRODUCT_CATALOG.parcel.heightCm,
    weight: Number(((PRODUCT_CATALOG.weightGrams * quantity) / 1000).toFixed(3)),
  };
}

/**
 * Idempotent end-to-end fulfilment for one Razorpay order.
 * Safe to call repeatedly with the same order id — see idempotency.ts for the layering.
 */
export async function fulfilRazorpayOrder(
  razorpayOrderId: string,
  payment: RazorpayPayment | undefined,
): Promise<FulfilmentOutcome> {
  if (wasProcessedInMemory(razorpayOrderId)) {
    log.info("fulfilment.skipped_duplicate", { razorpayOrderId, via: "memory" });
    return { status: "already_fulfilled", via: "memory" };
  }

  const credentials = getRazorpayCredentials();
  const order = await fetchRazorpayOrder(razorpayOrderId, credentials);
  const notes = normalizeNotes(order.notes);

  const marker = readFulfilmentMarker(notes);
  if (marker) {
    markProcessedInMemory(razorpayOrderId);
    log.info("fulfilment.skipped_duplicate", {
      razorpayOrderId,
      via: "razorpay_notes",
      shiprocketOrderId: marker.shiprocketOrderId,
    });
    return { status: "already_fulfilled", via: "razorpay_notes" };
  }

  const payload = buildShiprocketPayload(order, payment);

  log.info("fulfilment.creating_shipment", {
    razorpayOrderId,
    paymentMethod: payload.payment_method,
    units: payload.order_items[0]?.units,
    subTotal: payload.sub_total,
    pickupLocation: payload.pickup_location,
    customerName: maskName(`${payload.billing_customer_name} ${payload.billing_last_name}`),
    customerEmail: maskEmail(payload.billing_email),
    customerPhone: maskPhone(payload.billing_phone),
    city: payload.billing_city,
    state: payload.billing_state,
    pincode: payload.billing_pincode,
  });

  const result = await createShiprocketOrder(payload);

  if (!result.created || !result.response) {
    // Shiprocket rejected it as a duplicate — another delivery of this webhook already won.
    markProcessedInMemory(razorpayOrderId);
    return { status: "already_fulfilled", via: "shiprocket_duplicate" };
  }

  const {
    order_id: shiprocketOrderId,
    shipment_id: shipmentId,
    awb_code: awbCode,
  } = result.response;

  markProcessedInMemory(razorpayOrderId);

  log.info("fulfilment.shipment_created", {
    razorpayOrderId,
    shiprocketOrderId,
    shipmentId,
    awbCode: awbCode ?? null,
    courierName: result.response.courier_name ?? null,
    status: result.response.status ?? null,
  });

  // Durable idempotency marker. Best-effort: the shipment already exists at this point, and
  // Shiprocket's unique order_id still blocks a duplicate if this write is lost.
  try {
    await patchRazorpayOrderNotes(
      razorpayOrderId,
      buildFulfilmentNotes(notes, shiprocketOrderId, shipmentId),
      credentials,
    );
  } catch (error) {
    log.warn("fulfilment.note_write_failed", {
      razorpayOrderId,
      shiprocketOrderId,
      ...describeError(error),
    });
  }

  return { status: "created", shiprocketOrderId, shipmentId, awbCode };
}
