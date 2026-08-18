import { formatInr, MRP_INR, PRICE_INR } from "@/lib/pricing";

// Single reusable price element used everywhere the site shows the product price.
// Presentation is deliberately price-first and not discount-led: the MRP is a small struck
// through reference beside the live price, and no percentage saving is displayed anywhere.
export function PriceDisplay({
  variant = "block",
  align = "left",
  className = "",
}: {
  variant?: "block" | "inline";
  align?: "left" | "center";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <span className={`inline-flex items-baseline gap-2 ${className}`}>
        <span>{formatInr(PRICE_INR)}</span>
        <span
          className="inline-flex items-baseline gap-1"
          style={{ color: "color-mix(in oklab, currentColor 70%, transparent)" }}
        >
          <span className="text-[9px] uppercase tracking-[0.1em]">MRP</span>
          <span className="line-through">{formatInr(MRP_INR)}</span>
        </span>
      </span>
    );
  }

  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignClass} gap-3 ${className}`}>
      <div className="flex items-baseline gap-3">
        <span
          className="font-display text-4xl md:text-5xl lg:text-[58px]"
          style={{ color: "var(--forest)" }}
        >
          {formatInr(PRICE_INR)}
        </span>
        <span
          className="inline-flex items-baseline gap-1.5"
          style={{ color: "color-mix(in oklab, var(--forest) 70%, transparent)" }}
        >
          <span className="text-[10px] uppercase tracking-[0.14em]">MRP</span>
          <span className="font-display text-[15px] line-through">{formatInr(MRP_INR)}</span>
        </span>
      </div>
    </div>
  );
}
