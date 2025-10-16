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
      <section className="auth-left-section">
        <Link href="/" className="auth-logo">
          <Image
            src="/assets/logo.svg"
            alt="LetsPlay logo"
            width={140}
            height={32}
            className="h-8 w-auto"
          />
        </Link>

        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
      </section>
    </main>
  );
};

export default Layout;
