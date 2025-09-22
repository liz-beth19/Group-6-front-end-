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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

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
                  console.log("Setting admin from API...");
                  await setAdminFromApi(data?.username || email, data?.token);
                } else {
                  // Store token for regular users
                  if (data?.token) {
                    localStorage.setItem("gg_auth_token", data.token);
                  }
                  
                  const ok = await login(email, password);
                  if (!ok) {
                    
                    const fullName = [data?.name, data?.surname].filter(Boolean).join(" ");
                    setUserFromApi({ 
                      username: data?.username || email, 
                      email: data?.email || email, 
                      fullName: fullName || undefined,
                      name: data?.name,
                      surname: data?.surname,
                      id: data?.id,
                      role: data?.role
                    });
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
          
          {!showForgotPassword ? (
            <>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                New to GradGate? <Link to="/register" className="text-primary hover:underline">Create an account</Link>
              </p>
              <p className="mt-2 text-center text-sm">
                <button 
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-primary hover:underline"
                >
                  Forgot your password?
                </button>
              </p>
            </>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Reset Password</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email address and we'll send you a temporary password.
                </p>
              </div>
              
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setForgotPasswordMessage(null);
                  setForgotPasswordLoading(true);
                  try {
                    const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: forgotPasswordEmail }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setForgotPasswordMessage(data.message);
                    } else {
                      setForgotPasswordMessage(data.message || "Failed to reset password");
                    }
                  } catch (err: any) {
                    setForgotPasswordMessage("Failed to reset password. Please try again.");
                  } finally {
                    setForgotPasswordLoading(false);
                  }
                }}
              >
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={forgotPasswordLoading}>
                  {forgotPasswordLoading ? "Sending..." : "Send Reset Email"}
                </Button>
              </form>
              
              {forgotPasswordMessage && (
                <div className={`text-sm p-3 rounded-md ${
                  forgotPasswordMessage.includes("successful") 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {forgotPasswordMessage}
                </div>
              )}
              
              <p className="text-center text-sm">
                <button 
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail("");
                    setForgotPasswordMessage(null);
                  }}
                  className="text-primary hover:underline"
                >
                  Back to login
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
