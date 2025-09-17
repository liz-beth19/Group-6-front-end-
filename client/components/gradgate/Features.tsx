import { CheckCircle2, Globe2, Layers3, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Global program discovery",
    desc: "Search thousands of programs across top universities worldwide.",
    icon: Globe2,
  },
  {
    title: "Unified application",
    desc: "Apply once, track everywhere with real-time updates.",
    icon: Layers3,
  },
  {
    title: "Guided milestones",
    desc: "Step-by-step guidance to keep you on track from start to admit.",
    icon: CheckCircle2,
  },
  {
    title: "Secure by design",
    desc: "Enterprise-grade security to protect your personal data.",
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Built for your journey</h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to discover, apply, and succeed—beautifully connected.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
