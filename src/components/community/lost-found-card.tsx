"use client";

import { LostFoundItem } from "@/hooks/use-lost-found";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/use-admin";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, CheckCircle, MapPin, Clock } from "lucide-react";

interface LostFoundCardProps {
    item: LostFoundItem;
    onMarkReturned: (id: string, current: boolean) => void;
    onDelete: (id: string) => void;
}

export function LostFoundCard({ item, onMarkReturned, onDelete }: LostFoundCardProps) {
    const { isAdmin } = useAdmin();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
            <Card className="overflow-hidden border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/30 transition-colors group h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden bg-zinc-800">
                    {item.imageUrl && item.imageUrl !== "" ? (
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            onError={(e) => console.error(`Firebase: Image failed for '${item.title}' URL:`, item.imageUrl)}
                            onLoad={() => console.log(`Firebase: Image loaded for '${item.title}'`)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 italic text-xs">
                            No image provided
                        </div>
                    )}

                    <div className="absolute top-2 left-2 flex gap-2">
                        <Badge className={item.type === "lost" ? "bg-red-500/80" : "bg-emerald-500/80"}>
                            {item.type.toUpperCase()}
                        </Badge>
                        {item.status === "returned" && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                RETURNED
                            </Badge>
                        )}
                    </div>
                </div>

                <CardContent className="p-4 flex-1 flex flex-col gap-3">
                    <div>
                        <h3 className="font-semibold text-zinc-100 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="mt-auto space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <Clock size={12} className="text-emerald-500" />
                            {item.postedAt?.toDate ? item.postedAt.toDate().toLocaleDateString() : "Just now"}
                        </div>

                        {isAdmin && (
                            <div className="flex gap-2 pt-2 border-t border-zinc-800/50">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 h-8 text-[10px] gap-1.5 border-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-500"
                                    onClick={() => onMarkReturned(item.id, item.status !== "returned")}
                                >
                                    <CheckCircle size={14} />
                                    {item.status === "returned" ? "Undo" : "Returned"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 border-zinc-800 hover:bg-red-500/10 hover:text-red-500"
                                    onClick={() => onDelete(item.id)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
