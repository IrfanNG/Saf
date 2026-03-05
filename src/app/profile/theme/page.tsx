"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ThemeSettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-background" />;
    }

    const handleApply = () => {
        router.back();
    };

    return (
        <main className="flex min-h-screen flex-col bg-background text-foreground pb-32 font-sans transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
                <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition">
                    <ArrowLeft size={24} className="text-foreground" />
                </button>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">App Theme</h1>
                <div className="w-10"></div> {/* Spacer for alignment */}
            </div>

            <div className="flex flex-col px-6 mt-2 flex-1">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center mb-8 px-4 leading-relaxed tracking-tight">
                    Choose the appearance that suits your spiritual journey.
                </p>

                <div className="flex flex-col gap-5">
                    {/* Light Theme Card */}
                    <div
                        onClick={() => setTheme("light")}
                        className={`relative rounded-[1.25rem] border-2 p-4 cursor-pointer transition-all duration-300 ${theme === "light" ? "border-[#EB6F39] shadow-sm transform scale-[1.01]" : "border-slate-100 dark:border-zinc-800 opacity-70"
                            }`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className={`font-semibold text-sm ${theme === "light" ? "text-foreground" : "text-foreground"}`}>
                                Light (Desert Bloom)
                            </span>
                            {theme === "light" ? (
                                <CheckCircle2 size={24} className="text-[#EB6F39] fill-[#EB6F39] text-white" />
                            ) : (
                                <Circle size={24} className="text-slate-200 dark:text-zinc-700" strokeWidth={1.5} />
                            )}
                        </div>
                        {/* Light Mock UI */}
                        <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm flex flex-col gap-3">
                            <div className="flex gap-3 items-center">
                                <div className="h-6 w-6 rounded-full bg-[#f4e6df]" />
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <div className="h-2 w-24 rounded-full bg-slate-200" />
                                    <div className="h-1.5 w-16 rounded-full bg-slate-100" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-10 flex-1 rounded-md bg-slate-50" />
                                <div className="h-10 flex-1 rounded-md bg-slate-50" />
                                <div className="h-10 flex-1 rounded-md bg-[#fdf5f3]" />
                            </div>
                        </div>
                    </div>

                    {/* Dark Theme Card */}
                    <div
                        onClick={() => setTheme("dark")}
                        className={`relative rounded-[1.25rem] border-2 bg-[#0C0B0A] p-4 cursor-pointer transition-all duration-300 ${theme === "dark"
                            ? "border-[#EB6F39] shadow-lg shadow-orange-900/10 transform scale-[1.01]"
                            : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-sm text-white">
                                Dark (Midnight Desert)
                            </span>
                            {theme === "dark" ? (
                                <CheckCircle2 size={24} className="text-[#EB6F39] fill-[#EB6F39] text-white" />
                            ) : (
                                <Circle size={24} className="text-[#262626]" strokeWidth={1.5} />
                            )}
                        </div>
                        {/* Dark Mock UI */}
                        <div className="rounded-xl border border-white/5 bg-[#171514] p-3 flex flex-col gap-3">
                            <div className="flex gap-3 items-center">
                                <div className="h-6 w-6 rounded-full bg-[#5A382A]" />
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <div className="h-2 w-24 rounded-full bg-white/10" />
                                    <div className="h-1.5 w-16 rounded-full bg-white/5" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-10 flex-1 rounded-md bg-white/5" />
                                <div className="h-10 flex-1 rounded-md bg-white/5" />
                                <div className="h-10 flex-1 rounded-md bg-[#3B251D]" />
                            </div>
                        </div>
                    </div>

                    {/* System Default Card */}
                    <div
                        onClick={() => setTheme("system")}
                        className={`relative rounded-[1.25rem] border-2 bg-white overflow-hidden p-4 cursor-pointer transition-all duration-300 ${theme === "system"
                            ? "border-[#EB6F39] shadow-sm transform scale-[1.01]"
                            : "border-slate-100 dark:border-zinc-800 opacity-70"
                            }`}
                    >
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <span className="font-semibold text-sm text-slate-800">
                                System Default
                            </span>
                            {theme === "system" ? (
                                <CheckCircle2 size={24} className="text-[#EB6F39] fill-[#EB6F39] text-white" />
                            ) : (
                                <Circle size={24} className="text-slate-200" strokeWidth={1.5} />
                            )}
                        </div>
                        {/* System Mock UI - Split */}
                        <div className="relative rounded-xl border border-slate-100 shadow-sm flex overflow-hidden">
                            {/* Left Half (Light) */}
                            <div className="w-1/2 bg-white p-3 flex flex-col gap-3">
                                <div className="h-2 w-10 py-0.5 rounded-full bg-slate-200" />
                                <div className="h-6 w-full rounded-md bg-slate-100" />
                            </div>
                            {/* Right Half (Dark) */}
                            <div className="w-1/2 bg-[#171514] p-3 flex flex-col gap-3 border-l border-white/5">
                                <div className="h-2 w-10 py-0.5 rounded-full bg-white/20" />
                                <div className="h-6 w-full rounded-md bg-white/10" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-background border-t border-slate-100 dark:border-zinc-800 z-50 pt-4 pb-8">
                    <button
                        onClick={handleApply}
                        className="w-full bg-[#C55D40] text-white py-4 rounded-xl font-bold shadow-sm transition hover:bg-[#A94A2F] active:scale-[0.98]"
                    >
                        Set Theme
                    </button>
                </div>
            </div>
        </main>
    );
}
