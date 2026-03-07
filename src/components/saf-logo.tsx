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
            {/* The "Perfect Match" Onion Dome from reference image */}
            <g stroke="#415D43" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {/* 1. Main Outer Onion Shape (More bulgy at the bottom) */}
                <path d="M 20 86 C 12 78, 8 60, 15 42 C 22 24, 45 22, 50 12 C 55 22, 78 24, 85 42 C 92 60, 88 78, 80 86" />

                {/* 2. The Curved Base Line ("Smile" base) */}
                <path d="M 20 86 C 35 78, 65 78, 80 86" />

                {/* 3. Left Interior Detail Line (Hand-drawn shadow look) */}
                <path d="M 28 80 C 24 72, 22 60, 26 48 C 30 36, 42 32, 48 24" />

                {/* 4. Small Right Detail Notch */}
                <path d="M 78 72 Q 76 60, 78 52" />

                {/* 5. Finial Stalk (Neck) */}
                <path d="M 50 12 V 8" />

                {/* 6. Crescent Moon (Facing left/up) */}
                <path d="M 51 0 C 42 0, 42 10, 51 10 C 47 10, 47 0, 51 0 Z" fill="#415D43" strokeWidth="0" />

                {/* 7. Star (Small, five-pointed) */}
                <path d="M 52 4 L 53 4 L 52.4 4.8 L 52.6 5.5 L 52 5.1 L 51.4 5.5 L 51.6 4.8 L 51 4 L 52 4 Z" fill="#415D43" strokeWidth="0" />
            </g>
        </svg>
    );
}
