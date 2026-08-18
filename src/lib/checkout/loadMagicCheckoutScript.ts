const MAGIC_CHECKOUT_SRC = "https://checkout.razorpay.com/v1/magic-checkout.js";

let scriptPromise: Promise<void> | null = null;

// Loads the Magic Checkout SDK exactly once, however many buttons on the page try to open
// checkout. Resolves only once window.Razorpay is actually available.
export function loadMagicCheckoutScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Checkout can only be opened in the browser"));
  }
  if (window.Razorpay) {
    return Promise.resolve();
  }
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${MAGIC_CHECKOUT_SRC}"]`,
    );
    if (existing) {
      if (window.Razorpay) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Razorpay checkout script")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = MAGIC_CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Razorpay checkout script"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}
