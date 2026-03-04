"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDetailsPage = pathname.startsWith("/community/") && pathname !== "/community";
    const hideNav = ["/login", "/register", "/pustaka-doa", "/profile/personal-info", "/profile/theme"].includes(pathname) || isDetailsPage;

    return (
        <div className={`mx-auto max-w-md min-h-screen relative overflow-x-clip ${hideNav ? "" : "pb-24"} touch-pan-y shadow-2xl bg-[#F5F2EA]`}>
            {children}
            {!hideNav && <BottomNav />}
        </div>
    );
}
