import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "../../layouts/AdminLayout";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { AdminDashboard } from "./Dashboard";
import { adminRoutes } from "./config";
import { useAuth } from "../../hooks/useAuth";
import type { AuthUser } from "../../types/auth";

export const AdminRoutes: React.FC = () => {
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
    <Routes>
      {adminRoutes.map(({ path, requiredRole }) => (
        <Route
          key={path}
          path={path.replace("/admin/", "")}
          element={
            <ProtectedRoute>
              <AdminLayout>
                {hasAccess(requiredRole) ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )}
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      ))}
      <Route index element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};
