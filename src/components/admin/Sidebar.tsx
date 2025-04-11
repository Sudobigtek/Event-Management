import type { FC } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { adminRoutes } from "../../pages/admin/config";
import { cn } from "../../lib/utils";
import type { AuthUser } from "../../types/auth";

interface NavLinkClassNameProps {
  isActive: boolean;
}

export const Sidebar: FC = () => {
  const { user } = useAuth();
  const authUser = user as AuthUser;
  const userRole = authUser?.role;

  const hasAccess = (requiredRole?: string) => {
    if (!requiredRole) return true;
    if (!userRole) return false;
    if (requiredRole === "admin")
      return ["admin", "super_admin"].includes(userRole);
    return userRole === requiredRole;
  };

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {adminRoutes.map(
          ({ path, label, icon: Icon, requiredRole }) =>
            hasAccess(requiredRole) && (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }: NavLinkClassNameProps) =>
                  cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    "hover:bg-gray-700",
                    isActive ? "bg-gray-700 text-white" : "text-gray-300"
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            )
        )}
      </nav>
    </aside>
  );
};
