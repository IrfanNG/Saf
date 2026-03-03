"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="flex flex-col p-6 gap-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-28" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            {/* Hero */}
            <Skeleton className="h-36 w-full rounded-xl" />

            {/* Qiyam */}
            <Skeleton className="h-20 w-full rounded-xl" />

            {/* Section label */}
            <Skeleton className="h-4 w-20 mt-2" />

            {/* Mosque info grid */}
            <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-20 col-span-2 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
            </div>

            {/* Discover label */}
            <Skeleton className="h-4 w-20 mt-2" />

            {/* Discover grid */}
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
            </div>
        </div>
    );
}
