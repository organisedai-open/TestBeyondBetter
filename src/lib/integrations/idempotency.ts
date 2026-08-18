// Duplicate protection for webhook redeliveries.
//
// Razorpay redelivers a webhook whenever it doesn't get a prompt 2xx — on its own retry
// schedule for up to 24 hours — and both `order.paid` and `payment.captured` fire for the
// same successful prepaid order. So the same Razorpay order id WILL arrive here more than
// once, and it must never produce two shipments.
//
// The key is always the Razorpay **order** id, not the payment id: an order is what maps
// 1:1 to a physical shipment, and keying on payment id would let a retried payment on the
// same order ship twice.
//
// Three layers, cheapest first — deliberately no database, because each layer already
// exists in infrastructure this integration depends on anyway:
//
//   1. In-memory set (this file)  — instant, but only within one warm instance.
//   2. Razorpay order notes       — durable across cold starts and regions; read for free
//                                   during the order fetch we already perform.
//   3. Shiprocket's unique order_id constraint (see shiprocket.ts) — the atomic backstop
//                                   that settles a genuine race between two instances.
//
// Layers 1 and 2 are optimisations that keep the common case fast and quiet. Layer 3 is the
// one that actually guarantees correctness, and it holds even if 1 and 2 both miss.

/** Note key written onto the Razorpay order once fulfilment succeeds. */
export const FULFILMENT_NOTE_KEY = "shiprocket_order_id";
export const FULFILMENT_SHIPMENT_NOTE_KEY = "shiprocket_shipment_id";

/**
 * Bounded so a long-lived warm instance can't grow this without limit. Insertion-ordered
 * Map + oldest-first eviction gives LRU-ish behaviour that's fine here: evicting an entry
 * only costs us one redundant upstream check, never a duplicate shipment.
 */
const MAX_TRACKED_ORDERS = 1000;
const processedOrders = new Map<string, number>();

export function markProcessedInMemory(razorpayOrderId: string): void {
  if (processedOrders.size >= MAX_TRACKED_ORDERS) {
    const oldest = processedOrders.keys().next();
    if (!oldest.done) processedOrders.delete(oldest.value);
  }
  processedOrders.set(razorpayOrderId, Date.now());
}

export function wasProcessedInMemory(razorpayOrderId: string): boolean {
  return processedOrders.has(razorpayOrderId);
}

/** Reads layer 2 — the durable marker previously written onto the Razorpay order. */
export function readFulfilmentMarker(
  notes: Record<string, string>,
): { shiprocketOrderId: string; shiprocketShipmentId?: string } | undefined {
  const shiprocketOrderId = notes[FULFILMENT_NOTE_KEY];
  if (!shiprocketOrderId) return undefined;
  return {
    shiprocketOrderId,
    shiprocketShipmentId: notes[FULFILMENT_SHIPMENT_NOTE_KEY],
  };
}

/**
 * Builds the merged notes object to PATCH back onto the Razorpay order.
 *
 * Merging matters: PATCH replaces the notes object wholesale, and the existing notes carry
 * `productId` / `quantity` written at checkout time — dropping them would
 * destroy the very data a later redelivery needs to rebuild the shipment.
 */
export function buildFulfilmentNotes(
  existingNotes: Record<string, string>,
  shiprocketOrderId: string | number,
  shiprocketShipmentId?: string | number,
): Record<string, string> {
  const notes: Record<string, string> = {
    ...existingNotes,
    [FULFILMENT_NOTE_KEY]: String(shiprocketOrderId),
  };

  if (shiprocketShipmentId !== undefined) {
    notes[FULFILMENT_SHIPMENT_NOTE_KEY] = String(shiprocketShipmentId);
  }

  // Razorpay caps notes at 15 key-value pairs and rejects the whole PATCH if exceeded.
  // Our own keys are added last above, so trimming from the front drops caller keys first
  // and never the fulfilment markers this file exists to persist.
  const entries = Object.entries(notes);
  if (entries.length <= 15) return notes;
  return Object.fromEntries(entries.slice(entries.length - 15));
}

/** Test seam. */
export function __resetIdempotencyCache() {
  processedOrders.clear();
}
