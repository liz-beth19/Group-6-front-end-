export type EventItem = { id: string; title: string; time?: string; date: string; important?: boolean; note?: boolean };

const EVENTS_KEY = "gg_events";

function save(items: EventItem[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(items));
}

function seed(): EventItem[] {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0,10);
  const items: EventItem[] = [
    { id: "e1", title: "Business meeting", time: "08:30", date: iso(today) },
    { id: "e2", title: "Shop — Buy lamp", time: "11:00", date: iso(today) },
    { id: "e3", title: "TV — Premiere of new season", time: "19:00", date: iso(today) },
    { id: "e4", title: "Write brief", time: "10:00", date: iso(new Date(today.getTime()+86400000)), important: true },
    { id: "e5", title: "Dinner with team", time: "20:00", date: iso(new Date(today.getTime()+2*86400000)), important: true },
    { id: "e6", title: "New agreement", date: iso(new Date(today.getTime()+3*86400000)), note: true },
  ];
  save(items);
  return items;
}

export function getEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as EventItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seed();
    return parsed;
  } catch {
    return seed();
  }
}

export function addEvent(e: Omit<EventItem, "id">) {
  const items = getEvents();
  const item: EventItem = { id: `e_${Date.now()}`, ...e };
  const next = [item, ...items];
  save(next);
  return item;
}

export function eventsForDate(date: string) {
  return getEvents().filter(e => e.date === date);
}

export function removeEvent(id: string) {
  const items = getEvents();
  const next = items.filter(e => e.id !== id);
  save(next);
  return next;
}