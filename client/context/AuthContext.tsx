import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type User = { username: string; email?: string; address?: string } | null;

type Profile = { username: string; email: string; address: string; password: string };

type AuthContextType = {
  user: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<Profile>) => void;
  getProfile: () => Profile;
  setUserFromApi: (u: { username: string; email?: string; address?: string }) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILE_KEY = "gg_profile";

function readProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw) as Profile;
  } catch {}
  return { username: "", email: "", address: "", password: "" };
}

function writeProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("gg_auth_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("gg_auth_user", JSON.stringify(user));
    else localStorage.removeItem("gg_auth_user");
  }, [user]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    async login(username, password) {
      // Local login no longer supported; rely on API in Login page.
      return false;
    },
    logout() {
      setUser(null);
      navigate("/", { replace: true });
    },
    updateProfile(updates) {
      const current = readProfile();
      const merged: Profile = { ...current, ...updates } as Profile;
      writeProfile(merged);
      setUser({ username: merged.username, email: merged.email, address: merged.address });
    },
    getProfile() {
      return readProfile();
    },
    setUserFromApi(u) {
      setUser(u);
      navigate("/dashboard", { replace: true });
    },
  }), [user, navigate]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }
  return <>{children}</>;
}
export const companyAddress = "GradGate HQ, 322 Fifteenth Road, Randjespark, Midrand 1685";
