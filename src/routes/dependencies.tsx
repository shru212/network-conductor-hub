import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader, Tag, Btn } from "@/components/ui-bits/Bits";

export const Route = createFileRoute("/dependencies")({
  head: () => ({ meta: [{ title: "Dependency Graph — Skyloom OPS" }] }),
  component: Dependencies,
});

interface Node { id: string; x: number; y: number; kind: string; }
const center: Node = { id: "RUH → DXB", x: 400, y: 240, kind: "od" };
const around: Node[] = [
  { id: "Baggage rules", x: 130, y: 90, kind: "rule" },
  { id: "Transit logic", x: 660, y: 90, kind: "rule" },
  { id: "Lounge eligibility", x: 80, y: 240, kind: "service" },
  { id: "Partner inventory", x: 720, y: 240, kind: "inventory" },
  { id: "Pricing engine", x: 130, y: 400, kind: "engine" },
  { id: "Ancillaries", x: 400, y: 440, kind: "service" },
  { id: "Payment restrictions", x: 660, y: 400, kind: "rule" },
  { id: "Loyalty accrual", x: 400, y: 40, kind: "engine" },
];
const kindColor: Record<string, string> = {
  od: "oklch(0.72 0.16 200)",
  rule: "oklch(0.78 0.16 75)",
  service: "oklch(0.7 0.17 155)",
  inventory: "oklch(0.7 0.14 240)",
  engine: "oklch(0.72 0.18 320)",
};

function Dependencies() {
  return (
    <div>
      <PageHeader title="Route Dependency Graph" subtitle="Galaxy view of downstream systems impacted by an O&D configuration.">
        <Btn size="sm">Layout: radial</Btn>
        <Btn size="sm">Show heatmap</Btn>
        <Btn size="sm" variant="primary">Export SVG</Btn>
      </PageHeader>

      <div className="p-6 grid grid-cols-12 gap-6">
        <Panel className="col-span-12 xl:col-span-9" dense>
          <div className="relative grid-bg h-[560px] overflow-hidden rounded-b-md">
            <svg viewBox="0 0 800 540" className="absolute inset-0 w-full h-full">
              {around.map(n => (
                <g key={n.id}>
                  <line x1={center.x} y1={center.y} x2={n.x} y2={n.y} stroke="oklch(0.72 0.16 200 / 0.35)" strokeWidth="1" strokeDasharray="3 3" />
                </g>
              ))}
              {[center, ...around].map(n => (
                <g key={n.id} transform={`translate(${n.x},${n.y})`}>
                  <circle r={n.kind === "od" ? 38 : 26} fill="oklch(0.19 0.013 250)" stroke={kindColor[n.kind]} strokeWidth="1.5" />
                  {n.kind === "od" && <circle r={48} fill="none" stroke={kindColor[n.kind]} strokeWidth="0.6" opacity="0.4" />}
                  <text textAnchor="middle" dy="4" fontSize={n.kind === "od" ? 13 : 11} fill="oklch(0.95 0.005 250)" fontWeight={n.kind === "od" ? 600 : 500}>
                    {n.id}
                  </text>
                </g>
              ))}
            </svg>
            <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[11px] bg-surface/80 backdrop-blur border border-border rounded px-2 py-1.5">
              {Object.entries(kindColor).map(([k, c]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ background: c }} />
                  <span className="capitalize text-muted-foreground">{k}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <div className="col-span-12 xl:col-span-3 space-y-4">
          <Panel title="Selected: RUH → DXB" dense>
            <div className="p-3.5 text-[12.5px] space-y-2">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Downstream systems</span><span className="font-mono">8</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Affected partners</span><span className="font-mono">3</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Pending changes</span><Tag tone="warn">2</Tag></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Last validated</span><span className="font-mono text-[11.5px]">2h ago</span></div>
            </div>
          </Panel>
          <Panel title="Impact heatmap" dense>
            <div className="p-3.5 space-y-2">
              {[
                ["Pricing engine", 92], ["Loyalty accrual", 78], ["Partner inventory", 64], ["Ancillaries", 41], ["Lounge eligibility", 22],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex items-center justify-between text-[11.5px] mb-1"><span>{k}</span><span className="font-mono text-muted-foreground">{v}%</span></div>
                  <div className="h-1.5 bg-surface-3 rounded overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
