import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/builds")({
  beforeLoad: () => {
    throw redirect({ to: "/garage" });
  },
  component: () => null,
});
