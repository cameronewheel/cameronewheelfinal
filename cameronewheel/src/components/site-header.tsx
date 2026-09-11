import { Link } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { nav, site } from "@/lib/site-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-[70] border-b border-border bg-bg/90 text-fg backdrop-blur-md">
        <div className="page-wrap flex h-14 items-center justify-between gap-3">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5 text-fg"
            onClick={() => setOpen(false)}
          >
            <Mark className="size-7 text-fg" />
            <span className="font-display text-sm font-semibold tracking-tight">
              {site.name}
            </span>
          </Link>

          <nav className="hidden min-w-0 items-center lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} className="nav-link">
                {item.label}
              </Link>
            ))}
            <Button asChild size="sm" variant="default" className="ml-2 shrink-0">
              <Link to="/sponsors">Work with me</Link>
            </Button>
          </nav>

          <button
            type="button"
            className="menu-toggle lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {open ? (
        <div
          id={menuId}
          className="site-menu lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <nav className="page-wrap flex flex-col" aria-label="Menu">
            <Link to="/" className="menu-link" onClick={() => setOpen(false)}>
              Home
            </Link>
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="menu-link"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/go/youtube"
              rel="noreferrer"
              className="menu-link"
              onClick={() => setOpen(false)}
            >
              YouTube
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}
