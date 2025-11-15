"use client";

import { useAuthStore } from "@/store/authStore";

const Header = () => {
  const { user } = useAuthStore();
  return (
    <header className="header bg-slate-600 py-5 px-10 rounded-3xl">
      <div className="container">{user?.name}</div>
    </header>
  );
};
export default Header;
