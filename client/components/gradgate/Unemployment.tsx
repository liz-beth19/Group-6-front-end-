import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const data = [
  { q: "2024 Q3", rate: 32.1 },
  { q: "2024 Q4", rate: 32.5 },
  { q: "2025 Q1", rate: 32.9 },
  { q: "2025 Q2", rate: 33.2 },
];

export function Unemployment() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold md:text-3xl">South African Youth Unemployment – 2025</h2>
        <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="q" />
                <YAxis domain={[30, 35]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v:number) => `${v}%`} />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 3 }} isAnimationActive />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            South Africa continues to face one of the highest unemployment rates globally, with the official jobless rate hitting 33.2 percent in the second quarter of 2025—up from 32.9 percent in the prior quarter. Under the expanded definition, which includes discouraged job seekers, the rate remains above 42 percent. This backdrop underscores the urgency of platforms like GradGate that empower job seekers through meaningful connections and guidance.
          </p>
        </div>
      </div>
    </section>
  );
}
