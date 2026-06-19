import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, History, LayoutGrid, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="border-b border-ink-border bg-ink/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="font-display text-lg tracking-tight text-paper">
          Praxis
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive("/dashboard") ? "text-paper bg-ink-raised" : "text-paper-muted hover:text-paper"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            to="/history"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive("/history") ? "text-paper bg-ink-raised" : "text-paper-muted hover:text-paper"
            }`}
          >
            <History className="w-4 h-4" />
            History
          </Link>
          {user.role === "admin" && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive("/admin") ? "text-paper bg-ink-raised" : "text-paper-muted hover:text-paper"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-paper-muted hidden sm:inline">{user.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-paper-muted hover:text-bad transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
