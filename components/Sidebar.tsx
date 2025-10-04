import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";

const Sidebar = () => {
    return (
        <section className="top-0 header bg-slate-700 rounded-3xl px-10 py-5">
            <div className="container header-wrapper">
                <Link href="/">
                    <Image src="/assets/logo.svg" alt="Signalist logo" width={140} height={32} className="h-8 w-auto cursor-pointer" />
                </Link>
                <nav className="hidden sm:block">
                    <NavItems />
                </nav>
                {/* UserDropdown */}
            </div>
        </section>
    )
}
export default Sidebar