import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold md:text-3xl">Profile & Settings</h1>
        <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold">Full Name</div>
          <div className="mt-1 text-lg font-bold text-primary">
            {user?.name && user?.surname ? `${user.name} ${user.surname}` : user?.fullName || user?.username || "Student"}
          </div>
        </div>
      </div>
    </section>
  );
}
