import { useState } from "react";

const paths = {
  "Software Development": ["Complete profile & CV", "Entry internship", "Build portfolio", "Junior role", "Mid-level growth"],
  Cybersecurity: ["Complete profile & CV", "IT support internship", "CompTIA Security+", "Junior Analyst", "Pentest+ / Mid-level"],
  "Business Analysis": ["Complete profile & CV", "Shadow a BA", "BABOK fundamentals", "Junior BA", "Mid-level BA"],
};

export default function Roadmaps() {
  const [sel, setSel] = useState<keyof typeof paths>("Software Development");
  const steps = paths[sel];
  const progress = Math.round((2 / steps.length) * 100);

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Roadmaps</h1>
            <p className="mt-1 text-sm text-muted-foreground">Choose a career path to see your next steps.</p>
          </div>
          <select className="h-9 rounded-md border border-input bg-background px-2" value={sel} onChange={(e)=>setSel(e.target.value as any)}>
            {Object.keys(paths).map((p)=>(<option key={p}>{p}</option>))}
          </select>
        </div>

        <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-xs text-muted-foreground">Progress</div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <ol className="mt-6 grid gap-4 md:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s} className="rounded-lg border p-4 text-sm">
                <div className="font-medium">Step {i + 1}</div>
                <div className="mt-1 text-muted-foreground">{s}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
