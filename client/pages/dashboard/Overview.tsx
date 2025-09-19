import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { Unemployment } from "@/components/gradgate/Unemployment";
import { getPosts } from "@/store/posts";
import { Calendar as Day } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { getProjects } from "@/store/projects";
import { addTask, getTasks, toggleTask } from "@/store/tasks";
import { updateProjectProgress } from "@/store/projects";
import { addEvent, eventsForDate, getEvents, removeEvent } from "@/store/events";

export default function Overview() {
  const { user } = useAuth();
  const location = useLocation();
  const justApplied = Boolean((location as any).state?.applied);
  const [search, setSearch] = useState("");
  // Dashboard calendar state (mirrors Calendar page sans Todos)
  const today = new Date();
  const [selected, setSelected] = useState<Date | undefined>(today);
  const all = getEvents();
  const dateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const sel = useMemo(()=> selected ? eventsForDate(dateKey(selected)) : [], [selected]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [view, setView] = useState<"day"|"week"|"month">("month");

  // State for projects to enable re-rendering
  const [projects, setProjects] = useState(getProjects());
  const [tasks, setTasks] = useState(getTasks());

  // Real statistics calculations
  const completedTasks = tasks.filter(t => t.done).length;
  const totalTasks = tasks.length;
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.completed === p.tasks).length;
  const totalProjectTasks = projects.reduce((sum, p) => sum + p.tasks, 0);
  const completedProjectTasks = projects.reduce((sum, p) => sum + p.completed, 0);
  const overallProgress = totalProjectTasks > 0 ? Math.round((completedProjectTasks / totalProjectTasks) * 100) : 0;

  // Function to handle project progress updates
  const handleProjectProgressUpdate = (projectId: string, newCompleted: number) => {
    updateProjectProgress(projectId, newCompleted);
    setProjects(getProjects()); // Update projects state
  };

  // Function to handle task updates
  const handleTaskToggle = (taskId: string) => {
    toggleTask(taskId);
    setTasks(getTasks()); // Update tasks state
  };

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_-20%,hsl(var(--primary)/0.12),transparent_70%)]"
      />
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Welcome, {(user?.fullName || "").split(" ")[0] || user?.username || "Student"} 👋</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Here's a quick look at your journey today.</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-primary/10" />
              <div>
                <div className="text-sm font-semibold">Quick start</div>
                <div className="text-xs text-muted-foreground">Add your profile to get tailored matches</div>
              </div>
              <Button size="sm" className="ml-auto">Complete profile</Button>
            </div>
          </motion.div>
        </div>

        {justApplied && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-6 rounded-lg border border-primary/40 bg-primary/5 p-4 text-sm">
            🎉 Application sent! Keep an eye on your inbox.
          </motion.div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search announcements..." className="max-w-sm" />
          <Link to="/dashboard/chat" className="text-sm text-primary underline">Open Support Chat</Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/100?img=5" alt="avatar" className="h-12 w-12 rounded-full" />
              <div>
                <div className="text-sm font-semibold">{user?.fullName || user?.username || "Student"}</div>
                <div className="text-xs text-muted-foreground">{user?.email || "student@gradgate.com"}</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">Status: Available</div>
          </div>

          <div className="col-span-3 grid gap-4 sm:grid-cols-3">
            {projects.map(p => (
              <div key={p.id} className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className={`h-2 w-2 rounded-full ${p.color}`} />
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded bg-muted">
                  <div className={`h-full ${p.color} transition-all duration-300`} style={{ width: `${Math.round((p.completed/p.tasks)*100)}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{p.completed} / {p.tasks} tasks</div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleProjectProgressUpdate(p.id, Math.max(0, p.completed - 1))}
                      className="w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-xs"
                      disabled={p.completed <= 0}
                    >
                      -
                    </button>
                    <button 
                      onClick={() => handleProjectProgressUpdate(p.id, Math.min(p.tasks, p.completed + 1))}
                      className="w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-xs"
                      disabled={p.completed >= p.tasks}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-sm font-semibold">Tasks for today</div>
            <form className="mt-3 flex gap-2" onSubmit={(e)=>{ e.preventDefault(); const f = e.target as HTMLFormElement; const input = f.elements.namedItem('newtask') as HTMLInputElement; if (input.value.trim()) { addTask(input.value); setTasks(getTasks()); input.value=''; e.currentTarget.reset(); } }}>
              <Input name="newtask" placeholder="Add a task" />
              <Button type="submit" variant="secondary">Add</Button>
            </form>
            <ul className="mt-3 space-y-2 text-sm">
              {tasks.map(t => (
                <li key={t.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={t.done} onChange={() => handleTaskToggle(t.id)} />
                  <span className={t.done?"line-through text-muted-foreground":""}>{t.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-sm font-semibold">Statistics</div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-lg border p-3">
                <div className="text-xl font-bold">{completedTasks}</div>
                <div className="text-muted-foreground">Completed tasks</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xl font-bold">{completedProjects}</div>
                <div className="text-muted-foreground">Finished projects</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xl font-bold">{overallProgress}%</div>
                <div className="text-muted-foreground">Overall progress</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Project Progress</span>
                <span>{completedProjectTasks}/{totalProjectTasks}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-sm font-semibold">Announcements</div>
            <div className="mt-3 space-y-3">
              {getPosts().filter(p=> (p.title+" "+p.body).toLowerCase().includes(search.toLowerCase())).map((p)=> (
                <div key={p.id} className="rounded-md border p-3">
                  <div className="text-sm font-medium">{p.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()} • {p.author}</div>
                  <p className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">{p.body}</p>
                </div>
              ))}
              {getPosts().length === 0 && (
                <p className="text-sm text-muted-foreground">No announcements yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Calendar section (matches Calendar page sans Todos) */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-sm font-semibold">Upcoming Events</div>
            <ul className="mt-4 space-y-3 text-sm">
              {all
                .filter(e=> new Date(`${e.date}T${e.time??"00:00"}`) >= new Date())
                .sort((a,b)=> +new Date(`${a.date}T${a.time??"00:00"}`) - +new Date(`${b.date}T${b.time??"00:00"}`))
                .slice(0,4)
                .map(e=> (
                  <li key={e.id} className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">{e.date} {e.time??"All day"}</div>
                    <div className="mt-1 font-semibold">{e.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">Reminder</div>
                  </li>
                ))}
              {all.length===0 && <li className="text-sm text-muted-foreground">No upcoming events.</li>}
            </ul>
            <div className="mt-5">
              <div className="text-sm font-semibold">Add Event</div>
              <form className="mt-2 grid grid-cols-3 gap-2" onSubmit={(e)=>{
                e.preventDefault();
                if (!eventTitle.trim()) return;
                const dateStr = selected ? dateKey(selected) : dateKey(new Date());
                addEvent({ title: eventTitle.trim(), date: dateStr, time: eventTime || undefined });
                setEventTitle("");
                setEventTime("");
              }}>
                <input placeholder="Title" className="col-span-2 h-9 rounded-md border border-input px-2 text-sm" value={eventTitle} onChange={(e)=>setEventTitle(e.target.value)} />
                <input placeholder="10:00" className="h-9 rounded-md border border-input px-2 text-sm" value={eventTime} onChange={(e)=>setEventTime(e.target.value)} />
                <div className="col-span-3"><Button type="submit" className="h-9 px-3 text-xs">Add</Button></div>
              </form>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">{selected ? selected.toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "Calendar"}</div>
              <div className="flex gap-2">
                <button onClick={()=>setView("week")} className={`rounded-md border px-3 py-1 text-xs ${view==='week'?"bg-primary text-primary-foreground":""}`}>Week</button>
                <button onClick={()=>setView("day")} className={`rounded-md border px-3 py-1 text-xs ${view==='day'?"bg-primary text-primary-foreground":""}`}>Day</button>
                <button onClick={()=>setView("month")} className={`rounded-md border px-3 py-1 text-xs ${view==='month'?"bg-primary text-primary-foreground":""}`}>Month</button>
              </div>
            </div>
            <div className="flex justify-center">
              <Day mode="single" selected={selected} onSelect={setSelected} />
            </div>
            {selected && (
              <div className="mt-4">
                <div className="text-sm font-semibold">Events on {dateKey(selected)}</div>
                <ul className="mt-2 space-y-2 text-sm">
                  {sel.map(e=> (
                    <li key={e.id} className="flex items-center justify-between rounded-md border p-2">
                      <div>
                        <div className="text-xs text-muted-foreground">{e.date} {e.time??"All day"}</div>
                        <div className="font-medium">{e.title}</div>
                      </div>
                      <button className="rounded-md border px-2 py-1 text-xs" onClick={()=>{ removeEvent(e.id); setSelected(new Date(e.date)); }}>Delete</button>
                    </li>
                  ))}
                  {sel.length===0 && <li className="text-xs text-muted-foreground">No events.</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="mt-10">
          <Unemployment />
        </div>
      </div>
    </section>
  );
}
