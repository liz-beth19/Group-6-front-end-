import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { Unemployment } from "@/components/gradgate/Unemployment";
import { getPosts } from "@/store/posts";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getProjects } from "@/store/projects";
import { addTask, getTasks, toggleTask } from "@/store/tasks";

export default function Overview() {
  const { user } = useAuth();
  const location = useLocation();
  const justApplied = Boolean((location as any).state?.applied);
  const [search, setSearch] = useState("");

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_-20%,hsl(var(--primary)/0.12),transparent_70%)]"
      />
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Welcome back, {user?.username || "Student"} 👋</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Here’s a quick look at your journey today.</p>
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
                <div className="text-sm font-semibold">{user?.username || "Student"}</div>
                <div className="text-xs text-muted-foreground">{user?.email || "student@gradgate.com"}</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">Status: Available</div>
          </div>

          <div className="col-span-3 grid gap-4 sm:grid-cols-3">
            {getProjects().map(p => (
              <div key={p.id} className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className={`h-2 w-2 rounded-full ${p.color}`} />
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded bg-muted">
                  <div className={`h-full ${p.color}`} style={{ width: `${Math.round((p.completed/p.tasks)*100)}%` }} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{p.completed} / {p.tasks} tasks</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-sm font-semibold">Tasks for today</div>
            <form className="mt-3 flex gap-2" onSubmit={(e)=>{ e.preventDefault(); const f = e.target as HTMLFormElement; const input = f.elements.namedItem('newtask') as HTMLInputElement; if (input.value.trim()) { addTask(input.value); input.value=''; e.currentTarget.reset(); } }}>
              <Input name="newtask" placeholder="Add a task" />
              <Button type="submit" variant="secondary">Add</Button>
            </form>
            <ul className="mt-3 space-y-2 text-sm">
              {getTasks().map(t => (
                <li key={t.id} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={t.done} onChange={()=>{ toggleTask(t.id); }} />
                  <span className={t.done?"line-through text-muted-foreground":""}>{t.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-sm font-semibold">Statistics</div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-lg border p-3"><div className="text-xl font-bold">28 h</div><div className="text-muted-foreground">Tracked time</div></div>
              <div className="rounded-lg border p-3"><div className="text-xl font-bold">18</div><div className="text-muted-foreground">Finished tasks</div></div>
              <div className="rounded-lg border p-3"><div className="text-xl font-bold">Pro</div><div className="text-muted-foreground">Upgrade</div></div>
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
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-sm font-semibold">Calendar</div>
            <div className="mt-3"><Calendar mode="single" /></div>
          </div>
        </div>
        <div className="mt-10">
          <Unemployment />
        </div>
      </div>
    </section>
  );
}
