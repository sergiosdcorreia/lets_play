"use client";

import { UserMenu } from "@/components/UserMenu";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

const Header = () => {
  return (
    <header className="sticky top-0 z-10">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-400">Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />

          {/* User Menu Dropdown */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
