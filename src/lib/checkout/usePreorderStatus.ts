import { useEffect, useState } from "react";

import {
  isPreorderActive,
  MRP_INR,
  PREORDER_PRICE_INR,
  POST_LAUNCH_PRICE_INR,
  PREORDER_CTA_LABEL,
  IN_STOCK_CTA_LABEL,
} from "@/lib/pricing";

// Used by every CTA/price display so copy and pricing automatically flip from pre-order to
// in-stock the moment the restock date passes — no reload, no manual toggle. A 60s re-check
// is plenty for text/price display (the visible countdown digits tick independently, see
// RestockCountdown); this just needs to catch the one true/false transition eventually.
export function usePreorderStatus() {
  const [preorder, setPreorder] = useState(() => isPreorderActive());

  useEffect(() => {
    const check = () => setPreorder(isPreorderActive());
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  return {
    isPreorderActive: preorder,
    price: preorder ? PREORDER_PRICE_INR : POST_LAUNCH_PRICE_INR,
    mrp: MRP_INR,
    ctaLabel: preorder ? PREORDER_CTA_LABEL : IN_STOCK_CTA_LABEL,
  };
}
