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

  const numberColor = variant === "hero" ? "#1f3a2a" : "var(--forest)";
  // Solid, WCAG-AA-checked colors rather than opacity dimming — opacity multiplies against
  // whatever sits behind it, which silently drops below 4.5:1 on the cream/ivory
  // backgrounds this renders on.
  const captionColor = variant === "hero" ? "#4a5a4f" : "color-mix(in oklab, var(--forest) 78%, transparent)";
  const colonColor = variant === "hero" ? "#5c6b60" : "color-mix(in oklab, var(--forest) 60%, transparent)";

  return (
    <div className={`flex items-start ${gap} ${className}`}>
      {UNITS.map((unit, i) => (
        <div key={unit.key} className="flex items-start">
          <div className="flex flex-col items-center">
            <span
              className={`font-display tabular-nums ${numberSize}`}
              style={{ fontWeight: 500, letterSpacing: "-0.01em", color: numberColor }}
              // The rendered digit legitimately differs by up to a second between the
              // server-rendered HTML and the client's first paint (it's a live clock) —
              // this is React's documented, sanctioned case for suppressHydrationWarning
              // rather than a real markup mismatch.
              suppressHydrationWarning
            >
              {pad(remaining[unit.key])}
            </span>
            <span
              className={`${labelSize} mt-1 uppercase`}
              style={{ letterSpacing: "0.18em", fontWeight: 500, color: captionColor }}
            >
              {unit.label}
            </span>
          </div>
          {i < UNITS.length - 1 && (
            <span
              className={`font-display ${numberSize} px-1 md:px-1.5`}
              style={{ fontWeight: 300, color: colonColor }}
              aria-hidden="true"
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
