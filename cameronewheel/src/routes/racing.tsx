import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/racing")({
  beforeLoad: () => {
    throw redirect({ to: "/results" });
  },
  component: () => null,
});
