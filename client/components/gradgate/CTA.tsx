import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_-10%,hsl(var(--accent)/0.12),transparent_70%)]"
      />
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border bg-card px-6 py-12 shadow-sm md:px-12 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-2xl font-bold md:text-3xl">Ready to open your gate?</h3>
            <p className="mt-3 text-muted-foreground">
              Create your profile in minutes and start applying with confidence.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="shadow-sm">
                <a href="/admissions">Start Application</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#features">See how it works</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
