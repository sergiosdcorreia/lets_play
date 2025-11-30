import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import { Card } from "./ui/card";

const Sidebar = () => {
  return (
    <Card className="flex-1 m-5 rounded-3xl px-10 py-5 glassmorphism-card backdrop-blur-sm">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            src="/assets/logo.svg"
            alt="Signalist logo"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
        </Link>
        <nav className="hidden sm:block">
          <NavItems />
        </nav>
        {/* UserDropdown */}
      </div>
    </Card>
  );
};
export default Sidebar;
