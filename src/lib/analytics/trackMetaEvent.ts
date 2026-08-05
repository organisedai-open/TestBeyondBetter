import { sendMetaEvent, sendMetaPurchaseEvent } from "./metaEvents.functions";
import { generateEventId, getFbc, getFbp } from "./metaBrowserIds";

// The single entry point every component uses to fire a Meta event. Both the browser Pixel
// call and the server-side Conversions API call are fired with the SAME event_id, which is
// the field Meta uses to dedupe the two copies of one event into one.
//
// The server call is fire-and-forget from the caller's perspective — it never blocks or can
// fail the UI action it's attached to (a Buy click, a page view). Failures are logged
// server-side (see metaCapi.server.ts) and swallowed here.

export type MetaStandardEvent = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout";

interface TrackOptions {
  customData?: Record<string, unknown>;
}

function getFbq(): ((...args: unknown[]) => void) | undefined {
  if (typeof window === "undefined") return undefined;
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  return typeof fbq === "function" ? fbq : undefined;
}

function currentUrl(): string {
  return typeof window !== "undefined" ? window.location.href : "";
}

/** Fires one of the four non-Purchase standard events. Returns the event_id used, in case the caller wants it. */
export function trackMetaEvent(eventName: MetaStandardEvent, options: TrackOptions = {}): string {
  const eventId = generateEventId();
  const eventSourceUrl = currentUrl();
  const customData = options.customData ?? {};

  getFbq()?.("track", eventName, customData, { eventID: eventId });

  void sendMetaEvent({
    data: {
      eventName,
      eventId,
      eventSourceUrl,
      customData,
      fbp: getFbp(),
      fbc: getFbc(),
    },
  }).catch((error) => {
    console.error(`Meta CAPI ${eventName} failed`, error);
  });

  return eventId;
}

/**
 * Fires Purchase. Separate from trackMetaEvent because the server side enriches user_data
 * with the customer's hashed email/phone/address pulled from the Razorpay order — Purchase
 * is the one event in this checkout flow where that customer identity actually exists.
 */
export function trackMetaPurchase(params: {
  razorpayOrderId: string;
  value: number;
  currency: string;
  quantity: number;
  contentId: string;
}): string {
  const eventId = generateEventId();
  const eventSourceUrl = currentUrl();
  const customData = {
    value: params.value,
    currency: params.currency,
    content_ids: [params.contentId],
    content_type: "product",
    num_items: params.quantity,
  };

  getFbq()?.("track", "Purchase", customData, { eventID: eventId });

  void sendMetaPurchaseEvent({
    data: {
      eventId,
      eventSourceUrl,
      razorpayOrderId: params.razorpayOrderId,
      value: params.value,
      currency: params.currency,
      quantity: params.quantity,
      fbp: getFbp(),
      fbc: getFbc(),
    },
  }).catch((error) => {
    console.error("Meta CAPI Purchase failed", error);
  });

  return eventId;
}
