import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold md:text-4xl">About GradGate</h2>
            <p className="mt-4 text-muted-foreground">
              GradGate is a recruitment system focused on learnerships, internships, and early-career opportunities. We connect talented candidates with trusted partners through a unified, transparent experience.
            </p>
            <ul className="mt-6 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Discover curated learnerships and internships across industries.</li>
              <li>One profile, many applications—track progress in real time.</li>
              <li>Guided milestones, document management, and deadline reminders.</li>
              <li>Partner network including organizations like Mecer Inter-Ed and CAPACITI.</li>
            </ul>
            <a href="/about" className="mt-6 inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground">Read More</a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold">How it works</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-muted-foreground">
              <li>Create your profile with skills, education, and interests.</li>
              <li>Get matched with opportunities and apply in a few clicks.</li>
              <li>Track statuses, receive updates, and communicate in one place.</li>
              <li>Secure storage and strict privacy controls on your data.</li>
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
