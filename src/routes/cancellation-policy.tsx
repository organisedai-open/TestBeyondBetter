import { createFileRoute } from "@tanstack/react-router";

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

const PATH = "/cancellation-policy";
const TITLE = "Cancellation Policy — Beyond Better";
const DESCRIPTION =
  "Beyond Better orders can be cancelled for a full refund any time before they ship. The current batch ships August 20, 2026 — here's how to cancel.";
const LAST_UPDATED = "August 2026";
// Human-readable form of pricing.ts's RESTOCK_DATE_ISO ("2026-08-20"), matching the wording
// already used sitewide (e.g. PREORDER_FULL_PAYMENT_NOTE). Kept as a literal, like every other
// on-page date on this site, rather than importing and formatting RESTOCK_DATE_ISO -- update
// both together if the ship date ever moves.
const SHIP_DATE_HUMAN = "August 20, 2026";
// Not specified by the site owner as of Phase 3 -- flagged rather than invented. Replace with a
// real figure (and delete this comment) before this page ships.
const REFUND_TIMELINE_PLACEHOLDER = "[X business days — confirm with owner]";

const FAQS = [
  {
    question: "Can I cancel my order?",
    answer: `Yes — orders can be cancelled for a full refund any time before your batch ships. The current batch ships ${SHIP_DATE_HUMAN}. Once your order has shipped, it's no longer eligible for cancellation or refund.`,
  },
  {
    question: "How do I cancel my order?",
    answer: `Email ${SUPPORT_EMAIL} with your order ID. This is currently the only way we can process a cancellation request — we don't yet offer a self-serve cancel option, live chat or phone line.`,
  },
  {
    question: "How long does a refund take after I cancel?",
    answer: `Refunds for cancelled orders are processed to your original payment method within ${REFUND_TIMELINE_PLACEHOLDER}.`,
  },
  {
    question: "What happens if my order has already shipped?",
    answer:
      "Once an order has shipped, it is no longer eligible for cancellation or refund under this policy.",
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
        intro={`Charged in full today, ships ${SHIP_DATE_HUMAN} — here's exactly when and how you can cancel for a full refund before then.`}
        breadcrumbLabel="Cancellation Policy"
      />
      <PolicyContent>
        <div className="mb-11">
          <TrustBadges />
        </div>
        <WhoWeAreBlock />

        <PolicySection id="cancelling-an-order" heading="Cancelling Your Order">
          <PolicyParagraph>
            Orders are eligible for full cancellation and refund any time before they ship. The
            current batch is scheduled to ship {SHIP_DATE_HUMAN}.
          </PolicyParagraph>
          <PolicyParagraph>
            To cancel, email <SupportEmailLink /> with your order ID. This is currently the only way
            we can process a cancellation — we don't yet offer a self-serve cancel option, live chat
            or phone line.
          </PolicyParagraph>
          <PolicyParagraph>
            Once an order has shipped, it is no longer eligible for cancellation or refund under
            this policy.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection id="how-to-cancel" heading="How to Cancel">
          <StepFlow
            steps={[
              { label: "Email Us", detail: SUPPORT_EMAIL },
              { label: "Include Order ID" },
              { label: "We Confirm", detail: "Before your batch ships" },
              { label: "Refund Issued", detail: REFUND_TIMELINE_PLACEHOLDER },
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
