"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Moon } from "lucide-react";
import { formatRemaining } from "@/lib/prayer-times";

interface QiyamTimerProps {
    qiyamTime: string; // "HH:MM"
    fajrTime?: string; // "HH:MM" — Subuh time
    loading: boolean;
}

function getQiyamMs(qiyamTime: string): number {
    const [h, m] = qiyamTime.split(":").map(Number);
    return h * 3600000 + m * 60000;
}

function getNowMs(): number {
    const now = new Date();
    return (
        now.getHours() * 3600000 +
        now.getMinutes() * 60000 +
        now.getSeconds() * 1000
    );
}

export function QiyamTimer({ qiyamTime, fajrTime, loading }: QiyamTimerProps) {
    const [remaining, setRemaining] = useState<string>("--:--:--");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const tick = () => {
            const nowMs = getNowMs();
            const qiyamMs = getQiyamMs(qiyamTime);
            const fajrMs = fajrTime ? getQiyamMs(fajrTime) : qiyamMs + 5400000;

            // Case 1: Active Now (between Qiyam and Fajr/Subuh)
            if (nowMs >= qiyamMs && nowMs < fajrMs) {
                setIsActive(true);
                setRemaining("Active Now");
                return;
            }

            // Case 2: Countdown (either later today or tomorrow morning)
            setIsActive(false);
            let diff = qiyamMs - nowMs;
            // If qiyam is in the past (e.g., it's 8 AM now and qiyam was 3:30 AM), 
            // the countdown is for tomorrow (add 24h)
            if (diff < 0) {
                diff += 86400000;
            }
            setRemaining(formatRemaining(diff));
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [qiyamTime, fajrTime]);

    if (loading) return null;

    return (
        <Card
            className={`border-border/50 bg-card overflow-hidden relative transition-shadow duration-700 ${isActive
                ? "shadow-[0_0_20px_rgba(16,185,129,0.25)] border-emerald-500/40"
                : "shadow-sm"
                }`}
        >
            {isActive && (
                <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-emerald-500/30"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            )}
            <CardContent className="p-5 flex items-center gap-4 relative z-10">
                <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isActive
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-zinc-900 text-zinc-400"
                        }`}
                >
                    <Moon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-emerald-500 uppercase tracking-widest mb-0.5">
                        Qiyamullail
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {isActive ? (
                            <span className="text-emerald-400 font-medium">Active Now — Pray tahajjud</span>
                        ) : (
                            <>Starts at {qiyamTime} AM</>
                        )}
                    </p>
                </div>
                <div className="text-right shrink-0">
                    {!isActive && (
                        <p className="text-lg font-mono tabular-nums text-foreground">
                            {remaining}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
