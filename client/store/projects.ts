export type Project = { id: string; name: string; color: string; tasks: number; completed: number; avatars: string[] };

const PROJ_KEY = "gg_projects";

function save(items: Project[]) {
  localStorage.setItem(PROJ_KEY, JSON.stringify(items));
}

export function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJ_KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as Project[];
  } catch {
    return seed();
  }
}

export function updateProjectProgress(projectId: string, completed: number) {
  const projects = getProjects();
  const updated = projects.map(p => 
    p.id === projectId ? { ...p, completed: Math.max(0, Math.min(p.tasks, completed)) } : p
  );
  save(updated);
  return updated;
}

function seed(): Project[] {
  const items: Project[] = [
    { id: "p_web", name: "Web Development", color: "bg-purple-600", tasks: 10, completed: 9, avatars: [] },
    { id: "p_mobile", name: "Mobile App Design", color: "bg-teal-400", tasks: 12, completed: 4, avatars: [] },
    { id: "p_fb", name: "Facebook Brand UI Kit", color: "bg-orange-400", tasks: 22, completed: 17, avatars: [] },
  ];
  save(items);
  return items;
}
