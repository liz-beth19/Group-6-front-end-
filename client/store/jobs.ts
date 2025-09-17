export type JobPost = { id: string; title: string; company: string; location: string; type: string; description: string; createdAt: string };

const JOBS_KEY = "gg_job_posts";

function save(items: JobPost[]) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(items));
}

function seed(): JobPost[] {
  const now = Date.now();
  const items: JobPost[] = [
    { id: `j_${now}_1`, title: "Frontend Intern", company: "GradGate Labs", location: "Remote", type: "Internship", description: "Build UI components with React and Tailwind.", createdAt: new Date(now - 86400000).toISOString() },
    { id: `j_${now}_2`, title: "Data Analyst Learnership", company: "Insight Corp", location: "Johannesburg", type: "Learnership", description: "Assist with data cleaning, dashboards, and reports.", createdAt: new Date(now - 3600_000).toISOString() },
  ];
  save(items);
  return items;
}

export function getJobPosts(): JobPost[] {
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as JobPost[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seed();
    return parsed.sort((a,b)=> (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return seed();
  }
}

export function addJobPost(input: Omit<JobPost, "id"|"createdAt">): JobPost {
  const list = getJobPosts();
  const item: JobPost = { id: `j_${Date.now()}_${Math.random().toString(36).slice(2,7)}`, createdAt: new Date().toISOString(), ...input };
  const next = [item, ...list];
  save(next);
  return item;
}

export function removeJobPost(id: string) {
  const next = getJobPosts().filter(j => j.id !== id);
  save(next);
  return next;
}

export function getJobPostById(id: string): JobPost | undefined {
  return getJobPosts().find(j => j.id === id);
}
