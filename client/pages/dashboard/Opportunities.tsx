import { companies } from "@/data/companies";
import { Link } from "react-router-dom";
import { getSavedJobs, toggleSavedJob } from "@/store/app";
import { useState } from "react";
import { getJobPosts } from "@/store/jobs";
import { Button } from "@/components/ui/button";

export default function Opportunities() {
  const [saved, setSaved] = useState<string[]>(getSavedJobs());

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
          <div>Showing {getJobPosts().length} Jobs Results</div>
          <div className="flex items-center gap-2">
            <span>Newest</span>
            <button className="rounded-md border px-2 py-1">▤</button>
            <button className="rounded-md border px-2 py-1">☰</button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {getJobPosts().map(j => (
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
          {getJobPosts().length===0 && <div className="text-sm text-muted-foreground">No job posts yet.</div>}
        </div>
      </div>
    </section>
  );
}
