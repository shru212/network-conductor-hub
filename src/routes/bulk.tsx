import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader, Btn, Tag } from "@/components/ui-bits/Bits";
import { Upload, FileSpreadsheet, FileJson, Webhook } from "lucide-react";

export const Route = createFileRoute("/bulk")({
  head: () => ({ meta: [{ title: "Bulk & APIs — Skyloom OPS" }] }),
  component: Bulk,
});

const jobs = [
  { id: "BULK-3401", file: "seasonal_winter_27.csv", rows: 184, ok: 178, fail: 6, status: "partial" },
  { id: "BULK-3400", file: "blackouts_q3.xlsx", rows: 42, ok: 42, fail: 0, status: "success" },
  { id: "BULK-3399", file: "interline_KE_update.json", rows: 24, ok: 0, fail: 24, status: "failed" },
];

function Bulk() {
  return (
    <div>
      <PageHeader title="Bulk Upload & API Integrations" subtitle="Batch route changes, scheduled syncs, and programmatic access for partner systems.">
        <Btn size="sm">API tokens</Btn>
        <Btn size="sm" variant="primary"><Upload className="size-3.5" /> New upload</Btn>
      </PageHeader>

      <div className="p-6 grid grid-cols-12 gap-6">
        <Panel title="Upload zone" className="col-span-12 xl:col-span-5" dense>
          <div className="p-5">
            <div className="border-2 border-dashed border-border-strong rounded-md p-8 text-center bg-surface-2/40">
              <Upload className="size-6 text-muted-foreground mx-auto" />
              <div className="text-[13px] font-medium mt-2">Drop CSV, XLSX, or JSON</div>
              <div className="text-[11.5px] text-muted-foreground mt-1">Max 50MB · validated before commit · partial success supported</div>
              <Btn size="sm" className="mt-3">Browse files</Btn>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
              <div className="border border-border rounded p-2.5"><FileSpreadsheet className="size-4 text-success mb-1" /> CSV template<div className="text-[10.5px] text-muted-foreground">v3.2</div></div>
              <div className="border border-border rounded p-2.5"><FileSpreadsheet className="size-4 text-info mb-1" /> XLSX template<div className="text-[10.5px] text-muted-foreground">v3.2</div></div>
              <div className="border border-border rounded p-2.5"><FileJson className="size-4 text-warning mb-1" /> JSON schema<div className="text-[10.5px] text-muted-foreground">OpenAPI 3.1</div></div>
            </div>
          </div>
        </Panel>

        <Panel title="Recent batch jobs" className="col-span-12 xl:col-span-7" dense>
          <table className="data-grid w-full">
            <thead><tr><th>Job</th><th>File</th><th>Rows</th><th>OK</th><th>Fail</th><th>Status</th></tr></thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id}>
                  <td className="font-mono text-[12px]">{j.id}</td>
                  <td className="font-mono text-[12px]">{j.file}</td>
                  <td className="font-mono">{j.rows}</td>
                  <td className="font-mono text-success">{j.ok}</td>
                  <td className="font-mono text-destructive">{j.fail}</td>
                  <td><Tag tone={j.status === "success" ? "success" : j.status === "failed" ? "danger" : "warn"}>{j.status}</Tag></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="API endpoints" className="col-span-12" dense>
          <table className="data-grid w-full">
            <thead><tr><th>Method</th><th>Path</th><th>Description</th><th>Auth</th><th>Rate limit</th></tr></thead>
            <tbody>
              {[
                ["GET", "/v1/od", "List O&D configurations with filters", "OAuth2 / mTLS", "600 rpm"],
                ["POST", "/v1/od", "Create new O&D draft", "OAuth2", "120 rpm"],
                ["PATCH", "/v1/od/:id", "Patch configuration · idempotent", "OAuth2", "120 rpm"],
                ["POST", "/v1/od/:id/simulate", "Run synchronous simulation", "OAuth2", "60 rpm"],
                ["POST", "/v1/od/:id/publish", "Publish · requires L2 approval", "OAuth2 + signature", "30 rpm"],
                ["GET", "/v1/audit", "Stream immutable audit log", "mTLS", "—"],
              ].map(r => (
                <tr key={r[1]}>
                  <td><Tag tone={r[0] === "GET" ? "info" : r[0] === "POST" ? "success" : "warn"}>{r[0]}</Tag></td>
                  <td className="font-mono text-[12.5px]">{r[1]}</td>
                  <td className="text-[12.5px]">{r[2]}</td>
                  <td className="text-[12px] text-muted-foreground">{r[3]}</td>
                  <td className="font-mono text-[12px]">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3.5 border-t border-border flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2 text-muted-foreground"><Webhook className="size-3.5" /> 3 webhook subscriptions active · last delivery 4s ago</div>
            <Btn size="sm">Open OpenAPI spec</Btn>
          </div>
        </Panel>
      </div>
    </div>
  );
}
