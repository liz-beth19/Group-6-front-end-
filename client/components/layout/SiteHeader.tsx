import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAdminAuth } from "@/context/AdminAuthContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About Us" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, logout: userLogout } = useAuth();
  const { admin, logout: adminLogout } = useAdminAuth();

  const isLoggedIn = !!(user || admin);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-primary-foreground">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F7d31c179ca09481195e0fe9ffe5058f6%2Fc76d397d704c4839a0ba8969bc9c29dd?format=webp&width=96"
            alt="GradGate logo"
            className="h-9 w-9 rounded-md shadow-sm"
          />
          <span className="text-lg font-extrabold tracking-tight">GradGate</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            item.href === "/" ? (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-white",
                  "text-white/80",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-white",
                  "text-white/80",
                )}
              >
                {item.label}
              </a>
            )
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-sm font-medium">
                {admin ? `Admin: ${admin.username}` : `Logged in as: ${user?.username}`}
              </span>
              <Button
                variant="outline"
                className="text-primary bg-white hover:bg-white/90"
                onClick={() => (admin ? adminLogout() : userLogout())}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="shadow-sm transition-transform hover:scale-[1.02] bg-white text-primary border border-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-primary text-white">
          <div className="container px-4 py-3 flex flex-col gap-2">
            {navItems.map((item) => (
              item.href === "/" ? (
                <Link
                  key={item.href}
                  to={item.href}
                  className="py-2 text-white/90 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="py-2 text-white/90 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              )
            ))}
            <div className="flex gap-2 pt-2">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  className="flex-1 text-primary bg-white hover:bg-white/90"
                  onClick={() => { setOpen(false); admin ? adminLogout() : userLogout(); }}
                >
                  Log out
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" className="flex-1 text-white hover:bg-white/10" onClick={() => setOpen(false)}>
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild className="flex-1 transition-transform hover:scale-[1.02] bg-white text-primary border border-primary hover:bg-primary hover:text-primary-foreground" onClick={() => setOpen(false)}>
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
            {isLoggedIn && (
              <div className="pt-2 text-sm text-white/80">
                {admin ? `Admin: ${admin.username}` : `Logged in as: ${user?.username}`}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
