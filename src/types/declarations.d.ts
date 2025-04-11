declare module "lucide-react" {
  import { FC, SVGProps } from "react";
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }
  export type Icon = FC<IconProps>;

  export const Home: Icon;
  export const CalendarDays: Icon;
  export const Users: Icon;
  export const Award: Icon;
  export const Settings: Icon;
  export const LogOut: Icon;
  export const UserCircle: Icon;
  export const User: Icon;
}

declare module "@supabase/supabase-js" {
  export interface User {
    id: string;
    email?: string;
    role?: string;
    [key: string]: any;
  }

  export interface Session {
    user: User;
    [key: string]: any;
  }
}

declare module "react-router-dom" {
  import { ComponentType, ReactNode } from "react";

  export interface LinkProps {
    to: string;
    className?: string | ((props: { isActive: boolean }) => string);
    children?: ReactNode;
  }

  export interface RoutesProps {
    children?: ReactNode;
  }

  export const NavLink: ComponentType<LinkProps>;
  export const Routes: ComponentType<RoutesProps>;
  export const Route: ComponentType<{
    path?: string;
    element?: ReactNode;
    index?: boolean;
  }>;
  export const Navigate: ComponentType<{
    to: string;
    replace?: boolean;
  }>;
}
