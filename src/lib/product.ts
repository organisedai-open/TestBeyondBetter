import { CURRENCY, MRP_INR } from "@/lib/pricing";
import productImage from "@/assets/hero-berberine-product.webp";

const SITE_URL = "https://www.bebeyondbetter.com";

// Single-SKU store: every "Buy"/"Shop" CTA on the site checks out this product.
// The unit price is NOT here — it's pre-order/in-stock dependent, so it's computed fresh
// per order via getActivePriceInr() in pricing.ts (see checkout.functions.ts), never
// frozen at module load.
export const PRODUCT_CATALOG = {
  id: "berberine-hcl-500mg",
  sku: "BB-BERB-60CAP",
  variantId: "bb-berb-60cap-default",
  name: "Herbal Berberine HCL Extract",
  description: "97% Japanese HPLC-verified Berberine HCL, 500mg x 60 capsules",
  imageUrl: `${SITE_URL}${productImage}`,
  productUrl: `${SITE_URL}/products/berberine-hcl`,
  currency: CURRENCY,
  unitMrp: MRP_INR,
  // Shipped weight of one bottle (60 capsules), in grams. Magic Checkout's Shiprocket-backed
  // serviceability lookup needs this to resolve courier availability for an address.
  weightGrams: 500,
  // Outer parcel dimensions in cm for one bottle, used when creating the Shiprocket order.
  // Shiprocket rejects zero/missing dimensions, and bills on volumetric weight when it
  // exceeds actual weight — so these must describe the box you actually ship, not the
  // bottle. Update here if the packaging changes.
  parcel: {
    lengthCm: 12,
    breadthCm: 10,
    heightCm: 10,
  },
} as const;
