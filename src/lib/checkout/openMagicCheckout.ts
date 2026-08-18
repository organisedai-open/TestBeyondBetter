import { toast } from "sonner";

import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/api/checkout.functions";
import { PRODUCT_CATALOG } from "@/lib/product";
import { PRICE_INR } from "@/lib/pricing";
import { trackMetaEvent, trackMetaPurchase } from "@/lib/analytics/trackMetaEvent";
import logoLeaf from "@/assets/logo-leaf.webp";

import { loadMagicCheckoutScript } from "./loadMagicCheckoutScript";
import { isCheckoutInProgress, setCheckoutInProgress } from "./magicCheckoutStore";
import { ORDER_CONFIRMED_PATH, storeConfirmedOrder } from "./orderConfirmation";

function productCustomData(quantity: number, valueInr: number) {
  return {
    content_ids: [PRODUCT_CATALOG.id],
    content_type: "product",
    value: valueInr,
    currency: PRODUCT_CATALOG.currency,
    num_items: quantity,
  };
}

// Single entry point every "Buy"/"Shop" CTA calls. Creates a fresh Razorpay order server-side,
// then opens Magic Checkout (one_click_checkout) for the customer to pick address/payment/COD.
export async function openMagicCheckout(quantity = 1) {
  if (isCheckoutInProgress()) return;
  setCheckoutInProgress(true);

  // Fired the moment the customer commits to buying. There's no separate cart step in this
  // one-click-checkout flow, so this is the closest equivalent to a classic "Add to Cart".
  trackMetaEvent("AddToCart", {
    customData: productCustomData(quantity, PRICE_INR * quantity),
  });

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
        void handleCheckoutCompleted(response, {
          quantity,
          amount: order.amount,
          currency: order.currency,
        });
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

    trackMetaEvent("InitiateCheckout", {
      customData: productCustomData(quantity, order.amount / 100),
    });
  } catch (error) {
    console.error("Failed to open Razorpay Magic Checkout", error);
    toast.error("Couldn't start checkout. Please try again.");
    setCheckoutInProgress(false);
  }
}

interface OrderContext {
  quantity: number;
  /** Paise, as returned by createRazorpayOrder. */
  amount: number;
  currency: string;
}

async function handleCheckoutCompleted(
  response: RazorpayHandlerResponse,
  orderContext: OrderContext,
) {
  try {
    const isPrepaid = Boolean(response.razorpay_payment_id && response.razorpay_signature);

    if (isPrepaid) {
      const { verified } = await verifyRazorpayPayment({
        data: {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id!,
          razorpay_signature: response.razorpay_signature!,
        },
      });

      if (!verified) {
        toast.error(
          "We couldn't verify that payment. If you were charged, please contact support.",
        );
        setCheckoutInProgress(false);
        return;
      }
    }

    trackPurchase(response.razorpay_order_id, orderContext);

    storeConfirmedOrder({
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
      quantity: orderContext.quantity,
      amountPaise: orderContext.amount,
      currency: orderContext.currency,
      paymentMethod: isPrepaid ? "prepaid" : "cod",
    });

    // Full navigation rather than a router push: this module is not a component, and a hard
    // load guarantees the customer lands on the confirmation even if the SPA router is in an
    // odd state after the payment modal closes. Nothing is left in flight to interrupt.
    window.location.assign(ORDER_CONFIRMED_PATH);
    return;
  } catch (error) {
    console.error("Failed to verify Razorpay payment", error);
    toast.error("We couldn't confirm your order. If you were charged, please contact support.");
  }

  setCheckoutInProgress(false);
}

function trackPurchase(razorpayOrderId: string, orderContext: OrderContext) {
  trackMetaPurchase({
    razorpayOrderId,
    value: orderContext.amount / 100,
    currency: orderContext.currency,
    quantity: orderContext.quantity,
    contentId: PRODUCT_CATALOG.id,
  });
}
