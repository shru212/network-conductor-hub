import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader, Btn, Tag } from "@/components/ui-bits/Bits";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Skyloom OPS" }] }),
  component: Analytics,
});

const monthlySeries = [42, 48, 51, 47, 55, 62, 68, 72, 70, 78, 84, 91];
const failureSeries = [12, 9, 14, 8, 11, 7, 6, 9, 5, 4, 6, 3];

function Sparkline({ data, color, fill }: { data: number[]; color: string; fill: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / (max - min || 1)) * 90 - 5;
    return `${x},${y}`;
  });
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-24">
      <polygon points={`0,100 ${pts.join(" ")} 100,100`} fill={fill} />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

function Analytics() {
  return (
    <div>
      <PageHeader title="Network Analytics" subtitle="Demand signals, configuration trends, and copilot insights across the portfolio.">
        <Btn size="sm">30d</Btn>
        <Btn size="sm">90d</Btn>
        <Btn size="sm" variant="primary">YTD</Btn>
      </PageHeader>

      <div className="p-6 grid grid-cols-12 gap-6">
        <Panel title="Route activations · trailing 12 months" className="col-span-12 xl:col-span-6" dense>
          <div className="p-4">
            <div className="flex items-baseline gap-3">
              <div className="text-[28px] font-semibold font-mono">748</div>
              <Tag tone="success">+22% YoY</Tag>
            </div>
            <Sparkline data={monthlySeries} color="oklch(0.72 0.16 200)" fill="oklch(0.72 0.16 200 / 0.15)" />
          </div>
        </Panel>

        <Panel title="Publish failures (auto-recovered)" className="col-span-12 xl:col-span-6" dense>
          <div className="p-4">
            <div className="flex items-baseline gap-3">
              <div className="text-[28px] font-semibold font-mono">94</div>
              <Tag tone="success">−38% YoY</Tag>
            </div>
            <Sparkline data={failureSeries} color="oklch(0.62 0.22 25)" fill="oklch(0.62 0.22 25 / 0.12)" />
          </div>
        </Panel>

        <Panel title="Top searched · unavailable O&Ds" className="col-span-12 xl:col-span-7" dense>
          <table className="data-grid w-full">
            <thead><tr><th>Route</th><th>Region</th><th>30d searches</th><th>Conversion gap</th><th>Competitor presence</th><th>Action</th></tr></thead>
            <tbody>
              {[
                ["RUH → HND", "APAC", "184,210", "8.4%", "JL · NH · TK"],
                ["JED → BCN", "EMEA", "92,440", "6.1%", "IB · TK · EK"],
                ["DMM → CGK", "APAC", "68,011", "5.7%", "SV · GA"],
                ["RUH → CPT", "EMEA", "44,120", "4.2%", "EK · QR"],
                ["AHB → DOH", "MENA", "31,808", "3.0%", "QR"],
              ].map(r => (
                <tr key={r[0]}>
                  <td className="font-mono font-semibold">{r[0]}</td>
                  <td>{r[1]}</td>
                  <td className="font-mono">{r[2]}</td>
                  <td className="font-mono text-warning">{r[3]}</td>
                  <td className="font-mono text-[11.5px] text-muted-foreground">{r[4]}</td>
                  <td><Btn size="sm" variant="primary">Draft O&D</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Copilot insights" className="col-span-12 xl:col-span-5" action={<Tag tone="info">Beta</Tag>} dense>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 h-9 px-2.5 rounded border border-border bg-surface-2 text-[12.5px]">
              <Sparkles className="size-3.5 text-primary" />
              <span className="text-muted-foreground">Ask: "unpublished APAC routes with high search · low competition"</span>
            </div>
            {[
              { tone: "info", t: "3 routes match", d: "RUH→HND, RUH→ICN, DMM→KIX show ≥18% demand uplift with ≤2 carrier competition." },
              { tone: "warn", t: "Risky configuration detected", d: "OD-2419 MCT of 1:15 at DXB falls below station minimum for INTL transfers." },
              { tone: "success", t: "Optimization suggested", d: "Switching RX9956 to evening departure adds est. $214K monthly revenue (24% LF lift)." },
            ].map((c, i) => (
              <div key={i} className="border border-border rounded p-3">
                <div className="flex items-center gap-2"><Tag tone={c.tone as "info"}>insight</Tag><span className="text-[12.5px] font-medium">{c.t}</span></div>
                <div className="text-[12px] text-muted-foreground mt-1">{c.d}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
