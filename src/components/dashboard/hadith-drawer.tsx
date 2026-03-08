"use client";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Quote } from "lucide-react";
import { Hadith } from "@/hooks/use-daily-hadiths";

interface HadithDrawerProps {
    hadith: Hadith | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function HadithDrawer({ hadith, open, onOpenChange }: HadithDrawerProps) {
    if (!hadith) return null;

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-white border-none max-w-md mx-auto shadow-2xl max-h-[85dvh] flex flex-col">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-[#D1CCBF] my-4" />

                <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-12">
                    <DrawerHeader className="text-center pt-2 px-0">
                        <div
                            className="mx-auto h-14 w-14 rounded-[2rem] flex items-center justify-center text-white mb-4 shadow-lg"
                            style={{ backgroundColor: hadith.color }}
                        >
                            <Quote size={24} fill="white" />
                        </div>
                        <DrawerTitle className="text-[1.25rem] font-bold text-[#1A2420] font-sans tracking-tight mb-1">
                            Hadis Penuh
                        </DrawerTitle>
                        <DrawerDescription className="text-[#9AA5AB] font-bold text-[10px] uppercase tracking-[0.2em]">
                            {hadith.source}
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="mt-4 bg-gray-50 rounded-[2rem] p-8 border border-black/[0.03]">
                        <p className="text-[#1A2420] text-[16px] font-medium font-sans italic leading-relaxed text-center">
                            "{hadith.fullText}"
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-2">
                        <div className="h-[1px] w-12 bg-gray-200" />
                        <p className="text-[12px] font-bold text-[#4D6A53] uppercase tracking-widest">
                            Saf Inspiration
                        </p>
                    </div>
                </div>

                <div className="mx-auto w-32 h-1.5 flex-shrink-0 rounded-full bg-gray-100 mb-4 mt-2" />
            </DrawerContent>
        </Drawer>
    );
}
