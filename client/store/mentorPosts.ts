export type MentorPost = {
  id: string;
  field: string; // e.g., Healthcare, Education, Creative, Business, Law, Engineering
  title: string;
  body: string;
  author: string;
  createdAt: string; // ISO
};

const KEY = "gg_mentor_posts";

function seed(): MentorPost[] {
  const now = Date.now();
  const data: MentorPost[] = [
    { id: `mp_${now}_1`, field: "Healthcare", title: "Breaking into Nursing in 2025", body: "Focus on clinical hours. Volunteer at clinics; it builds confidence and networks.", author: "Dr. A. Mokoena", createdAt: new Date(now-1*3600e3).toISOString() },
    { id: `mp_${now}_2`, field: "Education", title: "Your first year of teaching", body: "Start with clear routines. Borrow lesson plans; adapt them to your voice.", author: "Thandi N.", createdAt: new Date(now-2*3600e3).toISOString() },
    { id: `mp_${now}_3`, field: "Creative", title: "Portfolio that gets callbacks", body: "Show 6–8 pieces max. Add briefs and results; keep it focused.", author: "K. Dlamini", createdAt: new Date(now-3*3600e3).toISOString() },
    { id: `mp_${now}_4`, field: "Business", title: "Validate before you build", body: "Interview 10 customers. Charge early; feedback from payers is gold.", author: "Sipho M.", createdAt: new Date(now-4*3600e3).toISOString() },
    { id: `mp_${now}_5`, field: "Law", title: "Landing your first articles", body: "Network at moot courts. Publish short case notes on LinkedIn.", author: "Adv. P. Naidoo", createdAt: new Date(now-5*3600e3).toISOString() },
    { id: `mp_${now}_6`, field: "Engineering", title: "From theory to site", body: "Request site rotations. Learn schedules, safety, and materials.", author: "Eng. J. van Wyk", createdAt: new Date(now-6*3600e3).toISOString() },
    { id: `mp_${now}_7`, field: "Healthcare", title: "Interview tips for interns", body: "Use SBAR framework for case discussions; it shows structure.", author: "Nurse L. Khumalo", createdAt: new Date(now-7*3600e3).toISOString() },
    { id: `mp_${now}_8`, field: "Creative", title: "Freelance pricing 101", body: "Quote per project. Define 2 revisions. Ask 50% upfront.", author: "M. Peters", createdAt: new Date(now-8*3600e3).toISOString() },
    { id: `mp_${now}_9`, field: "Business", title: "CV for startups", body: "Lead with outcomes: revenue, users, cost saved. Keep to one page.", author: "Z. Maseko", createdAt: new Date(now-9*3600e3).toISOString() },
    { id: `mp_${now}_10`, field: "Engineering", title: "CAD to real-world tolerances", body: "Discuss tolerances early with manufacturing; saves weeks later.", author: "T. Pillay", createdAt: new Date(now-10*3600e3).toISOString() },
  ];
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

export function getMentorPosts(field?: string): MentorPost[] {
  try {
    const raw = localStorage.getItem(KEY);
    const all = raw ? (JSON.parse(raw) as MentorPost[]) : seed();
    if (all.length === 0) {
      return seed();
    }
    if (!field || field === "All") return all;
    return all.filter(p => p.field === field);
  } catch {
    return seed();
  }
}

export function addMentorPost(post: Omit<MentorPost, "id"|"createdAt">) {
  const all = getMentorPosts();
  const item: MentorPost = { id: `mp_${Date.now()}`, createdAt: new Date().toISOString(), ...post };
  const next = [item, ...all];
  localStorage.setItem(KEY, JSON.stringify(next));
  return item;
}

export function getMentorFields(): string[] {
  return ["Healthcare","Education","Creative","Business","Law","Engineering"];
}


