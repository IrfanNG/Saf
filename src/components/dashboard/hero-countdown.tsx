"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { NextPrayer, PrayerTimings } from "@/lib/prayer-times";
import { useState, useEffect } from "react";

interface HeroCountdownProps {
    nextPrayer: NextPrayer | null;
    loading: boolean;
    location?: { city: string, country?: string } | null;
    prayerTimes?: PrayerTimings | null;
}

export function HeroCountdown({ nextPrayer, loading, location, prayerTimes }: HeroCountdownProps) {
    const isUrgent = nextPrayer && nextPrayer.remainingMs < 1800000; // < 30 min

    if (loading) {
        return (
            <Card className="bg-[#4D6A53] border-none overflow-hidden relative shadow-md rounded-3xl">
                <CardContent className="p-6 flex flex-col h-48 justify-between">
                    <div className="flex justify-between items-start">
                        <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
                        <div className="h-6 w-24 bg-white/20 rounded-full animate-pulse" />
                    </div>
                    <div className="mt-4">
                        <div className="h-10 w-40 bg-white/20 rounded animate-pulse gap-2 mb-2" />
                        <div className="h-6 w-32 bg-white/20 rounded animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!nextPrayer || !prayerTimes) return null;

    const prayersList = [
        { key: "Fajr", label: "FAJR", time: prayerTimes.Fajr },
        { key: "Sunrise", label: "SUNRISE", time: prayerTimes.Sunrise },
        { key: "Dhuhr", label: "DHUHR", time: prayerTimes.Dhuhr },
        { key: "Asr", label: "ASR", time: prayerTimes.Asr },
        { key: "Maghrib", label: "MAGHRIB", time: prayerTimes.Maghrib },
    ];

    const [islamicDateStr, setIslamicDateStr] = useState<string>("");

    useEffect(() => {
        try {
            const date = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(new Date());
            setIslamicDateStr(date.replace(" AH", ""));
        } catch (e) {
            setIslamicDateStr("");
        }
    }, []);

    return (
        <Card className="bg-[#4D6A53] border-none overflow-hidden relative shadow-md rounded-3xl mt-2">
            <CardContent className="p-6 relative z-10 flex flex-col h-full gap-5">
                <div className="flex flex-col">
                    {/* Top Row */}
                    <div className="flex justify-between items-baseline mb-1">
                        <p className="text-[15px] font-medium text-white/80 tracking-wide">
                            Next Prayer
                        </p>
                        <p className="text-[#D4B84F] font-semibold text-[15px] tracking-wide">
                            In {nextPrayer.remainingFormatted.replace(/^0/, '')}
                        </p>
                    </div>

                    {/* Middle Row */}
                    <div className="flex justify-between items-start">
                        <motion.h2
                            className="text-[3.25rem] font-bold tracking-tight text-white leading-none font-serif mt-1"
                            animate={isUrgent ? { scale: [1, 1.02, 1] } : {}}
                            transition={isUrgent ? { duration: 2, repeat: Infinity } : {}}
                        >
                            {nextPrayer.name === "Subuh" ? "Fajr" : nextPrayer.name === "Zohor" ? "Dhuhr" : nextPrayer.name}
                        </motion.h2>
                        <p className="text-white/60 text-[11px] tracking-wide font-medium mt-1">
                            {islamicDateStr}
                        </p>
                    </div>
                </div>

                {/* Bottom Row - Prayer Times */}
                <div className="flex justify-between items-center mt-2 pt-5 border-t border-white/10">
                    {prayersList.map((p) => {
                        const isNext = (p.key === nextPrayer.name || (p.key === 'Fajr' && nextPrayer.name === 'Subuh') || (p.key === 'Dhuhr' && nextPrayer.name === 'Zohor'));
                        return (
                            <div key={p.key} className={`flex flex-col items-center px-3 py-2 rounded-xl border border-transparent transition-all ${isNext ? 'bg-[#5C7154] shadow-sm' : ''}`}>
                                <p className={`text-[10px] mb-1.5 tracking-widest font-semibold ${isNext ? 'text-[#D4B84F]' : 'text-white/50'}`}>
                                    {p.label}
                                </p>
                                <p className={`font-bold text-[13px] ${isNext ? 'text-white' : 'text-white'}`}>
                                    {p.time.split(" ")[0]}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
