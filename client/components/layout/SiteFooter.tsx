import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/20 bg-[#0f0b1a] text-white/80">
      <div className="h-[2px] w-full bg-primary/40" />
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="text-xl font-extrabold text-white">GradGate</div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Discover programs, streamline applications, and unlock your future.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/login" className="hover:text-primary">Login</Link></li>
            <li><Link to="/register" className="hover:text-primary">Register</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><a href="#team" className="hover:text-foreground">Team</a></li>
            <li><a href="#partners" className="hover:text-foreground">Partners</a></li>
            <li><a href="#features" className="hover:text-foreground">Features</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><a href="mailto:info@gradgate.com" className="hover:text-primary">info@gradgate.com</a></li>
            <li><span className="hover:text-primary">+27 10 730 0860</span></li>
          </ul>
        </div>
      </div>
      <Separator />
      <div className="container mx-auto px-4 py-6 text-xs text-white/60 flex flex-col md:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} GradGate. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary">Privacy</a>
          <a href="#" className="hover:text-primary">Terms</a>
        </div>
      </div>
    </footer>
  );
}
