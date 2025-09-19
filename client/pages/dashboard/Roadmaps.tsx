import { useMemo, useState } from "react";
import { CareerKey, getRoadmaps, markStage, progressByStages, toggleStep, type Roadmap } from "@/store/roadmaps";

export default function Roadmaps() {
  const [career, setCareer] = useState<CareerKey>("Healthcare");
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(()=>getRoadmaps());
  const current = roadmaps.find(r=>r.career===career)!;
  const progress = useMemo(()=>progressByStages(career), [career, roadmaps]);

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">🌍 Career Roadmaps for Mentorship</h1>
            <p className="mt-1 text-sm text-muted-foreground">Track progress across stages and steps.</p>
          </div>
          <select className="h-9 rounded-md border border-input bg-background px-2" value={career} onChange={(e)=>setCareer(e.target.value as CareerKey)}>
            {(["Healthcare","Education","Creative","Business","Law","Engineering"] as CareerKey[]).map((p)=>(<option key={p}>{p}</option>))}
          </select>
        </div>

        <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-xs text-muted-foreground">Progress</div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
              {career === 'Healthcare' && '🩺'}
              {career === 'Education' && '📚'}
              {career === 'Creative' && '🖌️'}
              {career === 'Business' && '💼'}
              {career === 'Law' && '⚖️'}
              {career === 'Engineering' && '⚙️'}
            </div>
            <div className="text-muted-foreground">{career}</div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {current.stages.map((stage) => (
              <div key={stage.name} className={`rounded-lg border p-4 transition ${stage.completed?"shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]" : "hover:border-primary/40"}`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{stage.name}</div>
                  <button className={`h-7 rounded-md px-2 text-xs ${stage.completed?"bg-primary text-primary-foreground":"border"}`} onClick={()=>{ const next = markStage(career, stage.name, !stage.completed); setRoadmaps(next); }}>
                    {stage.completed?"Completed":"Mark complete"}
                  </button>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {stage.steps.map((step) => (
                    <li key={step.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={step.done}
                        onChange={()=>{
                          const next = toggleStep(career, step.id);
                          setRoadmaps(next);
                        }}
                      />
                      <span className={step.done?"line-through text-muted-foreground":""}>{step.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
