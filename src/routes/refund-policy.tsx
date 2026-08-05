import { createFileRoute } from "@tanstack/react-router";

import {
  PolicyPageShell,
  PolicyHero,
  PolicyContent,
  PolicySection,
  PolicyAnswer,
  PolicyParagraph,
  PolicyList,
  RelatedPolicies,
} from "@/components/PolicyPage";
import { buildPolicyPageHead } from "@/lib/seo";

const PATH = "/refund-policy";
const TITLE = "Refund Policy — Beyond Better";
const DESCRIPTION =
  "When Beyond Better issues refunds — wrong, damaged or lost shipments — and how to request one.";

// Headings are phrased as questions for AEO readability; the answer beneath each one is the
// verbatim policy sentence, unaltered — only the navigational heading above it is new text.
const WHEN_ELIGIBLE_ANSWER =
  "Refunds are available only if the wrong product is delivered, the product arrives damaged, or the shipment is confirmed lost by the courier.";
const HOW_TO_REQUEST_ANSWER =
  "Customers should contact us within 48 hours of delivery and provide photographs of the product and packaging.";
const HOW_ISSUED_ANSWER =
  "Refunds are processed after verification. Approved refunds are issued to the original payment method within a reasonable processing period.";
const OPENED_PRODUCTS_ANSWER =
  "Opened or used products are generally not eligible for refunds unless required under applicable law.";

export const Route = createFileRoute("/refund-policy")({
  head: () =>
    buildPolicyPageHead({
      path: PATH,
      title: TITLE,
      description: DESCRIPTION,
      breadcrumbName: "Refund Policy",
      faqs: [
        { question: "When am I eligible for a refund?", answer: WHEN_ELIGIBLE_ANSWER },
        { question: "How do I request a refund?", answer: HOW_TO_REQUEST_ANSWER },
        { question: "How will my refund be issued?", answer: HOW_ISSUED_ANSWER },
        {
          question: "Are opened or used products eligible for a refund?",
          answer: OPENED_PRODUCTS_ANSWER,
        },
      ],
    }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <PolicyPageShell>
      <PolicyHero
        eyebrow="Legal"
        title="Refund Policy"
        lastUpdated="August 2026"
        intro="Customer satisfaction is important to us."
        breadcrumbLabel="Refund Policy"
      />
      <PolicyContent>
        <PolicySection id="refund-eligibility" heading="Refund Eligibility">
          <PolicyAnswer question="When am I eligible for a refund?">
            <PolicyParagraph>Refunds are available only if:</PolicyParagraph>
            <PolicyList
              items={[
                "the wrong product is delivered",
                "the product arrives damaged",
                "the shipment is confirmed lost by the courier",
              ]}
            />
          </PolicyAnswer>

          <PolicyAnswer question="How do I request a refund?">
            <PolicyParagraph>{HOW_TO_REQUEST_ANSWER}</PolicyParagraph>
          </PolicyAnswer>

          <PolicyAnswer question="How will my refund be issued?">
            <PolicyParagraph>Refunds are processed after verification.</PolicyParagraph>
            <PolicyParagraph>
              Approved refunds are issued to the original payment method within a reasonable
              processing period.
            </PolicyParagraph>
          </PolicyAnswer>

          <PolicyAnswer question="Are opened or used products eligible for a refund?">
            <PolicyParagraph>{OPENED_PRODUCTS_ANSWER}</PolicyParagraph>
          </PolicyAnswer>
        </PolicySection>

        <RelatedPolicies currentPath={PATH} />
      </PolicyContent>
    </PolicyPageShell>
  );
}
