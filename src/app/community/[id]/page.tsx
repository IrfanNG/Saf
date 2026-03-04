"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LostFoundItem, useLostAndFound } from "@/hooks/use-lost-found";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/hooks/use-admin";
import { MapPin, LayoutList, Calendar, ChevronLeft, Share2, MessageSquare, Phone, Clock, Loader2, CheckCircle, Trash2 } from "lucide-react";

export default function ItemDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAdmin } = useAdmin();
    const { markReturned, deleteItem } = useLostAndFound();

    const [item, setItem] = useState<LostFoundItem | null>(null);
    const [loading, setLoading] = useState(true);

    const handleMarkReturned = async () => {
        if (!item) return;
        const newStatus = item.status !== "returned";
        await markReturned(item.id, newStatus);
        setItem({ ...item, status: newStatus ? "returned" : "active" });
    };

    const handleDelete = async () => {
        if (!item) return;
        await deleteItem(item.id);
        router.push("/community");
    };

    useEffect(() => {
        const fetchItem = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "lost_items", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setItem({ id: docSnap.id, ...docSnap.data() } as LostFoundItem);
                }
            } catch (err) {
                console.error("Error fetching item:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F4F6] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#4D6A53]" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-[#F4F4F6] flex flex-col items-center justify-center p-5 text-center">
                <h1 className="text-xl font-bold text-[#5A413A] mb-4">Item Not Found</h1>
                <Button onClick={() => router.push("/community")} className="bg-[#4D6A53] text-white">
                    Back to Community
                </Button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F4F4F6] pb-10">
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between bg-white/30 backdrop-blur-md sticky top-0 z-20">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5A413A] shadow-sm">
                    <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
                <h2 className="text-[1.1rem] font-bold text-[#5A413A] font-serif">Item Details</h2>
                <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5A413A] shadow-sm">
                    <Share2 size={18} strokeWidth={2} />
                </button>
            </div>

            <div className="flex flex-col items-center">
                {/* Image Preview */}
                <div className="w-full aspect-video bg-[#F1EDE2] relative flex items-center justify-center p-8 overflow-hidden">
                    {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain drop-shadow-lg scale-110" />
                    ) : (
                        <div className="text-[#A68F80] italic">No image provided</div>
                    )}
                </div>

                {/* Content Card */}
                <div className="w-[92%] -mt-10 bg-white rounded-[2rem] p-6 shadow-xl relative z-10 flex flex-col gap-5 border border-white/40">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1.5">
                            <Badge className={`w-fit font-bold text-[9px] tracking-[0.05em] px-3 py-1 rounded-lg border-none ${item.type === 'found' ? 'bg-[#4D6A53] text-white' : 'bg-[#D26E43] text-white'}`}>
                                {item.type.toUpperCase()}
                            </Badge>
                            <h1 className="text-2xl font-bold text-[#5A413A] font-serif tracking-tight">{item.title}</h1>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-[#F7F7F7] flex items-center justify-center text-[#4D6A53] shrink-0">
                                <MapPin size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#A68F80] uppercase tracking-widest leading-none mb-1">Found At</p>
                                <p className="text-[14px] font-bold text-[#5A413A] leading-tight">{item.location || "Masjid Al-Azim"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-[#F7F7F7] flex items-center justify-center text-[#4D6A53] shrink-0">
                                <LayoutList size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#A68F80] uppercase tracking-widest leading-none mb-1.5">Description</p>
                                <p className="text-[13px] font-medium text-[#7A8A93] leading-relaxed">
                                    {item.description || "No detailed description provided by the finder yet."}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-[#F7F7F7] flex items-center justify-center text-[#4D6A53] shrink-0">
                                <Calendar size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#A68F80] uppercase tracking-widest leading-none mb-1">Reported On</p>
                                <p className="text-[14px] font-bold text-[#5A413A] leading-tight">
                                    {item.postedAt ? (
                                        (() => {
                                            const date = typeof item.postedAt.toDate === 'function' ? item.postedAt.toDate() : new Date(item.postedAt);
                                            return new Intl.DateTimeFormat('en-MY', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }).format(date);
                                        })()
                                    ) : (
                                        "Recently"
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        {isAdmin && (
                            <div className="pt-4 border-t border-[#F1EDE2] flex gap-3">
                                <Button
                                    onClick={handleMarkReturned}
                                    className="flex-1 bg-[#4D6A53] hover:bg-[#3D4F40] text-white font-bold h-12 rounded-xl"
                                >
                                    <CheckCircle size={18} className="mr-2" />
                                    {item.status === "returned" ? "Mark Active" : "Mark Returned"}
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    variant="outline"
                                    className="w-12 h-12 border-[#EBE7DF] text-[#A68F80] hover:text-red-500 rounded-xl"
                                >
                                    <Trash2 size={20} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>


            </div>
        </main>
    );
}
