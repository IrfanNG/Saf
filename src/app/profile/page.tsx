"use client";

import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { LogOut, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
    const { user, signOut } = useAuth();
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
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    };

    return (
        <main className="flex min-h-[80vh] flex-col p-6 pt-12 items-center">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="w-full max-w-sm flex flex-col items-center space-y-8"
            >
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

                <motion.div variants={itemVariants} className="w-full">
                    <div className="bg-black border border-zinc-800 rounded-xl p-5 space-y-4">
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

                <motion.div variants={itemVariants} className="w-full pt-4 border-t border-zinc-800/50">
                    <button
                        onClick={signOut}
                        className="w-full flex items-center justify-center space-x-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition p-3 rounded-xl font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </motion.div>
            </motion.div>
        </main>
    );
}
