import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader, Tag, Btn } from "@/components/ui-bits/Bits";
import { Check, Minus } from "lucide-react";

export const Route = createFileRoute("/rbac")({
  head: () => ({ meta: [{ title: "Access Control — Skyloom OPS" }] }),
  component: RBAC,
});

const roles = ["Viewer", "Analyst", "Sr Analyst", "Revenue Mgr", "Network Planner", "Admin", "Super Admin"];
const perms = ["View", "Create draft", "Edit", "Simulate", "Approve · L1", "Approve · L2", "Publish", "Rollback", "Archive", "Manage users"];
const matrix: number[][] = [
  [1,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,0,0,0,0,0,0],
  [1,1,1,1,1,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,1,0],
  [1,1,1,1,1,1,1,0,1,0],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
];

const users = [
  { name: "Abdullah Alzahrani", email: "a.alzahrani@riyadhair.com", role: "Sr Analyst", unit: "Network Planning", region: "MENA", status: "active" },
  { name: "Naomi Okafor", email: "n.okafor@riyadhair.com", role: "Network Planner", unit: "Network Planning", region: "EMEA", status: "active" },
  { name: "Kenji Tanaka", email: "k.tanaka@riyadhair.com", role: "Revenue Mgr", unit: "Revenue Mgmt", region: "APAC", status: "active" },
  { name: "Mariam Almutairi", email: "m.almutairi@riyadhair.com", role: "Admin", unit: "Digital Product", region: "Global", status: "active" },
  { name: "Sanjay Patel", email: "s.patel@riyadhair.com", role: "Analyst", unit: "Pricing", region: "South Asia", status: "invited" },
  { name: "Fatima Hadi", email: "f.hadi@riyadhair.com", role: "Viewer", unit: "Operations", region: "MENA", status: "active" },
];

function RBAC() {
  return (
    <div>
      <PageHeader title="Role-Based Access Control" subtitle="Granular permission matrix with geography and business-unit segregation.">
        <Btn size="sm">Audit access</Btn>
        <Btn size="sm" variant="primary">+ Invite user</Btn>
      </PageHeader>

      <div className="p-6 space-y-6">
        <Panel title="Permission matrix" dense>
          <div className="overflow-x-auto">
            <table className="data-grid w-full">
              <thead>
                <tr>
                  <th className="!text-left">Role / Permission</th>
                  {perms.map(p => <th key={p} className="text-center !text-[10px]">{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {roles.map((r, ri) => (
                  <tr key={r}>
                    <td className="font-medium">{r}</td>
                    {matrix[ri].map((v, ci) => (
                      <td key={ci} className="text-center">
                        {v ? <Check className="size-3.5 text-success inline" /> : <Minus className="size-3.5 text-muted-foreground/40 inline" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Active users" dense>
          <table className="data-grid w-full">
            <thead><tr><th>User</th><th>Role</th><th>Business unit</th><th>Region scope</th><th>Status</th><th>Last seen</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.email}>
                  <td>
                    <div className="font-medium text-[13px]">{u.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{u.email}</div>
                  </td>
                  <td><Tag tone="info">{u.role}</Tag></td>
                  <td>{u.unit}</td>
                  <td>{u.region}</td>
                  <td><Tag tone={u.status === "active" ? "success" : "warn"}>{u.status}</Tag></td>
                  <td className="font-mono text-[12px] text-muted-foreground">{u.status === "active" ? "3m ago" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
