import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function Login() {
  const { login, setUserFromApi } = useAuth();
  const { setAdminFromApi } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative min-h-[calc(100vh-64px)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_0%,hsl(var(--primary)/0.12),transparent_70%)]" />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Log in to continue your GradGate journey.
            </p>
          </div>
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              try {
                const res = await fetch("http://localhost:8080/api/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  
                  body: JSON.stringify({ email, password }),
                });
                if (!res.ok) {
                  let msg = `Login failed (${res.status})`;
                  try {
                    const data = await res.json();
                    if (data?.message) msg = data.message;
                    if (data?.error) msg = data.error;
                  } catch {}
                  throw new Error(msg);
                }
                const data = await res.json();
                
                const role = (data?.role || "").toString().toUpperCase();
                if (role === "ADMIN") {
                 
                  setAdminFromApi(data?.username || email);
                } else {
                  
                  const ok = await login(email, password);
                  if (!ok) {
                    
                    const fullName = [data?.name, data?.surname].filter(Boolean).join(" ");
                    setUserFromApi({ username: data?.username || email, email: data?.email || email, fullName: fullName || undefined });
                  }
                }
              } catch (err: any) {
                setError(err?.message || "Invalid credentials");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder={`you@example.com`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error ? (
              <div className="text-sm text-destructive">{error}</div>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Loading…" : "Log in"}</Button>
          </form>
          
          <p className="mt-3 text-center text-sm text-muted-foreground">
            New to GradGate? <Link to="/register" className="text-primary hover:underline">Create an account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
