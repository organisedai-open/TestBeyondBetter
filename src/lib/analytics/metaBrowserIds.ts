// Client-safe helpers for the Meta browser identifiers and the shared dedup event_id.
// No secrets here — safe to import from client components.

export function generateEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getFbp(): string | undefined {
  return readCookie("_fbp");
}

/**
 * Reads the `_fbc` cookie the Pixel sets, falling back to constructing it from a `fbclid`
 * query param when the cookie hasn't landed yet — e.g. the very first pageview immediately
 * after a click-through from a Meta ad, before fbevents.js has had a chance to set it.
 * Format per Meta's docs: `fb.<subdomain_index>.<creation_time_ms>.<fbclid>`.
 */
export function getFbc(): string | undefined {
  const existing = readCookie("_fbc");
  if (existing) return existing;

  if (typeof window === "undefined") return undefined;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return undefined;

  return `fb.1.${Date.now()}.${fbclid}`;
}
