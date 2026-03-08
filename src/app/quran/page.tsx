"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { ChevronRight, Search, BookOpen, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.05 },
    },
};

const item = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 320, damping: 26 },
    },
};

export default function QuranScreen() {
    const router = useRouter();
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchSurahs() {
            try {
                setLoading(true);
                const res = await fetch("https://api.alquran.cloud/v1/surah");
                if (!res.ok) throw new Error("Network response was not ok");
                const data = await res.json();
                if (data.status === "OK" && isMounted) {
                    setSurahs(data.data);
                } else if (isMounted) {
                    throw new Error(data.message || "Failed to load data");
                }
            } catch (error: any) {
                console.error("Failed to fetch surahs:", error);
                if (isMounted) setError(error.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchSurahs();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredSurahs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return surahs;

        return surahs.filter(s =>
            s.englishName.toLowerCase().includes(query) ||
            s.englishNameTranslation.toLowerCase().includes(query) ||
            s.name.includes(query)
        );
    }, [searchQuery, surahs]);

    return (
        <div className="flex flex-col pb-6 bg-gray-50 min-h-screen font-sans">
            {/* Header Section */}
            <div className="px-5 pt-12 pb-4 sticky top-0 bg-gray-50/95 backdrop-blur-md z-30 border-b border-black/[0.03]">
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href="/"
                        className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/[0.03] text-[#1A2420] active:bg-gray-100 transition-colors"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </Link>

                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[1.75rem] font-bold text-[#1A2420] font-sans leading-tight tracking-tight"
                    >
                        Al-Quran
                    </motion.h1>

                    <div className="w-11 opacity-0" /> {/* Spacer for centering */}
                </div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative"
                >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-[#9AA5AB]" strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari Surah..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-black/[0.05] rounded-2xl py-3.5 pl-11 pr-4 text-[14px] font-semibold text-[#1A2420] placeholder:text-[#9AA5AB] focus:outline-none focus:ring-2 focus:ring-[#4D6A53]/30 shadow-sm transition-all"
                    />
                </motion.div>
            </div>

            {/* List Section */}
            <div className="px-5 mt-4">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-24 gap-3">
                        <Loader2 className="animate-spin text-[#4D6A53] w-10 h-10" />
                        <p className="text-[13px] font-bold text-[#4D6A53] animate-pulse">Memuatkan Surah...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <BookOpen size={32} className="text-red-400" />
                        </div>
                        <h3 className="text-[16px] font-bold text-[#1A2420] font-sans mb-1">Failed to load</h3>
                        <p className="text-[13px] font-medium text-[#9AA5AB] font-sans px-8">
                            {error}. Please check your connection and try again.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-2 bg-[#4D6A53] text-white rounded-xl font-bold text-[14px] shadow-md"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredSurahs.length > 0 ? (
                    <motion.div
                        key={searchQuery === "" ? "all" : "filtered"}
                        className="flex flex-col gap-3 pb-8"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {filteredSurahs.map((surah) => (
                            <motion.div variants={item} key={surah.number}>
                                <Link
                                    href={`/quran/${surah.number}`}
                                    className="bg-white rounded-[1.25rem] p-4 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)] active:bg-gray-50 transition-colors border border-black/[0.01] touch-manipulation"
                                >
                                    {/* Number / Icon */}
                                    <div className="h-14 w-14 rounded-xl bg-[#F0EDE7] flex flex-col items-center justify-center shrink-0 border border-[#E8E3DB]">
                                        <span className="text-[13px] font-bold text-[#4D6A53] font-sans">{surah.number}</span>
                                    </div>

                                    {/* Surah Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="text-[15px] font-bold text-[#1A2420] font-sans leading-snug">
                                                {surah.englishName}
                                            </h3>
                                            <span className="text-[18px] font-bold text-[#4D6A53] leading-none text-right">
                                                {surah.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[11px] font-bold text-[#9AA5AB] uppercase tracking-[0.05em]">
                                                {surah.revelationType === "Meccan" ? "Makkiyah" : "Madaniyah"}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-[#E8E3DB]" />
                                            <span className="text-[11px] font-bold text-[#9AA5AB] uppercase tracking-[0.05em]">
                                                {surah.numberOfAyahs} Ayat
                                            </span>
                                        </div>
                                    </div>

                                    <ChevronRight size={18} className="text-[#C8C4BE] shrink-0" strokeWidth={2.5} />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <BookOpen size={48} className="text-[#C8C4BE] mb-4" strokeWidth={1} />
                        <h3 className="text-[16px] font-bold text-[#1A2420] font-sans mb-1">No Surah found</h3>
                        <p className="text-[13px] font-medium text-[#9AA5AB] font-sans">
                            Try adjusting your search criteria
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
}
