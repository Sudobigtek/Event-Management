import type { FC } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { LogOut, UserCircle } from "lucide-react";
import type { AuthUser } from "../../types/auth";

export const Header: FC = () => {
  const { user, signOut } = useAuth();
  const authUser = user as AuthUser;

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-600">
            <UserCircle className="h-5 w-5 mr-2" />
            <span>{authUser?.email}</span>
          </div>
          <Button
            onClick={() => signOut()}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};
