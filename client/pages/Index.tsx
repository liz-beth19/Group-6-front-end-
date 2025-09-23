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
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JobPost {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  company: string;
  location?: string;
  type?: string;
  postedDate?: string;
  createdAt?: string;
}

export default function Index() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  // Fetch opportunities from backend
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/admin/public");
        
        if (response.ok) {
          const jobsData = await response.json();
          // Show only the first 6 opportunities
          setJobs(jobsData.slice(0, 6));
        } else {
          // Fallback to sample data if API fails
          setJobs([
            {
              id: "1",
              title: "Software Development Internship",
              description: "Join our team as a Software Development Intern and work on cutting-edge web applications.",
              company: "MECER Inter-Ed",
              location: "Cape Town",
              type: "Internship",
              postedDate: new Date().toISOString()
            },
            {
              id: "2", 
              title: "Data Science Learnership",
              description: "Learn data science fundamentals and work on real-world projects with industry experts.",
              company: "CAPACITI",
              location: "Johannesburg",
              type: "Learnership",
              postedDate: new Date().toISOString()
            },
            {
              id: "3",
              title: "Frontend Development Program",
              description: "Master modern frontend technologies including React, TypeScript, and Next.js.",
              company: "We Think Code",
              location: "Remote",
              type: "Program",
              postedDate: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        // Set sample data on error
        setJobs([
          {
            id: "1",
            title: "Software Development Internship",
            description: "Join our team as a Software Development Intern and work on cutting-edge web applications.",
            company: "MECER Inter-Ed",
            location: "Cape Town",
            type: "Internship",
            postedDate: new Date().toISOString()
          },
          {
            id: "2", 
            title: "Data Science Learnership",
            description: "Learn data science fundamentals and work on real-world projects with industry experts.",
            company: "CAPACITI",
            location: "Johannesburg",
            type: "Learnership",
            postedDate: new Date().toISOString()
          },
          {
            id: "3",
            title: "Frontend Development Program",
            description: "Master modern frontend technologies including React, TypeScript, and Next.js.",
            company: "We Think Code",
            location: "Remote",
            type: "Program",
            postedDate: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleApplyNow = () => {
    if (user) {
      navigate("/dashboard/opportunities");
    } else {
      navigate("/login");
    }
  };

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
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-[16/9] bg-muted animate-pulse" />
                  <CardHeader>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </CardHeader>
                </Card>
              ))
            ) : (
              jobs.map((job) => (
                <Card key={job.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop`}
                      alt={job.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <CardHeader className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold line-clamp-2">{job.title}</CardTitle>
                        <CardDescription className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {job.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        {job.company}
                      </Badge>
                      {job.type && (
                        <Badge variant="outline" className="text-xs">
                          {job.type}
                        </Badge>
                      )}
                    </div>
                    {job.location && (
                      <p className="text-xs text-muted-foreground mt-2">📍 {job.location}</p>
                    )}
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <Button 
                      onClick={handleApplyNow}
                      className="w-full"
                      size="sm"
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          <div className="mt-10 text-center">
            <Button 
              onClick={handleApplyNow}
              variant="outline"
              size="lg"
            >
              View All Opportunities
            </Button>
          </div>
        </div>
      </section>
      <Team />
      <Testimonials />
    </div>
  );
}
