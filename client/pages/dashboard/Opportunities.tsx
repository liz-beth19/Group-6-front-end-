import { companies } from "@/data/companies";
import { Link } from "react-router-dom";
import { getSavedJobs, toggleSavedJob } from "@/store/app";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobPost } from "@/store/jobs";

export default function Opportunities() {
  
  const [saved, setSaved] = useState<string[]>(getSavedJobs());
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [showCompanyJobs, setShowCompanyJobs] = useState(false);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesRes = await fetch("http://localhost:8080/api/jobs/companies");
        
        if (companiesRes.ok) {
          const companiesData = await companiesRes.json();
          setCompanies(companiesData);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        // Set default companies if API fails
        setCompanies([
          "Microsoft", 
          "Google", 
          "Amazon", 
          "Apple", 
          "Meta", 
          "Netflix", 
          "Tesla", 
          "Spotify", 
          "Airbnb", 
          "Uber", 
          "Shopify", 
          "Salesforce"
        ]);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch jobs from Spring Boot API when company is selected
  useEffect(() => {
    if (!selectedCompany) {
      setJobs([]);
      setShowCompanyJobs(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let endpoint = `http://localhost:8080/api/jobs/company/${encodeURIComponent(selectedCompany)}`;
        
        // Category filtering removed
        
        console.log(`Fetching jobs from: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch jobs. Status: ${response.status}`);
        }
        
        const jobsData = await response.json();
        console.log("Jobs data received:", jobsData);
        
        // Handle different response formats
        const jobs = Array.isArray(jobsData) ? jobsData : jobsData.data || jobsData.jobs || [];
        setJobs(jobs.sort((a: JobPost, b: JobPost) => (a.createdAt < b.createdAt ? 1 : -1)));
        setShowCompanyJobs(true);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(`Failed to load jobs: ${err.message}. Please check if your Spring Boot API is running.`);
        
        // Show sample data when API is not available
        const sampleJobs: JobPost[] = [
          {
            id: "sample_1",
            title: "Frontend Developer Intern",
            description: "Join our team as a Frontend Developer Intern and work on cutting-edge web applications using React and TypeScript.",
            requirements: "Basic knowledge of HTML, CSS, JavaScript. Familiarity with React is a plus.",
            company: selectedCompany,
            location: "Remote",
            type: "Internship",
            category: "TECHNOLOGY",
            createdAt: new Date().toISOString()
          },
          {
            id: "sample_2", 
            title: "Data Analyst Learnership",
            description: "Learn data analysis skills while working on real business projects. Perfect for graduates looking to enter the data field.",
            requirements: "Degree in Mathematics, Statistics, or related field. Basic Excel knowledge required.",
            company: selectedCompany,
            location: "Johannesburg",
            type: "Learnership",
            category: "TECHNOLOGY",
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        setJobs(sampleJobs);
        setShowCompanyJobs(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedCompany]);

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            {showCompanyJobs ? (
              <div>
                <h1 className="text-3xl font-bold text-primary md:text-4xl">
                  {selectedCompany}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Available Job Openings
                </p>
              </div>
            ) : (
              <h1 className="text-xl font-semibold md:text-2xl">
                Browse Companies
              </h1>
            )}
          </div>
          {showCompanyJobs && (
            <Button 
              variant="outline" 
              className="h-9 px-3 text-xs"
              onClick={() => {
                setSelectedCompany("");
                setShowCompanyJobs(false);
                setJobs([]);
              }}
            >
              ← Back to Companies
            </Button>
          )}
        </div>

        {!showCompanyJobs ? (
          // Company Selection View
          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-center">Select a Company</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {companies.map((company) => (
                  <div
                    key={company}
                    onClick={() => setSelectedCompany(company)}
                    className="p-6 rounded-xl border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all duration-200 hover:shadow-md"
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-primary mb-2">{company}</h3>
                      <p className="text-sm text-muted-foreground">
                        Click to view job openings
                      </p>
                      <div className="mt-3 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-primary text-xl">→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Job Listings View
          <div className="space-y-4">
            {/* Category filtering removed */}
          </div>
        )}

        {showCompanyJobs && (
          <>
            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
              <div>Showing {loading ? "..." : jobs.length} Jobs Results for {selectedCompany}</div>
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

            {jobs.length === 0 && !loading && !error && (
              <div className="mt-8 text-center py-8">
                <div className="text-muted-foreground">
                  No jobs found for {selectedCompany}
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {jobs.map(j => (
                <article key={j.id} className="rounded-lg border p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{j.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {j.location && `${j.location} • `}
                        {j.type && `${j.type}`}
                        {j.category && ` • ${j.category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}`}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        <strong>Description:</strong> {j.description}
                      </div>
                      {j.requirements && (
                        <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                          <strong>Requirements:</strong> {j.requirements}
                        </div>
                      )}
                      <div className="mt-1 text-[10px] text-muted-foreground">Posted {new Date(j.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="mt-2">
                        <Link 
                          to={`/dashboard/apply/post/${j.id}`} 
                          className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
