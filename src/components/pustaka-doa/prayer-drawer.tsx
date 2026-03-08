"use client";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Prayer } from "@/data/prayers";
import { BookMarked, X } from "lucide-react";

interface PrayerDrawerProps {
    prayer: Prayer | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PrayerDrawer({ prayer, open, onOpenChange }: PrayerDrawerProps) {
    if (!prayer) return null;

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-white border-none max-w-md mx-auto shadow-2xl rounded-t-[2.5rem] pb-8">
                {/* Custom Close Button / Handle */}
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-200 my-4" />

                <div className="absolute right-6 top-6">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                <DrawerHeader className="text-left px-8 pt-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-[#EEE9DF] flex items-center justify-center">
                            <BookMarked size={16} className="text-[#4D6A53]" strokeWidth={2} />
                        </div>
                        <p className="text-[10px] font-bold text-[#4D6A53] uppercase tracking-[0.15em]">
                            {prayer.category}
                        </p>
                    </div>
                    <DrawerTitle className="text-[1.5rem] font-bold text-[#1A2B22] font-sans leading-tight">
                        {prayer.title}
                    </DrawerTitle>
                </DrawerHeader>

                <div className="px-8 py-6 space-y-8 overflow-y-auto max-h-[60vh] scrollbar-none">
                    {/* Arabic Text */}
                    <div className="text-right">
                        <p className="text-[1.85rem] font-sans leading-[1.8] text-[#1A2B22]" dir="rtl">
                            {prayer.arabic}
                        </p>
                    </div>

                    {/* Transliteration */}
                    <div className="bg-[#F8F9F8] rounded-2xl p-5 border border-[#E8ECE9]">
                        <p className="text-[#5A655F] italic text-[14px] leading-relaxed text-center">
                            {prayer.transliteration}
                        </p>
                    </div>

                    {/* Translation */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-[#9AA5AB] uppercase tracking-widest">
                            Translation
                        </p>
                        <p className="text-[#1A2B22] text-[15px] leading-relaxed font-sans">
                            {prayer.translation}
                        </p>
                    </div>
                </div>

                {/* Bottom decorative bar */}
                <div className="mx-auto w-32 h-1.5 flex-shrink-0 rounded-full bg-gray-100 mt-4" />
            </DrawerContent>
        </Drawer>
    );
}
