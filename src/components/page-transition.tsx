"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const variants = {
        initial: {
            opacity: 0,
            y: 8,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2,
                ease: [0.33, 1, 0.68, 1] as any
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.1
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full flex flex-col"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
