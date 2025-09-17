import { companies } from "@/data/companies";
import { Link } from "react-router-dom";
import { getSavedJobs, toggleSavedJob } from "@/store/app";
import { useState } from "react";
import { getJobPosts } from "@/store/jobs";

export default function Opportunities() {
  const [saved, setSaved] = useState<string[]>(getSavedJobs());

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold md:text-3xl">Opportunities</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Apply to featured jobs or browse by company.</p>

        <div className="mt-6">
          <div className="text-sm font-semibold">Featured jobs</div>
          <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getJobPosts().map(j => (
              <article key={j.id} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{j.title}</h3>
                    <div className="mt-1 text-xs text-muted-foreground">{j.company} • {j.location} • {j.type}</div>
                  </div>
                  <Link to={`/dashboard/apply/post/${j.id}`} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Apply</Link>
                </div>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{j.description}</p>
              </article>
            ))}
            {getJobPosts().length===0 && <div className="text-sm text-muted-foreground">No job posts yet.</div>}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <div key={c.slug} className="group rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-accent/10">
              <div className="flex items-center gap-3">
                {c.logo ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <img src={c.logo} className="h-10" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                    {c.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.blurb}</div>
                </div>
                <button
                  onClick={()=>setSaved(toggleSavedJob(c.slug))}
                  className={`rounded-md border px-3 py-1 text-xs ${saved.includes(c.slug)?"bg-primary text-primary-foreground border-primary":"hover:bg-accent"}`}
                >{saved.includes(c.slug)?"Saved":"Save"}</button>
                <Link to={`/dashboard/company/${c.slug}`} className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground">View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
