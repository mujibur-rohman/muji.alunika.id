import { prisma } from "@/lib/prisma";
import { Eye, Users, CalendarDays, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

const DAYS = 14;

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const today = startOfDay(now);
  const last7 = new Date(today);
  last7.setDate(last7.getDate() - 6);
  const since = new Date(today);
  since.setDate(since.getDate() - (DAYS - 1));

  const [total, uniqueGroups, todayCount, last7Count, recent, topPaths] =
    await Promise.all([
      prisma.visit.count(),
      prisma.visit.groupBy({ by: ["visitorId"] }),
      prisma.visit.count({ where: { createdAt: { gte: today } } }),
      prisma.visit.count({ where: { createdAt: { gte: last7 } } }),
      prisma.visit.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      prisma.visit.groupBy({
        by: ["path"],
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 8,
      }),
    ]);

  const unique = uniqueGroups.length;

  // Bucket the last DAYS days.
  const buckets: { label: string; key: string; count: number }[] = [];
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      count: 0,
    });
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]));
  for (const v of recent) {
    const key = v.createdAt.toISOString().slice(0, 10);
    const b = byKey.get(key);
    if (b) b.count++;
  }
  const maxCount = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Analytics</h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Kunjungan halaman publik (area admin tidak dihitung).
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<Eye className="h-4 w-4" />}
          label="Total Views"
          value={total}
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Unique Visitors"
          value={unique}
        />
        <StatCard
          icon={<CalendarDays className="h-4 w-4" />}
          label="Today"
          value={todayCount}
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Last 7 days"
          value={last7Count}
        />
      </div>

      {/* Daily bar chart */}
      <div className="rounded-xl border border-[var(--border)] p-4">
        <h3 className="mb-4 text-sm font-semibold">Last {DAYS} days</h3>
        <div className="flex h-40 items-end gap-1.5">
          {buckets.map((b) => (
            <div
              key={b.key}
              className="group flex flex-1 flex-col items-center justify-end gap-1"
            >
              <span className="text-[10px] font-medium text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100">
                {b.count}
              </span>
              <div
                className="w-full rounded-t bg-[var(--foreground)]/80 transition-all hover:bg-[var(--foreground)]"
                style={{
                  height: `${(b.count / maxCount) * 100}%`,
                  minHeight: b.count > 0 ? "4px" : "2px",
                  opacity: b.count > 0 ? 1 : 0.15,
                }}
                title={`${b.label}: ${b.count}`}
              />
              <span className="text-[9px] text-[var(--muted-foreground)]">
                {b.label.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top pages */}
      <div className="rounded-xl border border-[var(--border)]">
        <div className="border-b border-[var(--border)] px-4 py-2.5">
          <h3 className="text-sm font-semibold">Top Pages</h3>
        </div>
        {topPaths.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-[var(--muted-foreground)]">
            Belum ada data kunjungan.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {topPaths.map((p) => (
              <li
                key={p.path}
                className="flex items-center justify-between px-4 py-2.5 text-sm"
              >
                <span className="truncate font-mono text-xs">{p.path}</span>
                <span className="ml-3 shrink-0 font-semibold">
                  {p._count.path}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/50 p-4">
      <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1.5 text-2xl font-bold tracking-tight">
        {value.toLocaleString("id-ID")}
      </p>
    </div>
  );
}
