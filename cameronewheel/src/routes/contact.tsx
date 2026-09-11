import { createFileRoute, Link } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  return (
    <main className="page-wrap py-10 sm:py-16">
      <PageHero index="07" kicker="Contact" title="Contact me">
        Events, questions, media. Nothing sends from this page — copy the note,
        open email, or use Instagram DMs. Brands looking to sponsor:{" "}
        <Link
          to="/sponsors"
          className="font-medium text-fg underline decoration-border underline-offset-4 hover:decoration-fg"
        >
          sponsorship
        </Link>
        .
      </PageHero>

      <div className="mt-12 max-w-xl">
        <ContactForm intent="general" />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <a href="/go/instagram" rel="noreferrer">
              {site.instagramHandle}
            </a>
          </Button>
          <Button asChild variant="accent">
            <a href="/go/youtube" rel="noreferrer">
              YouTube
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
