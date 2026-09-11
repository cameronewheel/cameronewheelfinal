import { createFileRoute } from "@tanstack/react-router";
import { LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/video-card";
import { cn } from "@/lib/utils";
import {
  videos,
  watchCategories,
  type WatchCategory,
} from "@/lib/site-data";

export const Route = createFileRoute("/watch")({ component: WatchPage });

function WatchPage() {
  const [filter, setFilter] = useState<WatchCategory | "all">("all");

  const list = useMemo(() => {
    if (filter === "all") return videos;
    return videos.filter((v) => v.category === filter);
  }, [filter]);

  return (
    <main className="page-wrap py-10 sm:py-16">
      <PageHero index="03" kicker="Watch" title="Videos">
        Shelves, not a second YouTube. Race weekends also sit on the result they
        belong to.
      </PageHero>

      <LayoutGroup>
        <div
          className="-mx-5 mt-8 flex flex-nowrap gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0"
          role="tablist"
          aria-label="Category"
        >
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </FilterChip>
          {watchCategories.map((cat) => (
            <FilterChip
              key={cat.id}
              active={filter === cat.id}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </FilterChip>
          ))}
        </div>
      </LayoutGroup>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {list.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="accent" size="lg">
          <a href="/go/youtube" rel="noreferrer">
            More on YouTube
          </a>
        </Button>
      </div>
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active ? "true" : "false"}
      className={cn("filter-chip", active && "text-bg")}
    >
      {active ? (
        <motion.span
          layoutId="watch-pill"
          className="absolute inset-0 rounded-[0.6rem] bg-fg"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
