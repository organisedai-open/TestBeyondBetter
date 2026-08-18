import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Package, Truck } from "lucide-react";

import { PolicyPageShell, PolicyContent, SupportEmailLink } from "@/components/PolicyPage";
import { PRODUCT_CATALOG } from "@/lib/product";
import { CURRENCY, DISPATCH_NOTE, formatInr } from "@/lib/pricing";
import { type ConfirmedOrder, readConfirmedOrder } from "@/lib/checkout/orderConfirmation";

const borderTint = "color-mix(in oklab, var(--forest) 12%, transparent)";

export const Route = createFileRoute("/order-confirmed")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Beyond Better" },
      // A per-customer transactional page: never index it, and keep it out of the sitemap.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OrderConfirmedPage,
});

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-baseline justify-between gap-6 border-b py-3 last:border-b-0"
      style={{ borderColor: borderTint }}
    >
      <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
      <dd
        className="text-right text-[15px]"
        style={{ color: "color-mix(in oklab, var(--charcoal) 88%, transparent)" }}
      >
        {value}
      </dd>
    </div>
  );
}

function OrderConfirmedPage() {
  // Read on the client only: sessionStorage does not exist during SSR, and rendering the
  // details on the server would produce a hydration mismatch on every load.
  const [order, setOrder] = useState<ConfirmedOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrder(readConfirmedOrder());
    setReady(true);
  }, []);

  const isCod = order?.paymentMethod === "cod";

  return (
    <PolicyPageShell>
      <PolicyContent>
        <div className="pt-16 lg:pt-24">
          <div className="text-center">
            <span
              className="inline-flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "color-mix(in oklab, var(--forest) 10%, transparent)" }}
            >
              <CheckCircle2
                className="h-7 w-7"
                style={{ color: "var(--forest)" }}
                strokeWidth={1.5}
              />
            </span>
            <h1
              className="mt-6 font-display text-[2.4rem] leading-[1.08] sm:text-5xl"
              style={{ color: "var(--forest)" }}
            >
              Order Confirmed
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {isCod
                ? "Your order is placed. Payment will be collected on delivery."
                : "Payment received. Thank you for choosing Beyond Better."}
            </p>
          </div>

          {ready && order ? (
            <div
              className="mx-auto mt-11 max-w-xl rounded-[22px] border bg-white p-8"
              style={{ borderColor: borderTint }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.28em]"
                style={{ color: "var(--forest)" }}
              >
                Order Summary
              </div>
              <dl className="mt-5">
                <DetailRow label="Order ID" value={order.orderId} />
                {order.paymentId && <DetailRow label="Payment ID" value={order.paymentId} />}
                <DetailRow label="Product" value={PRODUCT_CATALOG.name} />
                <DetailRow label="Quantity" value={String(order.quantity)} />
                <DetailRow
                  label={isCod ? "Payable on delivery" : "Amount paid"}
                  value={
                    order.currency === CURRENCY
                      ? formatInr(Math.round(order.amountPaise / 100))
                      : `${order.currency} ${(order.amountPaise / 100).toFixed(2)}`
                  }
                />
              </dl>
            </div>
          ) : ready ? (
            // Direct visit, a new tab, or storage unavailable. The order itself is safe — it
            // lives in Razorpay — so say so plainly rather than implying anything went wrong.
            <div
              className="mx-auto mt-11 max-w-xl rounded-[22px] border bg-white p-8 text-center"
              style={{ borderColor: borderTint }}
            >
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                We don&apos;t have the order details to show in this tab. If your payment went
                through, your order is confirmed and your emailed receipt has the reference — email{" "}
                <SupportEmailLink /> if you need anything.
              </p>
            </div>
          ) : null}

          <div className="mx-auto mt-6 max-w-xl grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border bg-white p-6" style={{ borderColor: borderTint }}>
              <Truck className="h-5 w-5" style={{ color: "var(--forest)" }} strokeWidth={1.5} />
              <div className="mt-3 font-display text-base" style={{ color: "var(--forest)" }}>
                Dispatch
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {DISPATCH_NOTE} Delivery within India typically takes 3–7 business days.
              </p>
            </div>
            <div className="rounded-[22px] border bg-white p-6" style={{ borderColor: borderTint }}>
              <Package className="h-5 w-5" style={{ color: "var(--forest)" }} strokeWidth={1.5} />
              <div className="mt-3 font-display text-base" style={{ color: "var(--forest)" }}>
                What happens next
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                You&apos;ll receive tracking details once your order is dispatched. Need to cancel?
                Email us before dispatch — see the{" "}
                <Link
                  to="/cancellation-policy"
                  className="underline hover:opacity-70"
                  style={{ color: "var(--forest)" }}
                >
                  Cancellation Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm transition hover:opacity-90"
              style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
            >
              Back to Beyond Better <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs text-muted-foreground">
              Questions? <SupportEmailLink />
            </p>
          </div>
        </div>
      </PolicyContent>
    </PolicyPageShell>
  );
}
