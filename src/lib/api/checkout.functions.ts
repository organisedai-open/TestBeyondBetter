import { createServerFn } from "@tanstack/react-start";
import crypto from "node:crypto";
import { z } from "zod";

import { PRODUCT_CATALOG } from "@/lib/product";

// Server-only. Reads RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET from process.env inside the
// handler (never at module scope) so the values are never bundled into the client and
// always reflect the request-time environment.

const inrToPaise = (rupees: number) => Math.round(rupees * 100);

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(10).default(1),
    }),
  )
  .handler(async ({ data }) => {
    if (data.productId !== PRODUCT_CATALOG.id) {
      throw new Error("Unknown product");
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.error("Razorpay order creation failed: RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET not configured");
      throw new Error("Checkout is not available right now. Please try again shortly.");
    }

    const quantity = data.quantity;
    const unitOfferPricePaise = inrToPaise(PRODUCT_CATALOG.unitPrice);
    const unitMrpPaise = inrToPaise(PRODUCT_CATALOG.unitMrp);
    const lineItemsTotal = unitOfferPricePaise * quantity;
    const receipt = `bb_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;

    const orderPayload = {
      amount: lineItemsTotal,
      currency: PRODUCT_CATALOG.currency,
      receipt,
      line_items_total: lineItemsTotal,
      line_items: [
        {
          type: "ecommerce",
          sku: PRODUCT_CATALOG.sku,
          variant_id: PRODUCT_CATALOG.variantId,
          price: unitMrpPaise,
          offer_price: unitOfferPricePaise,
          quantity,
          name: PRODUCT_CATALOG.name,
          description: PRODUCT_CATALOG.description,
          image_url: PRODUCT_CATALOG.imageUrl,
          product_url: PRODUCT_CATALOG.productUrl,
        },
      ],
      notes: { productId: PRODUCT_CATALOG.id },
    };

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error("Razorpay order creation failed", res.status, errBody);
      throw new Error("Couldn't start checkout. Please try again.");
    }

    const order = (await res.json()) as { id: string; amount: number; currency: string };

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    };
  });

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      razorpay_order_id: z.string().min(1),
      razorpay_payment_id: z.string().min(1),
      razorpay_signature: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("Razorpay payment verification failed: RAZORPAY_KEY_SECRET not configured");
      return { verified: false };
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    const expected = Buffer.from(expectedSignature);
    const actual = Buffer.from(data.razorpay_signature);
    const verified = expected.length === actual.length && crypto.timingSafeEqual(expected, actual);

    return { verified };
  });
