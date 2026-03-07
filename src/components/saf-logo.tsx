"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SafLogoProps {
    className?: string;
    size?: number;
}

export function SafLogo({ className, size = 48 }: SafLogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("flex-shrink-0", className)}
        >
            {/* The "Consistent Weight" Onion Dome - Matching Lucide strokeWidth 2 */}
            <g stroke="#415D43" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                {/* 1. Main Outer Onion Shape (Clean silhouette) */}
                <path d="M 20 86 C 12 78, 8 60, 15 42 C 22 24, 45 22, 50 12 C 55 22, 78 24, 85 42 C 92 60, 88 78, 80 86" />

                {/* 2. The Curved Base Line ("Smile" base) */}
                <path d="M 20 86 C 35 78, 65 78, 80 86" />

                {/* 3. Finial Stalk (Neck) */}
                <path d="M 50 12 V 8" />

                {/* 4. Crescent Moon (Facing left/up) */}
                <path d="M 51 0 C 40 0, 40 10, 51 10 C 46 10, 46 0, 51 0 Z" fill="#415D43" strokeWidth="0" />

                {/* 5. Star (Small, clear dot-like star) */}
                <circle cx="51.5" cy="4.5" r="3" fill="#415D43" strokeWidth="0" />
            </g>
        </svg>
    );
}
