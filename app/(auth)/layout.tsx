import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

const Layout: ({ children }: { children: ReactNode }) => React.JSX.Element = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="auth-layout">
      <Image
        src="/assets/bg.jpg"
        alt="Background"
        fill
        quality={100}
        priority
        className="object-cover -z-10 opacity-20"
      />
      <section>{children}</section>
    </main>
  );
};

export default Layout;
