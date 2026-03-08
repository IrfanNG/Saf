"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="flex flex-col pb-28 min-h-screen bg-[#F4F4F6] animate-in fade-in duration-300">
            {/* Hero Header Area */}
            <div className="relative w-full h-[32vh] min-h-[220px] max-h-[320px] bg-emerald-950 overflow-hidden">
                <div className="relative z-10 flex justify-between items-start px-5 pt-12">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-20 bg-emerald-900/40" />
                        <Skeleton className="h-8 w-40 bg-emerald-900/40" />
                        <Skeleton className="h-2 w-32 bg-emerald-900/40" />
                    </div>
                </div>
            </div>

            {/* Prayer Cards Overlap */}
            <div className="-mt-14 z-20 px-5 flex gap-4 overflow-hidden">
                <Skeleton className="h-32 w-full rounded-[2rem] bg-white border border-white shrink-0" />
                <Skeleton className="h-32 w-full rounded-[2rem] bg-emerald-900 border border-emerald-950 shrink-0" />
            </div>

            {/* Quick Tiles Row */}
            <div className="mx-6 mt-6 p-5 rounded-[2rem] bg-white/60 flex justify-between gap-2 h-20">
                <Skeleton className="h-14 w-14 rounded-2xl bg-slate-100" />
                <Skeleton className="h-14 w-14 rounded-2xl bg-slate-100" />
                <Skeleton className="h-14 w-14 rounded-2xl bg-slate-100" />
                <Skeleton className="h-14 w-14 rounded-2xl bg-slate-100" />
            </div>

            {/* Inspiration Grid - arched */}
            <div className="mt-8 px-5 flex gap-4 overflow-hidden">
                <Skeleton className="h-[240px] w-full rounded-[140px_140px_2.5rem_2.5rem] bg-white/40" />
            </div>

            {/* Mosque Events */}
            <div className="mt-12 px-6 space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-28 w-full rounded-[1.25rem] bg-white" />
                <Skeleton className="h-28 w-full rounded-[1.25rem] bg-white" />
            </div>
        </div>
    );
}
