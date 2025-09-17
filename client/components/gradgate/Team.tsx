import { motion } from "framer-motion";

const team = [
  {
    name: "Siyabonga Khumalo",
    role: "Project Manager • Backend Developer",
  },
  {
    name: "Andani Mukwevho",
    role: "Technical Lead • Frontend Developer",
  },
  {
    name: "Micheal Thulare",
    role: "Frontend Developer",
  },
  {
    name: "Lizbeth Mokgala",
    role: "Documentation Lead • Frontend Developer",
  },
];

export function Team() {
  return (
    <section id="team" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Development Team</h2>
          <p className="mt-3 text-muted-foreground">
            The people innovating your future.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, idx) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border bg-card p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-extrabold text-primary">
                {m.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="mt-4 font-semibold">{m.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{m.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
