import { ResultRow } from "@/components/result-list";
import { youtubeWatch, type TimelineItem } from "@/lib/site-data";

export function BeatRow({
  label,
  line,
  placeholder,
  videoId,
  year,
  venue,
}: {
  label: string;
  line: string;
  placeholder?: boolean;
  videoId?: string;
  year?: number;
  venue?: string;
}) {
  return (
    <li data-journey={year && venue ? `${year}:${venue}` : undefined}>
      <div className="flex items-center gap-3 py-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-subtle">
            {label}
            {placeholder ? " · TBD" : ""}
          </p>
          <p className="mt-0.5 text-fg">{line}</p>
        </div>
        {videoId ? (
          <a
            href={youtubeWatch(videoId)}
            rel="noreferrer"
            target="_blank"
            className="text-action"
          >
            Watch
          </a>
        ) : null}
      </div>
    </li>
  );
}

export function JourneyList({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="divide-y divide-border border-y border-border">
      {items.map((item) =>
        item.type === "race" ? (
          <ResultRow key={item.id} result={item.result} />
        ) : (
          <BeatRow
            key={item.id}
            label={item.beat.label}
            line={item.beat.line}
            placeholder={item.beat.placeholder}
            videoId={item.beat.videoId}
            year={item.year}
            venue={item.beat.venue}
          />
        ),
      )}
    </ol>
  );
}
