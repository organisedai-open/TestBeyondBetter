import { createFileRoute } from "@tanstack/react-router";

import {
  PolicyPageShell,
  PolicyHero,
  PolicyContent,
  PolicySection,
  PolicyAnswer,
  PolicyParagraph,
  RelatedPolicies,
  SupportEmailLink,
} from "@/components/PolicyPage";
import { buildPolicyPageHead } from "@/lib/seo";

const PATH = "/shipping-policy";
const TITLE = "Shipping Policy — Beyond Better";
const DESCRIPTION =
  "Shipping coverage, processing times and delivery timelines for Beyond Better orders across India.";

const WHERE_ANSWER = "Beyond Better currently ships across India.";
const PROCESSING_ANSWER =
  "Orders are typically processed within 1–2 business days after payment confirmation.";
const DELIVERY_ANSWER =
  "Delivery timelines depend on the customer's location and the courier partner but are generally completed within 3–7 business days.";
const TRACKING_ANSWER =
  "Customers will receive shipment tracking details once the order has been dispatched.";
const DELAYS_ANSWER =
  "While we strive to deliver within estimated timelines, delays caused by courier partners, weather, public holidays, or unforeseen circumstances may occur.";
const RETURNED_ORDER_ANSWER =
  "If an order is returned to us because of an incorrect shipping address or repeated failed delivery attempts, additional shipping charges may apply for reshipment.";

export const Route = createFileRoute("/shipping-policy")({
  head: () =>
    buildPolicyPageHead({
      path: PATH,
      title: TITLE,
      description: DESCRIPTION,
      breadcrumbName: "Shipping Policy",
      faqs: [
        { question: "Where does Beyond Better ship?", answer: WHERE_ANSWER },
        { question: "How long does order processing take?", answer: PROCESSING_ANSWER },
        { question: "How long does delivery take?", answer: DELIVERY_ANSWER },
        { question: "Will I be able to track my order?", answer: TRACKING_ANSWER },
        {
          question: "What if my order is returned due to an address or delivery issue?",
          answer: RETURNED_ORDER_ANSWER,
        },
      ],
    }),
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  return (
    <PolicyPageShell>
      <PolicyHero
        eyebrow="Legal"
        title="Shipping Policy"
        lastUpdated="August 2026"
        breadcrumbLabel="Shipping Policy"
      />
      <PolicyContent>
        <PolicySection id="delivery" heading="Delivery">
          <PolicyAnswer question="Where does Beyond Better ship?">
            <PolicyParagraph>{WHERE_ANSWER}</PolicyParagraph>
          </PolicyAnswer>

          <PolicyAnswer question="How long does order processing take?">
            <PolicyParagraph>{PROCESSING_ANSWER}</PolicyParagraph>
          </PolicyAnswer>

          <PolicyAnswer question="How long does delivery take?">
            <PolicyParagraph>{DELIVERY_ANSWER}</PolicyParagraph>
          </PolicyAnswer>

          <PolicyAnswer question="Will I be able to track my order?">
            <PolicyParagraph>{TRACKING_ANSWER}</PolicyParagraph>
          </PolicyAnswer>

          <PolicyAnswer question="What if there's a delay?">
            <PolicyParagraph>{DELAYS_ANSWER}</PolicyParagraph>
          </PolicyAnswer>

          <PolicyAnswer question="What if my order is returned due to an address or delivery issue?">
            <PolicyParagraph>{RETURNED_ORDER_ANSWER}</PolicyParagraph>
          </PolicyAnswer>
        </PolicySection>

        <PolicySection id="questions" heading="Shipping Questions">
          <PolicyParagraph>
            For shipping-related questions, customers may contact our support team at{" "}
            <SupportEmailLink />.
          </PolicyParagraph>
        </PolicySection>

        <RelatedPolicies currentPath={PATH} />
      </PolicyContent>
    </PolicyPageShell>
  );
}
