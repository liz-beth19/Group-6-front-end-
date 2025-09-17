import { Rocket, BookOpen, Handshake, Globe2 } from "lucide-react";

const points = [
  { title: "Quick Access to Opportunities", icon: Rocket },
  { title: "Career Growth Support", icon: BookOpen },
  { title: "Employer Partnerships", icon: Handshake },
  { title: "Inclusive to All", icon: Globe2 },
];

export function WhyChoose() {
  return (
    <section id="why-us" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Why Choose GradGate?</h2>
          <p className="mt-3 text-muted-foreground">
            GradGate isn’t just a recruitment platform—it’s your partner in career success. We help you showcase your skills, connect with employers, and grow your future.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl border bg-card p-6 text-center shadow-sm transition-colors hover:bg-primary/5">
              <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <p.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 text-sm font-medium">{p.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
