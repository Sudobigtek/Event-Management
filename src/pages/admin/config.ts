import { Home, CalendarDays, Users, Award, Settings } from "lucide-react";

export interface AdminRoute {
  path: string;
  label: string;
  icon: typeof Home;
  requiredRole?: "admin" | "super_admin";
}

export const adminRoutes: AdminRoute[] = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    path: "/admin/events",
    label: "Events",
    icon: CalendarDays,
  },
  {
    path: "/admin/users",
    label: "Users",
    icon: Users,
    requiredRole: "admin",
  },
  {
    path: "/admin/awards",
    label: "Awards",
    icon: Award,
  },
  {
    path: "/admin/settings",
    label: "Settings",
    icon: Settings,
    requiredRole: "super_admin",
  },
];
