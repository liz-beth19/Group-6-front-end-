import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold md:text-4xl">About GradGate</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Bridging the gap between education and employment
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold mb-6">What is GradGate?</h3>
            <p className="text-muted-foreground mb-6">
              GradGate is a digital platform designed to bridge the gap between education and employment. Many graduates leave university with strong academic qualifications but struggle to connect with the right opportunities, networks, and professional experiences. GradGate exists to solve this challenge by acting as a one-stop career transition hub. It empowers graduates with tools to showcase their skills, helps employers discover fresh talent, and enables institutions to track and support their alumni's professional journeys.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold mb-6">Who is it for?</h3>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="text-4xl mb-4">🎓</div>
                <h4 className="text-lg font-semibold mb-3">Graduates</h4>
                <p className="text-sm text-muted-foreground">
                  Those who are eager to begin their careers but may lack direct pathways into the workforce. GradGate gives them access to job listings, internships, mentorship programs, and personalized resources to boost employability.
                </p>
              </div>
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="text-4xl mb-4">💼</div>
                <h4 className="text-lg font-semibold mb-3">Employers</h4>
                <p className="text-sm text-muted-foreground">
                  Companies and organizations seeking motivated, job-ready graduates. Employers gain access to pre-vetted profiles, AI-powered candidate matching, and an efficient hiring process that saves time and connects them with the right talent.
                </p>
              </div>
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="text-4xl mb-4">🏛️</div>
                <h4 className="text-lg font-semibold mb-3">Institutions</h4>
                <p className="text-sm text-muted-foreground">
                  Universities and colleges that want to support their students beyond graduation. Through GradGate, institutions can track graduate outcomes, strengthen alumni engagement, and demonstrate their impact in preparing future professionals.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
            <p className="text-muted-foreground mb-6">
              At GradGate, our mission is to help graduates transition smoothly into the world of work. We believe that every graduate deserves the chance to succeed, and every employer deserves access to skilled talent. By combining technology, mentorship, and community, GradGate is building a future where graduates don't just leave with a degree—they leave with direction, support, and opportunity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold mb-6">Why It Matters</h3>
            <p className="text-muted-foreground mb-6">
              The transition from education to employment is one of the most critical and challenging stages in a young person's life. Many graduates face unemployment, underemployment, or a lack of career guidance. At the same time, employers often struggle to find fresh talent with the right mix of skills. GradGate fills this gap, creating a win-win ecosystem that benefits graduates, employers, and institutions alike.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <a href="/about" className="inline-flex items-center rounded-md border border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              Learn More About Our Platform
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
