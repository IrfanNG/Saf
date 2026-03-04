"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Info, Car } from "lucide-react";
import type { MosqueSettings } from "@/hooks/use-mosque-settings";

interface MosqueInfoProps {
    settings: MosqueSettings;
    loading: boolean;
}

export function MosqueInfo({ settings, loading }: MosqueInfoProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`${i === 1 ? "col-span-2" : ""} bg-zinc-900/60 border border-border/40 rounded-xl p-4 animate-pulse`}
                    >
                        <div className="h-4 w-20 bg-zinc-800 rounded mb-3" />
                        <div className="h-3 w-32 bg-zinc-800 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {/* Mosque Name + Address — Full width */}
            <Card
                className="col-span-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/masjid3.jpeg')" }}
            >
                {/* Further reduced overlay opacity to make masjid3.jpeg even more visible */}
                <div className="absolute inset-0 bg-white/30 pointer-events-none"></div>

                <CardContent className="p-4 flex items-center gap-4 relative z-10">
                    <div className="h-12 w-12 rounded-[1rem] bg-[#FFEDD5] text-[#CC6449] flex items-center justify-center shrink-0">
                        <MapPin size={22} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                        <p className="font-bold text-[15px] text-[#1A1A1A] leading-tight mb-1.5">
                            {settings.mosqueName}
                        </p>
                        <p className="text-[13px] text-slate-500 leading-snug font-medium">
                            {settings.address}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Facilities */}
            <Card className="bg-slate-50 border-slate-100 hover:shadow-lg transition-shadow text-[#1A1A1A]">
                <CardContent className="p-4">
                    <Info size={18} className="text-[#CC6449] mb-2" />
                    <p className="text-sm font-bold mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-1.5">
                        {settings.facilities.map((f) => (
                            <span
                                key={f}
                                className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold shadow-sm"
                            >
                                {f}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Parking */}
            <Card className="bg-slate-50 border-slate-100 hover:shadow-lg transition-shadow text-[#1A1A1A]">
                <CardContent className="p-4 h-full flex flex-col justify-between">
                    <div>
                        <Car size={18} className="text-[#CC6449] mb-2" />
                        <p className="text-sm font-bold mb-1">Parking</p>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium mt-auto">
                        {settings.parking}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
