import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type AdminUser = { username: string } | null;

type AdminContextType = {
  admin: AdminUser;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setAdminFromApi: (username: string) => void;
};

const AdminAuthContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_KEY = "gg_admin_user";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_KEY);
    if (saved) setAdmin(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (admin) localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    else localStorage.removeItem(ADMIN_KEY);
  }, [admin]);

  const value = useMemo<AdminContextType>(() => ({
    admin,
    async login(username, password) {
      return false;
    },
    logout() {
      setAdmin(null);
      navigate("/login", { replace: true });
    },
    setAdminFromApi(username: string) {
      setAdmin({ username });
      navigate("/admin", { replace: true });
    },
  }), [admin, navigate]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();
  if (!admin) {
    navigate("/login", { replace: true });
    return null;
  }
  return <>{children}</>;
}

 
