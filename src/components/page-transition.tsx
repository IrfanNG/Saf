"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [prevPath, setPrevPath] = useState<string | null>(null);

    const isFromLogin = prevPath === "/login" && pathname === "/";

    useEffect(() => {
        setPrevPath(pathname);
    }, [pathname]);

    const variants = {
        initial: (isFromLogin: boolean) => ({
            opacity: 0,
            y: isFromLogin ? 40 : 15,
            scale: isFromLogin ? 0.95 : 1,
            filter: "blur(8px)"
        }),
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)"
        },
        exit: {
            opacity: 0,
            y: -15,
            scale: 0.98,
            filter: "blur(4px)"
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                custom={isFromLogin}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: isFromLogin ? 22 : 30 }}
                className="w-full h-full flex flex-col"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
