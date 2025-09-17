import { companies } from "@/data/companies";
import { Link, useParams } from "react-router-dom";

export default function CompanyJobs() {
  const { slug } = useParams<{ slug: string }>();
  const company = companies.find((c) => c.slug === slug);

  if (!company) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <p className="text-sm text-destructive">Company not found.</p>
          <Link to="/dashboard/opportunities" className="text-primary underline">Back to opportunities</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{company.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{company.blurb}</p>
          </div>
          <Link to="/dashboard/opportunities" className="text-sm text-primary underline">All companies</Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {company.jobs.map((j) => (
            <article key={j.id} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{j.title}</h3>
                  <div className="mt-1 text-xs text-muted-foreground">{j.location} • {j.type}</div>
                </div>
                <Link
                  to={`/dashboard/apply/${company.slug}/${j.id}`}
                  className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                >
                  Apply
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
