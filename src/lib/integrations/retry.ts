import { describeError, log } from "./logger";

// Retry policy shared by every outbound call in the fulfilment path.
//
// The budget here is deliberately small. Razorpay gives a webhook only a few seconds before
// it considers the delivery failed, and it redelivers failed webhooks on its own schedule
// for up to 24 hours. So the job of in-process retry is *only* to ride out a blip of a
// second or two — anything longer is Razorpay's redelivery to handle, which is both more
// durable and free. Retrying harder here just burns function time and risks the platform
// killing us mid-write.

export class RetryableError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "RetryableError";
    this.status = status;
  }
}

/** Non-retryable: a 4xx that will fail identically no matter how many times we resend it. */
export class PermanentError extends Error {
  readonly status?: number;
  readonly body?: string;

  constructor(message: string, status?: number, body?: string) {
    super(message);
    this.name = "PermanentError";
    this.status = status;
    this.body = body;
  }
}

interface RetryOptions {
  /** Total attempts including the first. */
  attempts?: number;
  /** Base delay; doubles each attempt and gets jitter applied. */
  baseDelayMs?: number;
  maxDelayMs?: number;
  /** Used purely for log correlation. */
  operation: string;
  context?: Record<string, unknown>;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  const { attempts = 3, baseDelayMs = 300, maxDelayMs = 2000, operation, context = {} } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // A PermanentError means the request itself is wrong (bad pincode, missing field,
      // duplicate order). Resending it is guaranteed to fail the same way, so stop now and
      // let the caller decide — retrying would only delay the real signal.
      if (error instanceof PermanentError) {
        log.warn("retry.permanent", {
          operation,
          attempt,
          status: error.status,
          ...context,
          ...describeError(error),
        });
        throw error;
      }

      if (attempt === attempts) break;

      // Full jitter: without it, concurrent webhook redeliveries retry in lockstep and
      // hammer the upstream at exactly the same instants.
      const backoff = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      const delay = Math.round(Math.random() * backoff);

      log.warn("retry.attempt_failed", {
        operation,
        attempt,
        attempts,
        retryInMs: delay,
        ...context,
        ...describeError(error),
      });

      await sleep(delay);
    }
  }

  log.error("retry.exhausted", {
    operation,
    attempts,
    ...context,
    ...describeError(lastError),
  });
  throw lastError;
}

/**
 * Classifies an HTTP response into the retry taxonomy above.
 * 408/429 and 5xx are transient; every other non-2xx is permanent.
 */
export function classifyHttpFailure(status: number, body: string, label: string): Error {
  const detail = body.slice(0, 500);
  if (status === 408 || status === 429 || status >= 500) {
    return new RetryableError(`${label} failed with ${status}: ${detail}`, status);
  }
  return new PermanentError(`${label} failed with ${status}: ${detail}`, status, body);
}
