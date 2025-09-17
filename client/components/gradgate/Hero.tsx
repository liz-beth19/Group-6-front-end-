import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnimatedLogo } from "./AnimatedLogo";

function AnimatedBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        initial={{ x: -40, y: 20 }}
        animate={{ x: 40, y: -20 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 8, ease: "easeInOut" }}
        className="absolute bottom-10 left-20 h-40 w-40 rounded-full bg-accent/20 blur-2xl"
      />
      <motion.div
        initial={{ x: 30, y: -10 }}
        animate={{ x: -30, y: 10 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 10, ease: "easeInOut" }}
        className="absolute right-24 top-20 h-52 w-52 rounded-full bg-primary/10 blur-2xl"
      />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_-20%,hsl(var(--primary)/0.12),transparent_70%)]"
      />
      <AnimatedBlobs />
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground ring-1 ring-inset ring-border">
                Innovate your future
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Launch Your Career with GradGate
              </h1>
              <h2 className="mt-3 text-base md:text-lg text-muted-foreground">
                We connect graduates and job seekers with internships, learnerships, and entry-level opportunities while providing career guidance for long-term success.
              </h2>
              <div className="mt-8">
                <Button asChild size="lg" className="shadow-sm hover:shadow-[0_0_25px_hsl(var(--primary)/50)] hover:scale-[1.02] transition-transform">
                  <a href="#opportunities">Find Opportunities</a>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <AnimatedLogo className="h-20 w-20" />
              <img
                src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1000&auto=format&fit=crop"
                alt="Graduates illustration"
                className="ml-6 hidden rounded-xl shadow-lg ring-1 ring-border md:block"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
