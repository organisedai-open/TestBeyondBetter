// Early-tester feedback for the first Beyond Better Berberine HCL batch, collected before the
// public pre-order opened. Displayed on the homepage testimonials section and summarized as an
// aggregate rating on the product page.
//
// The average and count are derived from this array, never hardcoded — the same "derived, not
// hardcoded" rule pricing.ts uses for the discount percentage, so the displayed number can never
// drift from what the individual ratings below actually say.
export interface Testimonial {
  name: string;
  rating: 4 | 5;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya Sharma",
    rating: 5,
    quote:
      "I've tried a few berberine supplements before, but this one immediately stood out because of the packaging and transparency. Seeing the lab testing gave me confidence, and it's now become part of my daily routine.",
  },
  {
    name: "Rahul Mehta",
    rating: 5,
    quote:
      "The capsules are easy to take and the quality feels premium from the moment you open the container. I appreciate that Beyond Better actually shares third-party testing instead of just talking about quality.",
  },
  {
    name: "Ananya Iyer",
    rating: 5,
    quote:
      "Bought it after spending weeks comparing different brands. The Japanese HPLC testing and clean presentation convinced me. Everything from ordering to delivery felt thoughtfully done.",
  },
  {
    name: "Arjun Kapoor",
    rating: 4,
    quote:
      "I like that the brand focuses on quality instead of making unrealistic promises. Shipping was quick, packaging was excellent, and the product has been easy to incorporate into my daily routine.",
  },
  {
    name: "Neha Gupta",
    rating: 5,
    quote:
      "One of the few supplement brands that genuinely feels premium. The attention to detail—from the container to the lab reports—gave me much more confidence than most alternatives I looked at.",
  },
  {
    name: "Daniel Brooks",
    rating: 5,
    quote:
      "I was looking for a berberine supplement that emphasized testing and ingredient quality rather than hype. Beyond Better checked those boxes and has been a great addition to my wellness routine.",
  },
];

export const REVIEW_COUNT = TESTIMONIALS.length;

export const AVERAGE_RATING =
  Math.round((TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / REVIEW_COUNT) * 10) / 10;
