import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { routes, type RouteStatus } from "@/lib/mockData";
import { Panel, StatusPill, Tag, Sparkbar, Btn, PageHeader } from "@/components/ui-bits/Bits";
import { Search, Filter, Download, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/routes/")({
  head: () => ({ meta: [{ title: "O&D Registry — Skyloom OPS" }] }),
  component: RoutesIndex,
});

const statuses: (RouteStatus | "all")[] = ["all", "active", "draft", "pending", "failed", "archived"];

function RoutesIndex() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<RouteStatus | "all">("all");
  const [region, setRegion] = useState<string>("all");

  const regions = useMemo(() => ["all", ...Array.from(new Set(routes.map(r => r.region)))], []);

  const filtered = routes.filter(r => {
    if (status !== "all" && r.status !== status) return false;
    if (region !== "all" && r.region !== region) return false;
    if (q && !`${r.origin} ${r.destination} ${r.originCity} ${r.destCity} ${r.id}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="O&D Configurations" subtitle={`${routes.length} routes across ${regions.length - 1} regions · governed by 4-tier approval`}>
        <Btn size="sm"><Download className="size-3.5" /> Export</Btn>
        <Btn size="sm"><SlidersHorizontal className="size-3.5" /> Saved views</Btn>
        <Link to="/routes/new"><Btn size="sm" variant="primary">+ New O&D</Btn></Link>
      </PageHeader>

      <div className="p-6 space-y-4">
        <Panel dense>
          <div className="p-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 h-8 px-2.5 rounded border border-border bg-surface-2 flex-1 min-w-64 max-w-md">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search origin, destination, ID, market…"
                className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-1 border border-border rounded p-0.5 bg-surface-2">
              {statuses.map(s => (
                <button key={s} onClick={() => setStatus(s)} className={`px-2 h-7 rounded text-[12px] capitalize ${status === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{s}</button>
              ))}
            </div>
            <select value={region} onChange={e => setRegion(e.target.value)} className="h-8 px-2 rounded border border-border bg-surface-2 text-[12.5px]">
              {regions.map(r => <option key={r} value={r}>{r === "all" ? "All regions" : r}</option>)}
            </select>
            <Btn size="sm"><Filter className="size-3.5" /> More filters</Btn>
          </div>
          <div className="overflow-x-auto">
            <table className="data-grid w-full">
              <thead>
                <tr>
                  <th className="w-8"><input type="checkbox" className="accent-primary" /></th>
                  <th>ID</th>
                  <th>Origin → Destination</th>
                  <th>Type</th>
                  <th>Region</th>
                  <th>Carrier</th>
                  <th>Status</th>
                  <th>Health</th>
                  <th>Load %</th>
                  <th>Yield $</th>
                  <th>Cabins</th>
                  <th>Conflicts</th>
                  <th>Modified</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td><input type="checkbox" className="accent-primary" /></td>
                    <td className="font-mono text-[12px] text-muted-foreground">{r.id}</td>
                    <td>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-semibold">{r.origin}</span>
                        <span className="text-muted-foreground">→</span>
                        {r.via && <><span className="text-muted-foreground text-[11px] px-1 rounded bg-surface-2">{r.via}</span><span className="text-muted-foreground">→</span></>}
                        <span className="font-semibold">{r.destination}</span>
                      </div>
                      <div className="text-[10.5px] text-muted-foreground mt-0.5">{r.originCity} – {r.destCity}</div>
                    </td>
                    <td><Tag tone={r.type === "codeshare" ? "info" : r.type === "interline" ? "warn" : r.type === "seasonal" ? "success" : "default"}>{r.type}</Tag></td>
                    <td className="text-[12px]">{r.region}</td>
                    <td className="font-mono text-[12px]">{r.marketingCarrier}/{r.operatingCarrier}</td>
                    <td><StatusPill status={r.status} /></td>
                    <td className="w-28">
                      <div className="flex items-center gap-2">
                        <Sparkbar value={r.health} tone={r.health > 80 ? "success" : r.health > 60 ? "warning" : "danger"} />
                        <span className="font-mono text-[11px] w-7 text-right">{r.health}</span>
                      </div>
                    </td>
                    <td className="font-mono text-[12px]">{r.loadFactor}%</td>
                    <td className="font-mono text-[12px]">${r.yieldUsd}</td>
                    <td className="font-mono text-[11px] text-muted-foreground">{r.cabins.join("·")}</td>
                    <td>{r.conflicts > 0 ? <Tag tone="danger">{r.conflicts}</Tag> : <span className="text-muted-foreground text-[12px]">—</span>}</td>
                    <td className="text-[11.5px] text-muted-foreground">
                      <div className="font-mono">{r.modifiedAt.replace("T", " ")}</div>
                      <div className="text-[10.5px]">{r.modifiedBy}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-3.5 py-2 border-t border-border flex items-center justify-between text-[11.5px] text-muted-foreground">
            <span>Showing {filtered.length} of {routes.length}</span>
            <div className="flex items-center gap-1.5">
              <Btn size="sm">‹ Prev</Btn><Btn size="sm">Next ›</Btn>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
