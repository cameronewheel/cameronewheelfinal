import { createFileRoute, Link } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { kit, site, sponsors } from "@/lib/site-data";

export const Route = createFileRoute("/sponsors")({ component: SponsorsPage });

function SponsorsPage() {
  return (
    <main>
      <div className="page-wrap py-10 sm:py-16">
        <PageHero index="05" kicker="Sponsors" title="Who I ride for">
          Parts, not travel. I race first.
        </PageHero>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {sponsors.map((s) => (
            <a
              key={s.name}
              href={`/go/${s.href}`}
              rel="noreferrer"
              className="work-card flex flex-col p-6"
            >
              <p className="index-kicker">{s.kind}</p>
              <p className="mt-2 font-display text-2xl font-semibold">{s.name}</p>
              <p className="mt-2 flex-1 text-sm text-muted">{s.role}</p>
              <p className="mt-5 text-sm font-semibold text-fg">Visit →</p>
            </a>
          ))}
        </div>
      </div>

      <section className="border-y border-border bg-tint">
        <div className="page-wrap py-14 sm:py-16">
          <h2 className="text-3xl">Short kit</h2>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Rider", `${site.rider}, 27`],
              ["Based", site.location],
              ["YouTube", `${site.youtubeHandle} · ${site.subscribers}`],
              ["Instagram", site.instagramHandle],
              ["Race board", kit.board],
              ["Recent", kit.recent],
            ].map(([label, value]) => (
              <div key={label} className="work-card p-5">
                <dt className="index-kicker">{label}</dt>
                <dd className="mt-2 font-display text-lg font-semibold">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="page-wrap py-16 sm:py-20">
        <div className="mx-auto max-w-xl">
          <p className="index-kicker">Brands</p>
          <h2 className="mt-4 text-3xl">Contact me for sponsorship</h2>
          <p className="mt-3 max-w-md text-muted">
            Brands only. Nothing sends from this page — copy the note.
            Everything else goes to{" "}
            <Link
              to="/contact"
              className="font-medium text-fg underline decoration-border underline-offset-4 hover:decoration-fg"
            >
              contact
            </Link>
            .
          </p>
          <div className="mt-8">
            <ContactForm intent="sponsorship" />
          </div>
        </div>
      </div>
    </main>
  );
}
