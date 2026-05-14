import { Search, Bell, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-64 h-16 glass z-40 px-8 flex justify-between items-center shadow-sm border-b border-outline-variant/10">
      <div className="flex-1 max-w-md relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant/60 group-focus-within:text-primary transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <input 
          type="text" 
          placeholder="Search entries, users, analytics..." 
          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full py-2 pl-10 pr-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-on-surface-variant/40"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface animate-pulse" />
          </button>
        </div>
        
        <div className="w-px h-6 bg-outline-variant/30 mx-2" />
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-on-surface leading-tight">{user?.fullName || user?.username}</p>
            <p className="text-[10px] font-label font-black text-on-surface-variant uppercase tracking-widest opacity-60">Administrator</p>
          </div>
          <img 
            src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || user?.username || 'Admin')}&background=6366f1&color=fff`} 
            alt="Profile" 
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 cursor-pointer hover:ring-primary/40 transition-all"
          />
          <button 
            onClick={logout}
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-full transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
