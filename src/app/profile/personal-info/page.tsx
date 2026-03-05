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
        <main className="flex min-h-screen flex-col bg-[#FBFBFB] text-[#1A2B22] pb-32 font-sans">
            {/* Header */}
            <div className="bg-white px-5 pt-8 pb-4 border-b border-[#E8ECE9]/30 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-50 bg-[#EEE9DF]/30">
                        <ArrowLeft size={20} className="text-[#1A2B22]" strokeWidth={2.5} />
                    </button>
                    <h1 className="text-[1.25rem] font-bold text-[#1A2B22] font-serif tracking-tight">Personal Information</h1>
                </div>
            </div>

            <div className="flex flex-col px-6 mt-8 w-full">
                {/* Avatar Area */}
                <div className="flex justify-center mb-10">
                    <div className="relative w-[110px] h-[110px]">
                        <div className="absolute inset-0 rounded-[2.5rem] bg-[#4D6A53] shadow-lg shadow-[#4D6A53]/20 overflow-hidden flex items-center justify-center">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-white opacity-90 text-4xl font-bold uppercase">{user?.email?.charAt(0) || "U"}</div>
                            )}
                        </div>
                        {/* Edit badge */}
                        <div className="absolute bottom-0 right-0 w-9 h-9 bg-[#3D5542] rounded-2xl border-[3px] border-[#FBFBFB] flex items-center justify-center cursor-pointer hover:bg-[#2D3F31] shadow-md transition-all z-10 active:scale-90">
                            <Edit2 size={14} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Full Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-[#4D6A53] uppercase tracking-widest ml-1">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white border border-[#E8ECE9] shadow-sm text-[#1A2B22] px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4D6A53]/20 placeholder:text-slate-400 font-bold text-sm transition-all"
                            placeholder="Muhaimin"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-[#4D6A53] uppercase tracking-widest ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full bg-white border border-[#E8ECE9] shadow-sm text-[#1A2B22] opacity-60 cursor-not-allowed px-5 py-4 rounded-2xl focus:outline-none placeholder:text-slate-400 font-bold text-sm"
                            placeholder="muhaimin@gmail.com"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-[#4D6A53] uppercase tracking-widest ml-1">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white border border-[#E8ECE9] shadow-sm text-[#1A2B22] px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4D6A53]/20 placeholder:text-slate-400 font-bold text-sm transition-all"
                            placeholder="+60 12-345 6789"
                        />
                    </div>

                    {/* Date Of Birth */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-[#4D6A53] uppercase tracking-widest ml-1">Date of Birth</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full bg-white border border-[#E8ECE9] shadow-sm text-[#1A2B22] px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4D6A53]/20 placeholder:text-slate-400 font-bold text-sm transition-all pr-12"
                                placeholder="12 May 1992"
                            />
                            <div
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4D6A53] cursor-pointer hover:opacity-70 transition-opacity"
                                onClick={() => {
                                    try {
                                        dateInputRef.current?.showPicker();
                                    } catch (e) {
                                        // Ignore fallback error
                                    }
                                }}
                            >
                                <Calendar size={18} strokeWidth={2.5} />
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

                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-white border-t border-[#E8ECE9]/30 z-50 pt-4 pb-8 shadow-[0_-4px_30px_rgba(0,0,0,0.03)]">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-[#4D6A53] text-white py-4 rounded-[1.25rem] font-bold shadow-lg shadow-[#4D6A53]/20 transition-all disabled:opacity-50 hover:bg-[#3D5542] active:scale-[0.98] text-sm tracking-wide"
                    >
                        {loading ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                </div>
            </div>
        </main>
    );
}
