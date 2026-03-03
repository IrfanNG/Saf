"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { NextPrayer } from "@/lib/prayer-times";

interface HeroCountdownProps {
    nextPrayer: NextPrayer | null;
    loading: boolean;
}

export function HeroCountdown({ nextPrayer, loading }: HeroCountdownProps) {
    const isUrgent = nextPrayer && nextPrayer.remainingMs < 1800000; // < 30 min

    if (loading) {
        return (
            <Card className="border-border/50 bg-card overflow-hidden relative">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse mb-4" />
                    <div className="h-12 w-40 bg-zinc-800 rounded animate-pulse mb-2" />
                    <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
                </CardContent>
            </Card>
        );
    }

    if (!nextPrayer) return null;

    return (
        <Card className="border-border/50 bg-card overflow-hidden relative shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -ml-8 -mb-8" />
            <CardContent className="p-8 flex flex-col items-center justify-center text-center relative z-10">
                <p className="text-xs font-medium text-emerald-500 mb-3 uppercase tracking-[0.25em]">
                    Next Prayer
                </p>
                <motion.h2
                    className="text-5xl font-light tracking-tighter mb-1 font-mono tabular-nums"
                    animate={
                        isUrgent
                            ? {
                                scale: [1, 1.02, 1],
                                opacity: [1, 0.85, 1],
                            }
                            : {}
                    }
                    transition={
                        isUrgent
                            ? {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }
                            : {}
                    }
                >
                    {nextPrayer.remainingFormatted}
                </motion.h2>
                <p className="text-muted-foreground text-sm mt-1">
                    {nextPrayer.name}{" "}
                    <span className="text-zinc-600">· {nextPrayer.time}</span>
                </p>
            </CardContent>
        </Card>
    );
}
