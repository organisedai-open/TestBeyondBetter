import { usePreorderStatus } from "@/lib/checkout/usePreorderStatus";
import { formatInr, PREORDER_BADGE_LABEL } from "@/lib/pricing";

// Single reusable price element used everywhere the site shows the product price. Reads
// live pre-order/in-stock state, so every instance flips together the moment the restock
// date passes — no per-page logic to keep in sync.
export function PriceDisplay({
  variant = "block",
  align = "left",
  className = "",
}: {
  variant?: "block" | "inline";
  align?: "left" | "center";
  className?: string;
}) {
  const { isPreorderActive, price, mrp } = usePreorderStatus();

  if (variant === "inline") {
    return (
      <span className={`inline-flex items-baseline gap-2 ${className}`}>
        <span className="line-through" style={{ color: "color-mix(in oklab, currentColor 80%, transparent)" }}>
          {formatInr(mrp)}
        </span>
        <span>{formatInr(price)}</span>
      </span>
    );
  }

  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignClass} gap-3 ${className}`}>
      {isPreorderActive && (
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.16em]"
          style={{ backgroundColor: "color-mix(in oklab, var(--gold) 20%, transparent)", color: "var(--forest)" }}
        >
          {PREORDER_BADGE_LABEL}
        </span>
      )}
      <div className="flex items-baseline gap-3">
        <span
          className="font-display text-[15px] line-through"
          style={{ color: "color-mix(in oklab, var(--forest) 80%, transparent)" }}
        >
          {formatInr(mrp)}
        </span>
        <span className="font-display text-4xl md:text-5xl lg:text-[58px]" style={{ color: "var(--forest)" }}>
          {formatInr(price)}
        </span>
      </div>
    </div>
  );
}
