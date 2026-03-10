"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const variants = {
        initial: {
            opacity: 0,
            x: 20,
            scale: 0.98,
        },
        animate: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.45,
                ease: [0.32, 0.72, 0, 1] as any // iOS signature easing
            }
        },
        exit: {
            opacity: 0,
            x: -20,
            scale: 1.02,
            transition: {
                duration: 0.3,
                ease: [0.32, 0, 0.67, 0] as any
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
