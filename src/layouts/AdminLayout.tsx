import * as React from "react";
import { Header, Sidebar } from "../components/admin";
import type { AdminLayoutProps } from "../types/layouts";

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  showHeader = true,
  showSidebar = true,
}) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {showSidebar && <Sidebar />}
      <div className="flex-1">
        {showHeader && <Header />}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
