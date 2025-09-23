import { useEffect, useState } from "react";

export function Partners() {
  const partners: { name: string; src: string; alt: string }[] = [
    {
      name: "Afrika Tikkun",
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop&crop=center&auto=format&q=80",
      alt: "Afrika Tikkun Logo"
    },
    {
      name: "MECER Inter-Ed",
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop&crop=center&auto=format&q=80",
      alt: "MECER Inter-Ed Logo"
    },
    {
      name: "Signa Academy",
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop&crop=center&auto=format&q=80",
      alt: "Signa Academy Logo"
    },
    {
      name: "CAPACITI",
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop&crop=center&auto=format&q=80",
      alt: "CAPACITI Logo"
    },
    {
      name: "DynamicDNA",
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop&crop=center&auto=format&q=80",
      alt: "DynamicDNA Logo"
    },
    {
      name: "We Think Code",
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop&crop=center&auto=format&q=80",
      alt: "We Think Code Logo"
    },
    {
      name: "GirlCode",
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop&crop=center&auto=format&q=80",
      alt: "GirlCode Logo"
    },
    {
      name: "MINDWORX",
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop&crop=center&auto=format&q=80",
      alt: "MINDWORX Logo"
    },
    {
      name: "Standard Bank",
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop&crop=center&auto=format&q=80",
      alt: "Standard Bank Logo"
    },
    {
      name: "CSG",
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop&crop=center&auto=format&q=80",
      alt: "CSG Logo"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % partners.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [partners.length]);

  return (
    <section id="partners" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by training providers and employers
        </p>
        <div className="mt-6 overflow-hidden">
          <div className="flex animate-scroll space-x-8">
            {/* First set of logos */}
            {partners.map((partner, index) => (
              <div
                key={`first-${index}`}
                className="flex h-16 w-40 flex-shrink-0 items-center justify-center rounded-xl border bg-card px-2 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <img 
                  src={partner.src} 
                  alt={partner.alt}
                  className="h-12 w-32 object-cover rounded-lg" 
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((partner, index) => (
              <div
                key={`second-${index}`}
                className="flex h-16 w-40 flex-shrink-0 items-center justify-center rounded-xl border bg-card px-2 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <img 
                  src={partner.src} 
                  alt={partner.alt}
                  className="h-12 w-32 object-cover rounded-lg" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
