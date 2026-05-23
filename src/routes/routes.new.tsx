import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel, Btn, PageHeader, Tag } from "@/components/ui-bits/Bits";
import { Check, ChevronRight, AlertTriangle, Info, ShieldAlert, FileCheck2, Plane, Settings2, Network, Globe, Beaker } from "lucide-react";

export const Route = createFileRoute("/routes/new")({
  head: () => ({ meta: [{ title: "Create O&D — Skyloom OPS" }] }),
  component: NewRoute,
});

const steps = [
  { id: 1, label: "Market", icon: Globe, desc: "Origin · destination · routing" },
  { id: 2, label: "Inventory", icon: Plane, desc: "Carriers · cabins · fare classes" },
  { id: 3, label: "Commercial", icon: Settings2, desc: "Rules · restrictions · pricing" },
  { id: 4, label: "Distribution", icon: Network, desc: "Channels · geos · partners" },
  { id: 5, label: "Validation", icon: Beaker, desc: "Conflict & simulation" },
  { id: 6, label: "Approval", icon: FileCheck2, desc: "Sign-off & publish" },
];

function NewRoute() {
  const [step, setStep] = useState(5);

  return (
    <div>
      <PageHeader title="New O&D Configuration · OD-2444 (draft)" subtitle="RUH → ICN codeshare — Northern Winter 2026/27 schedule">
        <Btn size="sm">Discard</Btn>
        <Btn size="sm">Save draft</Btn>
        <Btn size="sm" variant="primary">Submit for approval</Btn>
      </PageHeader>

      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Stepper */}
        <aside className="col-span-12 lg:col-span-3">
          <Panel dense>
            <ol className="divide-y divide-border">
              {steps.map(s => {
                const Icon = s.icon;
                const done = s.id < step;
                const active = s.id === step;
                return (
                  <li key={s.id}>
                    <button onClick={() => setStep(s.id)} className={`w-full flex items-center gap-3 px-3.5 py-3 text-left ${active ? "bg-primary/8" : "hover:bg-surface-2"}`}>
                      <div className={`size-7 rounded grid place-items-center text-[11px] font-mono ${done ? "bg-success/15 text-success" : active ? "bg-primary/15 text-primary" : "bg-surface-2 text-muted-foreground"}`}>
                        {done ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium flex items-center gap-1.5">
                          <span className="text-muted-foreground font-mono text-[11px]">0{s.id}</span> {s.label}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">{s.desc}</div>
                      </div>
                      {active && <ChevronRight className="size-3.5 text-primary" />}
                    </button>
                  </li>
                );
              })}
            </ol>
          </Panel>

          <div className="mt-4">
            <Panel title="Version control" dense>
              <div className="p-3.5 text-[12px] space-y-2">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Current</span><span className="font-mono">v3-draft</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Diff vs prod</span><span className="font-mono text-warning">+14 / −2</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Rollback to</span><span className="font-mono text-primary cursor-pointer">v2 (12 May)</span></div>
              </div>
            </Panel>
          </div>
        </aside>

        {/* Main pane */}
        <div className="col-span-12 lg:col-span-9 space-y-5">
          {step === 1 && <MarketStep />}
          {step === 2 && <InventoryStep />}
          {step === 3 && <CommercialStep />}
          {step === 4 && <DistributionStep />}
          {step === 5 && <ValidationStep />}
          {step === 6 && <ApprovalStep />}

          <div className="flex items-center justify-between">
            <Btn onClick={() => setStep(Math.max(1, step - 1))}>← Back</Btn>
            <div className="flex items-center gap-2">
              <Btn>Save & exit</Btn>
              <Btn variant="primary" onClick={() => setStep(Math.min(6, step + 1))}>Continue →</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children, span = 6 }: { label: string; hint?: string; children: React.ReactNode; span?: number }) {
  return (
    <div style={{ gridColumn: `span ${span} / span ${span}` }}>
      <label className="block text-[11.5px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {hint && <div className="text-[10.5px] text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}
const inputCls = "w-full h-9 px-2.5 rounded border border-border bg-surface-2 text-[13px] outline-none focus:border-primary";

function MarketStep() {
  return (
    <Panel title="Step 1 · Define market" dense>
      <div className="p-5 grid grid-cols-12 gap-4">
        <Field label="Origin airport" span={4}><input className={inputCls + " font-mono"} defaultValue="RUH — King Khalid Intl" /></Field>
        <Field label="Destination airport" span={4}><input className={inputCls + " font-mono"} defaultValue="ICN — Incheon Intl" /></Field>
        <Field label="Via points" hint="Optional · max 2 transit segments" span={4}><input className={inputCls} placeholder="None" /></Field>
        <Field label="Region pair" span={3}><select className={inputCls}><option>MENA → APAC</option></select></Field>
        <Field label="Market scope" span={3}><select className={inputCls}><option>International</option></select></Field>
        <Field label="Seasonality" span={3}><select className={inputCls}><option>Permanent</option><option>Seasonal</option></select></Field>
        <Field label="Schedule window" span={3}><input className={inputCls + " font-mono"} defaultValue="W26/27" /></Field>
        <Field label="Market tags" span={12}>
          <div className="flex flex-wrap gap-1.5">
            <Tag tone="info">Strategic</Tag><Tag tone="success">High-yield</Tag><Tag>Hub-to-Hub</Tag><Tag tone="warn">Visa-restricted</Tag>
            <button className="text-[11px] text-muted-foreground hover:text-foreground border border-dashed border-border rounded px-1.5 h-5">+ Add tag</button>
          </div>
        </Field>
      </div>
    </Panel>
  );
}

function InventoryStep() {
  return (
    <Panel title="Step 2 · Inventory mapping" dense>
      <div className="p-5 grid grid-cols-12 gap-4">
        <Field label="Operating carrier" span={4}><input className={inputCls + " font-mono"} defaultValue="KE" /></Field>
        <Field label="Marketing carrier" span={4}><input className={inputCls + " font-mono"} defaultValue="RX" /></Field>
        <Field label="Codeshare type" span={4}><select className={inputCls}><option>Free-flow</option><option>Block-space</option></select></Field>
      </div>
      <div className="border-t border-border px-5 py-4">
        <div className="text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Flight & cabin mapping</div>
        <table className="data-grid w-full">
          <thead><tr><th>Flight</th><th>Op carrier</th><th>Cabin</th><th>Fare class eligibility</th><th>Seat inventory</th><th>Status</th></tr></thead>
          <tbody>
            {[
              ["KE955", "KE", "F/J/W/Y", "F: A/P · J: J/C/D · W: W/T · Y: Y/B/M/H/K/L", "Linked: KE-SKD-955", "ok"],
              ["RX9955", "KE", "J/Y", "J: J/C/D · Y: Y/B/M/H", "Linked: Mirror KE955", "ok"],
              ["KE957", "KE", "F/J/W/Y", "F: A/P · J: J/C · W: W · Y: Y/B/M", "Linked: KE-SKD-957", "warn"],
            ].map(row => (
              <tr key={row[0]}>
                <td className="font-mono font-semibold">{row[0]}</td>
                <td className="font-mono">{row[1]}</td>
                <td className="font-mono">{row[2]}</td>
                <td className="font-mono text-[11.5px] text-muted-foreground">{row[3]}</td>
                <td className="font-mono text-[11.5px]">{row[4]}</td>
                <td>{row[5] === "ok" ? <Tag tone="success">linked</Tag> : <Tag tone="warn">gap</Tag>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function CommercialStep() {
  return (
    <Panel title="Step 3 · Commercial rules" dense>
      <div className="p-5 grid grid-cols-12 gap-4">
        <Field label="Min connection time (intl-intl)" span={3}><input className={inputCls + " font-mono"} defaultValue="01:45" /></Field>
        <Field label="Max connection time" span={3}><input className={inputCls + " font-mono"} defaultValue="06:00" /></Field>
        <Field label="Stopover allowed" span={3}><select className={inputCls}><option>Permitted ≤24h</option></select></Field>
        <Field label="Transit visa flag" span={3}><select className={inputCls}><option>Required (KOR K-ETA)</option></select></Field>
        <Field label="Blackout dates" span={6}><input className={inputCls + " font-mono"} defaultValue="2026-12-23 → 2027-01-04, 2027-02-10 → 2027-02-17" /></Field>
        <Field label="Dynamic pricing" span={3}><select className={inputCls}><option>Enabled</option></select></Field>
        <Field label="Loyalty redemption" span={3}><select className={inputCls}><option>Star Alliance only</option></select></Field>
        <Field label="Ancillaries" span={12}>
          <div className="flex flex-wrap gap-1.5">
            {["Seat select", "Extra bag", "Lounge", "Wi-Fi", "Meal upgrade", "Priority"].map(a => (
              <label key={a} className="flex items-center gap-1.5 h-7 px-2 rounded border border-border bg-surface-2 text-[12px]"><input type="checkbox" defaultChecked className="accent-primary" />{a}</label>
            ))}
          </div>
        </Field>
      </div>
    </Panel>
  );
}

function DistributionStep() {
  return (
    <Panel title="Step 4 · Distribution controls" dense>
      <div className="p-5 grid grid-cols-12 gap-4">
        {[
          ["Website (riyadhair.com)", "on"], ["iOS app", "on"], ["Android app", "on"],
          ["GDS Amadeus", "on"], ["GDS Sabre", "on"], ["GDS Travelport", "off"],
          ["NDC partners", "on"], ["OTA · Booking.com", "off"], ["OTA · Skyscanner", "on"],
        ].map(([label, state]) => (
          <div key={label} className="col-span-4 flex items-center justify-between h-10 px-3 rounded border border-border bg-surface-2 text-[13px]">
            <span>{label}</span>
            <span className={`h-5 w-9 rounded-full relative ${state === "on" ? "bg-primary/40" : "bg-surface-3"}`}>
              <span className={`absolute top-0.5 ${state === "on" ? "right-0.5 bg-primary" : "left-0.5 bg-muted-foreground"} size-4 rounded-full`} />
            </span>
          </div>
        ))}
        <Field label="Geo restrictions" span={12}>
          <div className="flex flex-wrap gap-1.5">
            <Tag tone="danger">Block: IL</Tag><Tag tone="danger">Block: SY</Tag><Tag tone="warn">Restrict: RU (sanctions)</Tag>
          </div>
        </Field>
      </div>
    </Panel>
  );
}

function ValidationStep() {
  const checks = [
    { kind: "ok", label: "Schedule continuity verified", detail: "All 7 weekly rotations connect within published window." },
    { kind: "warn", label: "Fare class gap detected on KE957", detail: "Cabin J missing fare class D — falls back to C. Revenue impact ≈ −$1,240/week." },
    { kind: "blocking", label: "MCT below station minimum at ICN", detail: "Configured 1:45 vs ICN published 2:00 for INTL→INTL with terminal change." },
    { kind: "info", label: "Booking flow simulation: 94/100 paths bookable", detail: "6 edge cases failed: see Simulation Report #SIM-8847." },
    { kind: "ok", label: "Interline e-tkt agreement active (RX↔KE)", detail: "MITA + bilateral SPA covers all configured cabins." },
    { kind: "warn", label: "Stopover rule conflict with global product policy", detail: "Stopovers >24h not permitted on codeshare unless joint-venture." },
  ];
  return (
    <>
      <Panel title="Step 5 · Validation engine" action={<Tag tone="warn">3 warnings · 1 blocking</Tag>} dense>
        <ul className="divide-y divide-border">
          {checks.map((c, i) => {
            const tone = c.kind === "blocking" ? "destructive" : c.kind === "warn" ? "warning" : c.kind === "info" ? "info" : "success";
            const Icon = c.kind === "ok" ? Check : c.kind === "info" ? Info : c.kind === "warn" ? AlertTriangle : ShieldAlert;
            return (
              <li key={i} className="px-4 py-3 flex gap-3">
                <div className={`size-7 rounded grid place-items-center bg-${tone}/15 text-${tone} shrink-0`}>
                  <Icon className="size-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium flex items-center gap-2">
                    {c.label}
                    {c.kind === "blocking" && <Tag tone="danger">blocking</Tag>}
                    {c.kind === "warn" && <Tag tone="warn">caution</Tag>}
                    {c.kind === "info" && <Tag tone="info">info</Tag>}
                  </div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">{c.detail}</div>
                </div>
                <Btn size="sm">Open</Btn>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="Booking flow simulation summary" dense>
        <div className="grid grid-cols-4 gap-px bg-border">
          {[
            { l: "Paths simulated", v: "100" },
            { l: "Bookable end-to-end", v: "94", t: "text-success" },
            { l: "Mock PNRs generated", v: "12" },
            { l: "Avg fare returned", v: "$1,184" },
          ].map(m => (
            <div key={m.l} className="bg-surface p-4">
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
              <div className={`text-[22px] font-semibold font-mono mt-1 ${m.t ?? ""}`}>{m.v}</div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function ApprovalStep() {
  const chain = [
    { role: "Analyst", who: "a.alzahrani", state: "approved", at: "May 21 · 14:02" },
    { role: "Senior Analyst", who: "n.okafor", state: "approved", at: "May 22 · 09:18" },
    { role: "Revenue Manager", who: "k.tanaka", state: "waiting", at: "SLA 14h" },
    { role: "Network Planner", who: "m.almutairi", state: "queued", at: "—" },
    { role: "Operations", who: "s.patel", state: "queued", at: "—" },
  ];
  return (
    <Panel title="Step 6 · Approval workflow" dense>
      <ol className="divide-y divide-border">
        {chain.map((c, i) => {
          const tone = c.state === "approved" ? "success" : c.state === "waiting" ? "warning" : "muted";
          return (
            <li key={i} className="px-4 py-3 flex items-center gap-3">
              <div className={`size-7 rounded-full grid place-items-center text-[11px] font-mono bg-${tone === "muted" ? "surface-2" : tone + "/15"} text-${tone === "muted" ? "muted-foreground" : tone}`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium">{c.role}</div>
                <div className="text-[11.5px] text-muted-foreground">{c.who}</div>
              </div>
              <Tag tone={c.state === "approved" ? "success" : c.state === "waiting" ? "warn" : "default"}>{c.state}</Tag>
              <div className="text-[11px] text-muted-foreground w-28 text-right font-mono">{c.at}</div>
            </li>
          );
        })}
      </ol>
      <div className="border-t border-border p-4 flex items-center justify-between">
        <div className="text-[12px] text-muted-foreground">Estimated time to publish: <span className="text-foreground font-medium">~36h</span> · Digital signoff required at finance gate</div>
        <div className="flex gap-2"><Btn size="sm">Add reviewer</Btn><Btn size="sm" variant="primary">Sign &amp; advance</Btn></div>
      </div>
    </Panel>
  );
}
