export type RouteStatus = "active" | "draft" | "pending" | "failed" | "archived";
export type RouteType = "direct" | "via" | "codeshare" | "interline" | "seasonal";

export interface ODRoute {
  id: string;
  origin: string;
  originCity: string;
  destination: string;
  destCity: string;
  via?: string;
  type: RouteType;
  region: string;
  marketingCarrier: string;
  operatingCarrier: string;
  status: RouteStatus;
  health: number; // 0-100
  loadFactor: number;
  yieldUsd: number;
  modifiedAt: string;
  modifiedBy: string;
  flights: number;
  cabins: string[];
  conflicts: number;
  tags: string[];
}

const carriers = ["RX", "SQ", "AK", "EK", "QR", "EY"];
const regions = ["MENA", "APAC", "EMEA", "Americas", "South Asia"];

const pairs: Array<[string, string, string, string, string, RouteType, string?]> = [
  ["RUH", "Riyadh", "BKK", "Bangkok", "APAC", "direct"],
  ["RUH", "JFK", "New York", "New York", "Americas", "codeshare"],
  ["DEL", "Delhi", "KUL", "Kuala Lumpur", "APAC", "direct"],
  ["JED", "Jeddah", "CDG", "Paris", "EMEA", "via", "DOH"],
  ["RUH", "Riyadh", "DXB", "Dubai", "MENA", "direct"],
  ["DMM", "Dammam", "LHR", "London", "EMEA", "via", "RUH"],
  ["AUH", "Abu Dhabi", "SIN", "Singapore", "APAC", "direct"],
  ["RUH", "Riyadh", "IST", "Istanbul", "EMEA", "direct"],
  ["MED", "Madinah", "CAI", "Cairo", "MENA", "direct"],
  ["JED", "Jeddah", "LAX", "Los Angeles", "Americas", "codeshare"],
  ["RUH", "Riyadh", "NRT", "Tokyo", "APAC", "interline"],
  ["RUH", "Riyadh", "FRA", "Frankfurt", "EMEA", "direct"],
  ["AHB", "Abha", "DXB", "Dubai", "MENA", "seasonal"],
  ["RUH", "Riyadh", "BOM", "Mumbai", "South Asia", "direct"],
  ["JED", "Jeddah", "DKR", "Dakar", "EMEA", "seasonal"],
  ["RUH", "Riyadh", "HKG", "Hong Kong", "APAC", "via", "BKK"],
  ["TIF", "Taif", "AMM", "Amman", "MENA", "direct"],
  ["RUH", "Riyadh", "GRU", "São Paulo", "Americas", "interline"],
  ["DMM", "Dammam", "DEL", "Delhi", "South Asia", "direct"],
  ["JED", "Jeddah", "MAD", "Madrid", "EMEA", "direct"],
];

const statuses: RouteStatus[] = ["active", "active", "active", "draft", "pending", "active", "failed"];

export const routes: ODRoute[] = pairs.map((p, i) => {
  const [origin, originCity, destination, destCity, region, type, via] = p;
  return {
    id: `OD-${(2401 + i).toString()}`,
    origin,
    originCity,
    destination,
    destCity,
    via,
    type,
    region: region as string,
    marketingCarrier: "RX",
    operatingCarrier: carriers[i % carriers.length],
    status: statuses[i % statuses.length],
    health: 60 + ((i * 7) % 40),
    loadFactor: 55 + ((i * 11) % 40),
    yieldUsd: 180 + ((i * 37) % 600),
    modifiedAt: `2026-05-${(22 - (i % 20)).toString().padStart(2, "0")}T${(8 + (i % 10)).toString().padStart(2, "0")}:${((i * 13) % 60).toString().padStart(2, "0")}`,
    modifiedBy: ["a.alzahrani", "n.okafor", "k.tanaka", "m.almutairi", "s.patel"][i % 5],
    flights: 4 + (i % 18),
    cabins: i % 3 === 0 ? ["Y", "J", "F"] : ["Y", "J"],
    conflicts: i % 5 === 0 ? (i % 3) + 1 : 0,
    tags: [region as string, type, i % 2 === 0 ? "Hub" : "Spoke"],
  };
});

export const kpis = [
  { label: "Active O&Ds", value: "1,284", delta: "+18", trend: "up" as const, hint: "vs last week" },
  { label: "Pending approvals", value: "47", delta: "+6", trend: "up" as const, hint: "12 SLA at risk" },
  { label: "Draft configurations", value: "92", delta: "−4", trend: "down" as const, hint: "rolling 7d" },
  { label: "Failed publishes (24h)", value: "3", delta: "−2", trend: "down" as const, hint: "auto-retry" },
  { label: "Publish success rate", value: "98.4%", delta: "+0.6", trend: "up" as const, hint: "30d avg" },
  { label: "Avg time to launch", value: "2.8d", delta: "−0.4", trend: "down" as const, hint: "Q2 target 3d" },
];

export const activity = [
  { ts: "12:42:08", user: "n.okafor", action: "approved", target: "OD-2417 JED→CDG via DOH", level: "info" as const },
  { ts: "12:31:55", user: "system", action: "validation failed", target: "OD-2433 — fare class gap (J)", level: "error" as const },
  { ts: "12:18:02", user: "a.alzahrani", action: "submitted for approval", target: "OD-2441 RUH→NRT interline", level: "info" as const },
  { ts: "11:55:30", user: "k.tanaka", action: "published", target: "OD-2402 RUH→BKK seasonal uplift", level: "success" as const },
  { ts: "11:40:11", user: "m.almutairi", action: "rolled back", target: "OD-2399 → v14 (MCT change)", level: "warn" as const },
  { ts: "11:22:48", user: "s.patel", action: "edited inventory", target: "OD-2410 RUH→DXB cabin J", level: "info" as const },
  { ts: "10:59:03", user: "system", action: "auto-archived", target: "OD-2350 seasonal window ended", level: "info" as const },
  { ts: "10:31:17", user: "a.alzahrani", action: "created draft", target: "OD-2444 RUH→ICN codeshare", level: "info" as const },
];

export const pendingApprovals = routes.filter(r => r.status === "pending").map((r, i) => ({
  ...r,
  stage: ["Analyst", "Manager", "Finance", "Ops"][i % 4],
  slaHours: 24 - (i * 5),
  requester: r.modifiedBy,
}));

export const failedJobs = routes.filter(r => r.status === "failed").map((r, i) => ({
  ...r,
  reason: ["MCT below minimum", "Fare class gap on cabin J", "Airport curfew conflict", "Inventory mismatch"][i % 4],
  attempts: (i % 3) + 1,
}));
