"use client";

import { UserMenu } from "@/components/UserMenu";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-10">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-400">Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-300" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu Dropdown */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
