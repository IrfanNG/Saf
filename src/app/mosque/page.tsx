"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Phone, MessageCircle, MapPin, ExternalLink, Info, Users, Library, Mic, Accessibility, Car, AlertTriangle, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
};

export default function MosquePage() {
    const router = useRouter();

    const handleOpenMaps = () => {
        window.open("https://www.google.com/maps/place/Al-Azim+Mosque+(State+Mosque)/@2.2152137,102.2599563,17z/data=!4m10!1m2!2m1!1sMasjid+Al-Azim+Melaka!3m6!1s0x31d1efd23656ce25:0xcb02f3ebc56362c0!8m2!3d2.2152137!4d102.262145!15sChVNYXNqaWQgQWwtQXppbSBNZWxha2GSAQZtb3NxdWXgAQA!16zL20vMGJfajZ6?entry=ttu&g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D", "_blank");
    };

    return (
        <motion.main
            className="flex flex-col pb-12 bg-[#F4F4F6] min-h-screen"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* ── HEADER SECTION ── */}
            <motion.div variants={item} className="relative w-full h-[320px] overflow-hidden">
                {/* Background Image */}
                <img
                    src="/masjidhall.jpeg"
                    alt="Masjid Al-Azim"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                {/* Top Controls */}
                <div className="absolute top-12 left-5 right-5 z-20 flex items-center">
                    <button
                        onClick={() => router.push("/")}
                        className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"
                    >
                        <ChevronLeft size={24} />
                    </button>
                </div>

                {/* Title & Location */}
                <div className="absolute bottom-8 left-6 right-6 z-20">
                    <h1 className="text-white text-[2.5rem] font-bold font-sans leading-tight tracking-tight mb-1">
                        Masjid Al-Azim
                    </h1>
                    <div className="flex items-center gap-1.5 text-white/80">
                        <MapPin size={14} className="text-emerald-400" />
                        <span className="text-[13px] font-medium tracking-wide">Masjid Negeri Melaka</span>
                    </div>
                </div>
            </motion.div>

            <div className="px-5 -mt-6 z-30 space-y-5">

                {/* ── CONTACT CARDS ── */}
                <motion.div variants={item} className="grid grid-cols-3 gap-3">
                    {/* Call Card */}
                    <button
                        onClick={() => window.location.href = 'tel:+6062841142'}
                        className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 shadow-sm border border-black/[0.03] active:scale-95 transition-all"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[#EEE9DF] flex items-center justify-center">
                            <Phone size={22} className="text-[#4D6A53]" strokeWidth={2} />
                        </div>
                        <span className="text-[11px] font-bold text-[#5A413A] uppercase tracking-wide font-sans text-center">Call</span>
                    </button>

                    {/* Inquiry Card */}
                    <button
                        onClick={() => window.open('https://wa.me/6062841142', '_blank')}
                        className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 shadow-sm border border-black/[0.03] active:scale-95 transition-all"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[#EEE9DF] flex items-center justify-center">
                            <MessageCircle size={22} className="text-[#4D6A53]" strokeWidth={2} />
                        </div>
                        <span className="text-[11px] font-bold text-[#5A413A] uppercase tracking-wide font-sans text-center">Inquiry</span>
                    </button>

                    {/* Review Card */}
                    <button
                        onClick={() => window.open('https://www.google.com/search?q=masjid+al+azim+negeri+melaka&rlz=1C1BNSD_enMY1013MY1013&oq=ma&gs_lcrp=EgZjaHJvbWUqDggBEEUYJxg7GIAEGIoFMgYIABBFGDkyDggBEEUYJxg7GIAEGIoFMgYIAhBFGDsyBggDEEUYOzIGCAQQRRg7MgYIBRBFGD0yBggGEEUYPDIGCAcQRRg80gEIMjY1N2owajeoAgCwAgA&sourceid=chrome&ie=UTF-8#wptab=si:AL3DRZGwdZTY6cvmDUM2_gY4Th5_S1_Qi6Xh0IePMjnAeypTRb3g1Rip4e8WWLpnPpJVBH3JVls3qImH72eU_TgEJtcu7Dm0XYZARnBbMe-z7oh9P84TCDs0w7xskqLUQaJDGzFpEDs4', '_blank')}
                        className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 shadow-sm border border-black/[0.03] active:scale-95 transition-all"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[#EEE9DF] flex items-center justify-center">
                            <Star size={22} className="text-[#4D6A53]" strokeWidth={2} />
                        </div>
                        <span className="text-[11px] font-bold text-[#5A413A] uppercase tracking-wide font-sans text-center">Review</span>
                    </button>
                </motion.div>

                {/* ── ADDRESS CARD ── */}
                <motion.div variants={item} className="bg-white rounded-3xl p-6 shadow-sm border border-black/[0.02]">
                    <div className="flex items-start gap-4">
                        <div className="mt-1">
                            <div className="w-10 h-10 rounded-full bg-[#EEE9DF] flex items-center justify-center">
                                <MapPin size={20} className="text-[#4D6A53]" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[17px] font-bold text-[#1A2B22] mb-1 font-sans tracking-tight">Location Address</h3>
                            <p className="text-[13px] text-[#9AA5AB] leading-relaxed font-sans font-medium">
                                Jalan Bukit Palah, 75400 Melaka.
                            </p>
                            <button
                                onClick={handleOpenMaps}
                                className="mt-4 flex items-center gap-2 text-[#4D6A53] font-bold text-[14px] hover:opacity-80 transition-opacity font-sans"
                            >
                                Open in Google Maps
                                <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* ── PARKING & LOGISTICS ── */}
                <motion.div variants={item} className="space-y-3">
                    {/* Parking Card */}
                    <div className="bg-white rounded-3xl p-5 flex items-center justify-between shadow-sm border border-black/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#EEE9DF] flex items-center justify-center">
                                <Car size={22} className="text-[#4D6A53]" strokeWidth={2} />
                            </div>
                            <div>
                                <h4 className="text-[15px] font-bold text-[#1E293B] font-sans tracking-tight">Parking Lots</h4>
                                <p className="text-[13px] text-[#64748B] font-medium font-sans">Ample open space</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[20px] font-bold text-[#0F172A] font-sans">450+</span>
                            <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wide font-sans">Capacity</p>
                        </div>
                    </div>

                    {/* Logistics Alert - Show only during Ramadan 2026 (Feb 18 - Mar 19 approx) */}
                    {(() => {
                        const now = new Date();
                        const start = new Date("2026-02-18");
                        const end = new Date("2026-03-20");
                        if (now >= start && now <= end) {
                            return (
                                <div className="bg-[#4D7C5F] rounded-3xl p-5 shadow-sm overflow-hidden relative">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                            <AlertTriangle size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-[14px] font-bold text-white mb-1 tracking-wide font-sans">Ramadan Traffic Alert</h4>
                                            <p className="text-[13px] text-white/85 leading-relaxed font-sans font-medium">
                                                High traffic during Tarawih. Consider carpooling or arriving 30 mins early. Special wardens on duty.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </motion.div>

                {/* ── FACILITY DIRECTORY ── */}
                <motion.div variants={item} className="flex flex-col gap-3">
                    <h3 className="text-[14px] font-bold uppercase tracking-[0.1em] text-[#8B5742] ml-2 mt-2 font-sans">Facility Directory</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Main Hall */}
                        <div className="bg-white rounded-3xl p-4 shadow-sm border border-black/[0.02] flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#EEE9DF] flex items-center justify-center text-[#4D6A53] shrink-0">
                                <Users size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-[#1A2B22] font-sans">Main Hall</h4>
                                <p className="text-[12px] text-[#6B7280] font-medium font-sans mt-0.5">10.4k Total Capacity</p>
                            </div>
                        </div>

                        {/* Museum */}
                        <div className="bg-white rounded-3xl p-4 shadow-sm border border-black/[0.02] flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#EEE9DF] flex items-center justify-center text-[#4D6A53] shrink-0">
                                <Library size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-[#1A2B22] font-sans">State Museum</h4>
                                <p className="text-[12px] text-[#6B7280] font-medium font-sans mt-0.5">Islamic Heritage</p>
                            </div>
                        </div>

                        {/* Auditorium */}
                        <div className="bg-white rounded-3xl p-4 shadow-sm border border-black/[0.02] flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#EEE9DF] flex items-center justify-center text-[#4D6A53] shrink-0">
                                <Mic size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-[#1A2B22] font-sans">Lecture Hall</h4>
                                <p className="text-[12px] text-[#6B7280] font-medium font-sans mt-0.5">Auditorium & Events</p>
                            </div>
                        </div>

                        {/* Accessibility */}
                        <div className="bg-white rounded-3xl p-4 shadow-sm border border-black/[0.02] flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#EEE9DF] flex items-center justify-center text-[#4D6A53] shrink-0">
                                <Accessibility size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-[#1A2B22] font-sans mb-1.5">Accessibility</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">Ramps</span>
                                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">Elevator</span>
                                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">OKU Toilet</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── DESCRIPTION SECTION ── */}
                <motion.div
                    variants={item}
                    className="bg-[#8B5742] rounded-3xl p-7 text-white shadow-md relative overflow-hidden"
                    style={{
                        borderRadius: "1.5rem 1.5rem 1.5rem 1.5rem"
                    }}
                >
                    {/* Decorative Arch Shape Overlay (Subtle) */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                            <Info size={14} className="text-white" />
                        </div>
                        <h3 className="text-[14px] font-bold uppercase tracking-[0.15em] font-sans">About Our Mosque</h3>
                    </div>

                    <p className="text-[16px] leading-[1.75] font-sans font-medium text-white/95">
                        Masjid Al-Azim is the State Mosque of Melaka. Opened in 1990, it is a grand example of Nusantarian architectural style, featuring a majestic three-tiered roof and a towering minaret. It serves as a central hub for Islamic administration and community activities in the historic state of Melaka, accommodating thousands of worshippers.
                    </p>

                    <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center">
                        <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest leading-none font-sans">Officially Opened 1990</span>
                        <div className="h-1 w-12 bg-white/20 rounded-full" />
                    </div>
                </motion.div>

                {/* Spacer for bottom */}
                <div className="h-10" />
            </div>
        </motion.main>
    );
}
