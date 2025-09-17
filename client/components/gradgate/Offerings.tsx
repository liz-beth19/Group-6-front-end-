import { GraduationCap, Briefcase, Compass } from "lucide-react";

const items = [
  {
    title: "Learnerships",
    desc: "Gain hands-on training through structured programs designed to build your skills and prepare you for the workplace.",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Internships",
    desc: "Step into the real world with internships that provide practical exposure and boost your employability.",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Career Guidance",
    desc: "Get the mentorship, resources, and support you need to make smart career decisions and achieve long-term growth.",
    icon: Compass,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
  },
];

export function Offerings() {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold md:text-4xl">What We Offer</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((i) => (
            <div key={i.title} className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-transform hover:-translate-y-1">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={i.image} alt={i.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <i.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-lg font-semibold">{i.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">{i.desc}</div>
                <div className="mt-4 h-[2px] w-12 rounded bg-primary/60 transition-all group-hover:w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
