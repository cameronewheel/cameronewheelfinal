import { Link } from "@tanstack/react-router";
import { nav, site } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="page-wrap py-14 sm:py-20">
        <p className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
          {site.name}
        </p>
        <p className="mt-4 max-w-md text-muted">
          {site.rider}. {site.location}.
        </p>
        <nav
          className="mt-10 flex flex-wrap gap-x-6 gap-y-0"
          aria-label="Footer"
        >
          <Link
            to="/"
            className="inline-flex h-11 items-center text-sm text-subtle hover:text-fg"
          >
            Home
          </Link>
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="inline-flex h-11 items-center text-sm text-subtle hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-subtle">
          Some shop links are affiliates (The Float Life code CAMERONEWHEEL,
          Landed Footwear). I may earn a commission. Results are mine — not a
          league table. Full standings live on{" "}
          <a href="/go/usaflt" className="underline hover:text-fg">
            USA FLT
          </a>
          . Updated {site.updated}.
        </p>
      </div>
    </footer>
  );
}
