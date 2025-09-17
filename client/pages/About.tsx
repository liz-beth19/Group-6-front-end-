export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold md:text-4xl">About GradGate</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            GradGate is a recruitment and career development platform bridging the gap between job seekers and employers. We specialise in connecting talent with learnerships, internships, and entry-level opportunities, and offering career guidance to ensure long-term workplace readiness and success.
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-xl border bg-card p-8 shadow-sm">
            We can expand this page with mission, values, timelines, and partner highlights. Share your copy and assets, and I’ll craft a full story.
          </div>
        </div>
      </section>
    </div>
  );
}
