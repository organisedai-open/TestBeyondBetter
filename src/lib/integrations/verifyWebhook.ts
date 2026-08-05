import crypto from "node:crypto";

// Razorpay signs the webhook with HMAC-SHA256 over the *raw* request body using the
// webhook secret (which is a different secret from RAZORPAY_KEY_SECRET — that one signs
// the client-side payment handler response, this one signs server-to-server webhooks).
//
// Razorpay's docs are explicit that the body must be passed exactly as received: parsing
// and re-serialising the JSON changes key order and whitespace, which changes the digest
// and makes every signature fail. Hence this module only ever accepts a string.

export const RAZORPAY_SIGNATURE_HEADER = "x-razorpay-signature";

export type WebhookVerificationResult =
  | { valid: true }
  | { valid: false; reason: "missing_secret" | "missing_signature" | "signature_mismatch" };

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string | null | undefined,
  secret: string | undefined,
): WebhookVerificationResult {
  if (!secret) return { valid: false, reason: "missing_secret" };
  if (!signature) return { valid: false, reason: "missing_signature" };

  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");

  if (!timingSafeEqualHex(expected, signature)) {
    return { valid: false, reason: "signature_mismatch" };
  }

  return { valid: true };
}

/**
 * timingSafeEqual throws if the two buffers differ in length, and that throw is itself an
 * early-exit side channel. Comparing length first and bailing out is fine — the length of a
 * hex digest is public information — but the *contents* comparison must stay constant time.
 */
function timingSafeEqualHex(expected: string, actual: string): boolean {
  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(actual, "utf8");
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
