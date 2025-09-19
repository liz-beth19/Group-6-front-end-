import { useMemo, useState } from "react";
import { Application, getApplications } from "@/store/app";

export default function Applications() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [companyFilter, setCompanyFilter] = useState<string>("All");
  const apps = getApplications();

  const filtered = useMemo(() =>
    apps.filter((a) =>
      (statusFilter === "All" || a.status === statusFilter) &&
      (companyFilter === "All" || a.company === companyFilter)
    ), [apps, statusFilter, companyFilter]);

  // Realistic progress: weight by status across all applications
  const progress = useMemo(()=>{
    if (apps.length === 0) return 0;
    const weights: Record<Application["status"], number> = {
      Pending: 0.25,
      Interview: 0.6,
      Rejected: 0.25,
      Hired: 1,
    };
    const total = apps.reduce((sum, a)=> sum + (weights[a.status] ?? 0), 0);
    return Math.min(100, Math.round((total / apps.length) * 100));
  }, [apps]);

  const companies = Array.from(new Set(apps.map((a) => a.company)));

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Applications</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your submitted applications at a glance.</p>
          </div>
          <div className="min-w-[260px]">
            <div className="text-xs text-muted-foreground">Progress</div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <select className="h-9 rounded-md border border-input bg-background px-2" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
            {['All','Pending','Interview','Rejected','Hired'].map((s)=>(<option key={s}>{s}</option>))}
          </select>
          <select className="h-9 rounded-md border border-input bg-background px-2" value={companyFilter} onChange={(e)=>setCompanyFilter(e.target.value)}>
            {['All',...companies].map((c)=>(<option key={c}>{c}</option>))}
          </select>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Position</th>
                <th className="px-4 py-3 text-left">Date Applied</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a: Application) => (
                <tr key={a.id} className="border-t transition hover:bg-primary/5">
                  <td className="px-4 py-3 capitalize">{a.company.replace(/-/g,' ')}</td>
                  <td className="px-4 py-3">{a.position}</td>
                  <td className="px-4 py-3">{a.dateApplied}</td>
                  <td className="px-4 py-3">{a.status}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-muted-foreground" colSpan={4}>No applications yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
