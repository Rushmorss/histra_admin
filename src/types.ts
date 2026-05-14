export type NavItem = "dashboard" | "users" | "content" | "analytics" | "settings" | "culinary";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Pathfinder" | "Explorer";
  status: "Active" | "Pending Expert" | "Suspended";
  joinedDate: string;
  avatar?: string;
}

export interface ModerationItem {
  id: string;
  author: string;
  authorAvatar?: string;
  type: "Trail Update" | "Heritage Entry" | "Review";
  title: string;
  content: string;
  submittedAt: string;
  image?: string;
  tags?: string[];
  rating?: number;
  location?: string;
  aiSuggestion?: string;
}
