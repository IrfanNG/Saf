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
            <Card className="col-span-2 border-border/40 bg-gradient-to-br from-card to-black">
                <CardContent className="p-4 flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={18} className="text-emerald-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground leading-tight">
                            {settings.mosqueName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {settings.address}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Facilities */}
            <Card className="border-border/40 bg-gradient-to-br from-card to-black">
                <CardContent className="p-4">
                    <Info size={18} className="text-emerald-500 mb-2" />
                    <p className="text-sm font-medium mb-1">Facilities</p>
                    <div className="flex flex-wrap gap-1">
                        {settings.facilities.map((f) => (
                            <span
                                key={f}
                                className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded"
                            >
                                {f}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Parking */}
            <Card className="border-border/40 bg-gradient-to-br from-card to-black">
                <CardContent className="p-4">
                    <Car size={18} className="text-emerald-500 mb-2" />
                    <p className="text-sm font-medium mb-1">Parking</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {settings.parking}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
