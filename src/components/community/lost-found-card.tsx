"use client";

import { LostFoundItem } from "@/hooks/use-lost-found";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface LostFoundCardProps {
    item: LostFoundItem;
    onMarkReturned: (id: string, current: boolean) => void;
    onDelete: (id: string) => void;
}

export function LostFoundCard({ item }: LostFoundCardProps) {
    const router = useRouter();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-full h-full cursor-pointer"
            onClick={() => router.push(`/community/${item.id}`)}
        >
            <Card className="overflow-hidden border-none shadow-[0_2px_15px_rgba(0,0,0,0.03)] bg-white hover:shadow-md transition-shadow duration-300 group h-full flex flex-col rounded-[2rem]">
                <div className="relative overflow-hidden bg-[#F4F4F4] h-[160px] sm:h-[180px] flex items-center justify-center p-4">
                    {item.imageUrl && item.imageUrl !== "" ? (
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply drop-shadow-sm"
                        />
                    ) : (
                        <div className="w-full h-32 flex items-center justify-center text-slate-400 italic text-xs">
                            No image
                        </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className={`font-bold text-[10px] tracking-[0.05em] px-3 py-1 rounded-xl border-none hover:opacity-90 ${item.type === "found" ? "bg-[#495C48] text-white" : "bg-[#D26E43] text-white"}`}>
                            {item.type.toUpperCase()}
                        </Badge>
                        {item.status === "returned" && (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none font-bold text-[8px] rounded-xl">
                                RETURNED
                            </Badge>
                        )}
                    </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="space-y-1">
                        <h3 className="font-bold text-[#5A413A] font-serif text-[18px] leading-tight line-clamp-1">{item.title}</h3>
                        <div className="flex items-start gap-1.5 text-[12px] text-[#7A8A93] font-semibold tracking-wide">
                            <MapPin size={14} strokeWidth={2.5} className="text-[#495C48] shrink-0 mt-[1px]" />
                            {item.location ? item.location : "Mosque Vicinity"}
                        </div>
                    </div>

                    <div className="mt-auto pt-6 space-y-4">
                        <Button
                            className="w-full h-11 bg-[#F1EDE2] hover:bg-[#EBE7DF] text-[#5A413A] font-bold rounded-xl text-[13px] shadow-none border-none transition-all flex items-center justify-center gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/community/${item.id}`);
                            }}
                        >
                            View Details <ChevronRight size={14} strokeWidth={2.5} />
                        </Button>

                        <div className="flex items-center justify-between text-[#7A8A93] opacity-60">
                            <div className="flex items-center gap-1.5">
                                <Clock size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Just now</span>
                            </div>
                            <ChevronRight size={14} strokeWidth={2.5} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
