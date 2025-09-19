export type CareerKey = "Healthcare" | "Education" | "Creative" | "Business" | "Law" | "Engineering";

export type RoadmapStep = { id: string; title: string; done: boolean };

export type Roadmap = { career: CareerKey; stages: { name: string; steps: RoadmapStep[]; completed?: boolean }[] };

const KEY = "gg_roadmaps";

const DEFAULT: Roadmap[] = [
  {
    career: "Healthcare",
    stages: [
      { name: "Foundation", steps: [
        { id: "hc_f_1", title: "Complete basic education (Matric/High School).", done: false },
        { id: "hc_f_2", title: "Study Biology & Health Sciences.", done: false },
      ]},
      { name: "Training", steps: [
        { id: "hc_t_1", title: "Enroll in Nursing/Medical school.", done: false },
        { id: "hc_t_2", title: "Do clinical practice/internships.", done: false },
      ]},
      { name: "Professional", steps: [
        { id: "hc_p_1", title: "Register as a nurse/doctor.", done: false },
        { id: "hc_p_2", title: "Gain hospital/clinic experience.", done: false },
      ]},
      { name: "Growth", steps: [
        { id: "hc_g_1", title: "Specialize (pediatrics, surgery, midwifery).", done: false },
        { id: "hc_g_2", title: "Mentor younger professionals.", done: false },
        { id: "hc_g_3", title: "Move into leadership/research.", done: false },
      ]},
    ],
  },
  {
    career: "Education",
    stages: [
      { name: "Foundation", steps: [
        { id: "ed_f_1", title: "Strong academic performance in key subjects.", done: false },
        { id: "ed_f_2", title: "Develop communication & leadership skills.", done: false },
      ]},
      { name: "Training", steps: [
        { id: "ed_t_1", title: "Enroll in Education degree/diploma.", done: false },
        { id: "ed_t_2", title: "Do practical classroom training.", done: false },
      ]},
      { name: "Professional", steps: [
        { id: "ed_p_1", title: "Become a qualified teacher.", done: false },
        { id: "ed_p_2", title: "Develop subject specialization.", done: false },
      ]},
      { name: "Growth", steps: [
        { id: "ed_g_1", title: "Leadership roles (HoD, Principal).", done: false },
        { id: "ed_g_2", title: "Contribute to curriculum development.", done: false },
        { id: "ed_g_3", title: "Mentor upcoming teachers.", done: false },
      ]},
    ],
  },
  {
    career: "Creative",
    stages: [
      { name: "Foundation", steps: [
        { id: "cr_f_1", title: "Learn basic design/drawing/writing skills.", done: false },
        { id: "cr_f_2", title: "Explore creativity with small projects.", done: false },
      ]},
      { name: "Training", steps: [
        { id: "cr_t_1", title: "Formal education (Arts, Design, Fashion, Journalism).", done: false },
        { id: "cr_t_2", title: "Build a portfolio.", done: false },
      ]},
      { name: "Professional", steps: [
        { id: "cr_p_1", title: "Work with agencies, brands, or as freelancer.", done: false },
        { id: "cr_p_2", title: "Showcase work on digital platforms.", done: false },
      ]},
      { name: "Growth", steps: [
        { id: "cr_g_1", title: "Launch personal brand or label.", done: false },
        { id: "cr_g_2", title: "Mentor new creatives.", done: false },
        { id: "cr_g_3", title: "Expand into international markets.", done: false },
      ]},
    ],
  },
  {
    career: "Business",
    stages: [
      { name: "Foundation", steps: [
        { id: "bs_f_1", title: "Learn basic financial literacy.", done: false },
        { id: "bs_f_2", title: "Develop problem-solving & leadership skills.", done: false },
      ]},
      { name: "Training", steps: [
        { id: "bs_t_1", title: "Start with small projects or internships.", done: false },
        { id: "bs_t_2", title: "Study business/management courses.", done: false },
      ]},
      { name: "Professional", steps: [
        { id: "bs_p_1", title: "Register a business/startup.", done: false },
        { id: "bs_p_2", title: "Gain experience with customers & operations.", done: false },
      ]},
      { name: "Growth", steps: [
        { id: "bs_g_1", title: "Scale the business.", done: false },
        { id: "bs_g_2", title: "Diversify into multiple ventures.", done: false },
        { id: "bs_g_3", title: "Mentor upcoming entrepreneurs.", done: false },
      ]},
    ],
  },
  {
    career: "Law",
    stages: [
      { name: "Foundation", steps: [
        { id: "lw_f_1", title: "Focus on strong reading/writing skills.", done: false },
        { id: "lw_f_2", title: "Study history, social sciences, and languages.", done: false },
      ]},
      { name: "Training", steps: [
        { id: "lw_t_1", title: "Law degree / political science.", done: false },
        { id: "lw_t_2", title: "Internships at law firms, NGOs, or government.", done: false },
      ]},
      { name: "Professional", steps: [
        { id: "lw_p_1", title: "Qualify as lawyer, public administrator, or policy officer.", done: false },
        { id: "lw_p_2", title: "Work on real cases/projects.", done: false },
      ]},
      { name: "Growth", steps: [
        { id: "lw_g_1", title: "Become a judge, senior advocate, or policymaker.", done: false },
        { id: "lw_g_2", title: "Mentor law students or interns.", done: false },
        { id: "lw_g_3", title: "Influence legislation & social change.", done: false },
      ]},
    ],
  },
  {
    career: "Engineering",
    stages: [
      { name: "Foundation", steps: [
        { id: "en_f_1", title: "Strong Math & Science background.", done: false },
        { id: "en_f_2", title: "Interest in building, fixing, designing.", done: false },
      ]},
      { name: "Training", steps: [
        { id: "en_t_1", title: "Technical college, apprenticeship, or engineering degree.", done: false },
        { id: "en_t_2", title: "Hands-on projects.", done: false },
      ]},
      { name: "Professional", steps: [
        { id: "en_p_1", title: "Work as technician, engineer, or skilled artisan.", done: false },
        { id: "en_p_2", title: "Gain certifications.", done: false },
      ]},
      { name: "Growth", steps: [
        { id: "en_g_1", title: "Specialize in civil, electrical, mechanical, etc.", done: false },
        { id: "en_g_2", title: "Lead projects or start your own company.", done: false },
        { id: "en_g_3", title: "Mentor apprentices.", done: false },
      ]},
    ],
  },
];

function read(): Roadmap[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Roadmap[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT;
    return parsed;
  } catch {
    return DEFAULT;
  }
}

function write(items: Roadmap[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getRoadmaps(): Roadmap[] {
  return read();
}

export function toggleStep(career: CareerKey, stepId: string) {
  const items = read();
  for (const r of items) if (r.career === career) {
    for (const st of r.stages) {
      for (const s of st.steps) if (s.id === stepId) s.done = !s.done;
    }
  }
  write(items);
  return items;
}

export function markStage(career: CareerKey, stageName: string, completed: boolean) {
  const items = read();
  for (const r of items) if (r.career === career) {
    for (const st of r.stages) if (st.name === stageName) {
      st.completed = completed;
    }
  }
  write(items);
  return items;
}

export function progressByStages(career: CareerKey): number {
  const items = read();
  const r = items.find(x=>x.career===career);
  if (!r) return 0;
  const total = r.stages.length || 1;
  const done = r.stages.filter(s=>s.completed).length;
  return Math.round((done/total)*100);
}

export function progressFor(career: CareerKey): number {
  const items = read();
  const r = items.find(x=>x.career===career);
  if (!r) return 0;
  const total = r.stages.reduce((sum, st)=> sum + st.steps.length, 0);
  const done = r.stages.reduce((sum, st)=> sum + st.steps.filter(s=>s.done).length, 0);
  if (total === 0) return 0;
  return Math.round((done/total)*100);
}


