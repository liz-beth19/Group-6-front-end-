import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { Unemployment } from "@/components/gradgate/Unemployment";
import { getPosts } from "@/store/posts";
import { CustomCalendar as Day } from "@/components/ui/custom-calendar";
import { Input } from "@/components/ui/input";
import { useMemo, useState, useEffect } from "react";
import { getProjects } from "@/store/projects";
import { addTask, getTasks, toggleTask, deleteTask } from "@/store/tasks";
import { updateProjectProgress } from "@/store/projects";
import { addEvent, eventsForDate, getEvents, removeEvent } from "@/store/events";
import { getApplications, deleteApplication } from "@/store/app";
import { getUserProjects, addUserProject, updateUserProject, deleteUserProject, UserProject } from "@/store/userProjects";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Bell, 
  MessageCircle,
  Target,
  BarChart3,
  Star,
  Plus,
  ArrowRight,
  Trash2,
  Edit,
  X
} from "lucide-react";

export default function Overview() {
  const { user } = useAuth();
  const location = useLocation();
  const justApplied = Boolean((location as any).state?.applied);
  const [search, setSearch] = useState("");
  // Dashboard calendar state (mirrors Calendar page sans Todos)
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
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [view, setView] = useState<"day"|"week"|"month">("month");

  // State for projects to enable re-rendering
  const [projects, setProjects] = useState(getProjects());
  const [tasks, setTasks] = useState(getTasks(user?.id));
  const [userProjects, setUserProjects] = useState(getUserProjects(user?.id));
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "ACTIVE" as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    progress: 0,
    tags: [] as string[],
  });
  
  // Application statistics - user-specific
  const [applications, setApplications] = useState(getApplications(user?.id));
  const pendingApplications = applications.filter(app => app.status === "PENDING").length;
  const approvedApplications = applications.filter(app => app.status === "APPROVED").length;
  const declinedApplications = applications.filter(app => app.status === "DECLINE").length;

  // Refresh data when user changes
  useEffect(() => {
    setTasks(getTasks(user?.id));
    setUserProjects(getUserProjects(user?.id));
    setApplications(getApplications(user?.id));
  }, [user?.id]);

  // Real statistics calculations
  const completedTasks = tasks.filter(t => t.done).length;
  const totalTasks = tasks.length;
  
  // User projects calculations (only these count now)
  const totalUserProjects = userProjects.length;
  const completedUserProjects = userProjects.filter(p => p.progress === 100).length;
  const totalUserProjectProgress = userProjects.reduce((sum, p) => sum + p.progress, 0);
  const averageUserProjectProgress = totalUserProjects > 0 ? totalUserProjectProgress / totalUserProjects : 0;
  
  // Progress calculation (only user projects)
  const overallProgress = totalUserProjects > 0 ? Math.round(averageUserProjectProgress) : 0;

  // Function to handle project progress updates
  const handleProjectProgressUpdate = (projectId: string, newCompleted: number) => {
    updateProjectProgress(projectId, newCompleted);
    setProjects(getProjects()); // Update projects state
  };

  // Function to handle task updates
  const handleTaskToggle = (taskId: string) => {
    toggleTask(taskId, user?.id);
    setTasks(getTasks(user?.id)); // Update tasks state
  };

  // Function to handle task deletion
  const handleTaskDelete = (taskId: string) => {
    deleteTask(taskId, user?.id);
    setTasks(getTasks(user?.id)); // Update tasks state
  };

  // Function to handle application deletion
  const handleApplicationDelete = (appId: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      const updatedApplications = deleteApplication(appId, user?.id);
      setApplications(updatedApplications);
    }
  };

  // Function to handle adding new user project
  const handleAddProject = () => {
    if (newProject.name.trim()) {
      addUserProject(newProject, user?.id);
      setUserProjects(getUserProjects(user?.id));
      setApplications(getApplications(user?.id)); // Refresh applications to update progress
      setNewProject({
        name: "",
        description: "",
        status: "ACTIVE" as const,
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        progress: 0,
        tags: [],
      });
      setShowAddProject(false);
    }
  };

  // Function to handle user project deletion
  const handleUserProjectDelete = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteUserProject(projectId, user?.id);
      setUserProjects(getUserProjects(user?.id));
      setApplications(getApplications(user?.id)); // Refresh applications to update progress
    }
  };

  // Function to handle user project progress update
  const handleUserProjectProgressUpdate = (projectId: string, newProgress: number) => {
    updateUserProject(projectId, { progress: Math.max(0, Math.min(100, newProgress)) }, user?.id);
    setUserProjects(getUserProjects(user?.id));
    setApplications(getApplications(user?.id)); // Refresh applications to update progress
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-6 py-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome back, {user?.name || (user?.fullName || "").split(" ")[0] || user?.username || "Student"}! 👋
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Ready to make today productive? Here's your dashboard overview.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/dashboard/chat">
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Support Chat
                </Button>
              </Link>
              <Link to="/dashboard/opportunities">
                <Button className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </motion.div>

        {justApplied && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">🎉 Application sent! Keep an eye on your inbox.</span>
              </div>
          </motion.div>
        )}
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-6 pb-12">
        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-900">{applications.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-green-600">Completed Tasks</p>
                  <p className="text-3xl font-bold text-green-900">{completedTasks}</p>
                </div>
                <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Active Projects</p>
                  <p className="text-3xl font-bold text-purple-900">{totalUserProjects}</p>
                </div>
                <div className="h-12 w-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
            </div>
          </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Overall Progress</p>
                  <p className="text-3xl font-bold text-orange-900">{overallProgress}%</p>
                  <p className="text-xs text-orange-700 mt-1">
                    {totalUserProjects > 0 ? `${totalUserProjects} user projects` : 'No user projects'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Profile & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {user?.name ? user.name.charAt(0).toUpperCase() : (user?.surname ? user.surname.charAt(0).toUpperCase() : 'U')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">
                        {user?.name && user?.surname ? `${user.name} ${user.surname}` : user?.fullName || user?.username || "Student"}
                      </h3>
                      <p className="text-muted-foreground">
                        {user?.role === 'USER' ? 'Student' : user?.role || 'User'} • Available
                      </p>
                      <div className="mt-2">
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* My Active Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      My Active Projects
                    </CardTitle>
                    <Button 
                      onClick={() => setShowAddProject(!showAddProject)}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Project
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    The Active Projects function gives graduates, employers, and institutions a space to connect with real-time opportunities 🌐. It highlights ongoing projects, internships, and collaborations 🎓💼, allowing graduates to gain hands-on experience while employers and institutions track progress and impact 📊. This feature keeps GradGate interactive, practical, and future-focused 🚀.
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Add Project Form */}
                  {showAddProject && (
                    <div className="mb-6 p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50">
                      <h4 className="font-semibold mb-3">Add New Project</h4>
                      <div className="space-y-3">
                        <Input
                          placeholder="Project name"
                          value={newProject.name}
                          onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        />
                        <Input
                          placeholder="Project description"
                          value={newProject.description}
                          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        />
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={newProject.startDate}
                            onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                            className="flex-1"
                          />
                          <Input
                            type="date"
                            placeholder="End date (optional)"
                            value={newProject.endDate}
                            onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddProject} size="sm">
                            Add Project
                          </Button>
                          <Button 
                            onClick={() => setShowAddProject(false)} 
                            variant="outline" 
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {userProjects.length > 0 ? (
                    <div className="grid gap-4">
                      {userProjects.map(p => (
                        <div key={p.id} className="p-4 rounded-xl border bg-gradient-to-r from-slate-50 to-white hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold">{p.name}</h4>
                              {p.description && (
                                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${
                                p.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                p.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {p.status}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserProjectDelete(p.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Progress value={p.progress} className="h-2 mb-3" />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{p.progress}% complete</span>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUserProjectProgressUpdate(p.id, Math.max(0, p.progress - 10))}
                                disabled={p.progress <= 0}
                                className="h-7 w-7 p-0"
                              >
                                -
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUserProjectProgressUpdate(p.id, Math.min(100, p.progress + 10))}
                                disabled={p.progress >= 100}
                                className="h-7 w-7 p-0"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Started: {new Date(p.startDate).toLocaleDateString()}</span>
                            {p.endDate && <span>Ends: {new Date(p.endDate).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No active projects yet</p>
                      <p className="text-sm">Add your first project to start tracking your progress</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
        </div>

          {/* Right Column - Tasks & Quick Actions */}
          <div className="space-y-6">
            {/* Tasks Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Today's Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="mb-4 flex gap-2" onSubmit={(e)=>{ 
                    e.preventDefault(); 
                    const f = e.target as HTMLFormElement; 
                    const input = f.elements.namedItem('newtask') as HTMLInputElement; 
                    if (input.value.trim()) { 
                      addTask(input.value, user?.id); 
                      setTasks(getTasks(user?.id)); 
                      input.value=''; 
                      e.currentTarget.reset(); 
                    } 
                  }}>
                    <Input name="newtask" placeholder="Add a task..." className="flex-1" />
                    <Button type="submit" size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                    </Button>
            </form>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
              {tasks.map(t => (
                      <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={t.done} 
                          onChange={() => handleTaskToggle(t.id)}
                          className="rounded border-2"
                        />
                        <span className={`flex-1 text-sm ${t.done ? "line-through text-muted-foreground" : ""}`}>
                          {t.title}
                        </span>
                        <div className="flex items-center gap-2">
                          {t.done && <CheckCircle className="h-4 w-4 text-green-500" />}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleTaskDelete(t.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No tasks yet</p>
                        <p className="text-xs">Add your first task above</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - Applications & Announcements */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Pending</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">{pendingApplications}</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Approved</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">{approvedApplications}</div>
              </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-5 text-red-600">✗</span>
                      <span className="font-medium text-red-800">Declined</span>
              </div>
                    <div className="text-2xl font-bold text-red-900">{declinedApplications}</div>
              </div>
            </div>
                
                {applications.length > 0 && (
                  <div className="mt-6">
                    <Link to="/dashboard/applications">
                      <Button variant="outline" className="w-full gap-2">
                        View All Applications
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Recent Applications List */}
                {applications.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 text-sm">Recent Applications</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {applications.slice(0, 3).map((app) => (
                        <div key={app.id} className="p-3 rounded-lg border bg-gradient-to-r from-slate-50 to-white hover:shadow-sm transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-sm truncate">
                                {app.jobOpening?.title || app.position || 'Application'}
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                {app.jobOpening?.company || app.company || 'Company'} • 
                                {new Date(app.appliedDate || app.dateApplied || '').toLocaleDateString()}
                              </p>
                              <Badge className={`mt-1 text-xs ${
                                app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {app.status}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApplicationDelete(app.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Announcements Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {getPosts().filter(p=> (p.title+" "+p.body).toLowerCase().includes(search.toLowerCase())).map((p)=> (
                    <div key={p.id} className="p-4 rounded-lg border bg-gradient-to-r from-slate-50 to-white hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bell className="h-4 w-4 text-primary" />
              </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">{p.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(p.createdAt).toLocaleString()} • {p.author}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.body}</p>
              </div>
            </div>
                </div>
              ))}
              {getPosts().length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No announcements yet</p>
                      <p className="text-sm">Check back later for updates</p>
                    </div>
              )}
            </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Calendar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendar & Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Events */}
                <div className="lg:col-span-1">
                  <h4 className="font-semibold mb-4">Upcoming Events</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
              {all
                .filter(e=> new Date(`${e.date}T${e.time??"00:00"}`) >= new Date())
                .sort((a,b)=> +new Date(`${a.date}T${a.time??"00:00"}`) - +new Date(`${b.date}T${b.time??"00:00"}`))
                .slice(0,4)
                .map(e=> (
                        <div key={e.id} className="p-3 rounded-lg border bg-gradient-to-r from-slate-50 to-white">
                    <div className="text-xs text-muted-foreground">{e.date} {e.time??"All day"}</div>
                          <div className="mt-1 font-semibold text-sm">{e.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">Reminder</div>
                        </div>
                      ))}
                    {all.length===0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No upcoming events</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Add Event Form */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Add Event</h4>
                    <form className="space-y-2" onSubmit={(e)=>{
                e.preventDefault();
                if (!eventTitle.trim()) return;
                const dateStr = selected ? dateKey(selected) : dateKey(new Date());
                addEvent({ title: eventTitle.trim(), date: dateStr, time: eventTime || undefined });
                setEventTitle("");
                setEventTime("");
              }}>
                      <Input placeholder="Event title" value={eventTitle} onChange={(e)=>setEventTitle(e.target.value)} />
                      <Input placeholder="Time (e.g., 10:00)" value={eventTime} onChange={(e)=>setEventTime(e.target.value)} />
                      <Button type="submit" className="w-full gap-2">
                        <Plus className="h-4 w-4" />
                        Add Event
                      </Button>
              </form>
            </div>
          </div>

                {/* Calendar */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">
                      {selected ? selected.toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "Calendar"}
                    </h4>
              <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={()=>{setSelected(today);}}>Today</Button>
                      <Button size="sm" variant={view==='week'?"default":"outline"} onClick={()=>setView("week")}>Week</Button>
                      <Button size="sm" variant={view==='day'?"default":"outline"} onClick={()=>setView("day")}>Day</Button>
                      <Button size="sm" variant={view==='month'?"default":"outline"} onClick={()=>setView("month")}>Month</Button>
              </div>
            </div>
                  
            <div className="flex justify-center">
              <div className="rounded-md border bg-card">
                <Day 
                  selected={selected} 
                  onSelect={setSelected}
                />
              </div>
            </div>
                  
            {selected && (
              <div className="mt-4">
                      <h5 className="font-semibold mb-3">Events on {dateKey(selected)}</h5>
                      <div className="space-y-2">
                  {sel.map(e=> (
                          <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-slate-50 to-white">
                      <div>
                        <div className="text-xs text-muted-foreground">{e.date} {e.time??"All day"}</div>
                              <div className="font-medium text-sm">{e.title}</div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={()=>{ removeEvent(e.id); setSelected(new Date(e.date)); }}
                            >
                              Delete
                            </Button>
                          </div>
                        ))}
                        {sel.length===0 && (
                          <div className="text-center py-4 text-muted-foreground text-sm">
                            No events on this date
                          </div>
                        )}
                      </div>
              </div>
            )}
          </div>
        </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Unemployment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Unemployment />
        </motion.div>
      </div>
    </div>
  );
}
