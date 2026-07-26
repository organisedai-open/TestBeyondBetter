// Tiny external store so every "Buy"/"Shop" button on a page (hero, sticky bar, footer, etc.)
// shares one "checkout in progress" flag without prop-drilling — clicking one disables all of
// them and prevents duplicate orders/modals from a stray second click.

type Listener = () => void;

let inProgress = false;
const listeners = new Set<Listener>();

export function isCheckoutInProgress() {
  return inProgress;
}

export function setCheckoutInProgress(value: boolean) {
  if (inProgress === value) return;
  inProgress = value;
  listeners.forEach((listener) => listener());
}

export function subscribeCheckoutProgress(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
