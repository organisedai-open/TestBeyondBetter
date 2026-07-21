export const PRODUCT_PRICING = {
  currency: "INR",
  sellingPrice: 990,
  mrp: 1900,
} as const;

export function formatInr(amount: number): string {
  return `₹${amount}`;
}
