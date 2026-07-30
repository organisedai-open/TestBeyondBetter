// Converts a human-readable date string ("March 4, 2026") to an ISO calendar date
// ("2026-03-04") for schema.org/Open Graph date fields and sitemap lastmod values.
//
// Deliberately does NOT use `new Date(str).toISOString()` — that converts through UTC,
// which shifts the calendar day whenever the runtime's local timezone is behind UTC (e.g.
// "March 4, 2026" parses as local midnight, and toISOString() on that instant can render
// as "2026-03-03" in a UTC-5 environment). Reading the same Date object's local
// year/month/day getters instead avoids the UTC round-trip entirely, so the calendar date
// authored in the source data is what comes out, regardless of server/build timezone.
export function toIsoDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
