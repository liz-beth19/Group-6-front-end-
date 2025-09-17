export default function Events() {
  const events = [
    { id: 1, title: "CV Writing Workshop", date: "2025-09-20", type: "Workshop" },
    { id: 2, title: "Tech Careers Webinar", date: "2025-09-25", type: "Webinar" },
  ];
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold md:text-3xl">Events & Webinars</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {events.map((e) => (
            <article key={e.id} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="text-sm text-muted-foreground">{e.type} • {e.date}</div>
              <div className="mt-1 font-semibold">{e.title}</div>
              <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Register</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
