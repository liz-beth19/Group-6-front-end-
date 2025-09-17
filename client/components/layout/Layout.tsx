import { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/context/AuthContext";
import { useAdminAuth } from "@/context/AdminAuthContext";

export function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { admin } = useAdminAuth();
  const loggedIn = !!(user || admin);
  return (
    <div className="min-h-screen flex flex-col">
      {!loggedIn && <SiteHeader />}
      {loggedIn && <UserMenu />}
      <main className="flex-1">{children}</main>
      {!loggedIn && <SiteFooter />}
    </div>
  );
}
