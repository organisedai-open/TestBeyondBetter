import { Star } from "lucide-react";

// Shared star-rating glyph used by the product page's aggregate rating and every testimonial
// card, so a partial (4-star) rating renders identically wherever it appears.
export function StarRating({
  rating,
  size = "h-4 w-4",
  className = "",
}: {
  rating: number;
  size?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      style={{ color: "var(--gold-deep)" }}
      role="img"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={size}
          strokeWidth={1.5}
          fill={i <= rating ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
