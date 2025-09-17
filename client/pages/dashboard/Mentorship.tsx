export default function Mentorship() {
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold md:text-3xl">Mentorship</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Book a Mentor</h2>
            <form className="mt-4 grid grid-cols-1 gap-3">
              <input placeholder="Topic (e.g., CV review)" className="h-10 rounded-md border border-input px-3" />
              <input type="date" className="h-10 rounded-md border border-input px-3" />
              <button className="h-10 rounded-md bg-primary px-4 text-sm text-primary-foreground">Request Session</button>
            </form>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">AI Tips</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Polish your LinkedIn headline to include your target role.</li>
              <li>Ask mentors for mock interviews before real ones.</li>
              <li>Keep a portfolio of small projects to showcase skills.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
