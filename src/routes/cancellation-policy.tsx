import { createFileRoute } from "@tanstack/react-router";

import {
  PolicyPageShell,
  PolicyHero,
  PolicyContent,
  PolicySection,
  PolicyParagraph,
  FaqAccordionSection,
  RelatedPolicies,
  WhoWeAreBlock,
  TrustBadges,
  PolicyClosing,
} from "@/components/PolicyPage";
import { buildPolicyPageHead } from "@/lib/seo";

const PATH = "/cancellation-policy";
const TITLE = "Cancellation Policy — Beyond Better";
const DESCRIPTION =
  "When you can cancel a Beyond Better order, what happens to your refund, and how to request a cancellation.";
const LAST_UPDATED = "August 2026";

const FAQS = [
  {
    question: "Can I cancel my order?",
    answer:
      "Orders may be cancelled before they have been processed for shipment. Once an order has been packed or dispatched, cancellation may no longer be possible.",
  },
  {
    question: "What happens to my refund if I cancel?",
    answer:
      "If cancellation is approved before shipment, any eligible refund will be processed to the original payment method.",
  },
  {
    question: "How do I cancel an order?",
    answer: "Customers should contact support as soon as possible after placing an order.",
  },
];

export const Route = createFileRoute("/cancellation-policy")({
  head: () =>
    buildPolicyPageHead({
      path: PATH,
      title: TITLE,
      description: DESCRIPTION,
      breadcrumbName: "Cancellation Policy",
      faqs: FAQS,
    }),
  component: CancellationPolicyPage,
});

function CancellationPolicyPage() {
  return (
    <PolicyPageShell>
      <PolicyHero
        eyebrow="Legal"
        title="Cancellation Policy"
        lastUpdated={LAST_UPDATED}
        readingTime="2 min read"
        breadcrumbLabel="Cancellation Policy"
      />
      <PolicyContent>
        <div className="mb-11">
          <TrustBadges />
        </div>
        <WhoWeAreBlock />

        <PolicySection id="cancelling-an-order" heading="Cancelling an Order">
          <PolicyParagraph>
            Orders may be cancelled before they have been processed for shipment.
          </PolicyParagraph>
          <PolicyParagraph>
            Once an order has been packed or dispatched, cancellation may no longer be possible.
          </PolicyParagraph>
          <PolicyParagraph>
            If cancellation is approved before shipment, any eligible refund will be processed to
            the original payment method.
          </PolicyParagraph>
          <PolicyParagraph>
            Customers should contact support as soon as possible after placing an order.
          </PolicyParagraph>
        </PolicySection>

        <FaqAccordionSection items={FAQS} />

        <RelatedPolicies currentPath={PATH} />
        <PolicyClosing lastUpdated={LAST_UPDATED} />
      </PolicyContent>
    </PolicyPageShell>
  );
}
