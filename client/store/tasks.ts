export type Task = { id: string; title: string; done: boolean };

const TASKS_KEY = "gg_tasks";

function save(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function getTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as Task[];
  } catch {
    return seed();
  }
}

function seed(): Task[] {
  const initial: Task[] = [
    { id: "t1", title: "Prepare Figma file", done: false },
    { id: "t2", title: "Design UX wireframes", done: false },
    { id: "t3", title: "Research mobile app", done: true },
  ];
  save(initial);
  return initial;
}

export function toggleTask(id: string) {
  const tasks = getTasks();
  const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  save(next);
  return next;
}

export function addTask(title: string) {
  const tasks = getTasks();
  const t: Task = { id: `t_${Date.now()}`, title: title.trim(), done: false };
  const next = [t, ...tasks];
  save(next);
  return next;
}
