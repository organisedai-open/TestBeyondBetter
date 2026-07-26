import { PRODUCT_PRICING } from "@/lib/pricing";
import productImage from "@/assets/hero-berberine-product.webp";

const SITE_URL = "https://bebeyondbetter.com";

// Single-SKU store: every "Buy"/"Shop" CTA on the site checks out this product.
// Price is sourced from PRODUCT_PRICING (src/lib/pricing.ts) — the same value shown on the page —
// so the server-side order amount always matches what the customer saw.
export const PRODUCT_CATALOG = {
  id: "berberine-hcl-500mg",
  sku: "BB-BERB-60CAP",
  variantId: "bb-berb-60cap-default",
  name: "Herbal Berberine HCL Extract",
  description: "97% HPLC-verified Berberine HCL, 500mg x 60 capsules",
  imageUrl: `${SITE_URL}${productImage}`,
  productUrl: `${SITE_URL}/#shop`,
  currency: PRODUCT_PRICING.currency,
  unitPrice: PRODUCT_PRICING.sellingPrice,
  unitMrp: PRODUCT_PRICING.mrp,
} as const;
