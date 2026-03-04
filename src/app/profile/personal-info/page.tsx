"use client";

import { useAuth } from "@/context/auth-context";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Edit2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";

export default function PersonalInfoPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Fetch full profile info out of auth context & firestore
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
            // Update Core Auth Profile Profile Display Name
            if (user.displayName !== fullName) {
                await updateProfile(user, { displayName: fullName });
            }

            // Update Additional Properties in the Firestore User Collection
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                displayName: fullName,
                phoneNumber: phone,
                dateOfBirth: dob
            });

            router.back();
        } catch (e) {
            console.error(e);
            alert("Failed to save changes.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-[#FAFAFA] text-[#1A1A1A] pb-32 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
                <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition">
                    <ArrowLeft size={24} className="text-[#1A1A1A]" />
                </button>
                <h1 className="text-xl font-semibold tracking-tight text-[#1A1A1A]">Personal Information</h1>
                <div className="w-10"></div> {/* Spacer for alignment */}
            </div>

            <div className="flex flex-col px-6 mt-4 w-full">
                {/* Avatar Area */}
                <div className="flex justify-center mb-10">
                    <div className="relative w-[110px] h-[110px]">
                        <div className="absolute inset-0 rounded-full bg-[#E47F66] shadow-sm overflow-hidden flex items-center justify-center">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-white opacity-80 text-4xl font-bold uppercase">{user?.email?.charAt(0) || "U"}</div>
                            )}
                        </div>
                        {/* Edit badge */}
                        <div className="absolute bottom-0 right-0 w-9 h-9 bg-[#C55D40] rounded-full border-[3px] border-[#FAFAFA] flex items-center justify-center cursor-pointer hover:bg-[#A94A2F] transition z-10">
                            <Edit2 size={14} className="text-white ml-0.5 mt-0.5" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-[#1A1A1A] px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CC6449] placeholder:text-slate-400 shadow-sm font-medium"
                            placeholder="Ahmed Al-Farsi"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full bg-white border border-slate-200 text-[#1A1A1A] opacity-70 cursor-not-allowed px-4 py-3.5 rounded-2xl focus:outline-none placeholder:text-slate-400 shadow-sm font-medium"
                            placeholder="ahmed.alfarsi@example.com"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-[#1A1A1A] px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CC6449] placeholder:text-slate-400 shadow-sm font-medium"
                            placeholder="+971 50 123 4567"
                        />
                    </div>

                    {/* Date Of Birth */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full bg-white border border-slate-200 text-[#1A1A1A] px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CC6449] placeholder:text-slate-400 shadow-sm font-medium pr-12"
                                placeholder="12 May 1992"
                            />
                            <div
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600 transition"
                                onClick={() => {
                                    try {
                                        dateInputRef.current?.showPicker();
                                    } catch (e) {
                                        // Ignore fallback error
                                    }
                                }}
                            >
                                <Calendar size={20} />
                                <input
                                    ref={dateInputRef}
                                    type="date"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [color-scheme:light]"
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

                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-[#FAFAFA] border-t border-slate-200 z-50 pt-4 pb-8">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-[#C55D40] text-white py-4 rounded-xl font-bold shadow-sm transition disabled:opacity-50 hover:bg-[#A94A2F] active:scale-[0.98]"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </main>
    );
}
