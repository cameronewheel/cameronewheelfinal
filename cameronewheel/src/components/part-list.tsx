import { cn } from "@/lib/utils";
import { affiliates, type Part } from "@/lib/site-data";

export function PartList({
  parts,
  compact = false,
}: {
  parts: Part[];
  compact?: boolean;
}) {
  return (
    <ul
      className={cn(
        "border-y border-border",
        compact
          ? "grid sm:grid-cols-2 sm:gap-x-10"
          : "divide-y divide-border",
      )}
    >
      {parts.map((part) => (
        <li
          key={part.name}
          className={cn(
            "flex items-baseline justify-between gap-4 py-3",
            compact && "border-b border-border",
            !compact &&
              "flex-col gap-2 sm:flex-row sm:items-start sm:gap-6 sm:py-4",
          )}
        >
          <div className="min-w-0">
            <p className="font-medium leading-snug">{part.name}</p>
            <p className="mt-0.5 text-sm text-muted">{part.role}</p>
            {!compact && part.why ? (
              <p className="mt-1 max-w-prose text-sm text-muted">{part.why}</p>
            ) : null}
          </div>
          {part.affiliate ? (
            <a
              href={`/go/${part.affiliate}`}
              rel={
                affiliates[part.affiliate].sponsored
                  ? "noreferrer sponsored"
                  : "noreferrer"
              }
              className="text-action"
            >
              Shop
            </a>
          ) : (
            <p className="shrink-0 self-center text-sm text-subtle">Custom</p>
          )}
        </li>
      ))}
    </ul>
  );
}
