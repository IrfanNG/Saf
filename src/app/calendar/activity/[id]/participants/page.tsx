"use client";

import { useActivityParticipants } from "@/hooks/use-activities";
import { useAdmin } from "@/hooks/use-admin";
import { ChevronLeft, User, Mail, Calendar, Loader2, ShieldX } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ParticipantsPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { isAdmin, loading: adminLoading } = useAdmin();
    const { participants, loading: participantsLoading } = useActivityParticipants(id, isAdmin && !adminLoading);

    if (adminLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F4F4F6]">
                <Loader2 className="w-8 h-8 text-[#415D43] animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F4F6] p-6 text-center">
                <ShieldX className="w-16 h-16 text-red-500/40 mb-4" />
                <h1 className="text-2xl font-bold text-[#5A413A] font-serif mb-2">Access Denied</h1>
                <p className="text-slate-500 mb-6">You need admin privileges to view this list.</p>
                <button
                    onClick={() => router.back()}
                    className="bg-[#415D43] text-white px-6 py-2 rounded-xl font-bold shadow-md"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F4F4F6] pb-12">
            {/* Header */}
            <div className="bg-white pt-12 pb-6 px-5 rounded-b-[2.5rem] shadow-sm mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-slate-100 rounded-full text-[#415D43] hover:bg-slate-200 transition"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-[#5A413A] font-serif">Participants List</h1>
                </div>
                <div className="bg-[#415D43]/5 rounded-2xl p-4 flex items-center justify-between border border-[#415D43]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#415D43] flex items-center justify-center text-white">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#415D43]/60 uppercase tracking-wider">Total Registered</p>
                            <p className="text-lg font-bold text-[#415D43]">{participants.length} Users</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="px-5 space-y-3">
                {participantsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-20 bg-white animate-pulse rounded-2xl shadow-sm border border-white" />
                    ))
                ) : participants.length === 0 ? (
                    <div className="text-center py-20">
                        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No one has joined this activity yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {participants.map((user, idx) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-white"
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-50 shrink-0">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                            <User size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[#5A413A] truncate">{user.name}</h3>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                                        <Mail size={10} />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                                        <Calendar size={10} />
                                        <span>Joined</span>
                                    </div>
                                    <p className="text-[12px] font-bold text-[#415D43]">
                                        {user.joinedAt?.toDate ? user.joinedAt.toDate().toLocaleDateString() : "Just now"}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
