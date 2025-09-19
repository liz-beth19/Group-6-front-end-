import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Opportunities from "./pages/dashboard/Opportunities";
import Applications from "./pages/dashboard/Applications";
import Roadmaps from "./pages/dashboard/Roadmaps";
import Mentorship from "./pages/dashboard/Mentorship";
import Events from "./pages/dashboard/Events";
import Profile from "./pages/dashboard/Profile";
import Chat from "./pages/dashboard/Chat";
import CalendarPage from "./pages/dashboard/Calendar";
import CompanyJobs from "./pages/dashboard/CompanyJobs";
import Apply from "./pages/dashboard/Apply";
import { Layout } from "./components/layout/Layout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminChat from "./pages/admin/AdminChat";
import { AuthProvider, RequireAuth } from "./context/AuthContext";
import { AdminAuthProvider, RequireAdmin } from "./context/AdminAuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AdminAuthProvider>
            <AuthProvider>
              <Layout>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <DashboardLayout />
                    </RequireAuth>
                  }
                >
                  <Route index element={<Overview />} />
                  <Route path="applications" element={<Applications />} />
                  <Route path="opportunities" element={<Opportunities />} />
                  <Route path="roadmaps" element={<Roadmaps />} />
                  <Route path="mentorship" element={<Mentorship />} />
                  <Route path="events" element={<Events />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="company/:slug" element={<CompanyJobs />} />
                  <Route path="apply/:slug/:jobId" element={<Apply />} />
                </Route>
                <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
                <Route path="/admin/chat" element={<RequireAdmin><AdminChat /></RequireAdmin>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Layout>
            </AuthProvider>
          </AdminAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
