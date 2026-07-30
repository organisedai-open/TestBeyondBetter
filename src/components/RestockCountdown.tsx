import { useEffect, useState } from "react";

import { RESTOCK_AT_UTC } from "@/lib/pricing";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeRemaining(): Remaining | null {
  const ms = RESTOCK_AT_UTC.getTime() - Date.now();
  if (ms <= 0) return null;
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

// Ticks every second purely for the visible digits — the pre-order/in-stock mode switch
// itself is driven separately (see usePreorderStatus) so CTA copy and pricing stay correct
// even on pages that never mount this component.
function useRemaining() {
  const [remaining, setRemaining] = useState<Remaining | null>(computeRemaining);
  useEffect(() => {
    const id = setInterval(() => setRemaining(computeRemaining()), 1000);
    return () => clearInterval(id);
  }, []);
  return remaining;
}

const UNITS: { key: keyof Remaining; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export function RestockCountdown({
  variant = "hero",
  className = "",
}: {
  variant?: "hero" | "compact";
  className?: string;
}) {
  const remaining = useRemaining();
  if (!remaining) return null;

  const numberSize = variant === "hero" ? "text-2xl md:text-3xl" : "text-base";
  const labelSize = variant === "hero" ? "text-[9px]" : "text-[8px]";
  const gap = variant === "hero" ? "gap-3 md:gap-4" : "gap-2";

  return (
    <div
      aria-hidden="true"
      className={`flex items-start ${gap} ${className}`}
      style={{ color: variant === "hero" ? "#1f3a2a" : "var(--forest)" }}
    >
      {UNITS.map((unit, i) => (
        <div key={unit.key} className="flex items-start">
          <div className="flex flex-col items-center">
            <span className={`font-display tabular-nums ${numberSize}`} style={{ fontWeight: 500, letterSpacing: "-0.01em" }}>
              {pad(remaining[unit.key])}
            </span>
            <span
              className={`${labelSize} mt-1 uppercase`}
              style={{ letterSpacing: "0.18em", opacity: 0.62, fontWeight: 500 }}
            >
              {unit.label}
            </span>
          </div>
          {i < UNITS.length - 1 && (
            <span
              className={`font-display ${numberSize} px-1 md:px-1.5`}
              style={{ opacity: 0.3, fontWeight: 300 }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
