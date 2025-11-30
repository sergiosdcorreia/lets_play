import React, { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen">
      <Image
        src="/assets/bg.jpg"
        alt="Background"
        fill
        quality={100}
        priority
        className="object-cover -z-10 opacity-20"
      />
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 flex flex-col">
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
