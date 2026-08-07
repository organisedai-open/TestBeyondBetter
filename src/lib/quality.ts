// Single source of truth for the two proprietary quality signals the brand is built around,
// so the numbers can't drift between page copy, metadata and structured data the way a
// hand-typed figure in fifteen files inevitably does.
//
// Same rule pricing.ts uses for the discount percentage: state the number once, derive every
// display from it.

/** HPLC-verified berberine HCl content, as reported on the published Certificate of Analysis. */
export const PURITY_PCT = 97;

/**
 * Size of the multi-residue pesticide panel the raw material is screened against.
 *
 * NOTE (owner action pending): the pesticide screening report is not yet published on the site.
 * The COA at /berberine-coa.pdf currently documents the HPLC assay, heavy metals and microbial
 * profile only. Every other claim on this site is backed by a document a visitor can open --
 * that is the brand's entire differentiator -- so this figure should not stay unsupported for
 * long. When the report is available, drop it in /public and set PESTICIDE_REPORT_PATH below;
 * the "view the screening report" links wire up automatically.
 */
export const PESTICIDES_SCREENED = 545;

/**
 * Public path to the pesticide screening report, once available. Null until then -- components
 * check this and simply omit the link rather than rendering a dead href.
 */
export const PESTICIDE_REPORT_PATH: string | null = null;

/** Canonical phrasings. Deliberately "screened for N residues", never "free of N pesticides" --
 *  the panel size is what was tested, which is a different and far more defensible claim than
 *  a statement about what the results were. */
export const JAPANESE_STANDARD_LABEL = "Japanese Standard Berberine";
export const PESTICIDE_SCREENING_LABEL = `${PESTICIDES_SCREENED} Pesticides Screened`;
export const PESTICIDE_SCREENING_SENTENCE = `screened against a ${PESTICIDES_SCREENED}-pesticide residue panel`;
