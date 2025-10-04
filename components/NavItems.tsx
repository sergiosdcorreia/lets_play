"use client"

import {NAV_ITEMS} from "@/lib/constants";
import Link from "next/link";
import {usePathname} from "next/navigation";

const NavItems = () => {
    const pathname = usePathname();
    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';

        return pathname.startsWith(path);
    }

    return (
        <ul className="mt-10 gap-3 sm:gap-10 font-medium">
            {NAV_ITEMS.map(({ href, label}) => (
                <li key={href} className="px-6 py-4">
                    <Link href={href} className={`hover:text-yellow-500 transition-colors ${isActive(href) ? 'text-gray-100' : ''}`}>
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
export default NavItems
