import { Button } from "@/components/ui/button";

export function CTABanner() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_20%_0%,rgba(255,255,255,0.2),transparent)]" />
          <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="text-2xl font-bold">Your career journey starts here. Don’t wait—opportunities are waiting for you.</h3>
            <Button asChild variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href="/register">Register Now</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
