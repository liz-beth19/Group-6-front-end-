import { getApplications, type Application } from "@/store/app";
import { type JobPost } from "@/store/jobs";
import { Link, NavLink } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Bar, BarChart } from "recharts";
import { BarChart2, Briefcase, LayoutDashboard, MessageSquare, Newspaper, ChevronLeft, GraduationCap, Users, FileCheck, Calendar, Mic, User, Settings, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addPost, getPosts, removePost, type Post } from "@/store/posts";
import { useAdminAuth } from "@/context/AdminAuthContext";

function aggregate(applications: Application[]) {
  const apps = applications;
  const dates = Array.from(new Set(apps.map(a=>a.dateApplied || a.appliedDate))).sort();
  const companies = Array.from(new Set(apps.map(a=>a.company || a.jobOpening?.company || '')));
  const byDate: Record<string, any> = {};
  for (const d of dates) {
    byDate[d] = { date: d };
    for (const c of companies) byDate[d][c] = 0;
  }
  for (const a of apps) {
    const date = a.dateApplied || a.appliedDate;
    const company = a.company || a.jobOpening?.company || '';
    if (byDate[date]) byDate[date][company] += 1;
  }
  return { data: dates.map(d=>byDate[d]), companies };
}

function aggregateStatus(applications: Application[]) {
  const apps = applications;
  const statuses = ["PENDING","APPROVED","DECLINE"] as const;
  return statuses.map((s)=> ({ status: s, count: apps.filter(a=>a.status===s).length }));
}

const palette = ["#6f67feff","#00B5FF","#FF7A59","#22C55E","#F59E0B","#E879F9"]; // different colours

function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  
  const navItem = (to: string, label: string, icon: React.ReactNode) => (
    <NavLink 
      to={to} 
      end={to==='/admin'} 
      className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-purple-200 text-purple-900 font-medium' 
          : 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'
      }`}
    >
      {icon}
      {!collapsed && <span className="text-sm">{label}</span>}
    </NavLink>
  );

  const anchorItem = (href: string, label: string, icon: React.ReactNode) => (
    <a 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-purple-700 hover:bg-purple-50 hover:text-purple-900"
    >
      {icon}
      {!collapsed && <span className="text-sm">{label}</span>}
    </a>
  );

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-purple-100 transition-all duration-300 min-h-screen flex flex-col`}>
      {/* Header/Logo Section */}
      <div className="p-6 border-b border-purple-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-purple-900 text-xl font-bold">GRADGATE</h1>
              <p className="text-purple-700 text-xs text-center leading-tight">
                Admin<br />Panel
              </p>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center hover:bg-purple-300 transition-colors"
          >
            <ChevronLeft className={`w-4 h-4 text-purple-700 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {anchorItem('#top', 'Dashboard', <LayoutDashboard className="w-5 h-5" />)}
        {anchorItem('#charts-company', 'Company Chart', <BarChart2 className="w-5 h-5" />)}
        {anchorItem('#charts-status', 'Status Chart', <BarChart2 className="w-5 h-5" />)}
        
        {!collapsed && (
          <div className="mt-4 mb-2 px-4 py-2 text-xs uppercase tracking-wide text-purple-600 font-semibold">
            Jobs
          </div>
        )}
        {anchorItem('#jobs-post', 'Post Job', <Briefcase className="w-5 h-5" />)}
        {anchorItem('#jobs-list', 'Jobs & Applicants', <FileCheck className="w-5 h-5" />)}
        
        {!collapsed && (
          <div className="mt-4 mb-2 px-4 py-2 text-xs uppercase tracking-wide text-purple-600 font-semibold">
            Applications
          </div>
        )}
        {anchorItem('#applications', 'View Applications', <FileCheck className="w-5 h-5" />)}
        
        {!collapsed && (
          <div className="mt-4 mb-2 px-4 py-2 text-xs uppercase tracking-wide text-purple-600 font-semibold">
            Communication
          </div>
        )}
        {navItem('/admin/chat', 'Admin Chat', <MessageCircle className="w-5 h-5" />)}
        {anchorItem('#posts', 'Posts', <Newspaper className="w-5 h-5" />)}
      </nav>
    </aside>
  );
}

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    applicationId: string;
    newStatus: string;
    applicantName: string;
  } | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { data, companies } = aggregate(applications);
  const statusData = aggregateStatus(applications);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);

  // Fetch applications from backend API
  useEffect(() => {
    if (!admin) return; // Don't fetch if admin is not loaded yet
    
    const fetchApplications = async () => {
      try {
        setLoading(true);
        if (!admin?.token) {
          setError("Admin not authenticated. Please log in again.");
          return;
        }

        console.log("Making request to applications endpoint with token:", admin.token.substring(0, 20) + "...");
        
        const response = await fetch("http://localhost:8080/api/admin/applications", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${admin.token}`,
            "Content-Type": "application/json"
          }
        });
        
        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          let errorDetails = "";
          try {
            const errorData = await response.json();
            console.log("Error response data:", errorData);
            errorDetails = errorData.message || errorData.error || "";
          } catch (e) {
            const textResponse = await response.text();
            console.log("Error response text:", textResponse);
            errorDetails = textResponse;
          }
          throw new Error(`Failed to fetch applications: ${response.status} - ${errorDetails}`);
        }

        const apps = await response.json();
        console.log("Applications data received:", apps);
        console.log("First application structure:", apps[0]);
        setApplications(apps);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [admin]);

  // Function to refresh applications
  const refreshApplications = async () => {
    try {
      setLoading(true);
      if (!admin?.token) {
        setError("Admin not authenticated. Please log in again.");
        return;
      }

      const response = await fetch("http://localhost:8080/api/admin/applications", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${admin.token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }

      const apps = await response.json();
      setApplications(apps);
      console.log("Applications refreshed successfully");
    } catch (err: any) {
      setError(err.message);
      console.error("Error refreshing applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to show confirmation dialog
  const showStatusConfirmation = (applicationId: string, newStatus: 'PENDING' | 'APPROVED' | 'DECLINE', applicantName: string) => {
    setConfirmDialog({
      show: true,
      applicationId,
      newStatus,
      applicantName
    });
  };

  // Function to update application status
  const updateApplicationStatus = async (applicationId: string, newStatus: 'PENDING' | 'APPROVED' | 'DECLINE') => {
    try {
      if (!admin?.token) {
        setError("Admin not authenticated. Please log in again.");
        return;
      }

      console.log(`Updating application ${applicationId} to status: ${newStatus}`);

      const response = await fetch(`http://localhost:8080/api/admin/applications/${applicationId}/status?status=${newStatus}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${admin.token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        let errorMessage = `Failed to update status (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData?.message) errorMessage = errorData.message;
        } catch {}
        throw new Error(errorMessage);
      }

      const updatedApplication = await response.json();
      console.log("Status updated successfully:", updatedApplication);

      // Update the applications state with the new status
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      );

      // Close confirmation dialog
      setConfirmDialog(null);
      
    } catch (err: any) {
      console.error("Error updating application status:", err);
      alert(`Failed to update status: ${err.message}`);
    }
  };

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

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading admin session...</div>
          <div className="text-sm text-muted-foreground mt-2">Please wait while we verify your authentication.</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading applications...</div>
          <div className="text-sm text-muted-foreground mt-2">Fetching data from database</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600">Error loading applications</div>
          <div className="text-sm text-muted-foreground mt-2">{error}</div>
          <div className="flex gap-3 justify-center mt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
            {error.includes("not authenticated") && (
              <button 
                onClick={() => window.location.href = "/login"} 
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div id="top" className="p-6">
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
            const applicants = applications.filter(a=>a.jobId === j.id);
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
              {applications && applications.length > 0 ? applications.map((a)=> (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-3">{a.appliedDate || a.dateApplied || 'N/A'}</td>
                  <td className="px-4 py-3 capitalize">{(a.jobOpening?.company || a.company || 'N/A').replace(/-/g,' ')}</td>
                  <td className="px-4 py-3">{a.jobOpening?.title || a.position || 'N/A'}</td>
                </tr>
              )) : (
                <tr>
                  <td className="px-4 py-6 text-center text-muted-foreground" colSpan={3}>No applications yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Student view: <Link to="/dashboard" className="text-primary underline">open dashboard</Link></p>
        </div>

        {/* Applications Section */}
        <div id="applications" className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Applications</h2>
            <button
              onClick={refreshApplications}
              disabled={loading}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Date Applied</th>
                  <th className="px-4 py-3 text-left">Applicant Name</th>
                  <th className="px-4 py-3 text-left">Job Title</th>
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-left">Province</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications && applications.length > 0 ? applications.map((app) => {
                  const job = jobs.find(j => j.id === (app.jobId || app.jobOpening?.id));
                  return (
                    <tr key={app.id} className="border-t">
                      <td className="px-4 py-3">{app.dateApplied || app.appliedDate}</td>
                      <td className="px-4 py-3">{app.applicationName || app.position || 'N/A'}</td>
                      <td className="px-4 py-3">{job?.title || app.jobOpening?.title || 'Job Not Found'}</td>
                      <td className="px-4 py-3 capitalize">{(app.company || app.jobOpening?.company || '').replace(/-/g,' ')}</td>
                      <td className="px-4 py-3">{app.province || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          app.status === 'DECLINE' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button 
                            onClick={() => setSelectedApplication(app)}
                            className="text-xs text-blue-600 hover:underline hover:text-blue-800 font-medium"
                          >
                            View Details
                          </button>
                          {app.status !== 'APPROVED' && (
                            <button 
                              onClick={() => showStatusConfirmation(app.id, 'APPROVED', app.applicationName || app.position || 'N/A')}
                              className="text-xs text-green-600 hover:underline hover:text-green-800 font-medium"
                            >
                              Approve
                            </button>
                          )}
                          {app.status !== 'DECLINE' && (
                            <button 
                              onClick={() => showStatusConfirmation(app.id, 'DECLINE', app.applicationName || app.position || 'N/A')}
                              className="text-xs text-red-600 hover:underline hover:text-red-800 font-medium"
                            >
                              Decline
                            </button>
                          )}
                          {app.status !== 'PENDING' && (
                            <button 
                              onClick={() => showStatusConfirmation(app.id, 'PENDING', app.applicationName || app.position || 'N/A')}
                              className="text-xs text-orange-600 hover:underline hover:text-orange-800 font-medium"
                            >
                              Reset to Pending
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={7}>No applications yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Application Details</h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Applicant Name</label>
                  <p className="text-sm">{selectedApplication.applicationName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    selectedApplication.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    selectedApplication.status === 'DECLINE' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedApplication.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Province</label>
                  <p className="text-sm">{selectedApplication.province || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Applied Date</label>
                  <p className="text-sm">{selectedApplication.appliedDate || selectedApplication.dateApplied || 'N/A'}</p>
                </div>
              </div>
              
              {selectedApplication.coverLetter && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Cover Letter</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm max-h-32 overflow-y-auto">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">CV Path</label>
                  <p className="text-sm text-blue-600">{selectedApplication.cvPath ? 'Available' : 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ID Document</label>
                  <p className="text-sm text-blue-600">{selectedApplication.idDocumentPath ? 'Available' : 'Not provided'}</p>
                </div>
              </div>
              
              {selectedApplication.jobOpening && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Details</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                    <p><strong>Title:</strong> {selectedApplication.jobOpening.title}</p>
                    <p><strong>Company:</strong> {selectedApplication.jobOpening.company}</p>
                    {selectedApplication.jobOpening.location && <p><strong>Location:</strong> {selectedApplication.jobOpening.location}</p>}
                    {selectedApplication.jobOpening.type && <p><strong>Type:</strong> {selectedApplication.jobOpening.type}</p>}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to change the status of <strong>{confirmDialog.applicantName}</strong>'s application to <strong>{confirmDialog.newStatus}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => updateApplicationStatus(confirmDialog.applicationId, confirmDialog.newStatus as 'PENDING' | 'APPROVED' | 'DECLINE')}
                className={`px-4 py-2 text-sm text-white rounded-md font-medium ${
                  confirmDialog.newStatus === 'APPROVED' ? 'bg-green-600 hover:bg-green-700' :
                  confirmDialog.newStatus === 'DECLINE' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Confirm {confirmDialog.newStatus}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
