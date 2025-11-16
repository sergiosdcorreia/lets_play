import React, { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Layout em grid com sidebar fixa */}
      <div className="flex">
        {/* Sidebar - fixa à esquerda */}
        <aside className="w-64 min-h-screen bg-slate-700 sticky top-0">
          <Sidebar />
        </aside>

        {/* Main content area */}
        <div className="flex-1">
          {/* Header */}
          <Header />

          {/* Page content */}
          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
