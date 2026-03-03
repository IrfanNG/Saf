"use client";

import { useAuth } from "@/context/auth-context";
import { useAdmin } from "@/hooks/use-admin";
import { useFCM } from "@/hooks/use-fcm";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Copy, CheckCircle2, ShieldCheck, ChevronRight, Bell, BellOff, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const { isAdmin, loading: adminLoading } = useAdmin();
    const { permission, loading: fcmLoading, requestPermission, unsubscribeFromNotifications } = useFCM();
    const [userCount, setUserCount] = useState<number | null>(null);
    const [countLoading, setCountLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const referralLink = `saf.app/join/${user?.uid || "USER_ID"}`;

    useEffect(() => {
        console.log("ProfilePage: Admin State -", { isAdmin, adminLoading });
    }, [isAdmin, adminLoading]);

    useEffect(() => {
        if (isAdmin) {
            const fetchCount = async () => {
                setCountLoading(true);
                try {
                    const coll = collection(db, "users");
                    const snapshot = await getCountFromServer(coll);
                    setUserCount(snapshot.data().count);
                } catch (error) {
                    console.error("Error fetching user count:", error);
                } finally {
                    setCountLoading(false);
                }
            };
            fetchCount();
        }
    }, [isAdmin]);

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

                {/* Notification Toggle */}
                <motion.div variants={itemVariants} className="w-full">
                    <button
                        onClick={() => permission === "granted" ? unsubscribeFromNotifications() : requestPermission()}
                        disabled={fcmLoading}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${fcmLoading ? "opacity-70 pointer-events-none" : ""} ${permission === "granted"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-400"
                            }`}
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className={`p-2 rounded-xl ${permission === "granted" ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-500"}`}>
                                {fcmLoading ? <Loader2 size={18} className="animate-spin" /> : permission === "granted" ? <Bell size={18} /> : <BellOff size={18} />}
                            </div>
                            <div>
                                <p className="text-sm font-bold tracking-tight">Qiyamullail Notifications</p>
                                <p className="text-[10px] opacity-70">
                                    {fcmLoading
                                        ? "Setting up..."
                                        : permission === "granted"
                                            ? "Enabled - We'll notify you at 3:30 AM"
                                            : permission === "denied"
                                                ? "Blocked - Check browser settings"
                                                : "Disabled - Tap to enable"}
                                </p>
                            </div>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${permission === "granted" ? "bg-emerald-500" : "bg-zinc-700"}`}>
                            <motion.div
                                animate={{ x: permission === "granted" ? 18 : 2 }}
                                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                        </div>
                    </button>
                    {permission === "denied" && (
                        <p className="text-[10px] text-red-500/70 text-center mt-2">Notifications blocked by browser. Please reset permissions.</p>
                    )}
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
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCopy}
                                className="bg-zinc-800 hover:bg-emerald-600 hover:text-white transition rounded-lg p-2 text-zinc-400 group"
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:text-white" /> : <Copy className="w-4 h-4" />}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Admin Console / Loading State */}
                {adminLoading ? (
                    <div className="w-full space-y-4">
                        <div className="h-20 w-full rounded-xl bg-zinc-900/50 border border-zinc-800 animate-pulse flex items-center px-5 gap-3">
                            <div className="h-10 w-10 rounded-lg bg-zinc-800" />
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-zinc-800 rounded" />
                                <div className="h-3 w-32 bg-zinc-800 rounded opacity-50" />
                            </div>
                        </div>
                    </div>
                ) : isAdmin ? (
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        className="w-full space-y-4"
                    >
                        <Link
                            href="/admin/mosque"
                            className="flex flex-col gap-3 group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 transition-all hover:bg-emerald-500/20 active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
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

                        {/* Admin Stats Dashboard */}
                        <div className="grid grid-cols-1 gap-4 p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Users size={16} />
                                    <span className="text-xs font-medium uppercase tracking-widest">Total Users</span>
                                </div>
                                {countLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                ) : (
                                    <span className="text-xl font-mono font-bold text-emerald-500">
                                        {userCount ?? "--"}
                                    </span>
                                )}
                            </div>
                            <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/50 to-transparent rounded-full" />
                            <p className="text-[10px] text-zinc-500 italic">Target: 10+ users for validation</p>
                        </div>
                    </motion.div>
                ) : null}

                {/* Sign Out */}
                <motion.div variants={itemVariants} className="w-full pt-4 border-t border-zinc-800/50">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={signOut}
                        className="w-full flex items-center justify-center space-x-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition p-4 rounded-xl font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </motion.button>
                </motion.div>
            </motion.div>
        </main>
    );
}
