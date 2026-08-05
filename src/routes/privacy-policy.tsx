import { createFileRoute } from "@tanstack/react-router";

import {
  PolicyPageShell,
  PolicyHero,
  PolicyContent,
  PolicySection,
  PolicyParagraph,
  PolicyList,
  RelatedPolicies,
  WhoWeAreBlock,
  TrustBadges,
  PolicyClosing,
} from "@/components/PolicyPage";
import { buildPolicyPageHead } from "@/lib/seo";

const PATH = "/privacy-policy";
const TITLE = "Privacy Policy — Beyond Better";
const DESCRIPTION =
  "How Beyond Better collects, uses and protects your personal information when you shop for our science-backed dietary supplements.";
const LAST_UPDATED = "August 2026";

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
        lastUpdated={LAST_UPDATED}
        readingTime="2 min read"
        intro="Beyond Better respects your privacy and is committed to protecting your personal information."
        breadcrumbLabel="Privacy Policy"
      />
      <PolicyContent>
        <div className="mb-11">
          <TrustBadges />
        </div>
        <WhoWeAreBlock />

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
          <PolicyParagraph>
            We use Razorpay, a PCI-DSS compliant payment processor, and our checkout is secured with
            SSL encryption to help keep your payment information safe.
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

        <RelatedPolicies currentPath={PATH} />
        <PolicyClosing lastUpdated={LAST_UPDATED} />
      </PolicyContent>
    </PolicyPageShell>
  );
}
