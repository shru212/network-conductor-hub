import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Route as RouteIcon, Plus, FlaskConical, Network,
  ShieldCheck, Users, Upload, BarChart3, Search, Bell, Command, Plane, ChevronRight
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { to: "/routes", label: "O&D Configurations", icon: RouteIcon, group: "Network" },
  { to: "/routes/new", label: "Create O&D", icon: Plus, group: "Network" },
  { to: "/simulation", label: "Route Simulation", icon: FlaskConical, group: "Network" },
  { to: "/dependencies", label: "Dependency Graph", icon: Network, group: "Network" },
  { to: "/analytics", label: "Analytics", icon: BarChart3, group: "Insights" },
  { to: "/audit", label: "Audit & Governance", icon: ShieldCheck, group: "Governance" },
  { to: "/rbac", label: "Access Control", icon: Users, group: "Governance" },
  { to: "/bulk", label: "Bulk & APIs", icon: Upload, group: "Governance" },
];

const groups = ["Overview", "Network", "Insights", "Governance"];

export function AppShell() {
  const { location } = useRouterState();
  const path = location.pathname;

  const crumb = nav.find(n => n.to === path)?.label ?? "Workspace";

  return (
    <div className="dark min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="h-12 flex items-center gap-2 px-4 border-b border-sidebar-border">
          <div className="size-7 rounded-md bg-primary/15 text-primary grid place-items-center">
            <Plane className="size-4 -rotate-45" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight">Skyloom OPS</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">O&amp;D Admin</div>
          </div>
        </div>
        <div className="px-3 py-2 border-b border-sidebar-border">
          <div className="flex items-center gap-2 h-8 px-2 rounded-md bg-surface-2/60 border border-border text-xs text-muted-foreground">
            <Search className="size-3.5" />
            <span className="flex-1">Search routes, jobs…</span>
            <kbd className="font-mono text-[10px] bg-surface-3 px-1.5 py-0.5 rounded">⌘K</kbd>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {groups.map(g => (
            <div key={g} className="px-3 mt-2 first:mt-0">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 px-2 py-1">{g}</div>
              {nav.filter(n => n.group === g).map(n => {
                const Icon = n.icon;
                const active = path === n.to || (n.to !== "/" && path.startsWith(n.to));
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`flex items-center gap-2.5 px-2 h-8 rounded-md text-[13px] transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {n.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-gradient-to-br from-primary/40 to-info/40 grid place-items-center text-[11px] font-semibold">AZ</div>
            <div className="flex-1 leading-tight min-w-0">
              <div className="text-[12px] font-medium truncate">A. Alzahrani</div>
              <div className="text-[10px] text-muted-foreground">Senior Analyst · NPL</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 border-b border-border bg-surface/60 backdrop-blur flex items-center px-4 gap-4">
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <span>Network Planning</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">{crumb}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground border border-border rounded px-2 h-7">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              ENV: PRD · 24 services healthy
            </div>
            <button className="h-7 px-2 rounded border border-border text-[12px] hover:bg-surface-2 flex items-center gap-1.5">
              <Command className="size-3.5" /> Command
            </button>
            <button className="size-7 rounded border border-border grid place-items-center hover:bg-surface-2 relative">
              <Bell className="size-3.5" />
              <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-destructive text-[9px] grid place-items-center font-semibold">5</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
