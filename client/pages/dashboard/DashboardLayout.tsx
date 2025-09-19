import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import { companies } from "@/data/companies";
import { ChevronLeft, BarChart3, FileCheck, Briefcase, GraduationCap, Map, Users, Calendar, Mic, User, MessageCircle, Settings } from "lucide-react";
//import { Clock } from "@/components/gradgate/Clock";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  
  const navItem = (to: string, label: string, icon: React.ReactNode) => (
    <NavLink 
      to={to} 
      end={to==='/dashboard'} 
      className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-purple-200 text-purple-900 font-medium' 
          : 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'
      }`}
    >
      {icon}
      {!collapsed && <span className="text-sm">{label}</span>}
    </NavLink>
  );

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-purple-100 transition-all duration-300 min-h-screen flex flex-col`}>
      {/* Header/Logo Section */}
      <div className="p-6 border-b border-purple-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-purple-900 text-xl font-bold">GRADGATE</h1>
              <p className="text-purple-700 text-xs text-center leading-tight">
                Innovate Your<br />Future
              </p>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center hover:bg-purple-300 transition-colors"
          >
            <ChevronLeft className={`w-4 h-4 text-purple-700 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItem('/dashboard', 'Dashboard', <BarChart3 className="w-5 h-5" />)}
        {navItem('/dashboard/applications', 'Applications', <FileCheck className="w-5 h-5" />)}
        {navItem('/dashboard/jobs', 'Jobs', <Briefcase className="w-5 h-5" />)}
        {navItem('/dashboard/roadmaps', 'Roadmaps', <Map className="w-5 h-5" />)}
        {navItem('/dashboard/mentorship', 'Mentorship', <Users className="w-5 h-5" />)}
        {navItem('/dashboard/calendar', 'Calendar', <Calendar className="w-5 h-5" />)}
        {navItem('/dashboard/events', 'Events', <Mic className="w-5 h-5" />)}
        {navItem('/dashboard/profile', 'Profile & Settings', <User className="w-5 h-5" />)}
        {navItem('/dashboard/chat', 'Support Chat', <MessageCircle className="w-5 h-5" />)}
      </nav>
    </aside>
  );
}

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
