export function Partners() {
  const partners: { name: string; src?: string }[] = [
    {
      name: "Mecer Inter-Ed",
      // Provide official logo URL to replace text mark below
    },
    {
      name: "CAPACITI",
    },
    {
      name: "More Partners",
    },
  ];

  return (
    <section id="partners" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by training providers and employers
        </p>
        <div className="mt-6 grid grid-cols-2 items-center justify-items-center gap-6 sm:grid-cols-3 md:grid-cols-5">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex h-16 w-40 items-center justify-center rounded-xl border bg-card px-4 text-center text-sm font-semibold text-foreground/70 shadow-sm"
            >
              {p.src ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img src={p.src} className="max-h-10 object-contain" />
              ) : (
                <span>{p.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
