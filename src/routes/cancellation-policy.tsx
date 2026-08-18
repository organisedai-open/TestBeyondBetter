import { createFileRoute, Link } from "@tanstack/react-router";

import {
  PolicyPageShell,
  PolicyHero,
  PolicyContent,
  PolicySection,
  PolicyParagraph,
  StepFlow,
  FaqAccordionSection,
  RelatedPolicies,
  WhoWeAreBlock,
  TrustBadges,
  PolicyClosing,
  SupportEmailLink,
} from "@/components/PolicyPage";
import { buildPolicyPageHead, SUPPORT_EMAIL } from "@/lib/seo";
import { DISPATCH_NOTE } from "@/lib/pricing";

const PATH = "/cancellation-policy";
const TITLE = "Cancellation Policy — Beyond Better";
const DESCRIPTION =
  "Beyond Better orders can be cancelled for a full refund any time before dispatch. Orders are dispatched within 1–2 business days — here's how to cancel.";
const LAST_UPDATED = "August 2026";

const FAQS = [
  {
    question: "Can I cancel my order?",
    answer: `Yes — orders can be cancelled for a full refund any time before they are dispatched. ${DISPATCH_NOTE} Once an order has been dispatched, the normal refund policy applies instead.`,
  },
  {
    question: "How do I cancel my order?",
    answer: `If you'd like to cancel your order, simply email ${SUPPORT_EMAIL} with your order ID as soon as possible. We'll do our best to process your cancellation before your order is shipped.`,
  },
  {
    question: "How long does a refund take after I cancel?",
    answer:
      "Refunds for cancelled orders are processed to your original payment method. We don't have a fixed processing window to share yet — you'll receive confirmation once your refund has been issued.",
  },
  {
    question: "What happens if my order has already shipped?",
    answer:
      "Once an order has been dispatched it can no longer be cancelled, and the normal refund policy applies instead — refunds are available if the wrong product is delivered, it arrives damaged, or the shipment is confirmed lost.",
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
        intro={`${DISPATCH_NOTE} You can cancel for a full refund any time before your order leaves us.`}
        breadcrumbLabel="Cancellation Policy"
      />
      <PolicyContent>
        <div className="mb-11">
          <TrustBadges />
        </div>
        <WhoWeAreBlock />

        <PolicySection id="cancelling-an-order" heading="Cancelling Your Order">
          <PolicyParagraph>
            Orders are eligible for full cancellation and refund any time before they are
            dispatched. {DISPATCH_NOTE}
          </PolicyParagraph>
          <PolicyParagraph>
            If you'd like to cancel your order, simply email <SupportEmailLink /> with your order ID
            as soon as possible. We'll do our best to process your cancellation before your order is
            shipped.
          </PolicyParagraph>
          <PolicyParagraph>
            Once an order has been dispatched it can no longer be cancelled. From that point the{" "}
            <Link to="/refund-policy" className="underline" style={{ color: "var(--forest)" }}>
              Refund Policy
            </Link>{" "}
            applies instead.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection id="how-to-cancel" heading="How to Cancel">
          <StepFlow
            steps={[
              { label: "Email Us", detail: SUPPORT_EMAIL },
              { label: "Include Order ID" },
              { label: "We Confirm", detail: "Before dispatch" },
              { label: "Refund Issued" },
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
