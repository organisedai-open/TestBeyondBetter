import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

import { sendMetaCapiEvent } from "@/lib/integrations/metaCapi.server";
import { fetchRazorpayOrder, getRazorpayCredentials } from "@/lib/integrations/razorpay";
import { PRODUCT_CATALOG } from "@/lib/product";

// Server functions the browser calls right after firing the Pixel event, passing the SAME
// event_id — that shared id is what lets Meta dedupe the browser and server copies of one
// event instead of double-counting it.

const NON_PURCHASE_EVENTS = ["PageView", "ViewContent", "AddToCart", "InitiateCheckout"] as const;

/** IP/User-Agent/cookies must come from the server's view of the request, never the client's. */
function resolveRequestContext() {
  return {
    ip: getRequestIP({ xForwardedFor: true }),
    userAgent: getRequestHeader("user-agent") ?? undefined,
  };
}

/**
 * Set only while verifying in Meta's Test Events tool (see testing instructions) — never
 * required in normal production traffic, so this is a server-only env var the client never
 * needs to know about.
 */
function resolveTestEventCode(): string | undefined {
  return process.env.META_TEST_EVENT_CODE || undefined;
}

export const sendMetaEvent = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      eventName: z.enum(NON_PURCHASE_EVENTS),
      eventId: z.string().min(1),
      eventSourceUrl: z.string().min(1),
      customData: z.record(z.unknown()).optional(),
      fbp: z.string().optional(),
      fbc: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { ip, userAgent } = resolveRequestContext();

    await sendMetaCapiEvent(
      {
        eventName: data.eventName,
        eventId: data.eventId,
        eventSourceUrl: data.eventSourceUrl,
        customData: data.customData,
        userData: {
          clientIpAddress: ip,
          clientUserAgent: userAgent,
          fbp: data.fbp ?? getCookie("_fbp"),
          fbc: data.fbc ?? getCookie("_fbc"),
        },
      },
      resolveTestEventCode(),
    );

    return { ok: true };
  });

export const sendMetaPurchaseEvent = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      eventId: z.string().min(1),
      eventSourceUrl: z.string().min(1),
      razorpayOrderId: z.string().min(1),
      value: z.number().nonnegative(),
      currency: z.string().min(1),
      quantity: z.number().int().min(1),
      fbp: z.string().optional(),
      fbc: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { ip, userAgent } = resolveRequestContext();

    // Best-effort enrichment: Razorpay's order carries the customer's email/phone/address
    // (Magic Checkout collects it, our own site never sees a checkout form). Pulling it in
    // here is what makes Purchase match quality meaningfully better than the other events,
    // which have no customer identity to hash at all. A lookup failure must never drop the
    // Purchase event itself — a weakly-matched Purchase beats a missing one.
    let email: string | undefined;
    let phone: string | undefined;
    let name: string | undefined;
    let city: string | undefined;
    let state: string | undefined;
    let zip: string | undefined;
    let country: string | undefined;

    try {
      const credentials = getRazorpayCredentials();
      const order = await fetchRazorpayOrder(data.razorpayOrderId, credentials);
      const details = order.customer_details;
      const address = details?.shipping_address ?? details?.billing_address;

      email = details?.email;
      phone = details?.contact ?? address?.contact;
      name = address?.name ?? details?.name;
      city = address?.city;
      state = address?.state;
      zip = address?.zipcode;
      country = address?.country;
    } catch (error) {
      console.error(
        "meta-capi.purchase_enrichment_failed",
        data.razorpayOrderId,
        error instanceof Error ? error.message : error,
      );
    }

    await sendMetaCapiEvent(
      {
        eventName: "Purchase",
        eventId: data.eventId,
        eventSourceUrl: data.eventSourceUrl,
        customData: {
          value: data.value,
          currency: data.currency,
          content_ids: [PRODUCT_CATALOG.id],
          content_type: "product",
          num_items: data.quantity,
        },
        userData: {
          clientIpAddress: ip,
          clientUserAgent: userAgent,
          fbp: data.fbp ?? getCookie("_fbp"),
          fbc: data.fbc ?? getCookie("_fbc"),
          email,
          phone,
          name,
          city,
          state,
          zip,
          country,
        },
      },
      resolveTestEventCode(),
    );

    return { ok: true };
  });
