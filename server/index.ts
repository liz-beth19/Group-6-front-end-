import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createServer = () => {
  const app = express();

  // CORS configuration
  app.use(cors({
    origin: ["http://localhost:8080", "http://localhost:8081", "http://127.0.0.1:8080", "http://127.0.0.1:8081"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // In-memory job storage (replace with database in production)
  let jobs = [
    {
      id: "1",
      title: "Frontend Developer Intern",
      description: "Build modern web applications using React and TypeScript. Work with our design team to create beautiful user interfaces.",
      requirements: "React, TypeScript, CSS, HTML",
      company: "GradGate Labs",
      location: "Remote",
      type: "Internship",
      postedDate: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "2",
      title: "Data Analyst Learnership",
      description: "Learn data analysis skills while working on real projects. Perfect for graduates looking to enter the data science field.",
      requirements: "Basic SQL, Excel, Analytical thinking",
      company: "Insight Corp",
      location: "Johannesburg",
      type: "Learnership",
      postedDate: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "3",
      title: "Software Engineer",
      description: "Full-stack development position working on our core platform. Experience with modern web technologies required.",
      requirements: "React, Node.js, TypeScript, PostgreSQL",
      company: "Tech Corp",
      location: "Cape Town",
      type: "Full-time",
      postedDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  ];

  // API routes
  app.get("/api/ping", (req, res) => {
    res.json({ message: "pong" });
  });

  app.get("/api/demo", (req, res) => {
    res.json({ message: "Hello from Express server!" });
  });

  // Jobs API routes - shared between admin and user dashboards
  app.get("/api/jobs", (req, res) => {
    res.json(jobs);
  });

  app.get("/api/jobs/:id", (req, res) => {
    const { id } = req.params;
    const job = jobs.find(j => j.id === id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  });

  app.post("/api/jobs", (req, res) => {
    const jobData = req.body;
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      postedDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    jobs.push(newJob);
    res.json(newJob);
  });

  app.put("/api/jobs/:id", (req, res) => {
    const { id } = req.params;
    const jobData = req.body;
    const jobIndex = jobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      return res.status(404).json({ error: "Job not found" });
    }
    jobs[jobIndex] = { ...jobs[jobIndex], ...jobData };
    res.json(jobs[jobIndex]);
  });

  app.delete("/api/jobs/:id", (req, res) => {
    const { id } = req.params;
    const jobIndex = jobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      return res.status(404).json({ error: "Job not found" });
    }
    jobs.splice(jobIndex, 1);
    res.json({ message: "Job deleted successfully" });
  });

  // Admin routes - these now use the same job storage as /api/jobs
  app.get("/api/admin", (req, res) => {
    // Return the same jobs data as /api/jobs for consistency
    res.json(jobs);
  });

  app.post("/api/admin/create", (req, res) => {
    const jobData = req.body;
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      postedDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    jobs.push(newJob);
    res.json(newJob);
  });

  app.put("/api/admin/:id", (req, res) => {
    const { id } = req.params;
    const jobData = req.body;
    const jobIndex = jobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      return res.status(404).json({ error: "Job not found" });
    }
    jobs[jobIndex] = { ...jobs[jobIndex], ...jobData };
    res.json(jobs[jobIndex]);
  });

  app.delete("/api/admin/:id", (req, res) => {
    const { id } = req.params;
    const jobIndex = jobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      return res.status(404).json({ error: "Job not found" });
    }
    jobs.splice(jobIndex, 1);
    res.json({ message: `Job ${id} deleted successfully` });
  });

  // Auth routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    
    // Mock authentication
    if (email === "admin@gmail.com" && password === "admin123") {
      res.json({
        token: "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sInN1YiI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc1ODE4Nzg2NCwiZXhwIjoxNzU4Mjc0MjY0fQ.9tairIfk87HH5wkxTlBKUo3jaHKfXp0z4ce0-OCxxE0sRjFfWg47OY3eky5ErJT_PO3yio6XNCtTOrpo9r0H6Q",
        user: {
          id: 1,
          email: "admin@gmail.com",
          name: "Admin User",
          role: "ADMIN"
        }
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const userData = req.body;
    res.json({
      message: "User registered successfully",
      user: {
        id: Date.now(),
        ...userData,
        role: "USER"
      }
    });
  });

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const clientPath = path.join(__dirname, "../dist/spa");
    app.use(express.static(clientPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(clientPath, "index.html"));
    });
  }

  return app;
};

export { createServer };



