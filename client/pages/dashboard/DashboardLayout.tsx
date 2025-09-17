import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import { companies } from "@/data/companies";

function Sidebar() {
  const [openJobs, setOpenJobs] = useState(true);
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card/50 p-4 md:block">
      <nav className="space-y-1 text-sm">
        <NavLink to="/dashboard" end className={({isActive})=>`block rounded-md px-3 py-2 ${isActive?"bg-primary/10 text-primary":"hover:bg-accent"}`}>Dashboard</NavLink>
        <NavLink to="/dashboard/applications" className={({isActive})=>`block rounded-md px-3 py-2 ${isActive?"bg-primary/10 text-primary":"hover:bg-accent"}`}>Applications</NavLink>
        <button onClick={()=>setOpenJobs(!openJobs)} className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-accent">
          <span>Jobs</span>
          <span className="text-xs">{openJobs?"−":"+"}</span>
        </button>
        {openJobs && (
          <div className="mb-2 ml-3 space-y-1">
            {companies.map(c=> (
              <NavLink key={c.slug} to={`/dashboard/company/${c.slug}`} className={({isActive})=>`block rounded-md px-3 py-1.5 text-xs ${isActive?"bg-primary/10 text-primary":"hover:bg-accent"}`}>{c.name}</NavLink>
            ))}
            <NavLink to="/dashboard/jobs" className={({isActive})=>`block rounded-md px-3 py-1.5 text-xs ${isActive?"bg-primary/10 text-primary":"hover:bg-accent"}`}>All Jobs</NavLink>
          </div>
        )}
        <NavLink to="/dashboard/roadmaps" className={({isActive})=>`block rounded-md px-3 py-2 ${isActive?"bg-primary/10 text-primary":"hover:bg-accent"}`}>Roadmaps</NavLink>
        <NavLink to="/dashboard/mentorship" className={({isActive})=>`block rounded-md px-3 py-2 ${isActive?"bg-primary/10 text-primary":"hover:bg-accent"}`}>Mentorship</NavLink>
        <NavLink to="/dashboard/calendar" className={({isActive})=>`block rounded-md px-3 py-2 ${isActive?"bg-primary/10 text-primary":"hover:bg-accent"}`}>Calendar</NavLink>
        <NavLink to="/dashboard/events" className={({isActive})=>`block rounded-md px-3 py-2 ${isActive?"bg-primary/10 text-primary":"hover:bg-accent"}`}>Events / Webinars</NavLink>
        <NavLink to="/dashboard/settings" className={({isActive})=>`block rounded-md px-3 py-2 ${isActive?"bg-primary/10 text-primary":"hover:bg-accent"}`}>Settings / Profile</NavLink>
        <NavLink to="/dashboard/profile" className={({isActive})=>`block rounded-md px-3 py-2 ${isActive?"bg-primary/10 text-primary":"hover:bg-accent"}`}>Profile</NavLink>
        <NavLink to="/dashboard/chat" className={({isActive})=>`block rounded-md px-3 py-2 ${isActive?"bg-primary/10 text-primary":"hover:bg-accent"}`}>Support Chat</NavLink>
      </nav>
    </aside>
  );
}

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex gap-6 px-4 py-6">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
