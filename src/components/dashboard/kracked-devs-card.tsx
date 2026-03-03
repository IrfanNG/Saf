"use client";

import { motion } from "framer-motion";
import { ExternalLink, Zap, Users, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export function KrackedDevsCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group mt-6"
        >
            {/* Animated Gradient Border */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500/50 via-zinc-800 to-black rounded-3xl blur-[1px] group-hover:blur-md transition-all duration-500 opacity-70" />

            <div className="relative bg-zinc-950 rounded-[22px] border border-zinc-900 overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={120} className="text-emerald-500" />
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                            <Code className="text-emerald-400" size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold tracking-tight text-white uppercase">KrackedDevs</h3>
                            <p className="text-[10px] text-emerald-500/80 font-bold tracking-widest uppercase">Limited Edition</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-lg font-bold text-zinc-100">Join the Kracked Community</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-[240px]">
                            Connect with fellow developers building the future of faith-tech and modern apps.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-zinc-400">KRACKED.DEVS/COMMUNITY</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[10px] gap-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/5"
                                onClick={() => window.open("https://krackeddevs.com", "_blank")}
                            >
                                Visit <ExternalLink size={12} />
                            </Button>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-black text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            onClick={() => window.open("https://krackeddevs.com/referral/saf-app", "_blank")}
                        >
                            Get My Unique Link
                            <Zap size={14} className="fill-current" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
