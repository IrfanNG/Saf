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
            {/* 
        Mosque Silhouette Outline 
        - Stroke: Green (#064E3B), 2px
        - Fill: Transparent
      */}
            <g stroke="#064E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">

                {/* === MAIN BUILDING / DOME === */}
                {/* Tier 1 (Bottom, Widest) */}
                <path d="M 35 75 L 40 62 L 85 62 L 90 75 Z" />

                {/* Tier 2 (Middle) */}
                <path d="M 45 62 L 50 48 L 75 48 L 80 62 Z" />

                {/* Tier 3 (Top) */}
                <path d="M 52 48 L 57 32 L 68 32 L 73 48 Z" />

                {/* Top Dome (Onion shape via bezier) */}
                <path d="M 57 32 C 57 26, 62.5 25, 62.5 20 C 62.5 25, 68 26, 68 32" />

                {/* Crescent Finial on Main Dome */}
                <path d="M 62.5 20 L 62.5 12" />
                <path d="M 62.5 10 C 64 10, 65 11, 65 12.5 C 65 11.5, 64.5 10.5, 63.5 10.5" />

                {/* Horizontal Seams (separating tiers) */}
                <line x1="40" y1="62" x2="85" y2="62" />
                <line x1="50" y1="48" x2="75" y2="48" />
                <line x1="57" y1="32" x2="68" y2="32" />

                {/* Foundation Base Line */}
                <line x1="10" y1="75" x2="90" y2="75" />

                {/* === MINARET (Left Side) === */}
                {/* Main Tower Base */}
                <path d="M 16 75 L 18 45 L 28 45 L 30 75 Z" />

                {/* Balcony 1 (Lower) */}
                <path d="M 14 45 L 32 45 L 30 40 L 16 40 Z" />

                {/* Upper Tower Section */}
                <path d="M 18 40 L 20 25 L 26 25 L 28 40 Z" />

                {/* Balcony 2 (Upper) */}
                <path d="M 17 25 L 29 25 L 27 20 L 19 20 Z" />

                {/* Minaret Dome / Roof */}
                <path d="M 19 20 L 23 12 L 27 20 Z" />

                {/* Finial on Minaret */}
                <line x1="23" y1="12" x2="23" y2="8" />

            </g>
        </svg>
    );
}
