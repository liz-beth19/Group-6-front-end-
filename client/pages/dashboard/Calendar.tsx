import { useMemo, useState } from "react";
import { Calendar as Day } from "@/components/ui/calendar";
import { getEvents, eventsForDate } from "@/store/events";

export default function CalendarPage() {
  const today = new Date();
  const [selected, setSelected] = useState<Date | undefined>(today);
  const all = getEvents();
  const sel = useMemo(()=> selected ? eventsForDate(selected.toISOString().slice(0,10)) : [], [selected]);
  const active = all.length;
  const completed = Math.max(0, Math.floor(active/2));
  const next = all
    .map(e=>({ e, t: new Date(`${e.date}T${e.time??"00:00"}`)}))
    .filter(x=> x.t >= new Date())
    .sort((a,b)=> +a.t - +b.t)[0];
  const timeToNext = next ? Math.max(0, Math.floor((+next.t - +new Date())/60000)) : null;

  return (
    <section className="py-8">
      <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold">Today Events</div>
          <ul className="mt-4 space-y-3 text-sm">
            {sel.map((e)=> (
              <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <span className="truncate">{e.title}</span>
                <span className="text-xs text-muted-foreground">{e.time ?? "All day"}</span>
              </li>
            ))}
            {sel.length===0 && <li className="text-sm text-muted-foreground">No events today.</li>}
          </ul>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold">Calendar</div>
          <div className="mt-3 flex justify-center">
            <Day mode="single" selected={selected} onSelect={setSelected} />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold">Information</div>
          <div className="mt-3 space-y-3">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Active events</div>
              <div className="text-2xl font-bold">{active}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Completed events</div>
              <div className="text-2xl font-bold">{completed}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Time to next event</div>
              <div className="text-2xl font-bold">{timeToNext!==null?`${Math.floor(timeToNext/60)}h ${timeToNext%60}m`:'—'}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Important events</div>
              <div className="text-2xl font-bold">{all.filter(e=>e.important).length}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold">Notes</div>
          <ul className="mt-3 space-y-2 text-sm">
            {all.filter(e=>e.note).map(n=> (
              <li key={n.id} className="rounded-md border p-3">{n.title}</li>
            ))}
            {all.filter(e=>e.note).length===0 && <li className="text-sm text-muted-foreground">No notes</li>}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold">Important Events</div>
          <ul className="mt-3 space-y-2 text-sm">
            {all.filter(e=>e.important).map(n=> (
              <li key={n.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                <span>{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.date} {n.time??''}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold">Upcoming Events</div>
          <ul className="mt-3 space-y-2 text-sm">
            {all
              .filter(e=> new Date(`${e.date}T${e.time??"00:00"}`) > new Date())
              .sort((a,b)=> +new Date(`${a.date}T${a.time??"00:00"}`) - +new Date(`${b.date}T${b.time??"00:00"}`))
              .slice(0,5)
              .map(e => (
              <li key={e.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                <span className="truncate">{e.title}</span>
                <span className="text-xs text-muted-foreground">{e.date} {e.time??''}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
