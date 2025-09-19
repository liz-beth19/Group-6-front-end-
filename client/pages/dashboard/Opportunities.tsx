import { companies } from "@/data/companies";
import { Link } from "react-router-dom";
import { getSavedJobs, toggleSavedJob } from "@/store/app";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { JobPost } from "@/store/jobs";

export default function Opportunities() {
  const [saved, setSaved] = useState<string[]>(getSavedJobs());
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs from Spring Boot API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try different possible Spring Boot endpoints
        const possibleEndpoints = [
          "http://localhost:8080/api/jobs",
          "http://localhost:8080/api/admin/public",
          "http://localhost:8080/jobs", 
          "http://localhost:8080/api/v1/jobs",
          "http://localhost:8081/api/jobs",
          "http://localhost:8081/jobs"
        ];
        
        let response = null;
        let lastError = null;
        
        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            response = await fetch(endpoint, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              }
            });
            
            if (response.ok) {
              console.log(`Success with endpoint: ${endpoint}`);
              break;
            } else {
              console.log(`Failed with ${endpoint}: ${response.status} ${response.statusText}`);
            }
          } catch (err) {
            console.log(`Error with ${endpoint}:`, err);
            lastError = err;
          }
        }
        
        if (!response || !response.ok) {
          throw new Error(`Failed to fetch jobs. Last error: ${lastError?.message || 'All endpoints failed'}`);
        }
        
        const jobsData = await response.json();
        console.log("Jobs data received:", jobsData);
        
        // Handle different response formats
        const jobs = Array.isArray(jobsData) ? jobsData : jobsData.data || jobsData.jobs || [];
        setJobs(jobs.sort((a: JobPost, b: JobPost) => (a.createdAt < b.createdAt ? 1 : -1)));
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(`Failed to load jobs: ${err.message}. Please check if your Spring Boot API is running.`);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold md:text-2xl">Search Jobs</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 px-3 text-xs">Filter</Button>
            <Button className="h-9 px-4 text-xs">Find</Button>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <input className="h-10 w-full rounded-md border px-3 text-sm" placeholder="Around You" />
            <input className="h-10 w-full rounded-md border px-3 text-sm md:col-span-2" placeholder="Search by title, company or keyword" />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" className="h-10 px-3 text-xs">Filter</Button>
              <Button className="h-10 px-4 text-xs">Find</Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {["Suggestions","Your Skill","Programmer","Software Engineer","Photographer","Digital Marketing"].map((t,i)=> (
              <button key={t} className={`rounded-full px-3 py-1 ${i===2?"bg-primary text-primary-foreground":"border hover:bg-accent"}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <div>Showing {loading ? "..." : jobs.length} Jobs Results</div>
          <div className="flex items-center gap-2">
            <span>Newest</span>
            <button className="rounded-md border px-2 py-1">▤</button>
            <button className="rounded-md border px-2 py-1">☰</button>
          </div>
        </div>

        {loading && (
          <div className="mt-4 flex justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading jobs...</div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="text-sm text-destructive">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-xs text-destructive underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {jobs.map(j => (
            <article key={j.id} className="flex items-start gap-4 rounded-xl border bg-card p-4 shadow-sm">
              <div className="h-10 w-10 rounded-md bg-primary/10" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{j.title}</div>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">REMOTE</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{j.company} • {j.location}</div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{j.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{j.type}</div>
                  <Link to={`/dashboard/apply/post/${j.id}`} className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground">Apply</Link>
                </div>
              </div>
            </article>
          ))}
          {!loading && !error && jobs.length === 0 && <div className="text-sm text-muted-foreground">No job posts yet.</div>}
        </div>
      </div>
    </section>
  );
}
