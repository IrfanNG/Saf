"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Search, Filter, BookOpen, BookMarked, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { prayers, Prayer, tahlilSteps } from "@/data/prayers";
import { Card, CardContent } from "@/components/ui/card";
import { PrayerDrawer } from "@/components/pustaka-doa/prayer-drawer";
import { TahlilCarousel } from "@/components/pustaka-doa/tahlil-carousel";

const categories = ["Doa Harian", "Tahlil", "Doa Ramadan"] as const;
type CategoryType = (typeof categories)[number];

export default function PustakaDoaPage() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>("Doa Harian");
    const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isTahlilActive, setIsTahlilActive] = useState(false);

    const filteredPrayers = prayers.filter(p => p.category === selectedCategory);

    const handlePrayerClick = (prayer: Prayer) => {
        setSelectedPrayer(prayer);
        setDrawerOpen(true);
    };

    if (isTahlilActive) {
        return <TahlilCarousel steps={tahlilSteps} onBack={() => setIsTahlilActive(false)} />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col min-h-screen bg-[#FBFBFB]"
        >
            {/* Header section with white background for light theme */}
            <div className="bg-white px-5 pt-12 pb-6 border-b border-[#E8ECE9]/30 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-50 bg-[#EEE9DF]/30">
                        <ChevronLeft size={22} className="text-[#1A2B22]" strokeWidth={2.5} />
                    </Link>
                    <h1 className="text-[1.5rem] font-bold text-[#1A2B22] font-sans tracking-tight">
                        Pustaka Doa
                    </h1>
                </div>

                {/* Subtitle / Description */}
                <p className="text-[13px] text-[#5A655F] font-medium leading-relaxed mb-6 px-1">
                    Find and learn everyday prayers for your spiritual journey.
                </p>

                {/* Search / Filter row */}
                <div className="flex gap-2">
                    <div className="flex-1 h-11 bg-[#F4F4F6] rounded-xl flex items-center px-4 gap-3 border border-[#E8ECE9]/50 shadow-inner">
                        <Search size={16} className="text-[#9AA5AB]" strokeWidth={2.5} />
                        <input
                            placeholder="Search prayers..."
                            className="bg-transparent border-none outline-none text-[13px] font-medium text-[#1A2B22] placeholder:text-[#9AA5AB] w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Category selection */}
            <div className="px-5 py-6">
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all duration-300 border ${selectedCategory === cat
                                ? "bg-[#4D6A53] text-white border-[#4D6A53] shadow-lg shadow-green-900/10"
                                : "bg-white text-[#5A655F] border-[#E8ECE9] hover:bg-[#F8F9F8] shadow-sm"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Prayer list display */}
            <div className="px-5 flex-1 pb-10">
                {selectedCategory === "Tahlil" ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card
                            onClick={() => setIsTahlilActive(true)}
                            className="group relative overflow-hidden bg-white rounded-3xl border-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer p-0"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EEE9DF] rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-[#4D6A53] flex items-center justify-center shadow-lg shadow-green-900/10 group-hover:scale-105 transition-transform duration-300">
                                        <BookOpen size={24} className="text-white" strokeWidth={2} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-[#4D6A53] uppercase tracking-[0.14em] mb-1">
                                            Interactive Series
                                        </p>
                                        <h3 className="text-[1.3rem] font-bold text-[#1A2B22] font-sans leading-tight">
                                            Tahlil & Doa Selamat
                                        </h3>
                                        <p className="text-[12px] text-[#5A655F] mt-1 font-medium">
                                            Follow step-by-step interactive carousel
                                        </p>
                                    </div>
                                    <ArrowRight size={20} className="text-[#9AA5AB] group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {filteredPrayers.length > 0 ? (
                            filteredPrayers.map((prayer, i) => (
                                <motion.div
                                    key={prayer.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card
                                        onClick={() => handlePrayerClick(prayer)}
                                        className="group bg-white rounded-2xl border-none shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all cursor-pointer overflow-hidden p-0"
                                    >
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-[#F8F9F8] flex items-center justify-center group-hover:bg-[#EEE9DF] transition-colors border border-[#E8ECE9]/50">
                                                <BookMarked size={20} className="text-[#4D6A53]" strokeWidth={2} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-[14px] font-bold text-[#1A2B22] group-hover:text-[#4D6A53] transition-colors">
                                                    {prayer.title}
                                                </h3>
                                                <div className="flex items-center gap-1.5 mt-1 opacity-60">
                                                    <Star size={10} className="text-[#4D6A53] fill-[#4D6A53]" />
                                                    <span className="text-[10px] font-bold text-[#5A655F] uppercase tracking-wide">
                                                        Daily Essential
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-1 px-3 bg-[#F4F4F6] rounded-full text-[10px] font-bold text-[#9AA5AB] group-hover:bg-[#4D6A53] group-hover:text-white transition-all">
                                                OPEN
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20 opacity-30">
                                <BookOpen size={48} className="mx-auto mb-4" />
                                <p className="text-[14px] font-medium">Coming soon In Sha Allah</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <PrayerDrawer
                prayer={selectedPrayer}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
            />
        </motion.div>
    );
}
