import { 
  LayoutDashboard, 
  Users, 
  Map, 
  BarChart3, 
  Settings, 
  Plus, 
  UtensilsCrossed 
} from "lucide-react";
import { NavItem } from "../types";
import { cn } from "../lib/utils";

interface SidebarProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "users" as const, label: "Users", icon: Users },
    { id: "content" as const, label: "Content", icon: Map },
    { id: "culinary" as const, label: "Culinary", icon: UtensilsCrossed },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <nav className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col p-4 gap-2 z-50">
      <div className="px-4 py-6 mb-4 flex flex-col gap-1">
        <div className="font-headline text-2xl font-black text-primary tracking-tight">HISTRA ADMIN</div>
        <div className="text-[10px] text-on-surface-variant font-label tracking-widest uppercase font-bold opacity-70">
          The Modern Pathfinder
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              activeTab === item.id
                ? "bg-secondary-container/30 text-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id && "fill-current/10")} />
            <span className="font-label text-sm font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
