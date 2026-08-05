import { createFileRoute } from "@tanstack/react-router";

import { describeError, log } from "@/lib/integrations/logger";

// Magic Checkout Shipping Info API — the ONLY way a custom (non-plugin) storefront controls
// whether Cash on Delivery is offered.
//
// Razorpay's Dashboard toggle under Magic Checkout -> COD Settings applies to the ecommerce
// plugins (Shopify/WooCommerce) only; their docs state plainly that it "is not applicable for
// custom websites" and that such merchants "can control COD directly through APIs". This site
// is a custom integration, which is why switching COD off in the Dashboard changed nothing.
//
// Razorpay calls this endpoint with the customer's address(es) once they enter a pincode, and
// the `cod` flag we return per shipping method decides whether the COD tile renders in the
// checkout modal. Returning `cod: false` is what actually hides it.
//
// Configure the URL in the Razorpay Dashboard:
//   Magic Checkout -> Platform Setup -> Custom E-Commerce Platform
//     -> Setup & Settings -> Shipping Setup
//     -> Shipping Service type = API
//     -> URL for shipping info = https://www.bebeyondbetter.com/api/razorpay/shipping-info
//
// Razorpay requires this URL to be publicly reachable and unauthenticated, so there is no
// signature check here. That is safe because the endpoint reads nothing and returns only
// static serviceability/fee policy — it exposes no customer or order data.

/**
 * COD kill switch. Off unless the env var is explicitly "true", so COD stays disabled by
 * default and can be restored later by setting RAZORPAY_COD_ENABLED=true in Vercel — no code
 * change or redeploy of this file required.
 */
function isCodEnabled(): boolean {
  return process.env.RAZORPAY_COD_ENABLED === "true";
}

interface IncomingAddress {
  id?: string;
  zipcode?: string;
  state_code?: string;
  country?: string;
}

interface ShippingInfoRequest {
  order_id?: string;
  razorpay_order_id?: string;
  addresses?: IncomingAddress[];
}

/**
 * Single flat-rate method. Shipping is free and the store ships worldwide (see the shipping
 * policy page), so every address is serviceable at zero cost — this preserves exactly the
 * pricing the checkout showed before the Shipping Info API was introduced. `cod_fee` must be
 * 0 whenever `cod` is false, per Razorpay's spec.
 */
function shippingMethodsFor() {
  const cod = isCodEnabled();
  return [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "Free shipping",
      serviceable: true,
      shipping_fee: 0,
      cod,
      cod_fee: 0,
    },
  ];
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function buildResponse(payload: ShippingInfoRequest): Response {
  const addresses = Array.isArray(payload.addresses) ? payload.addresses : [];

  // Echo each address back with its id intact — Razorpay matches the response rows to the
  // addresses it asked about by that id, so it must be preserved verbatim.
  const responseAddresses = addresses.map((address, index) => ({
    id: address.id ?? String(index),
    zipcode: address.zipcode,
    state_code: address.state_code,
    country: address.country,
    shipping_methods: shippingMethodsFor(),
  }));

  log.info("shipping_info.responded", {
    razorpayOrderId: payload.razorpay_order_id,
    addressCount: responseAddresses.length,
    codEnabled: isCodEnabled(),
  });

  return json({ addresses: responseAddresses }, 200);
}

/**
 * Razorpay documents this as a GET that carries a JSON body, which most HTTP clients cannot
 * send — in practice the call arrives as a POST. Both are handled so a change on their side
 * cannot silently break checkout, and an unparseable body still yields a valid (empty) shape
 * rather than a 500 that would stall the checkout modal.
 */
async function handleShippingInfo(request: Request): Promise<Response> {
  let payload: ShippingInfoRequest = {};

  try {
    const rawBody = await request.text();
    if (rawBody) payload = JSON.parse(rawBody) as ShippingInfoRequest;
  } catch (error) {
    log.warn("shipping_info.unparseable_body", describeError(error));
  }

  return buildResponse(payload);
}

export const Route = createFileRoute("/api/razorpay/shipping-info")({
  server: {
    handlers: {
      POST: async ({ request }) => handleShippingInfo(request),
      GET: async ({ request }) => handleShippingInfo(request),
      ANY: async () =>
        new Response("Method Not Allowed", {
          status: 405,
          headers: { allow: "GET, POST" },
        }),
    },
  },
});
