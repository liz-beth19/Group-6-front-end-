export type Application = {
  id: string;
  company: string;
  jobId: string;
  position: string;
  dateApplied: string;
  status: "Pending" | "Interview" | "Rejected" | "Hired";
};

const APPS_KEY = "gg_apps";
const SAVED_KEY = "gg_saved_jobs";

export function getApplications(): Application[] {
  try {
    return JSON.parse(localStorage.getItem(APPS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addApplication(app: Application) {
  const all = getApplications();
  all.unshift(app);
  localStorage.setItem(APPS_KEY, JSON.stringify(all));
}

export function getSavedJobs(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleSavedJob(key: string) {
  const saved = new Set(getSavedJobs());
  if (saved.has(key)) saved.delete(key);
  else saved.add(key);
  localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]));
  return [...saved];
}
