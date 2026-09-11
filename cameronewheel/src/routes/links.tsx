import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { site, treeLinks } from "@/lib/site-data";

export const Route = createFileRoute("/links")({ component: LinksPage });

function LinksPage() {
  return (
    <main className="page-wrap py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <PageHero index="06" kicker={site.name} title="Links">
          One list. The Instagram bio points here.
        </PageHero>

        <ul className="mt-12 flex flex-col gap-3">
          {treeLinks.map((item) => (
            <li key={item.label}>
              {item.kind === "go" ? (
                <a href={`/go/${item.partner}`} className="work-card link-slab">
                  {item.label}
                  <ArrowUpRight />
                </a>
              ) : (
                <Link to={item.to} className="work-card link-slab">
                  {item.label}
                  <ArrowUpRight />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
