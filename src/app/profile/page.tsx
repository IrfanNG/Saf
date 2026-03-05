"use client";

import { useAuth } from "@/context/auth-context";
import { useAdmin } from "@/hooks/use-admin";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { motion } from "framer-motion";
import {
    User as UserIcon,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
};

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const { isAdmin } = useAdmin();
    const { location } = usePrayerTimes();
    const router = useRouter();

    const menuItems = [
        { icon: UserIcon, label: "Personal Information", iconBg: "#EEF5EF", iconColor: "#4D6A53", href: "/profile/personal-info" },
        { icon: Shield, label: "Privacy & Security", iconBg: "#EEEDF8", iconColor: "#6B64C8", href: undefined },
        { icon: HelpCircle, label: "Help Center", iconBg: "#EDF3FB", iconColor: "#4A8ED4", href: undefined },
    ];



    return (
        <motion.main
            className="flex min-h-screen flex-col bg-[#F4F4F6] text-[#1A1A1A] pb-32"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* ── AVATAR + NAME SECTION ── */}
            <motion.div variants={item} className="flex flex-col items-center pt-16 pb-6 px-6">
                {/* Diamond avatar */}
                <div className="relative mb-5">
                    {/* Diamond shape via rotate trick */}
                    <div
                        className="w-24 h-24 rounded-[1.6rem] overflow-hidden border-4 border-white shadow-lg"
                        style={{ transform: "rotate(45deg)" }}
                    >
                        <div style={{ transform: "rotate(-45deg)", width: "140%", height: "140%", marginTop: "-20%", marginLeft: "-20%" }}>
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#D4C4A8] flex items-center justify-center">
                                    <UserIcon size={44} className="text-[#8A7060]" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gold coin badge beneath avatar */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#D4A017] border-2 border-[#F4F4F6] shadow-sm flex items-center justify-center z-10">
                        <span className="text-white text-[10px] font-black">✦</span>
                    </div>
                </div>

                {/* Name */}
                <h1 className="text-[1.6rem] font-bold text-[#5A413A] font-sans tracking-tight mt-2">
                    {user?.displayName || "Ahmad Ibrahim"}
                </h1>
                {/* Location */}
                <p className="text-[11px] font-bold text-[#9AA5AB] uppercase tracking-[0.18em] mt-1 text-center">
                    {location?.city ? `${location.city}, Malaysia` : "Kuala Lumpur, Malaysia"}
                </p>
            </motion.div>



            {/* ── MENU ITEMS ── */}
            <motion.div variants={item} className="mx-5 flex flex-col gap-2">
                {menuItems.map((menuItem, idx) => {
                    const Row = (
                        <div
                            key={idx}
                            className="bg-white rounded-[1.25rem] px-4 py-3.5 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3.5">
                                <div
                                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: menuItem.iconBg }}
                                >
                                    <menuItem.icon size={20} strokeWidth={2} style={{ color: menuItem.iconColor }} />
                                </div>
                                <span className="font-semibold text-[15px] text-[#1A2420]">{menuItem.label}</span>
                            </div>
                            <ChevronRight size={18} className="text-[#C8C4BE]" strokeWidth={2.5} />
                        </div>
                    );

                    return menuItem.href ? (
                        <Link key={idx} href={menuItem.href}>{Row}</Link>
                    ) : (
                        <div key={idx}>{Row}</div>
                    );
                })}

                {/* Admin row */}
                {isAdmin && (
                    <Link href="/admin/mosque">
                        <div className="bg-white rounded-[1.25rem] px-4 py-3.5 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3.5">
                                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                    <ShieldCheck size={20} strokeWidth={2} className="text-emerald-600" />
                                </div>
                                <span className="font-semibold text-[15px] text-[#1A2420]">Admin Control</span>
                            </div>
                            <ChevronRight size={18} className="text-[#C8C4BE]" strokeWidth={2.5} />
                        </div>
                    </Link>
                )}
            </motion.div>

            {/* ── LOG OUT ── */}
            <motion.div variants={item} className="mx-5 mt-8">
                <div className="bg-white rounded-[1.25rem] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                    <button
                        onClick={signOut}
                        className="w-full flex items-center justify-center gap-2 py-4 text-[#E04B4B] font-bold text-[14px] tracking-wide hover:bg-red-50 rounded-[1.25rem] transition-colors"
                    >
                        <LogOut size={17} strokeWidth={2.5} />
                        LOG OUT
                    </button>
                </div>
            </motion.div>
        </motion.main>
    );
}
