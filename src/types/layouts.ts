import type { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface AdminLayoutProps extends LayoutProps {
  showHeader?: boolean;
  showSidebar?: boolean;
}
