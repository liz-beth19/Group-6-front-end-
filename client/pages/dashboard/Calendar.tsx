import { useMemo, useState } from "react";
import { Calendar as Day } from "@/components/ui/calendar";
import { getEvents, eventsForDate, addEvent, removeEvent } from "@/store/events";
import { getTasks, addTask, toggleTask } from "@/store/tasks";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const today = new Date();
  const [selected, setSelected] = useState<Date | undefined>(today);
  const all = getEvents();
  const dateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const sel = useMemo(()=> selected ? eventsForDate(dateKey(selected)) : [], [selected]);
  const active = all.length;
  const completed = Math.max(0, Math.floor(active/2));
  const next = all
    .map(e=>({ e, t: new Date(`${e.date}T${e.time??"00:00"}`)}))
    .filter(x=> x.t >= new Date())
    .sort((a,b)=> +a.t - +b.t)[0];
  const timeToNext = next ? Math.max(0, Math.floor((+next.t - +new Date())/60000)) : null;

  const [todoInput, setTodoInput] = useState("");
  const [tasks, setTasks] = useState(getTasks());
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [view, setView] = useState<"day"|"week"|"month">("month");

  return (
    <section className="py-8">
      <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold">Upcoming Events</div>
          <ul className="mt-4 space-y-3 text-sm">
            {all
              .filter(e=> new Date(`${e.date}T${e.time??"00:00"}`) >= new Date())
              .sort((a,b)=> +new Date(`${a.date}T${a.time??"00:00"}`) - +new Date(`${b.date}T${b.time??"00:00"}`))
              .slice(0,4)
              .map(e=> (
                <li key={e.id} className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground">{e.date} {e.time??"All day"}</div>
                  <div className="mt-1 font-semibold">{e.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Discussion / Meetup</div>
                </li>
              ))}
            {all.length===0 && <li className="text-sm text-muted-foreground">No upcoming events.</li>}
          </ul>
          <div className="mt-5">
            <div className="text-sm font-semibold">Add Event</div>
            <form className="mt-2 grid grid-cols-3 gap-2" onSubmit={(e)=>{
              e.preventDefault();
              if (!eventTitle.trim()) return;
              const dateStr = selected ? dateKey(selected) : dateKey(new Date());
              addEvent({ title: eventTitle.trim(), date: dateStr, time: eventTime || undefined });
              setEventTitle("");
              setEventTime("");
            }}>
              <input placeholder="Title" className="col-span-2 h-9 rounded-md border border-input px-2 text-sm" value={eventTitle} onChange={(e)=>setEventTitle(e.target.value)} />
              <input placeholder="10:00" className="h-9 rounded-md border border-input px-2 text-sm" value={eventTime} onChange={(e)=>setEventTime(e.target.value)} />
              <div className="col-span-3"><Button type="submit" className="h-9 px-3 text-xs">Add</Button></div>
            </form>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">{selected ? selected.toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "Calendar"}</div>
            <div className="flex gap-2">
              <button onClick={()=>setView("week")} className={`rounded-md border px-3 py-1 text-xs ${view==='week'?"bg-primary text-primary-foreground":""}`}>Week</button>
              <button onClick={()=>setView("day")} className={`rounded-md border px-3 py-1 text-xs ${view==='day'?"bg-primary text-primary-foreground":""}`}>Day</button>
              <button onClick={()=>setView("month")} className={`rounded-md border px-3 py-1 text-xs ${view==='month'?"bg-primary text-primary-foreground":""}`}>Month</button>
            </div>
          </div>
          <div className="flex justify-center">
            <Day mode="single" selected={selected} onSelect={setSelected} />
          </div>
          {selected && (
            <div className="mt-4">
              <div className="text-sm font-semibold">Events on {dateKey(selected)}</div>
              <ul className="mt-2 space-y-2 text-sm">
                {sel.map(e=> (
                  <li key={e.id} className="flex items-center justify-between rounded-md border p-2">
                    <div>
                      <div className="text-xs text-muted-foreground">{e.date} {e.time??"All day"}</div>
                      <div className="font-medium">{e.title}</div>
                    </div>
                    <button className="rounded-md border px-2 py-1 text-xs" onClick={()=>{ removeEvent(e.id); setSelected(new Date(e.date)); }}>Delete</button>
                  </li>
                ))}
                {sel.length===0 && <li className="text-xs text-muted-foreground">No events.</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm md:col-span-1">
          <div className="text-sm font-semibold">Todos</div>
          <form className="mt-3 flex gap-2" onSubmit={(e)=>{e.preventDefault(); if (!todoInput.trim()) return; setTasks(addTask(todoInput)); setTodoInput("");}}>
            <input value={todoInput} onChange={(e)=>setTodoInput(e.target.value)} placeholder="Add a todo" className="h-9 flex-1 rounded-md border border-input px-2 text-sm" />
            <Button type="submit" className="h-9 px-3 text-xs">Add</Button>
          </form>
          <ul className="mt-3 space-y-2 text-sm">
            {tasks.map(t=> (
              <li key={t.id} className="flex items-center justify-between rounded-md border p-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={t.done} onChange={()=>setTasks(toggleTask(t.id))} />
                  <span className={t.done?"line-through text-muted-foreground":""}>{t.title}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
