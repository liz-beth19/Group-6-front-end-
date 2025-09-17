export function Newsletter() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Stay updated with the latest opportunities</h3>
              <p className="text-sm text-muted-foreground">Subscribe for weekly learnerships and internships.</p>
            </div>
            <form className="flex w-full max-w-md items-center gap-2">
              <input type="email" placeholder="you@example.com" className="h-10 flex-1 rounded-md border border-input px-3" required />
              <button className="h-10 rounded-md bg-primary px-4 text-sm text-primary-foreground transition-shadow hover:shadow-[0_0_20px_hsl(var(--primary)/50)]">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
