import { type ReactNode } from "react";
import { type RouteStatus } from "@/lib/mockData";

export function Panel({ title, action, children, dense = false, className = "" }: { title?: ReactNode; action?: ReactNode; children: ReactNode; dense?: boolean; className?: string }) {
  return (
    <section className={`bg-surface border border-border rounded-md ${className}`}>
      {title && (
        <header className="h-10 px-3.5 flex items-center justify-between border-b border-border">
          <div className="text-[12px] font-semibold tracking-wide uppercase text-muted-foreground">{title}</div>
          {action}
        </header>
      )}
      <div className={dense ? "" : "p-4"}>{children}</div>
    </section>
  );
}

export function StatusPill({ status }: { status: RouteStatus | string }) {
  const map: Record<string, string> = {
    active: "bg-success/15 text-success border-success/30",
    draft: "bg-muted text-muted-foreground border-border-strong",
    pending: "bg-warning/15 text-warning border-warning/30",
    failed: "bg-destructive/15 text-destructive border-destructive/30",
    archived: "bg-muted/50 text-muted-foreground border-border",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-1.5 h-5 rounded text-[10.5px] font-medium uppercase tracking-wider border ${map[status] ?? map.draft}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "info" | "warn" | "danger" | "success" }) {
  const map = {
    default: "bg-surface-2 text-foreground/80 border-border",
    info: "bg-info/10 text-info border-info/30",
    warn: "bg-warning/10 text-warning border-warning/30",
    danger: "bg-destructive/10 text-destructive border-destructive/30",
    success: "bg-success/10 text-success border-success/30",
  };
  return <span className={`inline-flex items-center px-1.5 h-5 rounded text-[10.5px] border font-mono ${map[tone]}`}>{children}</span>;
}

export function Sparkbar({ value, max = 100, tone = "primary" }: { value: number; max?: number; tone?: "primary" | "success" | "warning" | "danger" }) {
  const pct = Math.min(100, (value / max) * 100);
  const colorMap = { primary: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-destructive" };
  return (
    <div className="h-1.5 w-full bg-surface-3 rounded-sm overflow-hidden">
      <div className={`h-full ${colorMap[tone]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Btn({ children, variant = "default", size = "md", className = "", ...rest }: { children: ReactNode; variant?: "default" | "primary" | "ghost" | "danger"; size?: "sm" | "md" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    default: "bg-surface-2 border-border hover:bg-surface-3 text-foreground",
    primary: "bg-primary text-primary-foreground border-primary hover:opacity-90",
    ghost: "bg-transparent border-transparent hover:bg-surface-2 text-foreground",
    danger: "bg-destructive/15 text-destructive border-destructive/40 hover:bg-destructive/25",
  };
  const sizes = { sm: "h-7 px-2 text-[12px]", md: "h-8 px-3 text-[13px]" };
  return (
    <button className={`inline-flex items-center gap-1.5 rounded border font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="px-6 pt-5 pb-4 border-b border-border flex items-end justify-between gap-4">
      <div>
        <h1 className="text-[20px] font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
