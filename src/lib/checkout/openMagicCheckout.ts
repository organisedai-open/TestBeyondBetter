import { toast } from "sonner";

import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/api/checkout.functions";
import { PRODUCT_CATALOG } from "@/lib/product";
import logoLeaf from "@/assets/logo-leaf.webp";

import { loadMagicCheckoutScript } from "./loadMagicCheckoutScript";
import { isCheckoutInProgress, setCheckoutInProgress } from "./magicCheckoutStore";

// Single entry point every "Buy"/"Shop" CTA calls. Creates a fresh Razorpay order server-side,
// then opens Magic Checkout (one_click_checkout) for the customer to pick address/payment/COD.
export async function openMagicCheckout(quantity = 1) {
  if (isCheckoutInProgress()) return;
  setCheckoutInProgress(true);

  try {
    const [order] = await Promise.all([
      createRazorpayOrder({ data: { productId: PRODUCT_CATALOG.id, quantity } }),
      loadMagicCheckoutScript(),
    ]);

    if (!window.Razorpay) {
      throw new Error("Razorpay checkout is unavailable");
    }

    const razorpay = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "Beyond Better",
      description: PRODUCT_CATALOG.name,
      image: logoLeaf,
      one_click_checkout: true,
      handler: (response) => {
        void handleCheckoutCompleted(response);
      },
      modal: {
        ondismiss: () => setCheckoutInProgress(false),
      },
    });

    razorpay.on("payment.failed", () => {
      toast.error("Payment failed. Please try again.");
      setCheckoutInProgress(false);
    });

    razorpay.open();
  } catch (error) {
    console.error("Failed to open Razorpay Magic Checkout", error);
    toast.error("Couldn't start checkout. Please try again.");
    setCheckoutInProgress(false);
  }
}

async function handleCheckoutCompleted(response: RazorpayHandlerResponse) {
  try {
    if (response.razorpay_payment_id && response.razorpay_signature) {
      const { verified } = await verifyRazorpayPayment({
        data: {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        },
      });

      if (verified) {
        toast.success("Payment received — your order is confirmed!");
      } else {
        toast.error("We couldn't verify that payment. If you were charged, please contact support.");
      }
    } else {
      // COD orders placed through Magic Checkout without an upfront payment.
      toast.success("Order placed! We'll send a confirmation shortly.");
    }
  } catch (error) {
    console.error("Failed to verify Razorpay payment", error);
    toast.error("We couldn't confirm your order. If you were charged, please contact support.");
  } finally {
    setCheckoutInProgress(false);
  }
}
