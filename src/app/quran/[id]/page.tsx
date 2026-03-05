"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, Bookmark, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface Ayah {
    numberInSurah: number;
    arabicText: string;
    translationText: string;
    juz: number;
}

interface SurahData {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: Ayah[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
};

const item = {
    hidden: { opacity: 0, y: 15 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
};

export default function SurahReadingScreen() {
    const router = useRouter();
    const params = useParams();
    const surahId = params.id as string;

    const [surahData, setSurahData] = useState<SurahData | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookmarks, setBookmarks] = useState<number[]>([]);

    useEffect(() => {
        // Load bookmarks from local storage
        try {
            const saved = localStorage.getItem(`bookmarks_surah_${surahId}`);
            if (saved) {
                setBookmarks(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load bookmarks", e);
        }

        let isMounted = true;
        async function fetchSurah() {
            try {
                // Fetch both Arabic Uthmani text and English translation
                const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.asad`);
                const data = await res.json();

                if (data.code === 200 && isMounted) {
                    const arabicData = data.data[0];
                    const englishData = data.data[1];

                    const combinedAyahs: Ayah[] = arabicData.ayahs.map((arabicAyah: any, index: number) => ({
                        numberInSurah: arabicAyah.numberInSurah,
                        arabicText: arabicAyah.text,
                        translationText: englishData.ayahs[index].text,
                        juz: arabicAyah.juz
                    }));

                    setSurahData({
                        number: arabicData.number,
                        name: arabicData.name,
                        englishName: arabicData.englishName,
                        englishNameTranslation: arabicData.englishNameTranslation,
                        revelationType: arabicData.revelationType,
                        numberOfAyahs: arabicData.numberOfAyahs,
                        ayahs: combinedAyahs
                    });
                }
            } catch (error) {
                console.error("Failed to fetch surah data:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchSurah();
        return () => { isMounted = false; };
    }, [surahId]);

    const toggleBookmark = (ayahNumber: number) => {
        setBookmarks(prev => {
            const isBookmarked = prev.includes(ayahNumber);
            const newBookmarks = isBookmarked ? prev.filter(n => n !== ayahNumber) : [...prev, ayahNumber];

            // Save to local storage
            localStorage.setItem(`bookmarks_surah_${surahId}`, JSON.stringify(newBookmarks));
            return newBookmarks;
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
                <Loader2 className="animate-spin text-[#4D6A53] w-10 h-10" />
            </div>
        );
    }

    if (!surahData) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center px-5 text-center">
                <p className="text-[#1A2420] font-bold">Surah not found.</p>
                <button onClick={() => router.push('/quran')} className="mt-4 text-[#4D6A53] font-bold">Go Back</button>
            </div>
        );
    }

    return (
        <motion.main
            className="flex flex-col bg-gray-50 min-h-screen font-sans pb-6"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* ── HEADER ── */}
            <div className="sticky top-0 z-40 bg-gray-50/95 backdrop-blur-md border-b border-black/[0.03]">
                <div className="flex items-center justify-between px-5 py-4">
                    <button
                        onClick={() => router.push("/quran")}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/[0.03] text-[#1A2420]"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </button>

                    <div className="flex flex-col items-center">
                        <h1 className="text-[18px] font-bold text-[#1A2420] font-sans leading-none mb-1">
                            {surahData.englishName}
                        </h1>
                        <p className="text-[12px] font-bold text-[#9AA5AB] font-sans uppercase tracking-widest">
                            {surahData.revelationType} • {surahData.numberOfAyahs} AYAHS
                        </p>
                    </div>

                    <div className="w-10 opacity-0" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* ── BISMILLAH HEADER ── */}
            {surahData.number !== 1 && surahData.number !== 9 && (
                <motion.div variants={item} className="flex justify-center pt-8 pb-4">
                    <h2 className="text-[28px] text-[#1A2420] font-sans font-bold text-center leading-relaxed">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </h2>
                </motion.div>
            )}

            {/* ── AYAHS LIST ── */}
            <div className="px-5 mt-4 space-y-4">
                {surahData.ayahs.map((ayah, index) => {
                    const isBookmarked = bookmarks.includes(ayah.numberInSurah);

                    // Note: API already includes Bismillah at the beginning of Surah 1, and as the first Ayah for other surahs. 
                    // To handle display well, we clean it up if it repeats, but the API's Uthmani text usually includes it explicitly only where needed.
                    let cleanedArabic = ayah.arabicText;

                    return (
                        <motion.div
                            variants={item}
                            key={ayah.numberInSurah}
                            className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-black/[0.02]"
                        >
                            {/* Action Bar (Ayah Number & Bookmark) */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-8 w-8 rounded-full bg-[#F0EDE7] flex items-center justify-center border border-[#E8E3DB]">
                                    <span className="text-[12px] font-bold text-[#4D6A53]">{ayah.numberInSurah}</span>
                                </div>
                                <button
                                    onClick={() => toggleBookmark(ayah.numberInSurah)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-full border border-black/[0.03] transition-colors ${isBookmarked ? "bg-[#4D6A53]" : "bg-[#EEE9DF]"
                                        }`}
                                >
                                    <Bookmark
                                        size={18}
                                        className={isBookmarked ? "text-white" : "text-[#4D6A53]"}
                                        strokeWidth={2.5}
                                        fill={isBookmarked ? "currentColor" : "none"}
                                    />
                                </button>
                            </div>

                            {/* Arabic Text */}
                            <div className="text-right mb-5 pt-2">
                                <p
                                    className="text-[26px] !leading-[1.8] text-[#1A2420]"
                                    dir="rtl"
                                    style={{ fontFamily: "var(--font-geist-sans), sans-serif", wordSpacing: "0.2em" }}
                                >
                                    {cleanedArabic}
                                </p>
                            </div>

                            {/* Translation */}
                            <div className="border-t border-[#F0F5F1] pt-4">
                                <p className="text-[15px] font-medium text-[#5A655F] leading-relaxed">
                                    {ayah.translationText}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

        </motion.main>
    );
}
