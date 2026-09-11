import { createFileRoute, Link } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact-form";
import { PartList } from "@/components/part-list";
import { ResultList } from "@/components/result-list";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/video-card";
import {
  featuredForYear,
  gear,
  gearShop,
  homeStrip,
  raceBoard,
  raceParts,
  site,
  sponsors,
  videos,
} from "@/lib/site-data";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const season = featuredForYear(site.currentSeason);
  const featured = videos.filter((v) => v.category !== "races").slice(0, 2);
  const gearPreview = gear.slice(0, 3);

  return (
    <main>
      <figure className="cover">
        <img
          src="/media/hero-nwef-2025.jpg"
          alt="Cameron Patecell racing a Onewheel on a forest trail at Northwest Electric Fest, bib 10, another rider behind."
          width={2400}
          height={1600}
        />
        <figcaption className="cover-caption">
          Northwest Electric Fest, 2025
        </figcaption>
      </figure>

      <div className="page-wrap py-10 sm:py-14">
        <p className="index-kicker">
          {site.location} · {site.currentSeason}
        </p>
        <h1 className="display-name mt-4 text-fg">
          <span className="block">Cameron</span>
          <span className="block">Patecell</span>
        </h1>
        <p className="mt-5 max-w-md text-lg text-muted">{site.oneLiner}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link to="/contact">Get in touch</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/sponsors">Work with me</Link>
          </Button>
          <a href="/go/youtube" rel="noreferrer" className="text-quiet">
            YouTube
          </a>
        </div>
      </div>

      <section id="season" className="page-wrap pb-12 sm:pb-16">
        <SectionLink
          kicker={String(site.currentSeason)}
          title="This season"
          to="/results"
          label="Full journey →"
        />
        <div className="mt-6">
          <ResultList items={season} showThumb={false} />
        </div>
      </section>

      <section className="border-y border-border bg-tint">
        <div className="page-wrap py-12 sm:py-16">
          <SectionLink
            kicker="Hardware"
            title="Current race board"
            to="/garage"
            label="Garage →"
          />
          <p className="mt-2 max-w-xl text-muted">{raceBoard.summary}</p>
          <div className="work-card mt-6 px-5">
            <PartList parts={raceParts} compact />
          </div>
        </div>
      </section>

      <section className="page-wrap py-12 sm:py-16">
        <SectionLink
          kicker="Watch"
          title="Videos"
          to="/watch"
          label="All videos →"
        />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {featured.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-tint">
        <div className="page-wrap py-12 sm:py-16">
          <SectionLink kicker="Gear" title="What I wear" to="/gear" label="Gear →" />
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {gearPreview.map((item) => {
              const shop = gearShop(item);
              return (
              <li
                key={item.name}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <p className="font-display font-semibold">{item.name}</p>
                  <p className="mt-0.5 truncate text-sm text-muted">{item.use}</p>
                </div>
                {shop ? (
                  <a
                    href={shop.href}
                    rel={shop.rel}
                    target={item.href ? "_blank" : undefined}
                    className="text-action"
                  >
                    Shop
                  </a>
                ) : null}
              </li>
            );
            })}
          </ul>
        </div>
      </section>

      <section className="page-wrap py-12 sm:py-16">
        <SectionLink
          kicker="Sponsors"
          title="Who I ride for"
          to="/sponsors"
          label="Sponsors →"
        />
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {sponsors.map((s) => (
            <li key={s.name} className="flex items-baseline justify-between gap-4 py-4">
              <div>
                <p className="font-display text-lg font-semibold">{s.name}</p>
                <p className="mt-0.5 text-sm text-muted">{s.role}</p>
              </div>
              <p className="index-kicker">{s.kind}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border">
        <div className="page-wrap py-3">
          <nav
            className="flex flex-wrap items-center text-sm text-muted"
            aria-label="Links"
          >
            {homeStrip.map((item, i) => (
              <span key={item.href} className="inline-flex items-center">
                {i > 0 ? (
                  <span className="mx-2.5 text-border" aria-hidden>
                    /
                  </span>
                ) : null}
                <a href={item.href} className="text-quiet">
                  {item.label}
                </a>
              </span>
            ))}
            <span className="mx-2.5 text-border" aria-hidden>
              /
            </span>
            <Link to="/links" className="text-quiet">
              All links
            </Link>
          </nav>
        </div>
      </section>

      <section className="page-wrap py-12 sm:py-16">
        <div className="mx-auto max-w-xl">
          <p className="index-kicker">Contact</p>
          <h2 className="mt-3 text-3xl">Get in touch</h2>
          <p className="mt-3 max-w-md text-muted">
            Events, questions, media. Nothing sends from this page — copy the
            note or open email.{" "}
            <Link
              to="/contact"
              className="font-medium text-fg underline decoration-border underline-offset-4 hover:decoration-fg"
            >
              Full contact
            </Link>
            .
          </p>
          <div className="mt-8">
            <ContactForm intent="general" compact />
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionLink({
  kicker,
  title,
  to,
  label,
}: {
  kicker: string;
  title: string;
  to: "/results" | "/garage" | "/watch" | "/gear" | "/sponsors";
  label: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="index-kicker">{kicker}</p>
        <h2 className="mt-2 text-3xl">{title}</h2>
      </div>
      <Link to={to} className="text-quiet">
        {label}
      </Link>
    </div>
  );
}
