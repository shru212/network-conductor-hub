import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/_app")({
  component: () => (
    <AppShell />
  ),
});

// Render outlet from shell
export const __unused = Outlet;
