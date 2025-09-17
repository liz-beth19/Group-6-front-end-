export function Testimonials() {
  const items = [
    {
      quote:
        "GradGate simplified my entire application process. I discovered programs I never knew existed.",
      name: "Aisha K.",
      role: "MSc Data Science",
    },
    {
      quote:
        "One dashboard for everything—deadlines, documents, and offers. It saved me weeks.",
      name: "Diego M.",
      role: "MBA Candidate",
    },
    {
      quote:
        "The guidance and reminders were so helpful. I felt in control from day one.",
      name: "Hannah L.",
      role: "PhD Physics",
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Trusted by aspiring graduates</h2>
          <p className="mt-3 text-muted-foreground">
            Stories from students who opened their next chapter with GradGate.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="rounded-xl border bg-card p-6 shadow-sm">
              <blockquote className="text-sm leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium">
                {t.name}
                <span className="ml-2 font-normal text-muted-foreground">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
