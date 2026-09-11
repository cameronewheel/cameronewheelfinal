import { createFileRoute } from "@tanstack/react-router";
import { KitExploded } from "@/components/kit-exploded";

export const Route = createFileRoute("/gear")({ component: GearPage });

function GearPage() {
  return (
    <main className="page-wrap py-8 sm:py-12">
      <KitExploded />
      <p className="mt-10 text-xs text-subtle">
        Shop links are affiliates. I may earn a commission.
      </p>
    </main>
  );
}
