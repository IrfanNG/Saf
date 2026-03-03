"use client";

import { useAuth } from "@/context/auth-context";
import { useAdmin } from "@/hooks/use-admin";
import { motion } from "framer-motion";
import { LogOut, Copy, CheckCircle2, ShieldCheck, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const { isAdmin, loading: adminLoading } = useAdmin();
    const [copied, setCopied] = useState(false);

    const referralLink = `saf.app/join/${user?.uid || "USER_ID"}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 300, damping: 24 }
        },
    };

    return (
        <main className="flex min-h-[80vh] flex-col p-6 pt-12 items-center">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="w-full max-w-sm flex flex-col items-center space-y-8"
            >
                {/* User Info */}
                <motion.div variants={itemVariants} className="flex flex-col items-center space-y-4 w-full">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-24 h-24 rounded-full border border-zinc-800" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl font-bold uppercase text-zinc-500">
                            {user?.email?.[0] || "?"}
                        </div>
                    )}
                    <div className="text-center">
                        <h1 className="text-2xl font-medium tracking-tight">
                            {user?.displayName || "Anonymous User"}
                        </h1>
                        <p className="text-zinc-500 text-sm">{user?.email}</p>
                    </div>
                </motion.div>

                {/* Referral Card */}
                <motion.div variants={itemVariants} className="w-full">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                        <div>
                            <h2 className="text-sm font-medium text-white mb-1">Referral Link</h2>
                            <p className="text-xs text-zinc-500">Invite friends and track your rewards together.</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 font-mono truncate">
                                {referralLink}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="bg-zinc-800 hover:bg-emerald-600 hover:text-white transition rounded-lg p-2 text-zinc-400 group"
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:text-white" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Admin Console - Solid Visibility (No variants to avoid stuck opacity:0) */}
                {isAdmin && (
                    <div className="w-full">
                        <Link
                            href="/admin/mosque"
                            className="flex flex-col gap-3 group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 transition-all hover:bg-emerald-500/20 active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-black">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-white">Admin Control</h2>
                                        <p className="text-xs text-emerald-400 font-medium">Manage mosque information</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>
                )}

                {!isAdmin && !adminLoading && (
                    <div className="mt-4 px-4 py-2 bg-red-500/5 border border-red-500/10 rounded-lg text-center opacity-30">
                        <p className="text-[9px] font-mono text-zinc-600 break-all select-all">
                            UID: {user?.uid}
                        </p>
                    </div>
                )}

                {/* Sign Out */}
                <motion.div variants={itemVariants} className="w-full pt-4 border-t border-zinc-800/50">
                    <button
                        onClick={signOut}
                        className="w-full flex items-center justify-center space-x-2 text-red-500/70 hover:text-red-400 hover:bg-red-400/10 transition p-4 rounded-xl font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </motion.div>
            </motion.div>
        </main>
    );
}
