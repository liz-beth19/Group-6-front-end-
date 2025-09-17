import { Hero } from "@/components/gradgate/Hero";
import { Stats } from "@/components/gradgate/Stats";
import { Offerings } from "@/components/gradgate/Offerings";
import { WhyChoose } from "@/components/gradgate/WhyChoose";
import { Partners } from "@/components/gradgate/Partners";
import { About } from "@/components/gradgate/About";
import { Testimonials } from "@/components/gradgate/Testimonials";
import { Team } from "@/components/gradgate/Team";
import { CTABanner } from "@/components/gradgate/CTABanner";
import { Unemployment } from "@/components/gradgate/Unemployment";
import { Newsletter } from "@/components/gradgate/Newsletter";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Index() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  return (
    <div className="bg-background">
      <Hero />
      <Stats />
      <Offerings />
      <WhyChoose />
      <CTABanner />
      <Unemployment />
      <About />
      <Partners />
      <section id="opportunities" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Opportunities</h2>
            <p className="mt-3 text-muted-foreground">
              Trending learnerships and internships from our partner network.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article key={i} className="group overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop`}
                    alt="Campus"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold">Computer Science MSc</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Top-ranked faculties, AI and systems specializations.</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Team />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
