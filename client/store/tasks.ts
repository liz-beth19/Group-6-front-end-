export type Task = { id: string; title: string; done: boolean };

const TASKS_KEY = "gg_tasks";

function getUserKey(userId?: string | number): string {
  return userId ? `${TASKS_KEY}_${userId}` : TASKS_KEY;
}

function save(tasks: Task[], userId?: string | number) {
  localStorage.setItem(getUserKey(userId), JSON.stringify(tasks));
}

export function getTasks(userId?: string | number): Task[] {
  try {
    const raw = localStorage.getItem(getUserKey(userId));
    if (!raw) return seed(userId);
    return JSON.parse(raw) as Task[];
  } catch {
    return seed(userId);
  }
}

function seed(userId?: string | number): Task[] {
  const initial: Task[] = [
    { id: "t1", title: "Prepare Figma file", done: false },
    { id: "t2", title: "Design UX wireframes", done: false },
    { id: "t3", title: "Research mobile app", done: true },
  ];
  save(initial, userId);
  return initial;
}

export function toggleTask(id: string, userId?: string | number) {
  const tasks = getTasks(userId);
  const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  save(next, userId);
  return next;
}

export function addTask(title: string, userId?: string | number) {
  const tasks = getTasks(userId);
  const t: Task = { id: `t_${Date.now()}`, title: title.trim(), done: false };
  const next = [t, ...tasks];
  save(next, userId);
  return next;
}

export function deleteTask(id: string, userId?: string | number) {
  const tasks = getTasks(userId);
  const next = tasks.filter((t) => t.id !== id);
  save(next, userId);
  return next;
}
