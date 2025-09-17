export function Stats() {
  const stats = [
    { value: "250+", label: "Partner Universities" },
    { value: "4,800+", label: "Programs Listed" },
    { value: "120k+", label: "Applications Processed" },
    { value: "98%", label: "Student Satisfaction" },
  ];

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-6 rounded-xl border bg-card p-6 text-center shadow-sm md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold md:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
