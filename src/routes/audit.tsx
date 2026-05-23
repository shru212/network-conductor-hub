import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader, Tag, Btn } from "@/components/ui-bits/Bits";
import { Download, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit & Governance — Skyloom OPS" }] }),
  component: Audit,
});

const log = [
  { ts: "2026-05-22 12:42:08", actor: "n.okafor", role: "Sr Analyst", action: "APPROVE", entity: "OD-2417", before: "stage:analyst", after: "stage:manager", hash: "0x9af2c1" },
  { ts: "2026-05-22 12:31:55", actor: "system", role: "Validator", action: "VALIDATION_FAIL", entity: "OD-2433", before: "valid:true", after: "valid:false (fare-gap)", hash: "0x1b8e44" },
  { ts: "2026-05-22 11:55:30", actor: "k.tanaka", role: "RM", action: "PUBLISH", entity: "OD-2402", before: "v17", after: "v18", hash: "0xff2102" },
  { ts: "2026-05-22 11:40:11", actor: "m.almutairi", role: "Network", action: "ROLLBACK", entity: "OD-2399", before: "v15", after: "v14", hash: "0x84cd09" },
  { ts: "2026-05-22 11:22:48", actor: "s.patel", role: "Pricing", action: "EDIT", entity: "OD-2410", before: "inv.J=44", after: "inv.J=52", hash: "0x4477ab" },
  { ts: "2026-05-22 10:31:17", actor: "a.alzahrani", role: "Analyst", action: "CREATE", entity: "OD-2444", before: "—", after: "draft v1", hash: "0xabc991" },
  { ts: "2026-05-22 09:48:02", actor: "system", role: "Scheduler", action: "AUTO_ARCHIVE", entity: "OD-2350", before: "active", after: "archived", hash: "0x55ffe2" },
];

function Audit() {
  return (
    <div>
      <PageHeader title="Audit & Governance" subtitle="Immutable, signed event log of every configuration change across the portfolio.">
        <Btn size="sm"><Download className="size-3.5" /> Export CSV</Btn>
        <Btn size="sm" variant="primary"><ShieldCheck className="size-3.5" /> Compliance pack</Btn>
      </PageHeader>

      <div className="p-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border rounded overflow-hidden">
          {[
            ["Events (30d)", "12,487"],
            ["Approvals", "284"],
            ["Rollbacks", "11"],
            ["Failed validations", "63"],
          ].map(([k, v]) => (
            <div key={k} className="bg-surface p-4">
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{k}</div>
              <div className="text-[22px] font-semibold font-mono mt-1">{v}</div>
            </div>
          ))}
        </div>

        <Panel title="Event log" className="col-span-12" dense>
          <table className="data-grid w-full">
            <thead><tr><th>Timestamp (UTC)</th><th>Actor</th><th>Role</th><th>Action</th><th>Entity</th><th>Before</th><th>After</th><th>Sig hash</th></tr></thead>
            <tbody>
              {log.map((e, i) => (
                <tr key={i}>
                  <td className="font-mono text-[12px]">{e.ts}</td>
                  <td>{e.actor}</td>
                  <td className="text-muted-foreground">{e.role}</td>
                  <td>
                    <Tag tone={e.action.includes("FAIL") || e.action === "ROLLBACK" ? "danger" : e.action === "PUBLISH" || e.action === "APPROVE" ? "success" : "default"}>{e.action}</Tag>
                  </td>
                  <td className="font-mono text-[12px]">{e.entity}</td>
                  <td className="font-mono text-[11.5px] text-muted-foreground">{e.before}</td>
                  <td className="font-mono text-[11.5px]">{e.after}</td>
                  <td className="font-mono text-[11px] text-primary/80">{e.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
