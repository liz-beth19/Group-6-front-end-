import { useState } from "react";
import { useAuth, companyAddress } from "@/context/AuthContext";

export default function Profile() {
  const { getProfile, updateProfile } = useAuth();
  const p = getProfile();
  const [username, setUsername] = useState(p.username);
  const [email, setEmail] = useState(p.email);
  const [address, setAddress] = useState(p.address);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold md:text-3xl">Profile & Settings</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <form
            className="md:col-span-2 space-y-4 rounded-xl border bg-card p-6 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(null); setError(null);
              if (password && password !== confirm) {
                setError("Passwords do not match");
                return;
              }
              updateProfile({ username, email, address, ...(password ? { password } : {}) });
              setSaved("Changes saved");
              setPassword("");
              setConfirm("");
            }}
          >
            <div>
              <label className="mb-1 block text-sm font-medium">Username</label>
              <input value={username} onChange={(e)=>setUsername(e.target.value)} className="h-10 w-full rounded-md border border-input px-3" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="h-10 w-full rounded-md border border-input px-3" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Address</label>
              <textarea value={address} onChange={(e)=>setAddress(e.target.value)} className="min-h-[90px] w-full rounded-md border border-input px-3 py-2" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">New Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="h-10 w-full rounded-md border border-input px-3" placeholder="Leave blank to keep current" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Confirm Password</label>
                <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="h-10 w-full rounded-md border border-input px-3" />
              </div>
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            {saved && <div className="text-sm text-primary">{saved}</div>}
            <button className="mt-2 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Save changes</button>
          </form>

          <aside className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
            <div className="text-sm font-semibold text-foreground">Company Address</div>
            <p className="mt-2">{companyAddress}</p>
            <hr className="my-4 border-border" />
            <p>
              Need account help? Update your details here. Changes are stored locally for this demo. For production, we can connect a database via Neon or Supabase.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
