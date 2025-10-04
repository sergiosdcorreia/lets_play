import React, {ReactNode} from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Layout:({children}: {children: ReactNode}) => React.JSX.Element = ({children}: {children: React.ReactNode}) => {
    return (
        <main className="min-h-screen text-gray-400">
            <div className="container flex">
                <div className="p-10">
                    <Sidebar />
                </div>
                <div className="p-10">
                    <Header />
                    <div className="my-10">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Layout;