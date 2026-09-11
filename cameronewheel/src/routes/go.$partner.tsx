import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { affiliates, type AffiliateKey } from "@/lib/site-data";

export const Route = createFileRoute("/go/$partner")({
  component: GoPartner,
});

function isAffiliate(key: string): key is AffiliateKey {
  return key in affiliates;
}

function GoPartner() {
  const { partner } = Route.useParams();
  const dest = isAffiliate(partner) ? affiliates[partner] : null;

  useEffect(() => {
    if (dest) {
      window.location.replace(dest.url);
    }
  }, [dest]);

  if (!dest) {
    return (
      <main className="page-wrap flex min-h-[24rem] flex-col items-start justify-center py-16">
        <h1 className="text-3xl">Unknown link</h1>
        <p className="mt-3 max-w-md text-muted">
          That shop or social shortcut is not on this site.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Back home</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="page-wrap flex min-h-[24rem] flex-col items-start justify-center py-16">
      <h1 className="text-3xl">Opening {dest.label}</h1>
      <p className="mt-3 max-w-md text-muted">
        If nothing happens, continue with the link below.
      </p>
      <Button asChild className="mt-6">
        <a
          href={dest.url}
          rel={dest.sponsored ? "noreferrer sponsored" : "noreferrer"}
        >
          Continue
        </a>
      </Button>
    </main>
  );
}
