import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
 

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState<string | number>("");
  const [province, setProvince] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative min-h-[calc(100vh-64px-64px)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_0%,hsl(var(--accent)/0.12),transparent_70%)]" />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-xl rounded-2xl border bg-card p-8 shadow-sm"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join GradGate and innovate your future.
            </p>
          </div>
          <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={async (e)=>{
            e.preventDefault(); setError(null); setLoading(true);
            try {
              if (!province) throw new Error("Please select a province");
              const endpoint = "http://localhost:8080/api/auth/register";
              const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name,
                  surname,
                  address,
                  email,
                  password,
                  phoneNumber,
                  age: typeof age === "string" ? Number(age) : age,
                  province,
                }),
              });

              if (!response.ok) {
                let message = `Registration failed (${response.status})`;
                try {
                  const data = await response.json();
                  if (data?.message) message = data.message;
                  if (data?.error) message = data.error;
                } catch {}
                throw new Error(message);
              }

              // On success, go to login
              navigate("/login", { replace: true });
            } catch (err: any) {
              setError(err?.message || "Could not register");
            } finally {
              setLoading(false);
            }
          }}>
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <Input type="text" placeholder="Enter name" value={name} onChange={(e)=>setName(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Surname</label>
              <Input type="text" placeholder="Enter surname" value={surname} onChange={(e)=>setSurname(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Address</label>
              <Input type="text" placeholder="Street, City, Province, Code" value={address} onChange={(e)=>setAddress(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone number</label>
              <Input type="tel" placeholder="e.g. 071 234 5678" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <Input type="password" placeholder="Create a strong password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Age</label>
              <Input type="number" min={0} placeholder="e.g. 21" value={age} onChange={(e)=>setAge(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Province</label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="border-purple-300 text-purple-700 focus:ring-purple-500">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent className="border-purple-200">
                  <SelectItem value="WESTERN_CAPE">WESTERN_CAPE</SelectItem>
                  <SelectItem value="GAUTENG">GAUTENG</SelectItem>
                  <SelectItem value="NORTH_WEST">NORTH_WEST</SelectItem>
                  <SelectItem value="MPUMALANGA">MPUMALANGA</SelectItem>
                  <SelectItem value="NORHTERN_CAPE">NORHTERN_CAPE</SelectItem>
                  <SelectItem value="LIMPOPO">LIMPOPO</SelectItem>
                  <SelectItem value="EASTERN_CAPE">EASTERN_CAPE</SelectItem>
                  <SelectItem value="FREE_STATE">FREE_STATE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <div className="md:col-span-2 text-sm text-destructive">{error}</div>}
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={loading}>{loading?"Registering…":"Create account"}</Button>
              
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
