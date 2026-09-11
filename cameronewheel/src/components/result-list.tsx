import { PlayMark } from "@/components/play-mark";
import { cn } from "@/lib/utils";
import { youtubeThumb, youtubeWatch, type Result } from "@/lib/site-data";

export function ResultRow({
  result,
  showThumb = true,
}: {
  result: Result;
  showThumb?: boolean;
}) {
  const mutedPlace =
    result.place === "DNF" || result.place === "DNS" || result.place === "—";

  return (
    <li data-journey={result.venue ? `${result.year}:${result.venue}` : undefined}>
      <div className="flex items-center gap-3 py-4 sm:gap-5">
        <div className="w-14 shrink-0">
          <p
            className={cn(
              "font-display text-lg font-semibold leading-none sm:text-xl",
              mutedPlace ? "text-muted" : "text-accent",
            )}
          >
            {result.place}
            {result.unconfirmed ? "*" : ""}
          </p>
        </div>

        {showThumb && result.videoId ? (
          <a
            href={youtubeWatch(result.videoId)}
            rel="noreferrer"
            target="_blank"
            className="relative hidden aspect-video h-12 shrink-0 overflow-hidden rounded-md bg-surface sm:block sm:h-14"
            aria-label={`Watch ${result.event}`}
          >
            <img
              src={youtubeThumb(result.videoId)}
              alt=""
              className="h-full w-full object-cover"
              width={320}
              height={180}
            />
          </a>
        ) : null}

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold leading-snug text-fg sm:text-lg">
            {result.event}
          </p>
          <p className="mt-0.5 truncate text-sm text-muted">
            {result.className}
            {result.location ? ` · ${result.location}` : ""}
          </p>
        </div>

        {result.videoId ? (
          <a
            href={youtubeWatch(result.videoId)}
            rel="noreferrer"
            target="_blank"
            className="text-action"
          >
            Watch
          </a>
        ) : null}

        {result.time ? (
          <p className="hidden shrink-0 text-sm tabular-nums text-muted sm:block">
            {result.time}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export function ResultList({
  items,
  showThumb = true,
}: {
  items: Result[];
  showThumb?: boolean;
}) {
  return (
    <ol className="divide-y divide-border border-y border-border">
      {items.map((result) => (
        <ResultRow key={result.id} result={result} showThumb={showThumb} />
      ))}
    </ol>
  );
}

export function ResultCard({
  result,
  index,
}: {
  result: Result;
  index?: number;
}) {
  const inner = (
    <>
      <div className="thumb-wrap">
        {result.videoId ? (
          <img
            src={youtubeThumb(result.videoId)}
            alt=""
            width={640}
            height={360}
          />
        ) : (
          <div className="h-full w-full bg-surface" />
        )}
        {result.videoId ? <PlayMark /> : null}
        {index ? (
          <span className="card-index">{String(index).padStart(2, "0")}</span>
        ) : null}
        <span className="place-pill">
          {result.place}
          {result.unconfirmed ? "*" : ""}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold leading-snug text-fg">
            {result.event}
          </p>
          <p className="mt-1 truncate text-sm text-muted">
            {result.className}
            {result.location ? ` · ${result.location}` : ""}
          </p>
        </div>
        {result.time ? (
          <p className="shrink-0 text-sm tabular-nums text-muted">
            {result.time}
          </p>
        ) : null}
      </div>
    </>
  );

  if (result.videoId) {
    return (
      <a
        href={youtubeWatch(result.videoId)}
        rel="noreferrer"
        target="_blank"
        className="work-card block"
      >
        {inner}
      </a>
    );
  }

  return <article className="work-card">{inner}</article>;
}
