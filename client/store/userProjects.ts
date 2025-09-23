export type UserProject = {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  startDate: string;
  endDate?: string;
  progress: number; // 0-100
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

const USER_PROJECTS_KEY = "gg_user_projects";

function getUserKey(userId?: string | number): string {
  return userId ? `${USER_PROJECTS_KEY}_${userId}` : USER_PROJECTS_KEY;
}

export function getUserProjects(userId?: string | number): UserProject[] {
  try {
    return JSON.parse(localStorage.getItem(getUserKey(userId)) || "[]");
  } catch {
    return [];
  }
}

export function addUserProject(project: Omit<UserProject, "id" | "createdAt" | "updatedAt">, userId?: string | number): UserProject {
  const all = getUserProjects(userId);
  const newProject: UserProject = {
    ...project,
    id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  all.unshift(newProject);
  localStorage.setItem(getUserKey(userId), JSON.stringify(all));
  return newProject;
}

export function updateUserProject(projectId: string, updates: Partial<UserProject>, userId?: string | number): UserProject | null {
  const all = getUserProjects(userId);
  const index = all.findIndex(p => p.id === projectId);
  if (index === -1) return null;
  
  all[index] = {
    ...all[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(getUserKey(userId), JSON.stringify(all));
  return all[index];
}

export function deleteUserProject(projectId: string, userId?: string | number): UserProject[] {
  const all = getUserProjects(userId);
  const filtered = all.filter(p => p.id !== projectId);
  localStorage.setItem(getUserKey(userId), JSON.stringify(filtered));
  return filtered;
}
