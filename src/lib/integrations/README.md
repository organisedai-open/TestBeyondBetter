# Razorpay → Shiprocket fulfilment

Automatically creates a Shiprocket order when a Magic Checkout payment succeeds.

```
Razorpay  --webhook-->  /api/webhooks/razorpay
                              |
                        verify HMAC signature (raw body)
                              |
                        GET /v1/orders/:id      <- customer_details lives here, not in the webhook
                              |
                        already fulfilled? -----> 200, stop
                              |
                        POST /orders/create/adhoc (Bearer, cached JWT)
                              |
                        PATCH order notes with shiprocket ids
```

## Files

| File | Role |
| --- | --- |
| `verifyWebhook.ts` | HMAC-SHA256 signature check, timing-safe |
| `razorpay.ts` | Order fetch + notes PATCH, Razorpay entity types |
| `shiprocket.ts` | Login + JWT cache, order creation, duplicate detection |
| `fulfillment.ts` | Razorpay → Shiprocket field mapping and orchestration |
| `idempotency.ts` | The three duplicate-protection layers |
| `retry.ts` | Retryable vs permanent error taxonomy, backoff |
| `logger.ts` | One-line JSON logs, PII masking |

The endpoint itself is `src/routes/api/webhooks/razorpay.ts` — a TanStack Start server
route, **not** a Vercel `/api` function. Nitro emits a Build Output API bundle that Vercel
serves exclusively, so a top-level `/api` directory would never be routed to.

## Environment variables

| Variable | Notes |
| --- | --- |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Already used by checkout; reused to fetch the order |
| `RAZORPAY_WEBHOOK_SECRET` | **Different secret** from `KEY_SECRET` — set when creating the webhook |
| `SHIPROCKET_EMAIL` / `SHIPROCKET_PASSWORD` | An *API user* (Settings → API → Add New API User), not your dashboard login |
| `SHIPROCKET_PICKUP_LOCATION` | Optional, defaults to `Primary`. Must match a nickname under Settings → Company → Pickup Addresses |

## Duplicate protection

The same Razorpay order arrives more than once — `order.paid` and `payment.captured` both
fire, and Razorpay redelivers anything that doesn't get a prompt 2xx. Three layers, keyed on
the Razorpay **order** id (never the payment id — one order is one parcel):

1. **In-memory set** — instant, but only within one warm instance.
2. **Razorpay order notes** — durable across cold starts; read during the order fetch we
   already perform, so it costs nothing extra.
3. **Shiprocket's unique `order_id`** — the atomic backstop. If two instances genuinely race,
   exactly one create succeeds and the other gets a 422 that we treat as success.

Layers 1–2 are latency optimisations. Layer 3 is what actually guarantees correctness, and it
holds even if the first two both miss. No database required.

## Failure handling

- **Transient** (Shiprocket 5xx, network): retried briefly in-process, then a `500` hands the
  retry to Razorpay's own redelivery, which runs for up to 24 hours. Idempotency makes that safe.
- **Permanent** (missing pincode, bad credentials): logged as `webhook.unrecoverable` and
  acked with `200`, because redelivering it every few minutes for a day would bury the signal.
  These need a human.

## Log events

Filter Vercel logs on `"scope":"shiprocket-fulfilment"`. Key events: `webhook.received`,
`webhook.signature_rejected`, `shiprocket.authenticated`, `fulfilment.creating_shipment`,
`fulfilment.shipment_created` (carries shipment id + AWB), `fulfilment.skipped_duplicate`,
`webhook.unrecoverable`, `webhook.failed`.

Customer name/email/phone are masked — enough to match a support ticket, not enough to
identify someone from the log store.

## Known gap: COD

Razorpay's published webhook events are `order.paid`, `payment.authorized`,
`payment.captured` and `payment.failed`. A Magic Checkout **COD** order never reaches
`paid` — it sits in `placed` with a `pending` COD payment — so none of those fire for it.
The mapping code handles COD correctly (`payment_method: "COD"`, COD fee mapped to
`transaction_charges`) if such an event is delivered, but confirm with your Razorpay SPOC
whether a COD notification is available on your account before relying on COD auto-fulfilment.
