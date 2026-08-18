// Customer reviews for Beyond Better Berberine HCL. Displayed on the homepage testimonials
// section and summarized as an aggregate rating on the product page.
//
// The average and count are derived from this array, never hardcoded, so the displayed number
// can never drift from what the individual ratings below actually say. The same array feeds
// the Product schema's AggregateRating/Review markup, which Google requires to mirror what is
// visible on the page.
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
      "I was expecting adding another supplement to my routine to be a bit of a hassle, but it's been really easy. I just take it with breakfast and dinner and don't have to think about it. No weird aftertaste either.",
  },
  {
    name: "Rahul Mehta",
    rating: 5,
    quote:
      "I'd been paying more attention to my blood sugar and metabolic health and wanted to try berberine as part of my routine. I've been taking Beyond Better consistently with meals, and it's become one of those things I just keep up with every day.",
  },
  {
    name: "Ananya Iyer",
    rating: 5,
    quote:
      "I've seen plenty of supplements make big claims about purity, so I was skeptical about the 97%. What I liked was being able to open the COA and actually see the batch results. That made the quality claims feel much more credible.",
  },
  {
    name: "Arjun Kapoor",
    rating: 4,
    quote:
      "I originally started looking into berberine because I wanted to be more proactive about my metabolism and overall metabolic health. After using it consistently, I've personally felt that my afternoon energy is more steady, which is one of the reasons I've continued taking it.",
  },
  {
    name: "Neha Gupta",
    rating: 5,
    quote:
      "I was originally going to go with a cheaper berberine option on Amazon. After comparing a few brands, I noticed that some didn't provide much actual testing information. The extra transparency from Beyond Better made the higher price feel justified.",
  },
  {
    name: "Daniel Brooks",
    rating: 5,
    quote:
      "I wasn't expecting much because I've tried supplements before without really noticing a difference. What I liked about Beyond Better was that it fit easily into my routine, and over the following weeks I felt like my energy and overall day-to-day consistency were better. That's what made me stick with it.",
  },
];

export const REVIEW_COUNT = TESTIMONIALS.length;

export const AVERAGE_RATING =
  Math.round((TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / REVIEW_COUNT) * 10) / 10;
