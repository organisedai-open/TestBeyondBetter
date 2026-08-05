import { createFileRoute } from "@tanstack/react-router";

import { fulfilRazorpayOrder } from "@/lib/integrations/fulfillment";
import { describeError, log } from "@/lib/integrations/logger";
import type { RazorpayWebhookEvent } from "@/lib/integrations/razorpay";
import { PermanentError } from "@/lib/integrations/retry";
import {
  RAZORPAY_SIGNATURE_HEADER,
  verifyRazorpayWebhookSignature,
} from "@/lib/integrations/verifyWebhook";

// Razorpay -> Shiprocket webhook endpoint.
//
// Configure this URL in the Razorpay Dashboard (Settings -> Webhooks) against the
// `order.paid` and `payment.captured` events:
//   https://www.bebeyondbetter.com/api/webhooks/razorpay
//
// This is a TanStack Start server route, not a Vercel `/api` function. The app builds
// through Nitro, which emits a Build Output API bundle that Vercel serves exclusively — a
// top-level /api directory would simply never be routed to. Server routes ship inside that
// same bundle and, unlike a bare Vercel function, also run under `vite dev`.

/**
 * Only these two events can mean "money is secured and the parcel should move".
 * `order.paid` carries both entities in one payload; `payment.captured` is subscribed as
 * well because it is the event that fires most reliably in practice, and the idempotency
 * layer makes receiving both for one order a no-op.
 */
const FULFILLABLE_EVENTS = new Set(["order.paid", "payment.captured"]);

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/webhooks/razorpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // The signature is computed over the exact bytes Razorpay sent. Reading the body as
        // text (never request.json()) is mandatory: parsing and re-serialising reorders keys
        // and drops whitespace, which changes the digest and fails every signature.
        const rawBody = await request.text();
        const signature = request.headers.get(RAZORPAY_SIGNATURE_HEADER);

        const verification = verifyRazorpayWebhookSignature(
          rawBody,
          signature,
          process.env.RAZORPAY_WEBHOOK_SECRET,
        );

        if (!verification.valid) {
          if (verification.reason === "missing_secret") {
            // Our misconfiguration, not a bad caller. 500 makes Razorpay redeliver, so
            // orders received during a bad deploy are not lost once the env var is fixed.
            log.error("webhook.secret_missing");
            return json({ error: "Webhook secret not configured" }, 500);
          }

          log.warn("webhook.signature_rejected", { reason: verification.reason });
          return json({ error: "Invalid signature" }, 401);
        }

        let event: RazorpayWebhookEvent;
        try {
          event = JSON.parse(rawBody) as RazorpayWebhookEvent;
        } catch (error) {
          // Signed by us but unparseable — redelivering identical bytes cannot help.
          log.error("webhook.invalid_json", describeError(error));
          return json({ error: "Malformed payload" }, 400);
        }

        const eventName = event.event;
        const orderEntity = event.payload?.order?.entity;
        const paymentEntity = event.payload?.payment?.entity;
        const razorpayOrderId = orderEntity?.id ?? paymentEntity?.order_id;

        log.info("webhook.received", {
          event: eventName,
          razorpayOrderId,
          razorpayPaymentId: paymentEntity?.id,
          paymentMethod: paymentEntity?.method,
        });

        if (!FULFILLABLE_EVENTS.has(eventName)) {
          // 200 so Razorpay stops redelivering something we intentionally do not act on.
          return json({ ignored: true, event: eventName }, 200);
        }

        if (!razorpayOrderId) {
          log.error("webhook.missing_order_id", { event: eventName });
          return json({ error: "No order id in payload" }, 400);
        }

        try {
          const outcome = await fulfilRazorpayOrder(razorpayOrderId, paymentEntity);

          return json(
            outcome.status === "created"
              ? {
                  ok: true,
                  created: true,
                  shiprocketOrderId: outcome.shiprocketOrderId,
                  shipmentId: outcome.shipmentId,
                }
              : { ok: true, created: false, reason: outcome.via },
            200,
          );
        } catch (error) {
          const details = describeError(error);

          // A PermanentError is a payload that will never succeed (address missing a
          // pincode, credentials wrong). Returning 500 would make Razorpay redeliver it
          // every few minutes for 24 hours and bury the real signal, so we ack with 200 and
          // rely on the error log — these need a human, not a retry.
          if (error instanceof PermanentError) {
            log.error("webhook.unrecoverable", { razorpayOrderId, event: eventName, ...details });
            return json({ ok: false, error: "Unrecoverable", detail: details.message }, 200);
          }

          // Anything else is transient (Shiprocket 5xx, network). 500 hands the retry back
          // to Razorpay's own redelivery, which is far more durable than looping in here —
          // and the idempotency layer means the redelivery cannot double-ship.
          log.error("webhook.failed", { razorpayOrderId, event: eventName, ...details });
          return json({ ok: false, error: "Fulfilment failed, will retry" }, 500);
        }
      },

      // Razorpay only ever POSTs. ANY is consulted solely when no handler matches the
      // request method, so this never intercepts the POST above — it just stops probes and
      // misconfigured URLs from falling through to the SSR router and rendering the app.
      ANY: async () =>
        new Response("Method Not Allowed", {
          status: 405,
          headers: { allow: "POST" },
        }),
    },
  },
});
