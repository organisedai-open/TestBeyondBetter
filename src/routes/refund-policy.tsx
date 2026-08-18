import { createFileRoute } from "@tanstack/react-router";

import {
  PolicyPageShell,
  PolicyHero,
  PolicyContent,
  PolicySection,
  PolicyParagraph,
  PolicyList,
  StepFlow,
  FaqAccordionSection,
  RelatedPolicies,
  WhoWeAreBlock,
  TrustBadges,
  PolicyClosing,
} from "@/components/PolicyPage";
import { buildPolicyPageHead } from "@/lib/seo";

const PATH = "/refund-policy";
const TITLE = "Refund Policy — Beyond Better";
const DESCRIPTION =
  "When Beyond Better issues refunds — wrong, damaged or lost shipments — how to request one, and how long it takes.";
const LAST_UPDATED = "August 2026";

const FAQS = [
  {
    question: "Can I return an opened supplement?",
    answer:
      "No. Products must be returned unopened with the seal intact — opened or used products are not eligible for a refund, except where required under applicable law.",
  },
  {
    question: "Can I cancel after shipping?",
    answer:
      "No. Once an order has been packed or dispatched, cancellation may no longer be possible.",
  },
  {
    question: "When will I receive my refund?",
    answer: "Usually within 5–7 business days of approval, once your bank has processed it.",
  },
  {
    question: "Will shipping charges be refunded?",
    answer: "Only under eligible circumstances, as determined during verification.",
  },
];

export const Route = createFileRoute("/refund-policy")({
  head: () =>
    buildPolicyPageHead({
      path: PATH,
      title: TITLE,
      description: DESCRIPTION,
      breadcrumbName: "Refund Policy",
      includeMerchantReturnPolicy: true,
      faqs: FAQS,
    }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <PolicyPageShell>
      <PolicyHero
        eyebrow="Legal"
        title="Refund Policy"
        lastUpdated={LAST_UPDATED}
        readingTime="3 min read"
        intro="Customer satisfaction is important to us."
        breadcrumbLabel="Refund Policy"
      />
      <PolicyContent>
        <div className="mb-11">
          <TrustBadges />
        </div>
        <WhoWeAreBlock />

        <PolicySection id="refund-eligibility" heading="Refund Eligibility">
          <PolicyParagraph>Refunds are available only if:</PolicyParagraph>
          <PolicyList
            items={[
              "the wrong product is delivered",
              "the product arrives damaged",
              "the shipment is confirmed lost by the courier",
            ]}
          />
          <PolicyParagraph>
            Customers should contact us within 48 hours of delivery and provide photographs of the
            product and packaging.
          </PolicyParagraph>
          <PolicyParagraph>
            Refunds are processed after verification. Approved refunds are issued to the original
            payment method within a reasonable processing period.
          </PolicyParagraph>
          <PolicyParagraph>
            The product must be returned unopened, with its seal intact and in its original
            packaging. Opened or used products are not eligible for a refund, except where a refund
            is required under applicable law.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection id="how-to-request-a-refund" heading="How to Request a Refund">
          <StepFlow
            steps={[
              { label: "Email Us", detail: "care@bebeyondbetter.com" },
              { label: "Mention Order ID" },
              { label: "Attach Photographs", detail: "Product and packaging" },
              { label: "Our Team Reviews" },
              { label: "Refund Decision" },
            ]}
          />
        </PolicySection>

        <PolicySection id="refund-timeline" heading="Refund Timeline">
          <StepFlow
            steps={[
              { label: "Inspection", detail: "1–2 business days" },
              { label: "Refund Approval" },
              { label: "Refund Initiated" },
              { label: "Bank Processing", detail: "5–7 business days" },
            ]}
          />
        </PolicySection>

        <FaqAccordionSection items={FAQS} />

        <RelatedPolicies currentPath={PATH} />
        <PolicyClosing lastUpdated={LAST_UPDATED} />
      </PolicyContent>
    </PolicyPageShell>
  );
}
