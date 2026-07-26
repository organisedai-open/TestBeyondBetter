// Minimal ambient typing for the Razorpay Magic Checkout web SDK.
// Scoped to window.Razorpay only — does not alter any other project-wide types.

interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

interface RazorpayOptions {
  key: string;
  order_id: string;
  amount?: number;
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  one_click_checkout?: boolean;
  handler?: (response: RazorpayHandlerResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  notes?: Record<string, string>;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, handler: (payload: unknown) => void) => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

interface Window {
  Razorpay?: RazorpayConstructor;
}
