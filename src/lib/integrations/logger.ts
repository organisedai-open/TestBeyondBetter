// Structured logging for the fulfilment pipeline.
//
// Every line is a single JSON object on one line so Vercel's log search can filter by
// `scope` / `event` / `razorpayOrderId` without multi-line log grouping getting in the way.
//
// PII rule: customer name/email/phone are needed to debug a failed shipment, but they must
// never sit in plaintext in a log aggregator. Everything customer-identifying goes through
// mask*() below, which keeps just enough to correlate a support ticket with a log line.

type LogFields = Record<string, unknown>;

const SCOPE = "shiprocket-fulfilment";

function emit(level: "info" | "warn" | "error", event: string, fields: LogFields = {}) {
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

export const log = {
  info: (event: string, fields?: LogFields) => emit("info", event, fields),
  warn: (event: string, fields?: LogFields) => emit("warn", event, fields),
  error: (event: string, fields?: LogFields) => emit("error", event, fields),
};

/** `gaurav.kumar@example.com` -> `ga***@example.com` */
export function maskEmail(email: string | undefined | null): string | undefined {
  if (!email) return undefined;
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local.slice(0, 2)}***@${domain}`;
}

/** `+919100000000` -> `+91*****0000` */
export function maskPhone(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  return `***${digits.slice(-4)}`;
}

/** `Gaurav Kumar` -> `G. K.` — enough to eyeball against a Shiprocket row, not enough to identify. */
export function maskName(name: string | undefined | null): string | undefined {
  if (!name) return undefined;
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}.`)
    .join(" ");
}

/**
 * Errors reach logs as `{}` when passed through JSON.stringify, which has burned enough
 * incident debugging to be worth normalising centrally.
 */
export function describeError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}
