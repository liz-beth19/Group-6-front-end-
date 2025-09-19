import { useMemo, useRef, useState } from "react";
import { getMentorFields, getMentorPosts, addMentorPost } from "@/store/mentorPosts";

export default function Mentorship() {
  const fields = getMentorFields();
  const [field, setField] = useState<string>(fields[0]);
  const posts = useMemo(()=>getMentorPosts(field), [field]);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const nodes = 6; // stages

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Mentorship</h1>
            <p className="mt-1 text-sm text-muted-foreground">Interactive career roadmap and mentor posts</p>
          </div>
          <select className="h-9 rounded-md border border-input bg-background px-2" value={field} onChange={(e)=>setField(e.target.value)}>
            {fields.map(f=> (<option key={f}>{f}</option>))}
          </select>
        </div>

        {/* Simplified header without glow/road */}
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold">Mentor insights for {field}</div>
          <div className="mt-2 text-xs text-muted-foreground">Curated advice and posts from experienced mentors.</div>
        </div>

        {/* Mentor Posts */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-sm md:col-span-2">
            <div className="text-sm font-semibold">Latest posts in {field}</div>
            <div className="mt-3 space-y-3">
              {posts.map(p => (
                <div key={p.id} className="rounded-lg border p-4 transition hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]">
                  <div className="text-sm font-medium">{p.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()} • {p.author} • {p.field}</div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{p.body}</p>
                </div>
              ))}
              {posts.length===0 && <div className="text-sm text-muted-foreground">No posts yet.</div>}
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="text-sm font-semibold">Write a mentor post</div>
            <form className="mt-3 space-y-3" onSubmit={(e)=>{
              e.preventDefault();
              const title = titleRef.current?.value?.trim() || "";
              const body = bodyRef.current?.value?.trim() || "";
              if (!title || !body) return;
              addMentorPost({ field, title, body, author: "Mentor" });
              if (titleRef.current) titleRef.current.value = "";
              if (bodyRef.current) bodyRef.current.value = "";
            }}>
              <input ref={titleRef} placeholder="Post title" className="h-9 w-full rounded-md border border-input px-3 text-sm" />
              <textarea ref={bodyRef} placeholder="Share advice, tips, and knowledge" className="min-h-[120px] w-full rounded-md border border-input px-3 py-2 text-sm" />
              <button className="h-9 rounded-md bg-primary px-4 text-xs text-primary-foreground">Publish</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
