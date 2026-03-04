"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!loading && !showSplash) {
            if (!user && pathname !== "/login") {
                router.push("/login");
            } else if (user && pathname === "/login") {
                router.push("/");
            }
        }
    }, [user, loading, router, pathname, showSplash]);

    return (
        <>
            <AnimatePresence>
                {(loading || showSplash) && (
                    <motion.div
                        key="splash"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="flex flex-col items-center space-y-4 text-[#4D6A53]"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1,
                                    duration: 1.5
                                }}
                            >
                                <Leaf className="w-16 h-16 text-[#4D6A53]" />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="text-5xl font-bold tracking-tight text-[#4D6A53] mb-2"
                            >
                                Saf
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.9 }}
                                className="text-[#4D6A53]/80 font-medium text-lg tracking-wide"
                            >
                                Your daily companion
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.4 }}
                            className="absolute bottom-16 flex flex-col items-center"
                        >
                            <div className="w-6 h-6 border-4 border-[#4D6A53] border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Render */}
            {(!user && pathname !== "/login") ? null : (
                <div className={(loading || showSplash) ? "hidden" : "block"}>
                    {children}
                </div>
            )}
        </>
    );
}
