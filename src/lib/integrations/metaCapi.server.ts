import crypto from "node:crypto";

// Reusable Meta Conversions API (Graph API) service. Server-only — the .server.ts suffix
// keeps this out of the client bundle, so META_CAPI_ACCESS_TOKEN never ships to the browser.
//
// Every caller (PageView/ViewContent/AddToCart/InitiateCheckout/Purchase) funnels through
// `sendMetaCapiEvent`, which is the single place that knows the Graph API shape, the hashing
// rules, and the endpoint version — see https://developers.facebook.com/docs/marketing-api/conversions-api.

const GRAPH_API_VERSION = "v25.0"; // Current stable as of Aug 2026; v26 is expected ~Sep 2026.

const SCOPE = "meta-capi";

function emit(
  level: "info" | "warn" | "error",
  event: string,
  fields: Record<string, unknown> = {},
) {
  const line = JSON.stringify({
    scope: SCOPE,
    event,
    level,
    at: new Date().toISOString(),
    ...fields,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export type MetaStandardEvent =
  "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";

/** Raw (unhashed) customer data. Hashing/normalization happens inside this module only. */
export interface MetaRawUserData {
  clientIpAddress?: string;
  clientUserAgent?: string;
  /** `_fbp` cookie value — never hashed. */
  fbp?: string;
  /** `_fbc` cookie value (or reconstructed from `fbclid`) — never hashed. */
  fbc?: string;
  email?: string;
  /** Any format Razorpay hands back (`+919100000000`, `9100000000`, etc). */
  phone?: string;
  /** Full name; split into first/last before hashing. */
  name?: string;
  city?: string;
  state?: string;
  zip?: string;
  /** ISO 3166-1 alpha-2 country code, e.g. `in`. */
  country?: string;
}

export interface MetaCapiEventInput {
  eventName: MetaStandardEvent;
  /** Shared with the browser Pixel call for the SAME user action — this is what dedupes. */
  eventId: string;
  /** Unix seconds. Defaults to now if omitted. */
  eventTime?: number;
  eventSourceUrl: string;
  userData: MetaRawUserData;
  customData?: Record<string, unknown>;
}

function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function trimLower(value: string | undefined): string | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : undefined;
}

/** em: trim + lowercase, then hash. */
function hashEmail(value: string | undefined): string | undefined {
  const normalized = trimLower(value);
  return normalized ? sha256Hex(normalized) : undefined;
}

/**
 * ph: digits only, no leading zeros, must include country code. Razorpay (India-only
 * storefront) hands back `+91XXXXXXXXXX`, `91XXXXXXXXXX`, or a bare 10-digit number — a bare
 * 10-digit number is assumed domestic and gets `91` prepended per Meta's requirement that the
 * country code always be present.
 */
function hashPhone(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let digits = value.replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return undefined;
  if (digits.length === 10) digits = `91${digits}`;
  return sha256Hex(digits);
}

/** fn/ln: lowercase Roman alphabet only, punctuation stripped. */
function hashNamePart(value: string | undefined): string | undefined {
  const normalized = trimLower(value)?.replace(/[^a-z]/g, "");
  return normalized ? sha256Hex(normalized) : undefined;
}

/** ct/st: lowercase, no punctuation, no spaces. */
function hashLocationField(value: string | undefined): string | undefined {
  const normalized = trimLower(value)?.replace(/[\s.,-]/g, "");
  return normalized ? sha256Hex(normalized) : undefined;
}

/** zp: lowercase, no spaces/dashes. (US-only 5-digit truncation doesn't apply — India ships 6-digit pincodes as-is.) */
function hashZip(value: string | undefined): string | undefined {
  const normalized = trimLower(value)?.replace(/[\s-]/g, "");
  return normalized ? sha256Hex(normalized) : undefined;
}

/** country: lowercase ISO 3166-1 alpha-2. */
function hashCountry(value: string | undefined): string | undefined {
  const normalized = trimLower(value);
  return normalized ? sha256Hex(normalized) : undefined;
}

function splitFullName(fullName: string | undefined): { first?: string; last?: string } {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return {};
  if (parts.length === 1) return { first: parts[0] };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

/**
 * Builds the `user_data` object. Hashed fields are sent as single-element arrays per Meta's
 * documented CAPI examples; client_ip_address/client_user_agent/fbp/fbc are sent as plain
 * strings and must NEVER be hashed.
 */
function buildUserData(raw: MetaRawUserData): Record<string, string | string[]> {
  const { first, last } = splitFullName(raw.name);
  const userData: Record<string, string | string[]> = {};

  if (raw.clientIpAddress) userData.client_ip_address = raw.clientIpAddress;
  if (raw.clientUserAgent) userData.client_user_agent = raw.clientUserAgent;
  if (raw.fbp) userData.fbp = raw.fbp;
  if (raw.fbc) userData.fbc = raw.fbc;

  const em = hashEmail(raw.email);
  const ph = hashPhone(raw.phone);
  const fn = hashNamePart(first);
  const ln = hashNamePart(last);
  const ct = hashLocationField(raw.city);
  const st = hashLocationField(raw.state);
  const zp = hashZip(raw.zip);
  const country = hashCountry(raw.country);

  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (fn) userData.fn = [fn];
  if (ln) userData.ln = [ln];
  if (ct) userData.ct = [ct];
  if (st) userData.st = [st];
  if (zp) userData.zp = [zp];
  if (country) userData.country = [country];

  return userData;
}

/**
 * Sends one event to the Graph API. Fire-and-forget by design (analytics, not a critical
 * path): a single attempt, no retry — retrying an event whose `event_time` is now seconds
 * stale buys nothing, and callers already treat this as best-effort.
 *
 * Reads META_PIXEL_ID / META_CAPI_ACCESS_TOKEN from process.env at call time, never at module
 * scope, matching every other server-only credential read in this codebase (see
 * src/lib/config.server.ts) — required for runtimes where env binds per-request.
 */
export async function sendMetaCapiEvent(
  input: MetaCapiEventInput,
  testEventCode?: string,
): Promise<void> {
  const pixelId = process.env.VITE_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    emit("error", "capi.not_configured", { eventName: input.eventName });
    return;
  }

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: buildUserData(input.userData),
        ...(input.customData ? { custom_data: input.customData } : {}),
      },
    ],
    access_token: accessToken,
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      emit("error", "capi.send_failed", {
        eventName: input.eventName,
        eventId: input.eventId,
        status: res.status,
        body: body.slice(0, 500),
      });
      return;
    }

    emit("info", "capi.sent", { eventName: input.eventName, eventId: input.eventId });
  } catch (error) {
    emit("error", "capi.send_threw", {
      eventName: input.eventName,
      eventId: input.eventId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
