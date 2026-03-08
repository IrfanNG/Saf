"use client";

import { useState } from "react";
import { useLostAndFound } from "@/hooks/use-lost-found";
import { LostFoundCard } from "@/components/community/lost-found-card";
import { PostItemDialog } from "@/components/community/post-item-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/custom-delete-dialog";


export default function CommunityPage() {
    // Lost & Found data
    const { items, loading, addItem, markReturned, deleteItem } = useLostAndFound();
    const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLostDialogOpen, setIsLostDialogOpen] = useState(false);

    // Deletion states
    const [deleteConfig, setDeleteConfig] = useState<{
        open: boolean;
        id: string;
    }>({ open: false, id: "" });

    const openDeleteDialog = (id: string) => {
        setDeleteConfig({ open: true, id });
    };

    const confirmDelete = () => {
        deleteItem(deleteConfig.id);
        setDeleteConfig({ ...deleteConfig, open: false });
    };

    const filteredItems = items.filter(item => {
        if (filter === "all") return true;
        return item.type === filter;
    });

    return (
        <main className="min-h-screen pb-32 pt-12 px-5 bg-[#F4F4F6]">
            <div className="flex flex-col gap-1 max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-start mb-5">
                    <div>
                        <p className="text-[10px] font-bold text-[#7D8F82] uppercase tracking-[0.15em] mb-1 pl-0.5">
                            Saf
                        </p>
                        <h1 className="text-[1.8rem] font-bold tracking-tight text-[#5A413A] font-sans leading-none">
                            Lost & Found
                        </h1>
                    </div>
                </header>

                <div className="flex flex-col">
                    {/* Lost & Found Content */}
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#A68F80] uppercase">
                            Recently Reported
                        </h3>

                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-1.5 text-[12px] font-bold transition-colors ${isFilterOpen ? 'text-[#5A413A]' : 'text-[#4D6A53] hover:opacity-80'}`}
                            >
                                Filter <Filter size={12} strokeWidth={2.5} />
                            </button>

                            <AnimatePresence>
                                {isFilterOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-1.5 border border-[#EBE7DF] z-20 flex flex-col overflow-hidden"
                                        >
                                            {[
                                                { id: 'all', label: 'All Items' },
                                                { id: 'found', label: 'Found Only' },
                                                { id: 'lost', label: 'Lost Only' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => {
                                                        setFilter(opt.id as any);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${filter === opt.id
                                                        ? 'text-[#4D6A53] bg-[#F8F5EE]'
                                                        : 'text-[#A68F80] hover:bg-[#FAFAFA] hover:text-[#5A413A]'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-8 h-8 text-[#4D6A53] animate-spin" />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center bg-white/40 border border-dashed border-slate-200 rounded-[2.5rem]">
                            <div className="h-16 w-16 bg-white flex items-center justify-center rounded-2xl mb-4 border border-slate-100 shadow-sm">
                                <Search className="text-slate-300" />
                            </div>
                            <h2 className="text-lg font-bold text-[#1A1A1A]">No items found</h2>
                            <p className="text-slate-400 font-medium text-sm mt-1 max-w-[200px]">Be the first to post an item to help the community.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3.5">
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map((item) => (
                                    <LostFoundCard
                                        key={item.id}
                                        item={item}
                                        onMarkReturned={markReturned}
                                        onDelete={(id) => openDeleteDialog(id)}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* FAB */}
            <div className="fixed bottom-28 right-6 z-50">
                <Button
                    onClick={() => setIsLostDialogOpen(true)}
                    className="w-14 h-14 rounded-2xl bg-[#4D6A53] hover:bg-[#3D5542] shadow-[0_4px_15px_rgba(77,106,83,0.35)] text-white font-bold p-0 transition-all hover:scale-105 active:scale-95 group"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                </Button>
            </div>

            <PostItemDialog
                open={isLostDialogOpen}
                onOpenChange={setIsLostDialogOpen}
                onSubmit={addItem}
            />

            <DeleteConfirmDialog
                open={deleteConfig.open}
                onOpenChange={(open) => setDeleteConfig({ ...deleteConfig, open })}
                onConfirm={confirmDelete}
                title="Delete Item?"
                description="Are you sure you want to delete this item? This cannot be undone."
            />
        </main>
    );
}
