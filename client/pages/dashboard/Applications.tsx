import { useMemo, useState, useEffect } from "react";
import { Application, getApplications } from "@/store/app";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function Applications() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [companyFilter, setCompanyFilter] = useState<string>("All");
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from backend first
        const response = await fetch("http://localhost:8080/api/auth/my-applications", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("gg_auth_token")}`
          }
        });
        
        if (response.ok) {
          const backendApps = await response.json();
          // Transform backend data to match frontend format
          const transformedApps = backendApps.map((app: any) => ({
            id: app.id.toString(),
            status: app.status,
            appliedDate: app.appliedDate,
            applicationName: app.applicationName,
            coverLetter: app.coverLetter,
            company: app.jobOpening?.company,
            position: app.jobOpening?.title,
            jobOpening: {
              id: app.jobOpening?.id?.toString(),
              title: app.jobOpening?.title,
              company: app.jobOpening?.company,
              location: app.jobOpening?.location,
              type: app.jobOpening?.type
            }
          }));
          setApps(transformedApps);
        } else {
          // Fallback to local storage
          const localApps = getApplications(user?.id);
          setApps(localApps);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        // Fallback to local storage
        const localApps = getApplications(user?.id);
        setApps(localApps);
        setError("Failed to load applications from server. Showing local data.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filtered = useMemo(() =>
    apps.filter((a) =>
      (statusFilter === "All" || a.status === statusFilter) &&
      (companyFilter === "All" || (a.company || a.jobOpening?.company) === companyFilter)
    ), [apps, statusFilter, companyFilter]);

  // Realistic progress: weight by status across all applications
  const progress = useMemo(()=>{
    if (apps.length === 0) return 0;
    const weights: Record<Application["status"], number> = {
      PENDING: 0.25,
      APPROVED: 1,
      DECLINE: 0.25,
    };
    const total = apps.reduce((sum, a)=> sum + (weights[a.status] ?? 0), 0);
    return Math.min(100, Math.round((total / apps.length) * 100));
  }, [apps]);

  const companies = Array.from(new Set(apps.map((a) => a.company || a.jobOpening?.company).filter(Boolean)));

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✓ Approved</Badge>;
      case "DECLINE":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">✗ Declined</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⏳ Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Refresh applications
  const refreshApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from backend first
      const response = await fetch("http://localhost:8080/api/auth/my-applications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("gg_auth_token")}`
        }
      });
      
      if (response.ok) {
        const backendApps = await response.json();
        // Transform backend data to match frontend format
        const transformedApps = backendApps.map((app: any) => ({
          id: app.id.toString(),
          status: app.status,
          appliedDate: app.appliedDate,
          applicationName: app.applicationName,
          coverLetter: app.coverLetter,
          company: app.jobOpening?.company,
          position: app.jobOpening?.title,
          jobOpening: {
            id: app.jobOpening?.id?.toString(),
            title: app.jobOpening?.title,
            company: app.jobOpening?.company,
            location: app.jobOpening?.location,
            type: app.jobOpening?.type
          }
        }));
        setApps(transformedApps);
      } else {
        // Fallback to local storage
        const localApps = getApplications(user?.id);
        setApps(localApps);
      }
    } catch (err) {
      console.error("Error refreshing applications:", err);
      // Fallback to local storage
      const localApps = getApplications(user?.id);
      setApps(localApps);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh applications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshApplications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Refresh data when user changes
  useEffect(() => {
    if (user?.id) {
      refreshApplications();
    }
  }, [user?.id]);


  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Applications</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your submitted applications at a glance.</p>
            {error && (
              <div className="mt-2 text-sm text-amber-600">
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshApplications}
                  className="ml-2"
                >
                  Refresh
                </Button>
              </div>
            )}
            <div className="mt-2 flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshApplications}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "🔄 Refresh"}
              </Button>
              <span className="text-xs text-muted-foreground">
                Auto-refreshes every 30 seconds
              </span>
            </div>
          </div>
          <div className="min-w-[260px]">
            <div className="text-xs text-muted-foreground">Progress</div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {apps.filter(a => a.status === "APPROVED").length} approved, {apps.filter(a => a.status === "PENDING").length} pending
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <select className="h-9 rounded-md border border-input bg-background px-2" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
            {['All','PENDING','APPROVED','DECLINE'].map((s)=>(<option key={s}>{s}</option>))}
          </select>
          <select className="h-9 rounded-md border border-input bg-background px-2" value={companyFilter} onChange={(e)=>setCompanyFilter(e.target.value)}>
            {['All',...companies].map((c)=>(<option key={c}>{c}</option>))}
          </select>
        </div>

        {loading ? (
          <div className="mt-6 flex justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading applications...</div>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-left">Position</th>
                  <th className="px-4 py-3 text-left">Date Applied</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a: Application) => (
                  <tr key={a.id} className="border-t transition hover:bg-primary/5">
                    <td className="px-4 py-3 capitalize">{(a.company || a.jobOpening?.company || '').replace(/-/g,' ')}</td>
                    <td className="px-4 py-3">{a.position || a.jobOpening?.title || 'N/A'}</td>
                    <td className="px-4 py-3">{a.dateApplied || a.appliedDate}</td>
                    <td className="px-4 py-3">{getStatusBadge(a.status)}</td>
                    <td className="px-4 py-3">
                      {a.status === "APPROVED" && (
                        <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                          View Details
                        </Button>
                      )}
                      {a.status === "PENDING" && (
                        <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-200">
                          Check Status
                        </Button>
                      )}
                      {a.status === "DECLINE" && (
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                          View Feedback
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={5}>
                      No applications found. Start applying to jobs to see your applications here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
