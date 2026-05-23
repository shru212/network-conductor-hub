import { createFileRoute, Link } from "@tanstack/react-router";
import { kpis, activity, routes, pendingApprovals, failedJobs } from "@/lib/mockData";
import { Panel, StatusPill, Tag, Sparkbar, Btn, PageHeader } from "@/components/ui-bits/Bits";
import { TrendingUp, TrendingDown, AlertTriangle, Activity, ArrowUpRight, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Network Console — Skyloom OPS" }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div>
      <PageHeader title="Network Operations Console" subtitle="Real-time view of the O&D portfolio across all markets and channels.">
        <Btn size="sm">Saved view: All markets</Btn>
        <Btn size="sm" variant="primary">+ New O&D</Btn>
      </PageHeader>

      <div className="p-6 space-y-6">
        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px bg-border rounded-md overflow-hidden border border-border">
          {kpis.map(k => (
            <div key={k.label} className="bg-surface p-3.5">
              <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">{k.label}</div>
              <div className="flex items-baseline gap-2 mt-1.5">
                <div className="text-[22px] font-semibold tracking-tight font-mono">{k.value}</div>
                <div className={`text-[11px] font-medium flex items-center gap-0.5 ${k.trend === "up" ? "text-success" : "text-warning"}`}>
                  {k.trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {k.delta}
                </div>
              </div>
              <div className="text-[10.5px] text-muted-foreground mt-1">{k.hint}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recently modified */}
          <Panel
            className="xl:col-span-2"
            title="Recently modified O&D configurations"
            action={
              <Link to="/routes" className="text-[11px] text-primary hover:underline flex items-center gap-1">
                Open registry <ArrowUpRight className="size-3" />
              </Link>
            }
            dense
          >
            <table className="data-grid w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Route</th>
                  <th>Type</th>
                  <th>Carrier</th>
                  <th>Status</th>
                  <th>Health</th>
                  <th>Load</th>
                  <th>Modified</th>
                </tr>
              </thead>
              <tbody>
                {routes.slice(0, 9).map(r => (
                  <tr key={r.id} className="cursor-pointer">
                    <td className="font-mono text-[12px] text-muted-foreground">{r.id}</td>
                    <td>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-semibold">{r.origin}</span>
                        <span className="text-muted-foreground">→</span>
                        {r.via && <><span className="text-muted-foreground text-[11px]">{r.via}</span><span className="text-muted-foreground">→</span></>}
                        <span className="font-semibold">{r.destination}</span>
                      </div>
                      <div className="text-[10.5px] text-muted-foreground mt-0.5">{r.originCity} – {r.destCity}</div>
                    </td>
                    <td><Tag tone={r.type === "codeshare" ? "info" : r.type === "interline" ? "warn" : "default"}>{r.type}</Tag></td>
                    <td className="font-mono text-[12px]">{r.marketingCarrier}/{r.operatingCarrier}</td>
                    <td><StatusPill status={r.status} /></td>
                    <td className="w-28">
                      <div className="flex items-center gap-2">
                        <Sparkbar value={r.health} tone={r.health > 80 ? "success" : r.health > 60 ? "warning" : "danger"} />
                        <span className="font-mono text-[11px] w-7 text-right">{r.health}</span>
                      </div>
                    </td>
                    <td className="font-mono text-[12px]">{r.loadFactor}%</td>
                    <td className="text-[11.5px] text-muted-foreground">
                      <div>{r.modifiedAt.replace("T", " ")}</div>
                      <div className="text-[10.5px]">by {r.modifiedBy}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          {/* Activity */}
          <Panel title="Live activity stream" dense>
            <ul className="divide-y divide-border">
              {activity.map((a, i) => {
                const dot = a.level === "error" ? "bg-destructive" : a.level === "warn" ? "bg-warning" : a.level === "success" ? "bg-success" : "bg-info";
                return (
                  <li key={i} className="px-3.5 py-2.5 text-[12.5px] flex gap-2.5">
                    <span className={`size-1.5 rounded-full ${dot} mt-1.5 shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[10.5px] font-mono">
                        <span>{a.ts}</span><span>·</span><span>{a.user}</span>
                      </div>
                      <div className="leading-snug mt-0.5">
                        <span className="text-muted-foreground">{a.action}</span>{" "}
                        <span className="font-medium">{a.target}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Pending approvals */}
          <Panel
            title="Pending approvals"
            action={<span className="text-[11px] text-warning flex items-center gap-1"><AlertTriangle className="size-3" /> {pendingApprovals.length} in queue</span>}
            dense
          >
            <ul className="divide-y divide-border">
              {pendingApprovals.slice(0, 5).map(p => (
                <li key={p.id} className="px-3.5 py-3 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-mono text-[12.5px]">
                      <span className="font-semibold">{p.origin}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-semibold">{p.destination}</span>
                      <span className="text-muted-foreground text-[11px]">· {p.id}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Stage: {p.stage} · {p.requester}</div>
                  </div>
                  <div className="text-right">
                    <Tag tone={p.slaHours < 8 ? "danger" : p.slaHours < 16 ? "warn" : "default"}>{p.slaHours}h SLA</Tag>
                  </div>
                </li>
              ))}
              {pendingApprovals.length === 0 && <li className="p-4 text-[12px] text-muted-foreground">No approvals waiting.</li>}
            </ul>
          </Panel>

          {/* Failed jobs */}
          <Panel title="Failed publish jobs (24h)" dense>
            <ul className="divide-y divide-border">
              {failedJobs.map(j => (
                <li key={j.id} className="px-3.5 py-3">
                  <div className="flex items-center gap-2 font-mono text-[12.5px]">
                    <span>{j.origin}</span><span className="text-muted-foreground">→</span><span>{j.destination}</span>
                    <span className="text-muted-foreground text-[11px] ml-auto">{j.id}</span>
                  </div>
                  <div className="text-[11.5px] text-destructive mt-1">{j.reason}</div>
                  <div className="text-[10.5px] text-muted-foreground mt-1">Attempt {j.attempts}/3 · auto-retry queued</div>
                </li>
              ))}
              {failedJobs.length === 0 && <li className="p-4 text-[12px] text-muted-foreground">All publishes succeeded.</li>}
            </ul>
          </Panel>

          {/* Market heatmap */}
          <Panel title="Market demand vs supply" action={<Tag tone="info">7d rolling</Tag>} dense>
            <div className="p-3.5">
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 56 }).map((_, i) => {
                  const intensity = (Math.sin(i * 0.7) + 1) / 2;
                  const op = 0.08 + intensity * 0.7;
                  return <div key={i} className="aspect-square rounded-sm" style={{ background: `oklch(0.72 0.16 200 / ${op})` }} title={`${(intensity * 100).toFixed(0)}% utilization`} />;
                })}
              </div>
              <div className="mt-3 flex items-center justify-between text-[10.5px] text-muted-foreground">
                <span>Underserved</span>
                <div className="flex items-center gap-1">
                  {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map(o => (
                    <div key={o} className="size-3 rounded-sm" style={{ background: `oklch(0.72 0.16 200 / ${o})` }} />
                  ))}
                </div>
                <span>Saturated</span>
              </div>
              <div className="mt-4 space-y-2 text-[12px]">
                <div className="flex items-center gap-2"><MapPin className="size-3 text-warning" /><span className="text-muted-foreground">Top underserved:</span><span className="font-mono font-medium">RUH–ICN, JED–BCN, DMM–CGK</span></div>
                <div className="flex items-center gap-2"><Activity className="size-3 text-success" /><span className="text-muted-foreground">Activation candidate:</span><span className="font-mono font-medium">RUH–HND (+18% search)</span></div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
