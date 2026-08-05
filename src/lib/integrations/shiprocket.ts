import { log } from "./logger";
import { PermanentError, classifyHttpFailure, withRetry } from "./retry";

// Shiprocket API client.
//
// Auth model: POST the API-user credentials once, get a JWT valid for 240 hours (10 days),
// then send `Authorization: Bearer <token>` on everything else. Shiprocket rate-limits
// logins hard, so re-authenticating per webhook is both slow and a good way to get locked
// out — the token is cached at module scope and reused until it is close to expiring.

const SHIPROCKET_API_BASE = "https://apiv2.shiprocket.in/v1/external";

/** Refresh this far before the JWT's own `exp`, so a token can't die mid-request. */
const TOKEN_REFRESH_MARGIN_MS = 60 * 60 * 1000; // 1 hour

/** Fallback lifetime if the returned token isn't a decodable JWT. Docs say 240h; we're conservative. */
const FALLBACK_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 1 day

interface CachedToken {
  token: string;
  expiresAtMs: number;
}

// Module scope survives across invocations on a warm serverless instance, so most requests
// skip the login entirely. A cold start just re-logs in — correctness never depends on the
// cache surviving, only latency does.
let cachedToken: CachedToken | undefined;

// Single-flight guard. Without it, a burst of concurrent webhooks on a cold instance each
// fire their own login and race to overwrite the cache.
let inFlightLogin: Promise<CachedToken> | undefined;

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: string;
  discount?: string;
  tax?: string;
  hsn?: string;
}

/** Field names and casing are Shiprocket's; do not "tidy" them. */
export interface ShiprocketOrderPayload {
  order_id: string;
  order_date: string;
  pickup_location: string;
  channel_id?: string;
  comment?: string;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  order_items: ShiprocketOrderItem[];
  payment_method: "Prepaid" | "COD";
  shipping_charges: number;
  giftwrap_charges: number;
  transaction_charges: number;
  total_discount: number;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export interface ShiprocketOrderResponse {
  order_id: number;
  shipment_id: number;
  status?: string;
  status_code?: number;
  onboarding_completed_now?: number;
  awb_code?: string | null;
  courier_company_id?: number | null;
  courier_name?: string | null;
}

export interface ShiprocketCreateResult {
  /** False when Shiprocket rejected the order as a duplicate — i.e. it already existed. */
  created: boolean;
  response?: ShiprocketOrderResponse;
}

interface ShiprocketLoginResponse {
  token?: string;
  first_name?: string;
  email?: string;
  company_id?: number;
}

function getShiprocketCredentials(): { email: string; password: string } {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email || !password) {
    throw new Error("SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD are not configured");
  }
  return { email, password };
}

export function getShiprocketPickupLocation(): string {
  // Must match a pickup-location nickname that exists in the Shiprocket dashboard
  // (Settings -> Company -> Pickup Addresses). Shiprocket rejects unknown nicknames.
  return process.env.SHIPROCKET_PICKUP_LOCATION || "Primary";
}

/**
 * Reads the `exp` claim so the cache tracks the token's real lifetime rather than a
 * hardcoded guess that silently drifts if Shiprocket changes their TTL.
 */
function decodeJwtExpiryMs(token: string): number | undefined {
  const parts = token.split(".");
  if (parts.length !== 3) return undefined;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as {
      exp?: number;
    };
    return typeof payload.exp === "number" ? payload.exp * 1000 : undefined;
  } catch {
    return undefined;
  }
}

async function login(): Promise<CachedToken> {
  const { email, password } = getShiprocketCredentials();

  return withRetry(
    async () => {
      const res = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw classifyHttpFailure(res.status, await res.text().catch(() => ""), "Shiprocket login");
      }

      const body = (await res.json()) as ShiprocketLoginResponse;
      if (!body.token) {
        throw new PermanentError("Shiprocket login returned no token");
      }

      const expiresAtMs = decodeJwtExpiryMs(body.token) ?? Date.now() + FALLBACK_TOKEN_TTL_MS;

      log.info("shiprocket.authenticated", {
        companyId: body.company_id,
        tokenExpiresAt: new Date(expiresAtMs).toISOString(),
      });

      return { token: body.token, expiresAtMs };
    },
    { operation: "shiprocket.login" },
  );
}

async function getToken(forceRefresh = false): Promise<string> {
  const now = Date.now();

  if (!forceRefresh && cachedToken && cachedToken.expiresAtMs - TOKEN_REFRESH_MARGIN_MS > now) {
    return cachedToken.token;
  }

  if (forceRefresh) cachedToken = undefined;

  // Join the in-flight login rather than starting a second one.
  if (!inFlightLogin) {
    inFlightLogin = login().finally(() => {
      inFlightLogin = undefined;
    });
  }

  cachedToken = await inFlightLogin;
  return cachedToken.token;
}

/**
 * Shiprocket enforces a unique `order_id` per account, and rejects a repeat with a 422
 * carrying a Laravel validator message. That rejection is the backstop that makes the whole
 * pipeline safe: even if two webhook redeliveries race past every local check and call
 * create() at the same instant, exactly one wins and the other lands here.
 */
function isDuplicateOrderRejection(status: number, body: string): boolean {
  if (status !== 422 && status !== 400) return false;
  return /already been taken|already exists|duplicate/i.test(body);
}

export async function createShiprocketOrder(
  payload: ShiprocketOrderPayload,
): Promise<ShiprocketCreateResult> {
  const send = async (token: string) => {
    const res = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (res.ok) {
      return { created: true, response: JSON.parse(text) as ShiprocketOrderResponse };
    }

    if (isDuplicateOrderRejection(res.status, text)) {
      log.info("shiprocket.duplicate_rejected", {
        referenceOrderId: payload.order_id,
        status: res.status,
      });
      return { created: false } satisfies ShiprocketCreateResult;
    }

    throw classifyHttpFailure(res.status, text, "Shiprocket order creation");
  };

  return withRetry(
    async () => {
      try {
        return await send(await getToken());
      } catch (error) {
        // A cached token can be revoked server-side before its `exp` (password rotation,
        // API user disabled). One forced re-login distinguishes "token went stale" from
        // "credentials are actually wrong" — the retry wrapper handles the latter.
        const isAuthFailure = error instanceof PermanentError && error.status === 401;
        if (!isAuthFailure) throw error;

        log.warn("shiprocket.token_rejected_refreshing", { referenceOrderId: payload.order_id });
        return await send(await getToken(true));
      }
    },
    { operation: "shiprocket.createOrder", context: { referenceOrderId: payload.order_id } },
  );
}

/** Test seam: lets a test force a cold-cache path without reaching into module state. */
export function __resetShiprocketTokenCache() {
  cachedToken = undefined;
  inFlightLogin = undefined;
}
