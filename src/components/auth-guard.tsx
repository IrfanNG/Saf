"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { SafLogo } from "@/components/saf-logo";

// Global variable to ensure splash only shows once per total app session in memory
let hasShownBrandingThisSession = false;

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [showBranding, setShowBranding] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Check session storage to persist across refreshes
        const hasShown = sessionStorage.getItem("saf_splash_shown");

        if (!hasShown && !hasShownBrandingThisSession) {
            setShowBranding(true);
            const timer = setTimeout(() => {
                setShowBranding(false);
                sessionStorage.setItem("saf_splash_shown", "true");
                hasShownBrandingThisSession = true;
            }, 2400); // 2.4s branding
            return () => clearTimeout(timer);
        } else {
            hasShownBrandingThisSession = true;
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        // Guard logic: Redirect only when we are sure about auth state AND branding is done
        if (!loading && !showBranding) {
            if (!user && pathname !== "/login") {
                router.push("/login");
            } else if (user && pathname === "/login") {
                router.push("/");
            }
        }
    }, [user, loading, router, pathname, showBranding]);

    // Determine if we should show the full-screen overlay
    // Condition 1: We are showing the branding (logo, text)
    // Condition 2: IT IS THE VERY FIRST MOUNT and we are still loading (loading=true && hasShownBrandingThisSession=false)
    const isShowingOverlay = showBranding || (loading && !hasShownBrandingThisSession);

    return (
        <>
            <AnimatePresence>
                {isShowingOverlay && (
                    <motion.div
                        key="master-splash"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6"
                    >
                        {showBranding && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="flex flex-col items-center space-y-4 text-[#4D6A53]"
                            >
                                <SafLogo size={84} className="drop-shadow-md" />
                                <h1 className="text-5xl font-bold tracking-tight">Saf</h1>
                                <p className="text-[#4D6A53]/80 font-medium text-lg">Your daily companion</p>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: showBranding ? 1.4 : 0 }}
                            className={`${showBranding ? "absolute bottom-16" : "relative"} flex flex-col items-center`}
                        >
                            <div className="w-6 h-6 border-4 border-[#4D6A53] border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 
                During navigation, we keep children visible at ALL times unless:
                1. We are doing the initial branding splash (first visit)
                2. We are logged out and need a redirect handled by the useEffect above
            */}
            <div className={showBranding ? "hidden" : "block"}>
                {children}
            </div>
        </>
    );
}
