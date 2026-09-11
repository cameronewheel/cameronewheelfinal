import { createFileRoute } from "@tanstack/react-router";
import { JourneyList } from "@/components/journey-list";
import { SeasonStage } from "@/components/season-stage";
import { PageHero } from "@/components/page-hero";
import { timelineForYear } from "@/lib/site-data";
import { seasonRoutes } from "@/lib/venues";

export const Route = createFileRoute("/results")({ component: ResultsPage });

function earlierYears() {
  return Object.entries(seasonRoutes)
    .filter(([, ids]) => ids.length <= 1)
    .map(([year]) => Number(year))
    .sort((a, b) => b - a);
}

function ResultsPage() {
  const earlier = earlierYears();

  return (
    <main>
      <div className="page-wrap py-10 sm:py-16">
        <PageHero index="01" kicker="Results" title="The journey">
          Newest year first. Each season starts at home and drives in order.
          Between stops the map comes forward. On a race it falls back. League
          standings stay on{" "}
          <a
            href="/go/usaflt"
            className="font-medium text-fg underline decoration-border underline-offset-4 hover:decoration-fg"
          >
            USA FLT
          </a>
          .
        </PageHero>
      </div>

      <SeasonStage />

      {earlier.map((year) => (
        <section key={year} className="page-wrap mt-16">
          <h2 className="font-display text-2xl tabular-nums">
            {year === 2022 ? "Earlier" : year}
          </h2>
          <div className="work-card mt-5 px-5 py-2 sm:px-7">
            <JourneyList items={timelineForYear(year)} />
          </div>
        </section>
      ))}
    </main>
  );
}
