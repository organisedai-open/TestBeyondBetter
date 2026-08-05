import { createFileRoute } from "@tanstack/react-router";

import {
  PolicyPageShell,
  PolicyHero,
  PolicyContent,
  PolicySection,
  PolicyAnswer,
  PolicyParagraph,
  RelatedPolicies,
} from "@/components/PolicyPage";
import { buildPolicyPageHead } from "@/lib/seo";

const PATH = "/cancellation-policy";
const TITLE = "Cancellation Policy — Beyond Better";
const DESCRIPTION =
  "When you can cancel a Beyond Better order, what happens to your refund, and how to request a cancellation.";

const CAN_CANCEL_ANSWER =
  "Orders may be cancelled before they have been processed for shipment. Once an order has been packed or dispatched, cancellation may no longer be possible.";
const REFUND_ANSWER =
  "If cancellation is approved before shipment, any eligible refund will be processed to the original payment method.";
const HOW_TO_CANCEL_ANSWER =
  "Customers should contact support as soon as possible after placing an order.";

export const Route = createFileRoute("/cancellation-policy")({
  head: () =>
    buildPolicyPageHead({
      path: PATH,
      title: TITLE,
      description: DESCRIPTION,
      breadcrumbName: "Cancellation Policy",
      faqs: [
        { question: "Can I cancel my order?", answer: CAN_CANCEL_ANSWER },
        { question: "What happens to my refund if I cancel?", answer: REFUND_ANSWER },
        { question: "How do I cancel an order?", answer: HOW_TO_CANCEL_ANSWER },
      ],
    }),
  component: CancellationPolicyPage,
});

function CancellationPolicyPage() {
  return (
    <PolicyPageShell>
      <PolicyHero
        eyebrow="Legal"
        title="Cancellation Policy"
        lastUpdated="August 2026"
        breadcrumbLabel="Cancellation Policy"
      />
      <PolicyContent>
        <PolicySection id="cancelling-an-order" heading="Cancelling an Order">
          <PolicyAnswer question="Can I cancel my order?">
            <PolicyParagraph>
              Orders may be cancelled before they have been processed for shipment.
            </PolicyParagraph>
            <PolicyParagraph>
              Once an order has been packed or dispatched, cancellation may no longer be possible.
            </PolicyParagraph>
          </PolicyAnswer>

          <PolicyAnswer question="What happens to my refund if I cancel?">
            <PolicyParagraph>{REFUND_ANSWER}</PolicyParagraph>
          </PolicyAnswer>

          <PolicyAnswer question="How do I cancel an order?">
            <PolicyParagraph>{HOW_TO_CANCEL_ANSWER}</PolicyParagraph>
          </PolicyAnswer>
        </PolicySection>

        <RelatedPolicies currentPath={PATH} />
      </PolicyContent>
    </PolicyPageShell>
  );
}
