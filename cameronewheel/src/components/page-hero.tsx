import type { ReactNode } from "react";

export function PageHero({
  kicker,
  index,
  title,
  children,
}: {
  kicker: string;
  index?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="max-w-2xl">
      <p className="index-kicker">
        {index ? <em>{index}</em> : null}
        {kicker}
      </p>
      <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
      {children ? (
        <div className="mt-4 max-w-xl text-base text-muted sm:text-lg">
          {children}
        </div>
      ) : null}
    </header>
  );
}

export function SectionHead({
  kicker,
  index,
  title,
  children,
  center = false,
}: {
  kicker: string;
  index?: string;
  title: string;
  children?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="index-kicker">
        {index ? <em>{index}</em> : null}
        {kicker}
      </p>
      <h2 className="mt-4 text-3xl sm:text-4xl">{title}</h2>
      {children ? (
        <p
          className={`mt-3 text-muted ${center ? "mx-auto max-w-xl" : "max-w-xl"}`}
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}
