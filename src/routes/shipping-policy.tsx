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
} from "@/components/PolicyPage";
import { buildPolicyPageHead } from "@/lib/seo";

const PATH = "/shipping-policy";
const TITLE = "Shipping Policy — Beyond Better";
const DESCRIPTION =
  "Shipping coverage, processing times and delivery timelines for Beyond Better orders. Dispatched within 1–2 business days and shipped worldwide.";
const LAST_UPDATED = "August 2026";

const FAQS = [
  {
    question: "Where does Beyond Better ship?",
    answer: "Beyond Better ships worldwide.",
  },
  {
    question: "How long does order processing take?",
    answer: "Orders are typically processed within 1–2 business days after payment confirmation.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery timelines depend on the customer's location and the courier partner. Domestic orders within India are generally completed within 3–7 business days, while international deliveries may take longer depending on the destination and customs processing.",
  },
  {
    question: "Will I be able to track my order?",
    answer: "Customers will receive shipment tracking details once the order has been dispatched.",
  },
  {
    question: "What if my order is returned due to an address or delivery issue?",
    answer:
      "If an order is returned to us because of an incorrect shipping address or repeated failed delivery attempts, additional shipping charges may apply for reshipment.",
  },
];

export const Route = createFileRoute("/shipping-policy")({
  head: () =>
    buildPolicyPageHead({
      path: PATH,
      title: TITLE,
      description: DESCRIPTION,
      breadcrumbName: "Shipping Policy",
      faqs: FAQS,
    }),
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  return (
    <PolicyPageShell>
      <PolicyHero
        eyebrow="Legal"
        title="Shipping Policy"
        lastUpdated={LAST_UPDATED}
        readingTime="3 min read"
        breadcrumbLabel="Shipping Policy"
      />
      <PolicyContent>
        <div className="mb-11">
          <TrustBadges />
        </div>
        <WhoWeAreBlock />

        <PolicySection id="how-your-order-ships" heading="How Your Order Ships">
          <StepFlow
            steps={[
              { label: "Order Confirmed" },
              { label: "Packed" },
              { label: "Quality Check" },
              { label: "Dispatched" },
              { label: "Tracking Shared" },
              { label: "Delivered" },
            ]}
          />
        </PolicySection>

        <PolicySection id="delivery" heading="Delivery">
          <PolicyParagraph>Beyond Better ships worldwide.</PolicyParagraph>
          <PolicyParagraph>
            Orders are typically processed within 1–2 business days after payment confirmation.
          </PolicyParagraph>
          <PolicyParagraph>
            Delivery timelines depend on the customer's location and the courier partner. Domestic
            orders within India are generally completed within 3–7 business days, while
            international deliveries may take longer depending on the destination and customs
            processing.
          </PolicyParagraph>
          <PolicyParagraph>
            Customers will receive shipment tracking details once the order has been dispatched.
          </PolicyParagraph>
          <PolicyParagraph>
            While we strive to deliver within estimated timelines, delays caused by courier
            partners, weather, public holidays, or unforeseen circumstances may occur.
          </PolicyParagraph>
          <PolicyParagraph>
            If an order is returned to us because of an incorrect shipping address or repeated
            failed delivery attempts, additional shipping charges may apply for reshipment.
          </PolicyParagraph>
        </PolicySection>

        <FaqAccordionSection items={FAQS} />

        <RelatedPolicies currentPath={PATH} />
        <PolicyClosing lastUpdated={LAST_UPDATED} />
      </PolicyContent>
    </PolicyPageShell>
  );
}
