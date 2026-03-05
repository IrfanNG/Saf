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
            className={`bg-[#5A413A] border-none text-white overflow-hidden relative transition-shadow duration-700 rounded-[1.25rem] ${isActive
                ? "shadow-[0_0_20px_rgba(209,165,79,0.25)] border-[#D1A54F]"
                : "shadow-md"
                }`}
        >
            {isActive && (
                <motion.div
                    className="absolute inset-0 rounded-[1.25rem] border border-[#D1A54F]"
                    animate={{ opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            )}
            <CardContent className="px-5 py-[0.85rem] flex items-center justify-between gap-3.5 relative z-10">
                <div className="flex items-center gap-3.5">
                    <div
                        className={`h-[2.6rem] w-[2.6rem] rounded-xl flex items-center justify-center shrink-0 ${isActive
                            ? "bg-[#D4B84F]/20 text-[#D4B84F]"
                            : "bg-[#6A4D42] text-[#D4B84F]"
                            }`}
                    >
                        <Moon size={18} className={isActive ? "fill-current" : "fill-current"} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center translate-y-[-1px]">
                        <p className="text-[15px] sm:text-[16px] text-white font-medium leading-[1.1] tracking-wide mb-[3px]">
                            Qiyamullail<br />Starts
                        </p>
                        <p className="text-[10.5px] text-white/60 leading-[1.15]">
                            {isActive ? (
                                <span className="text-[#D4B84F] font-bold">Time for Tahajjud</span>
                            ) : (
                                <>Prepare for<br />Tahajjud prayers</>
                            )}
                        </p>
                    </div>
                </div>
                <div className="shrink-0 pl-1">
                    {!isActive && (
                        <div className="bg-[#6E554C] px-3.5 py-[0.35rem] rounded-[0.8rem] text-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] border border-white/5">
                            <p className="text-[13px] font-sans font-bold tabular-nums text-white tracking-[0.1em]">
                                {remaining}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
