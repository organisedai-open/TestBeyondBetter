import { createFileRoute } from "@tanstack/react-router";

import {
  PolicyPageShell,
  PolicyHero,
  PolicyContent,
  PolicySection,
  PolicyParagraph,
  PolicyList,
  RelatedPolicies,
  SupportEmailLink,
} from "@/components/PolicyPage";
import { buildPolicyPageHead } from "@/lib/seo";

const PATH = "/privacy-policy";
const TITLE = "Privacy Policy — Beyond Better";
const DESCRIPTION =
  "How Beyond Better collects, uses and protects your personal information when you shop for our science-backed dietary supplements.";

export const Route = createFileRoute("/privacy-policy")({
  head: () =>
    buildPolicyPageHead({
      path: PATH,
      title: TITLE,
      description: DESCRIPTION,
      breadcrumbName: "Privacy Policy",
    }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <PolicyPageShell>
      <PolicyHero
        eyebrow="Legal"
        title="Privacy Policy"
        lastUpdated="August 2026"
        intro="Beyond Better respects your privacy and is committed to protecting your personal information."
        breadcrumbLabel="Privacy Policy"
      />
      <PolicyContent>
        <PolicySection id="information-we-collect" heading="Information We Collect">
          <PolicyParagraph>We may collect:</PolicyParagraph>
          <PolicyList
            items={[
              "Name",
              "Email address",
              "Phone number",
              "Shipping and billing address",
              "Payment-related information (processed securely through our payment partners)",
              "Device, browser and website usage information",
            ]}
          />
        </PolicySection>

        <PolicySection id="how-we-use-your-information" heading="How We Use Your Information">
          <PolicyParagraph>Your information is used to:</PolicyParagraph>
          <PolicyList
            items={[
              "Process and deliver orders",
              "Provide customer support",
              "Improve our website and services",
              "Send order updates",
              "Comply with legal obligations",
            ]}
          />
        </PolicySection>

        <PolicySection id="payment-information" heading="Payment Information">
          <PolicyParagraph>
            Payments are processed securely through trusted third-party payment providers.
          </PolicyParagraph>
          <PolicyParagraph>
            Beyond Better does not store your complete payment card details.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection id="cookies" heading="Cookies">
          <PolicyParagraph>
            Our website may use cookies and analytics technologies to improve user experience and
            website performance.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection id="data-protection" heading="Data Protection">
          <PolicyParagraph>
            We take commercially reasonable security measures to protect customer information from
            unauthorized access or misuse.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection id="third-party-services" heading="Third-Party Services">
          <PolicyParagraph>Our website may use third-party services for:</PolicyParagraph>
          <PolicyList items={["payment processing", "shipping", "analytics", "customer support"]} />
        </PolicySection>

        <PolicySection id="contact" heading="Contact">
          <PolicyParagraph>
            If you have questions regarding this Privacy Policy, please contact us at{" "}
            <SupportEmailLink />.
          </PolicyParagraph>
        </PolicySection>

        <RelatedPolicies currentPath={PATH} />
      </PolicyContent>
    </PolicyPageShell>
  );
}
