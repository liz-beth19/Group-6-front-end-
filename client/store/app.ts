export type Application = {
  id: string;
  province?: string;
  applicationName?: string;
  coverLetter?: string;
  status: "PENDING" | "APPROVED" | "DECLINE";
  cvPath?: string;
  idDocumentPath?: string;
  coverLetterPath?: string;
  appliedDate: string;
  applicant?: {
    id: string;
    email: string;
    name: string;
  };
  jobOpening?: {
    id: string;
    title: string;
    company?: string;
    location?: string;
    type?: string;
  };
  // Legacy fields for backward compatibility
  company?: string;
  jobId?: string;
  position?: string;
  dateApplied?: string;
  resumeName?: string;
  resumeDataUrl?: string;
};

const APPS_KEY = "gg_apps";
const SAVED_KEY = "gg_saved_jobs";

function getUserKey(userId?: string | number): string {
  return userId ? `${APPS_KEY}_${userId}` : APPS_KEY;
}

export function getApplications(userId?: string | number): Application[] {
  try {
    return JSON.parse(localStorage.getItem(getUserKey(userId)) || "[]");
  } catch {
    return [];
  }
}

export function addApplication(app: Application, userId?: string | number) {
  const all = getApplications(userId);
  all.unshift(app);
  localStorage.setItem(getUserKey(userId), JSON.stringify(all));
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
