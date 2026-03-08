"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Search, BookMarked, Star } from "lucide-react";
import Link from "next/link";
import { prayers, Prayer } from "@/data/prayers";
import { Card, CardContent } from "@/components/ui/card";
import { PrayerDrawer } from "@/components/pustaka-doa/prayer-drawer";

const categories = ["Doa Harian", "Doa Ramadan", "Doa Selepas Solat", "Kesejahteraan", "Zikir", "Favorites"] as const;
type CategoryType = (typeof categories)[number];

export default function PustakaDoaPage() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>("Doa Harian");
    const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("saf_prayer_favorites");
        if (saved) setFavorites(JSON.parse(saved));
    }, []);

    const toggleFavorite = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newFavs = favorites.includes(id)
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];
        setFavorites(newFavs);
        localStorage.setItem("saf_prayer_favorites", JSON.stringify(newFavs));
    };

    const filteredPrayers = useMemo(() => {
        let base = prayers;
        if (selectedCategory === "Favorites") {
            base = prayers.filter(p => favorites.includes(p.id));
        } else {
            base = prayers.filter(p => p.category === selectedCategory);
        }

        const query = searchQuery.trim().toLowerCase();
        if (!query) return base;

        return base.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.transliteration.toLowerCase().includes(query)
        );
    }, [selectedCategory, searchQuery, favorites]);

    const handlePrayerClick = (prayer: Prayer) => {
        setSelectedPrayer(prayer);
        setDrawerOpen(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col min-h-screen bg-[#FBFBFB]"
        >
            {/* Header section */}
            <div className="bg-white px-5 pt-12 pb-6 border-b border-[#E8ECE9]/30 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/" className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/[0.03] text-[#1A2420] active:bg-gray-100 transition-colors touch-manipulation">
                        <ChevronLeft size={22} className="text-[#1A2B22]" strokeWidth={2.5} />
                    </Link>
                    <h1 className="text-[1.5rem] font-bold text-[#1A2B22] font-sans tracking-tight">
                        Doa's Library
                    </h1>
                </div>

                <p className="text-[13px] text-[#5A655F] font-medium leading-relaxed mb-6 px-1">
                    Find situational prayers and daily zikir for your spiritual journey.
                </p>

                <div className="flex gap-2">
                    <div className="flex-1 h-11 bg-[#F4F4F6] rounded-xl flex items-center px-4 gap-3 border border-[#E8ECE9]/50 shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-[#4D6A53]/20 transition-all">
                        <Search size={16} className="text-[#9AA5AB]" strokeWidth={2.5} />
                        <input
                            placeholder="Search prayers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-[13px] font-medium text-[#1A2420] placeholder:text-[#9AA5AB] w-full"
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
                            className={`px-5 py-2.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all duration-300 border flex items-center gap-1.5 ${selectedCategory === cat
                                ? "bg-[#4D6A53] text-white border-[#4D6A53] shadow-lg shadow-green-900/10"
                                : "bg-white text-[#5A655F] border-[#E8ECE9] hover:bg-[#F8F9F8] shadow-sm"
                                }`}
                        >
                            {cat === "Favorites" && <Star size={12} className={selectedCategory === "Favorites" ? "fill-white" : "fill-[#9AA5AB] text-[#9AA5AB]"} />}
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Prayer list display */}
            <div className="px-5 flex-1 pb-10">
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
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[14px] font-bold text-[#1A2B22] group-hover:text-[#4D6A53] transition-colors truncate">
                                                {prayer.title}
                                            </h3>
                                            <p className="text-[10px] font-bold text-[#9AA5AB] uppercase tracking-wide mt-1">
                                                {prayer.category}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => toggleFavorite(e, prayer.id)}
                                            className={`p-2 rounded-full transition-colors ${favorites.includes(prayer.id) ? "bg-amber-50" : "hover:bg-gray-100"}`}
                                        >
                                            <Star
                                                size={18}
                                                className={favorites.includes(prayer.id) ? "fill-amber-400 text-amber-400" : "text-[#C8C4BE]"}
                                                strokeWidth={2.5}
                                            />
                                        </button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                            <BookMarked size={48} className="mx-auto mb-4" strokeWidth={1} />
                            <h3 className="text-[16px] font-bold text-[#1A2B20]">No Doa Found</h3>
                            <p className="text-[13px] font-medium">Try searching for something else or check your favorites.</p>
                        </div>
                    )}
                </div>
            </div>

            <PrayerDrawer
                prayer={selectedPrayer}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
            />
        </motion.div>
    );
}
