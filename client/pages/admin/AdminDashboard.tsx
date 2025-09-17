import { getApplications } from "@/store/app";
import { addJobPost, getJobPosts, removeJobPost, type JobPost } from "@/store/jobs";
import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Bar, BarChart } from "recharts";
import { BarChart2, Briefcase, LayoutDashboard, MessageSquare, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addPost, getPosts, removePost, type Post } from "@/store/posts";

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
  const { data, companies } = aggregate();
  const statusData = aggregateStatus();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);

  // job form state
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("Internship");
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    setPosts(getPosts());
    setJobs(getJobPosts());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 border-r border-primary/30 bg-primary/15 p-4 md:block">
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
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={(e)=>{
          e.preventDefault();
          if (!jobTitle.trim() || !jobCompany.trim() || !jobLocation.trim() || !jobDescription.trim()) return;
          addJobPost({ title: jobTitle, company: jobCompany, location: jobLocation, type: jobType, description: jobDescription });
          setJobs(getJobPosts());
          setJobTitle("");
          setJobCompany("");
          setJobLocation("");
          setJobType("Internship");
          setJobDescription("");
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
            <Textarea value={jobDescription} onChange={(e)=>setJobDescription(e.target.value)} placeholder="Describe the role, responsibilities, and requirements." required />
          </div>
          <div className="md:col-span-2">
            <Button type="submit">Publish job</Button>
          </div>
        </form>
      </div>

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
                    <div className="mt-1 text-xs text-muted-foreground">{j.company} • {j.location} • {j.type}</div>
                    <div className="mt-1 text-[10px] text-muted-foreground">Posted {new Date(j.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">Applicants: <span className="font-semibold">{applicants.length}</span></div>
                    <button onClick={()=> setJobs(removeJobPost(j.id) as JobPost[])} className="mt-2 text-xs text-destructive hover:underline">Delete</button>
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
