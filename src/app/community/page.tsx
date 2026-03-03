"use client";

import { useState } from "react";
import { useLostAndFound } from "@/hooks/use-lost-found";
import { LostFoundCard } from "@/components/community/lost-found-card";
import { PostItemDialog } from "@/components/community/post-item-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
    const { items, loading, addItem, markReturned, deleteItem } = useLostAndFound();
    const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredItems = items.filter(item => {
        if (filter === "all") return true;
        return item.type === filter;
    });

    return (
        <main className="min-h-screen pb-24 pt-12 px-6">
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            Lost & Found
                            <span className="text-[10px] uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full border border-emerald-500/20">
                                Community
                            </span>
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1">Help reunite items with their owners.</p>
                    </div>
                    <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 gap-1">
                        {(["all", "lost", "found"] as const).map((f) => (
                            <motion.button
                                key={f}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${filter === f
                                    ? "bg-zinc-800 text-white shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                {f}
                            </motion.button>
                        ))}
                    </div>
                </header>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                ) : filteredItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="h-16 w-16 bg-zinc-900 flex items-center justify-center rounded-2xl mb-4 border border-zinc-800 relative z-10 shadow-2xl"
                        >
                            <Search className="text-zinc-600" />
                        </motion.div>
                        <h2 className="text-lg font-bold text-zinc-100 relative z-10">Nothing here yet</h2>
                        <p className="text-zinc-500 text-[10px] mt-2 max-w-[220px] relative z-10 leading-relaxed uppercase tracking-[0.15em] font-bold opacity-50">
                            Be a hero. Post a lost or found item to reunite the community.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item) => (
                                <LostFoundCard
                                    key={item.id}
                                    item={item}
                                    onMarkReturned={markReturned}
                                    onDelete={deleteItem}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* FAB */}
            <div className="fixed bottom-28 right-6 z-50">
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-black font-bold p-0 transition-all hover:scale-110 active:scale-95 group border-2 border-emerald-400/20"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </Button>
            </div>

            <PostItemDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={addItem}
            />
        </main>
    );
}
