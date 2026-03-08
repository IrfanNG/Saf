"use client";

import { useAuth } from "@/context/auth-context";
import { useAdmin } from "@/hooks/use-admin";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { sendTestNotification } from "@/app/actions/notifications";
import {
    User as UserIcon,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    ShieldCheck,
    Edit2,
    Calendar,
    Save,
    Bell
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { toast } from "sonner";


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

    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Fetch full profile info
    useEffect(() => {
        if (!user) return;
        setFullName(user.displayName || "");
        setEmail(user.email || "");

        const fetchExtraData = async () => {
            try {
                const docRef = doc(db, "users", user.uid);
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setPhone(data.phoneNumber || "");
                    setDob(data.dateOfBirth || "");
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchExtraData();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (user.displayName !== fullName) {
                await updateProfile(user, { displayName: fullName });
            }

            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                displayName: fullName,
                phoneNumber: phone,
                dateOfBirth: dob
            });
            toast.success("Profile updated successfully!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to save changes.");
        } finally {
            setLoading(false);
        }
    };

    const [sendingTest, setSendingTest] = useState(false);

    const handleTestNotification = async () => {
        setSendingTest(true);
        try {
            const result = await sendTestNotification();
            if (result.success) {
                toast.success("Notification sent! 🔔 Check your device.");
            } else {
                toast.error(`OneSignal: ${result.error}`);
            }
        } catch (e: any) {
            toast.error("Failed to trigger notification.");
        } finally {
            setSendingTest(false);
        }
    };

    return (
        <motion.main
            className="flex min-h-screen flex-col bg-[#F4F4F6] text-[#1A1A1A] pb-32"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* ── AVATAR + NAME SECTION ── */}
            <motion.div variants={item} className="flex flex-col items-center pt-16 pb-6 px-6">
                <div className="relative mb-5">
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
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#D4A017] border-2 border-[#F4F4F6] shadow-sm flex items-center justify-center z-10">
                        <span className="text-white text-[10px] font-black">✦</span>
                    </div>
                </div>

                <h1 className="text-[1.6rem] font-bold text-[#5A413A] font-sans tracking-tight mt-2">
                    {fullName || "Ahmad Ibrahim"}
                </h1>
                <p className="text-[11px] font-bold text-[#9AA5AB] uppercase tracking-[0.18em] mt-1 text-center">
                    {location?.city ? `${location.city}, Malaysia` : "Kuala Lumpur, Malaysia"}
                </p>
            </motion.div>

            {/* ── PERSONAL INFORMATION FORM ── */}
            <motion.div variants={item} className="mx-5 space-y-5 px-1">
                <div className="space-y-4">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#4D6A53] uppercase tracking-[0.15em] ml-1">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-white border-none shadow-sm text-[#1A2B22] px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4D6A53]/20 font-bold text-[15px] transition-all"
                                placeholder="Muhaimin"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5 opacity-70">
                        <label className="text-[10px] font-bold text-[#4D6A53] uppercase tracking-[0.15em] ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full bg-white border-none shadow-sm text-[#1A2B22] cursor-not-allowed px-5 py-4 rounded-2xl focus:outline-none font-bold text-[15px]"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#4D6A53] uppercase tracking-[0.15em] ml-1">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white border-none shadow-sm text-[#1A2B22] px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4D6A53]/20 font-bold text-[15px] transition-all"
                            placeholder="+60 12-345 6789"
                        />
                    </div>

                    {/* Date Of Birth */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#4D6A53] uppercase tracking-[0.15em] ml-1">Date of Birth</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full bg-white border-none shadow-sm text-[#1A2B22] px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4D6A53]/20 font-bold text-[15px] transition-all pr-12"
                                placeholder="12 May 1992"
                            />
                            <div
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4D6A53] cursor-pointer hover:opacity-70 transition-opacity"
                                onClick={() => {
                                    try {
                                        dateInputRef.current?.showPicker();
                                    } catch (e) { }
                                }}
                            >
                                <Calendar size={18} strokeWidth={2.5} />
                                <input
                                    ref={dateInputRef}
                                    type="date"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            const date = new Date(e.target.value);
                                            setDob(date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-[#1A2420] text-white py-4 rounded-[1.25rem] font-bold shadow-lg transition-all disabled:opacity-50 hover:bg-[#25352c] active:scale-[0.98] text-[14px] tracking-wide flex items-center justify-center gap-2"
                >
                    {loading ? "SAVING..." : (
                        <>
                            <Save size={18} />
                            SAVE PROFILE
                        </>
                    )}
                </button>
            </motion.div>

            {/* ── ADMIN/DEVELOPER SECTION ── */}
            <motion.div variants={item} className="mx-5 mt-6 border-t border-slate-200 pt-6 space-y-4">
                {(isAdmin || process.env.NODE_ENV === "development") && (
                    <button
                        onClick={handleTestNotification}
                        disabled={sendingTest}
                        className="w-full bg-white rounded-[1.25rem] px-4 py-3.5 flex items-center justify-between shadow-sm hover:shadow-md transition-all border border-slate-50 disabled:opacity-50"
                    >
                        <div className="flex items-center gap-3.5">
                            <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                                <Bell size={20} strokeWidth={2} className="text-orange-600" />
                            </div>
                            <span className="font-semibold text-[15px] text-[#1A2420]">
                                {sendingTest ? "Sending..." : "Test Notification"}
                            </span>
                        </div>
                        {!sendingTest && (
                            <div className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                Dev tool
                            </div>
                        )}
                    </button>
                )}

                {isAdmin && (
                    <Link href="/admin/mosque">
                        <div className="bg-white rounded-[1.25rem] px-4 py-3.5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border border-slate-50">
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
            <motion.div variants={item} className="mx-5 mt-6">
                <button
                    onClick={signOut}
                    className="w-full flex items-center justify-center gap-2 py-4 text-[#E04B4B] font-bold text-[14px] tracking-wide bg-white hover:bg-red-50 rounded-[1.25rem] transition-colors shadow-sm"
                >
                    <LogOut size={17} strokeWidth={2.5} />
                    LOG OUT
                </button>
            </motion.div>
        </motion.main>
    );
}
