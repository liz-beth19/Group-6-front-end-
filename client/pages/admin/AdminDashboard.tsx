import { getApplications } from "@/store/app";
import { type JobPost } from "@/store/jobs";
import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Bar, BarChart } from "recharts";
import { BarChart2, Briefcase, LayoutDashboard, MessageSquare, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addPost, getPosts, removePost, type Post } from "@/store/posts";
import { useAdminAuth } from "@/context/AdminAuthContext";

function aggregate() {
  const apps = getApplications();
  const dates = Array.from(new Set(apps.map(a=>a.dateApplied))).sort();
  const companies = Array.from(new Set(apps.map(a=>a.company)));
  const byDate: Record<string, any> = {};
  for (const d of dates) {
    byDate[d] = { date: d };
    for (const c of companies) byDate[d][c] = 0;
  }
  for (const a of apps) {
    if (byDate[a.dateApplied]) byDate[a.dateApplied][a.company] += 1;
  }
  return { data: dates.map(d=>byDate[d]), companies };
}

function aggregateStatus() {
  const apps = getApplications();
  const statuses = ["Pending","Interview","Rejected","Hired"] as const;
  return statuses.map((s)=> ({ status: s, count: apps.filter(a=>a.status===s).length }));
}

const palette = ["#6f67feff","#00B5FF","#FF7A59","#22C55E","#F59E0B","#E879F9"]; // different colours

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  const { data, companies } = aggregate();
  const statusData = aggregateStatus();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);

  // job form state
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("Internship");
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);
  
  // Edit job state
  const [editingJob, setEditingJob] = useState<JobPost | null>(null);
  const [editJobTitle, setEditJobTitle] = useState("");
  const [editJobDescription, setEditJobDescription] = useState("");
  const [editJobRequirements, setEditJobRequirements] = useState("");
  const [editJobCompany, setEditJobCompany] = useState("");
  const [editJobLocation, setEditJobLocation] = useState("");
  const [editJobType, setEditJobType] = useState("Internship");
  const [editJobSubmitting, setEditJobSubmitting] = useState(false);
  const [editJobError, setEditJobError] = useState<string | null>(null);

  useEffect(() => {
    setPosts(getPosts());
    console.log("Admin context:", admin);
    if (admin) {
      console.log("Admin authenticated, fetching job posts...");
      fetchJobPosts();
    } else {
      console.log("No admin authentication available");
    }
  }, [admin]);

  // Function to fetch job posts from API
  const fetchJobPosts = async () => {
    if (!admin) {
      console.log("No admin authentication available");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8080/api/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${admin.token}`,
        },
      });

      if (response.ok) {
        const jobs = await response.json();
        // Transform backend data to match frontend format
        const transformedJobs = jobs.map((job: any) => ({
          id: job.id.toString(),
          title: job.title,
          description: job.description,
          requirements: job.requirements || "",
          company: job.company || "",
          location: job.location || "",
          type: job.type || "",
          postedDate: job.postedDate,
          createdAt: job.postedDate ? new Date(job.postedDate).toISOString() : new Date().toISOString()
        }));
        setJobs(transformedJobs);
      } else {
        console.error("Failed to fetch job posts");
      }
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };


  // Function to create job post via API
  const createJobPost = async (jobData: {
    title: string;
    description: string;
    requirements?: string;
    company?: string;
    location?: string;
    type?: string;
  }) => {
    if (!admin) {
      console.error("No admin authentication available");
      throw new Error("No admin authentication available");
    }
    
    try {
      console.log("Creating job post:", jobData);
      console.log("Using token:", admin.token);
      const response = await fetch("http://localhost:8080/api/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${admin.token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        let errorMessage = `Job creation failed (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData?.message) errorMessage = errorData.message;
          if (errorData?.error) errorMessage = errorData.error;
        } catch {}
        throw new Error(errorMessage);
      }

      const createdJob = await response.json();
      console.log("Job created successfully:", createdJob);
      
      // Transform backend response to match frontend format
      return {
        id: createdJob.id.toString(),
        title: createdJob.title,
        description: createdJob.description,
        requirements: createdJob.requirements || "",
        company: createdJob.company || "",
        location: createdJob.location || "",
        type: createdJob.type || "",
        postedDate: createdJob.postedDate,
        createdAt: createdJob.postedDate ? new Date(createdJob.postedDate).toISOString() : new Date().toISOString()
      };
    } catch (error: any) {
      console.error("Job creation error:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error("Network error: Unable to connect to server. Please check if the server is running on http://localhost:8080");
      }
      throw new Error(error?.message || "Failed to create job post");
    }
  };

  // Function to update job post via API
  const updateJobPost = async (jobId: string, jobData: {
    title: string;
    description: string;
    requirements?: string;
    company?: string;
    location?: string;
    type?: string;
  }) => {
    if (!admin) {
      throw new Error("No admin authentication available");
    }
    
    try {
      console.log("Updating job post:", jobId, jobData);
      const response = await fetch(`http://localhost:8080/api/admin/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${admin.token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        let errorMessage = `Job update failed (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData?.message) errorMessage = errorData.message;
          if (errorData?.error) errorMessage = errorData.error;
        } catch {}
        throw new Error(errorMessage);
      }

      const updatedJob = await response.json();
      console.log("Job updated successfully:", updatedJob);
      
      // Transform backend response to match frontend format
      return {
        id: updatedJob.id.toString(),
        title: updatedJob.title,
        description: updatedJob.description,
        requirements: updatedJob.requirements || "",
        company: updatedJob.company || "",
        location: updatedJob.location || "",
        type: updatedJob.type || "",
        postedDate: updatedJob.postedDate,
        createdAt: updatedJob.postedDate ? new Date(updatedJob.postedDate).toISOString() : new Date().toISOString()
      };
    } catch (error: any) {
      console.error("Job update error:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error("Network error: Unable to connect to server. Please check if the server is running on http://localhost:8080");
      }
      throw new Error(error?.message || "Failed to update job post");
    }
  };

  // Function to start editing a job
  const startEditJob = (job: JobPost) => {
    setEditingJob(job);
    setEditJobTitle(job.title);
    setEditJobDescription(job.description);
    setEditJobRequirements(job.requirements || "");
    setEditJobCompany(job.company || "");
    setEditJobLocation(job.location || "");
    setEditJobType(job.type || "Internship");
    setEditJobError(null);
  };

  // Function to cancel editing
  const cancelEditJob = () => {
    setEditingJob(null);
    setEditJobTitle("");
    setEditJobDescription("");
    setEditJobRequirements("");
    setEditJobCompany("");
    setEditJobLocation("");
    setEditJobType("Internship");
    setEditJobError(null);
  };

  // Function to save edited job
  const saveEditJob = async () => {
    if (!editingJob) return;
    
    if (!editJobTitle.trim() || !editJobDescription.trim()) {
      setEditJobError("Title and Description are required");
      return;
    }

    setEditJobSubmitting(true);
    setEditJobError(null);

    try {
      const jobData = {
        title: editJobTitle,
        description: editJobDescription,
        requirements: editJobRequirements,
        company: editJobCompany,
        location: editJobLocation,
        type: editJobType,
      };

      const updatedJob = await updateJobPost(editingJob.id, jobData);
      
      // Refresh the job list from the server
      await fetchJobPosts();
      
      // Reset edit state
      cancelEditJob();
    } catch (error: any) {
      setEditJobError(error.message || "Failed to update job post");
    } finally {
      setEditJobSubmitting(false);
    }
  };

  // Function to delete job post via API
  const deleteJobPost = async (jobId: string) => {
    if (!admin) {
      throw new Error("No admin authentication available");
    }
    
    try {
      console.log("Deleting job post:", jobId);
      const response = await fetch(`http://localhost:8080/api/admin/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${admin.token}`,
        },
      });

      if (!response.ok) {
        let errorMessage = `Job deletion failed (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData?.message) errorMessage = errorData.message;
          if (errorData?.error) errorMessage = errorData.error;
        } catch {}
        throw new Error(errorMessage);
      }

      console.log("Job deleted successfully");
      return true;
    } catch (error: any) {
      console.error("Job deletion error:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error("Network error: Unable to connect to server. Please check if the server is running on http://localhost:8080");
      }
      throw new Error(error?.message || "Failed to delete job post");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 border-r border-primary/30 bg-primary/15 p-4 md:block sticky top-0 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <nav className="space-y-1 text-sm">
            <a href="#top" className="block rounded-md px-3 py-2 hover:bg-primary/25"><span className="inline-flex items-center gap-2"><LayoutDashboard size={16}/> Dashboard</span></a>
            <a href="#charts-company" className="block rounded-md px-3 py-2 hover:bg-primary/25"><span className="inline-flex items-center gap-2"><BarChart2 size={16}/> Company Chart</span></a>
            <a href="#charts-status" className="block rounded-md px-3 py-2 hover:bg-primary/25"><span className="inline-flex items-center gap-2"><BarChart2 size={16}/> Status Chart</span></a>
            <div className="mt-2 rounded-md px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground">Jobs</div>
            <a href="#jobs-post" className="block rounded-md px-3 py-2 hover:bg-primary/25"><span className="inline-flex items-center gap-2"><Briefcase size={16}/> Post Job</span></a>
            <a href="#jobs-list" className="block rounded-md px-3 py-2 hover:bg-primary/25"><span className="inline-flex items-center gap-2"><Briefcase size={16}/> Jobs & Applicants</span></a>
            <div className="mt-2 rounded-md px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground">Communication</div>
            <Link to="/admin/chat" className="block rounded-md px-3 py-2 hover:bg-primary/25"><span className="inline-flex items-center gap-2"><MessageSquare size={16}/> Admin Chat</span></Link>
            <a href="#posts" className="block rounded-md px-3 py-2 hover:bg-primary/25"><span className="inline-flex items-center gap-2"><Newspaper size={16}/> Posts</span></a>
          </nav>
        </aside>
        <div id="top" className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Link to="/admin/chat" className="text-sm text-primary underline">Open Chat</Link>
          </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[{label:'App Downloads', value:5938}, {label:'Enrolled Schools', value:3623}, {label:'Enrolled Users', value:2341}, {label:'Revenue', value:'$69.2k'}].map((k)=> (
          <div key={k.label} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className="mt-2 text-2xl font-bold">{k.value}</div>
          </div>
        ))}
      </div>

      <div id="jobs-post" className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Post a job</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={async (e)=>{
          e.preventDefault();
          if (!jobTitle.trim() || !jobDescription.trim()) return;
          
          setJobSubmitting(true);
          setJobError(null);
          
          try {
            const jobData = {
              title: jobTitle,
              description: jobDescription,
              requirements: jobRequirements,
              company: jobCompany,
              location: jobLocation,
              type: jobType,
            };
            
            // Create job via API
            const createdJob = await createJobPost(jobData);
            
            // Refresh the job list from the server
            await fetchJobPosts();
            
            // Reset form
            setJobTitle("");
            setJobDescription("");
            setJobRequirements("");
            setJobCompany("");
            setJobLocation("");
            setJobType("Internship");
          } catch (error: any) {
            // If it's a network error, create a temporary local job
            if (error.message.includes("Network error") || error.message.includes("Unable to connect")) {
              const tempJob = {
                id: `temp_${Date.now()}`,
                title: jobTitle,
                description: jobDescription,
                requirements: jobRequirements,
                company: jobCompany,
                location: jobLocation,
                type: jobType,
                createdAt: new Date().toISOString(),
              };
              
              setJobs(prevJobs => [tempJob, ...prevJobs]);
              setJobError("⚠️ Server offline - Job saved locally. Will sync when server is back online.");
              
              // Reset form
              setJobTitle("");
              setJobDescription("");
              setJobRequirements("");
              setJobCompany("");
              setJobLocation("");
              setJobType("Internship");
            } else {
              setJobError(error.message || "Failed to create job post");
            }
          } finally {
            setJobSubmitting(false);
          }
        }}>
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <Input value={jobTitle} onChange={(e)=>setJobTitle(e.target.value)} placeholder="e.g. Frontend Intern" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Company</label>
            <Input value={jobCompany} onChange={(e)=>setJobCompany(e.target.value)} placeholder="e.g. GradGate Labs" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Location</label>
            <Input value={jobLocation} onChange={(e)=>setJobLocation(e.target.value)} placeholder="e.g. Remote / Johannesburg" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Type</label>
            <select className="h-9 w-full rounded-md border border-input bg-background px-2" value={jobType} onChange={(e)=>setJobType(e.target.value)}>
              {['Internship','Learnership','Full-time','Part-time','Contract'].map(t=> (<option key={t}>{t}</option>))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Description</label>
            <Textarea value={jobDescription} onChange={(e)=>setJobDescription(e.target.value)} placeholder="Describe the role and responsibilities." required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Requirements</label>
            <Textarea value={jobRequirements} onChange={(e)=>setJobRequirements(e.target.value)} placeholder="List the specific requirements, skills, and qualifications needed." />
          </div>
          {jobError && (
            <div className="md:col-span-2 text-sm text-destructive">{jobError}</div>
          )}
          <div className="md:col-span-2">
            <Button type="submit" disabled={jobSubmitting}>
              {jobSubmitting ? "Publishing..." : "Publish job"}
            </Button>
          </div>
        </form>
      </div>

      {/* Edit Job Form */}
      {editingJob && (
        <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Edit Job Post</h2>
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={(e) => {
            e.preventDefault();
            saveEditJob();
          }}>
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <Input 
                value={editJobTitle} 
                onChange={(e) => setEditJobTitle(e.target.value)} 
                placeholder="e.g. Frontend Intern" 
                required 
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Company</label>
              <Input 
                value={editJobCompany} 
                onChange={(e) => setEditJobCompany(e.target.value)} 
                placeholder="e.g. GradGate Labs" 
                required 
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Location</label>
              <Input 
                value={editJobLocation} 
                onChange={(e) => setEditJobLocation(e.target.value)} 
                placeholder="e.g. Remote / Johannesburg" 
                required 
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Type</label>
              <select 
                className="h-9 w-full rounded-md border border-input bg-background px-2" 
                value={editJobType} 
                onChange={(e) => setEditJobType(e.target.value)}
              >
                {['Internship','Learnership','Full-time','Part-time','Contract'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Description</label>
              <Textarea 
                value={editJobDescription} 
                onChange={(e) => setEditJobDescription(e.target.value)} 
                placeholder="Describe the role and responsibilities." 
                required 
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Requirements</label>
              <Textarea 
                value={editJobRequirements} 
                onChange={(e) => setEditJobRequirements(e.target.value)} 
                placeholder="List the specific requirements, skills, and qualifications needed." 
              />
            </div>
            {editJobError && (
              <div className="md:col-span-2 text-sm text-destructive">{editJobError}</div>
            )}
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={editJobSubmitting}>
                {editJobSubmitting ? "Updating..." : "Update Job"}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEditJob}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div id="jobs-list" className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Jobs & applicants</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {jobs.map((j)=>{
            const applicants = getApplications().filter(a=>a.jobId === j.id);
            return (
              <div key={j.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">{j.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {j.company && `${j.company} • `}
                      {j.location && `${j.location} • `}
                      {j.type && `${j.type}`}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{j.description}</div>
                    {j.requirements && (
                      <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        <strong>Requirements:</strong> {j.requirements}
                      </div>
                    )}
                    <div className="mt-1 text-[10px] text-muted-foreground">Posted {new Date(j.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">Applicants: <span className="font-semibold">{applicants.length}</span></div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => startEditJob(j)} className="text-xs text-primary hover:underline">Edit</button>
                    <button onClick={async ()=>{
                      try {
                        await deleteJobPost(j.id);
                        // Refresh the job list from the server
                        await fetchJobPosts();
                      } catch (error: any) {
                        console.error("Failed to delete job:", error.message);
                        // You could add a toast notification here
                      }
                    }} className="text-xs text-destructive hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground whitespace-pre-wrap">{j.description}</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-secondary/50 text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left">Date</th>
                        <th className="px-3 py-2 text-left">Position</th>
                        <th className="px-3 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map(a=> (
                        <tr key={a.id} className="border-t">
                          <td className="px-3 py-2">{a.dateApplied}</td>
                          <td className="px-3 py-2">{a.position}</td>
                          <td className="px-3 py-2">{a.status}</td>
                        </tr>
                      ))}
                      {applicants.length === 0 && (
                        <tr>
                          <td className="px-3 py-4 text-center text-muted-foreground" colSpan={3}>No applicants yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          {jobs.length === 0 && (
            <div className="text-sm text-muted-foreground">No jobs posted yet.</div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Create announcement/post</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={async (e)=>{
          e.preventDefault();
          if (!title.trim() || !body.trim()) return;
          setSubmitting(true);
          addPost({ title, body, author: "admin" });
          setTitle("");
          setBody("");
          setPosts(getPosts());
          setSubmitting(false);
        }}>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Title</label>
            <Input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Post title" required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Body</label>
            <Textarea value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Write your announcement..." required />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>{submitting?"Publishing...":"Publish post"}</Button>
          </div>
        </form>
      </div>

      <div id="charts-company" className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Applications by Company (daily)</h2>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {companies.map((c, i)=> (
                <Line key={c} type="monotone" dataKey={c} stroke={palette[i % palette.length]} strokeWidth={3} dot={{ r: 2 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div id="charts-status" className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Applications by Status</h2>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="rgba(166, 20, 244, 0.6)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { id: 1, t: "Review latest applications" },
              { id: 2, t: "Publish partner announcement" },
              { id: 3, t: "Export weekly report" },
            ].map(item => (
              <li key={item.id} className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" />
                <span>{item.t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-md border p-3">3 new applications submitted</div>
            <div className="rounded-md border p-3">Mentorship session scheduled for Friday</div>
            <div className="rounded-md border p-3">Partner uploaded new job openings</div>
          </div>
        </div>
      </div>

      <div id="posts" className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">All posts</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {posts.map(p => (
            <div key={p.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">by {p.author} • {new Date(p.createdAt).toLocaleString()}</div>
                </div>
                <button onClick={()=>{ removePost(p.id); setPosts(getPosts()); }} className="text-xs text-destructive hover:underline">Delete</button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{p.body}</p>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-sm text-muted-foreground">No posts yet.</div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Recent applications</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Position</th>
              </tr>
            </thead>
            <tbody>
              {getApplications().map((a)=> (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-3">{a.dateApplied}</td>
                  <td className="px-4 py-3 capitalize">{a.company.replace(/-/g,' ')}</td>
                  <td className="px-4 py-3">{a.position}</td>
                </tr>
              ))}
              {getApplications().length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-muted-foreground" colSpan={3}>No applications yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Student view: <Link to="/dashboard" className="text-primary underline">open dashboard</Link></p>
      </div>
        </div>
      </div>
    </div>
  );
}
