import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AppShell } from "@/components/layout/AppShell";

function NotFoundComponent() {
  return (
    <div className="dark min-h-screen grid place-items-center bg-background text-foreground">
      <div className="text-center">
        <div className="font-mono text-xs text-muted-foreground">ERR_ROUTE_404</div>
        <h1 className="text-3xl font-semibold mt-2">Route not found</h1>
        <a href="/" className="inline-block mt-4 text-primary text-sm hover:underline">Return to console →</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="dark min-h-screen grid place-items-center bg-background text-foreground">
      <div className="max-w-md text-center">
        <div className="font-mono text-xs text-destructive">RUNTIME_EXCEPTION</div>
        <h1 className="text-xl font-semibold mt-2">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 h-8 px-3 rounded bg-primary text-primary-foreground text-sm">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Skyloom OPS — O&D Admin Portal" },
      { name: "description", content: "Enterprise Origin & Destination configuration, simulation, and governance for airline network planning." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body className="dark">{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
