import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel, Btn, PageHeader, Tag, StatusPill } from "@/components/ui-bits/Bits";
import { Play, RotateCw, Plane } from "lucide-react";

export const Route = createFileRoute("/simulation")({
  head: () => ({ meta: [{ title: "Route Simulation — Skyloom OPS" }] }),
  component: Simulation,
});

const channels = ["Website", "iOS app", "OTA · Skyscanner", "GDS · Amadeus", "NDC partner"];

const results = [
  { ch: "Website", paths: 32, ok: 31, fail: 1, fare: 1184, ms: 412, status: "active" as const },
  { ch: "iOS app", paths: 28, ok: 28, fail: 0, fare: 1184, ms: 388, status: "active" as const },
  { ch: "OTA · Skyscanner", paths: 24, ok: 22, fail: 2, fare: 1212, ms: 612, status: "active" as const },
  { ch: "GDS · Amadeus", paths: 16, ok: 13, fail: 3, fare: 1268, ms: 1844, status: "failed" as const },
  { ch: "NDC partner", paths: 20, ok: 20, fail: 0, fare: 1198, ms: 502, status: "active" as const },
];

function Simulation() {
  const [running, setRunning] = useState(false);
  return (
    <div>
      <PageHeader title="Route Simulation Sandbox" subtitle="Mimic booking engine, OTA, GDS and mobile flows against staging configurations.">
        <Btn size="sm"><RotateCw className="size-3.5" /> Reset</Btn>
        <Btn size="sm" variant="primary" onClick={() => { setRunning(true); setTimeout(() => setRunning(false), 1400); }}>
          <Play className="size-3.5" /> {running ? "Running…" : "Run simulation"}
        </Btn>
      </PageHeader>

      <div className="p-6 grid grid-cols-12 gap-6">
        <Panel title="Scenario" className="col-span-12 xl:col-span-4" dense>
          <div className="p-4 space-y-3 text-[13px]">
            {[
              ["Target O&D", "RUH → ICN (codeshare RX/KE)"],
              ["Environment", "Sandbox · staging-2"],
              ["Cabin", "Economy / Business / First"],
              ["Pax mix", "1 ADT · 1 ADT+1CHD · 2 ADT+2CHD"],
              ["Search window", "Jun 1 → Aug 31 2026"],
              ["Currency", "USD · SAR · KRW"],
              ["Loyalty tier", "Anonymous · Silver · Gold"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <span className="text-muted-foreground text-[12px]">{k}</span>
                <span className="font-mono text-[12.5px]">{v}</span>
              </div>
            ))}
            <div>
              <div className="text-[11.5px] uppercase tracking-wider text-muted-foreground mt-2 mb-1.5">Channels</div>
              <div className="flex flex-wrap gap-1.5">{channels.map(c => <Tag key={c} tone="info">{c}</Tag>)}</div>
            </div>
          </div>
        </Panel>

        <Panel title="Simulation matrix" className="col-span-12 xl:col-span-8" dense>
          <table className="data-grid w-full">
            <thead><tr><th>Channel</th><th>Paths</th><th>Success</th><th>Fail</th><th>Avg fare</th><th>p95 latency</th><th>Status</th></tr></thead>
            <tbody>
              {results.map(r => (
                <tr key={r.ch}>
                  <td className="font-medium">{r.ch}</td>
                  <td className="font-mono">{r.paths}</td>
                  <td className="font-mono text-success">{r.ok}</td>
                  <td className="font-mono text-destructive">{r.fail}</td>
                  <td className="font-mono">${r.fare}</td>
                  <td className="font-mono text-[12px] text-muted-foreground">{r.ms} ms</td>
                  <td><StatusPill status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Mock PNR · RX/4HZ9KP" className="col-span-12 xl:col-span-7" dense>
          <pre className="font-mono text-[11.5px] leading-relaxed p-4 text-foreground/90 overflow-auto">
{`PNR     RX/4HZ9KP                              CREATED 2026-05-22 12:42
PAX     ALSAUD/FAHAD MR · LEE/MIN JI MS · LEE/JOON CHD
ITIN    1  RX9955 J 12JUN RUH ICN  HK2  0140 1715  E*KE955 OPER
        2  RX9956 J 28JUN ICN RUH  HK2  2300 0420+1 E*KE956 OPER
FARE    USD 3,684.00 TTL   FC: SAR/KRW/USD  TAX: SA YR YQ
SSR     SEAT  RX  HK1  04A    SSR  MEAL VLML
SSR     KE    HK1  03C
TKT     157-2402990012  ETKT-OK   COMM-PUBL
REMARKS GOVT.PSPT VLDTD · K-ETA RECEIVED 22MAY
WARN    *MCT alert: ICN INTL-DOM transfer recommended 02:00`}
          </pre>
        </Panel>

        <Panel title="Path failure diagnostics" className="col-span-12 xl:col-span-5" dense>
          <ul className="divide-y divide-border">
            {[
              { p: "RUH–ICN · GDS Amadeus · 2A+2C · Aug 12", r: "Family fare bundle not mapped to interline" },
              { p: "RUH–ICN · Skyscanner · 1A · Jul 21", r: "Cabin J inventory mismatch on segment 2" },
              { p: "RUH–ICN · GDS Amadeus · 1A · Jun 4", r: "MCT enforcement blocked combination" },
            ].map(f => (
              <li key={f.p} className="p-3.5">
                <div className="text-[12.5px] font-mono">{f.p}</div>
                <div className="text-[11.5px] text-destructive mt-1 flex items-center gap-1.5"><Plane className="size-3" /> {f.r}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
