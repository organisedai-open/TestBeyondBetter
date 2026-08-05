import { createFileRoute } from "@tanstack/react-router";

import {
  PolicyPageShell,
  PolicyHero,
  PolicyContent,
  PolicySection,
  PolicyParagraph,
  PolicyList,
  RelatedPolicies,
} from "@/components/PolicyPage";
import { buildPolicyPageHead } from "@/lib/seo";

const PATH = "/terms-and-conditions";
const TITLE = "Terms & Conditions — Beyond Better";
const DESCRIPTION =
  "The terms that govern purchases from Beyond Better, our premium science-backed dietary supplement store.";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () =>
    buildPolicyPageHead({
      path: PATH,
      title: TITLE,
      description: DESCRIPTION,
      breadcrumbName: "Terms & Conditions",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PolicyPageShell>
      <PolicyHero
        eyebrow="Legal"
        title="Terms & Conditions"
        lastUpdated="August 2026"
        intro="Welcome to Beyond Better. By accessing or purchasing from our website, you agree to these Terms & Conditions."
        breadcrumbLabel="Terms & Conditions"
      />
      <PolicyContent>
        <PolicySection id="products" heading="Products">
          <PolicyParagraph>
            Our products are dietary supplements intended to support general wellness.
          </PolicyParagraph>
          <PolicyParagraph>
            They are not medicines and are not intended to diagnose, treat, cure or prevent any
            disease.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection id="orders" heading="Orders">
          <PolicyParagraph>
            We reserve the right to accept, reject or cancel any order where necessary, including:
          </PolicyParagraph>
          <PolicyList items={["suspected fraud", "pricing errors", "inventory issues"]} />
        </PolicySection>

        <PolicySection id="pricing" heading="Pricing">
          <PolicyParagraph>Prices may change without prior notice.</PolicyParagraph>
        </PolicySection>

        <PolicySection id="intellectual-property" heading="Intellectual Property">
          <PolicyParagraph>
            All website content including logos, graphics, product images and written material
            belongs to Beyond Better unless otherwise stated.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection id="limitation-of-liability" heading="Limitation of Liability">
          <PolicyParagraph>
            Beyond Better shall not be liable for indirect, incidental or consequential damages
            arising from the use of this website or its products.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection id="governing-law" heading="Governing Law">
          <PolicyParagraph>These Terms shall be governed by the laws of India.</PolicyParagraph>
        </PolicySection>

        <RelatedPolicies currentPath={PATH} />
      </PolicyContent>
    </PolicyPageShell>
  );
}
