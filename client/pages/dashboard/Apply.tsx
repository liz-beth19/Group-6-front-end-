import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { companies } from "@/data/companies";
import { addApplication } from "@/store/app";
import { JobPost } from "@/store/jobs";

export default function Apply() {
  const { slug, jobId } = useParams<{ slug: string; jobId: string }>();
  const navigate = useNavigate();
  const isPost = slug === "post";
  const [post, setPost] = useState<JobPost | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const company = !isPost ? companies.find((c) => c.slug === slug) : undefined;
  const job = !isPost ? company?.jobs.find((j) => j.id === jobId) : undefined;

  // Fetch job post from Spring Boot API if it's a post
  useEffect(() => {
    if (isPost && jobId) {
      const fetchJob = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Try different possible Spring Boot endpoints
          const possibleEndpoints = [
            `http://localhost:8080/api/jobs/${jobId}`,
            `http://localhost:8080/api/admin/public/${jobId}`,
            `http://localhost:8080/jobs/${jobId}`,
            `http://localhost:8080/api/v1/jobs/${jobId}`,
            `http://localhost:8081/api/jobs/${jobId}`,
            `http://localhost:8081/jobs/${jobId}`
          ];
          
          let response = null;
          let lastError = null;
          
          for (const endpoint of possibleEndpoints) {
            try {
              console.log(`Trying job endpoint: ${endpoint}`);
              response = await fetch(endpoint, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                }
              });
              
              if (response.ok) {
                console.log(`Success with job endpoint: ${endpoint}`);
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
            throw new Error(`Job not found. Last error: ${lastError?.message || 'All endpoints failed'}`);
          }
          
          const jobData = await response.json();
          console.log("Job data received:", jobData);
          setPost(jobData);
        } catch (err) {
          console.error("Error fetching job:", err);
          setError(`Failed to load job details: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchJob();
    }
  }, [isPost, jobId]);

  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-sm text-muted-foreground">Loading job details...</div>
        </div>
      </section>
    );
  }

  if (error || ((!isPost && (!company || !job)) || (isPost && !post))) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <p className="text-sm text-destructive">{error || "Job not found."}</p>
          <Link to="/dashboard/opportunities" className="text-primary underline">Back to opportunities</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold">Apply — {isPost ? `${post!.company} • ${post!.title}` : `${company!.name} • ${job!.title}`}</h1>
        <form
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError(null);
            const form = e.target as HTMLFormElement;
            const fd = new FormData(form);
            const file = fd.get("resumeFile") as File | null;
            let resumeName: string | undefined;
            let resumeDataUrl: string | undefined;
            if (file && file.size > 0) {
              if (file.size > 5 * 1024 * 1024) { // 5MB
                setError("PDF is too large (max 5MB).");
                setSubmitting(false);
                return;
              }
              if (!file.type.includes("pdf")) {
                setError("Please upload a PDF file.");
                setSubmitting(false);
                return;
              }
              resumeName = file.name;
              const buf = await file.arrayBuffer();
              const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
              resumeDataUrl = `data:${file.type};base64,${base64}`;
            }
            try {
              // Simulate success locally (no backend)
              const generatedId = `app_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
              addApplication({
                id: generatedId,
                company: isPost ? post!.company : company!.slug,
                jobId: isPost ? post!.id : job!.id,
                position: isPost ? post!.title : job!.title,
                dateApplied: new Date().toISOString().slice(0, 10),
                status: "Pending",
                resumeName,
                resumeDataUrl,
              });
              navigate("/dashboard/applications", { replace: true, state: { applied: true } });
            } catch (err: any) {
              setError(err.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input name="name" className="h-10 w-full rounded-md border border-input px-3" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" name="email" className="h-10 w-full rounded-md border border-input px-3" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input name="phone" className="h-10 w-full rounded-md border border-input px-3" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Resume URL</label>
            <input name="resumeUrl" className="h-10 w-full rounded-md border border-input px-3" placeholder="Link to your CV" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Upload PDF Resume</label>
            <input name="resumeFile" type="file" accept="application/pdf" className="block w-full text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Cover letter</label>
            <textarea name="coverLetter" className="min-h-[120px] w-full rounded-md border border-input px-3 py-2" />
          </div>
          {error ? <div className="md:col-span-2 text-sm text-destructive">{error}</div> : null}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit application"}
            </button>
            <Link to={isPost ? "/dashboard/opportunities" : `/dashboard/company/${company!.slug}`} className="ml-3 text-sm text-muted-foreground underline">Cancel</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
