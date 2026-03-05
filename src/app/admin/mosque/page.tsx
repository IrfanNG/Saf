"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { useMosqueSettings, type MosqueSettings } from "@/hooks/use-mosque-settings";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { ShieldX, Save, CheckCircle2, ChevronLeft, Building2, MapPin, ListChecks, Car, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminMosquePage() {
    const { isAdmin, loading: adminLoading } = useAdmin();
    const { settings, loading: settingsLoading } = useMosqueSettings();
    const router = useRouter();

    const [form, setForm] = useState<MosqueSettings>({
        mosqueName: "",
        address: "",
        facilities: [],
        parking: "",
        qiyamTime: "03:30",
    });
    const [facilitiesStr, setFacilitiesStr] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!settingsLoading && settings) {
            setForm(settings);
            setFacilitiesStr(settings.facilities.join(", "));
        }
    }, [settings, settingsLoading]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const data = {
                ...form,
                facilities: facilitiesStr.split(",").map((s) => s.trim()).filter(Boolean),
            };
            await setDoc(doc(db, "mosque_info", "default"), data);
            setSaved(true);
            toast.success("Settings updated successfully!");
            setTimeout(() => setSaved(false), 2500);
        } catch (e) {
            console.error("Error saving mosque settings:", e);
            toast.error("Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    if (adminLoading || settingsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F4F4F6]">
                <div className="w-8 h-8 border-[3px] border-[#4D6A53] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F4F6] p-6 text-center">
                <div className="h-20 w-20 bg-white rounded-[2rem] flex items-center justify-center shadow-sm mb-6">
                    <ShieldX className="w-10 h-10 text-[#E04B4B]" />
                </div>
                <h1 className="text-2xl font-bold text-[#5A413A] font-sans mb-2">Access Denied</h1>
                <p className="text-[#7A8A93] font-medium text-[14px] max-w-[240px] leading-relaxed mb-8">
                    You do not have the administration privileges required to access this portal.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="h-12 px-8 bg-[#4D6A53] hover:bg-[#3D5542] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#4D6A53]/20 active:scale-95"
                >
                    Return Home
                </button>
            </div>
        );
    }

    const inputClasses = "w-full h-12 bg-[#F4F4F6] border-none rounded-2xl px-5 text-[14px] font-bold text-[#5A413A] focus:ring-2 focus:ring-[#4D6A53]/20 transition-all placeholder:text-[#A68F80]/40";
    const labelClasses = "text-[10px] uppercase tracking-widest font-bold text-[#A68F80] mb-2 pl-1 block";

    return (
        <main className="min-h-screen bg-[#F4F4F6] pb-24 pt-12 px-5">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Section */}
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="h-11 w-11 bg-white rounded-full flex items-center justify-center text-[#5A413A] transition-shadow active:scale-95 border border-white shadow-none"
                    >
                        <ChevronLeft size={20} strokeWidth={3} />
                    </button>
                    <div>
                        <p className="text-[10px] font-bold text-[#7D8F82] uppercase tracking-[0.15em] mb-0.5">
                            Saf / Administration
                        </p>
                        <h1 className="text-[1.8rem] font-bold tracking-tight text-[#5A413A] font-sans leading-none">
                            Admin Control
                        </h1>
                    </div>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-[2.5rem] p-7 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-white"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
                            <div className="h-8 w-8 bg-[#F8F5EE] rounded-lg flex items-center justify-center text-[#4D6A53] shrink-0">
                                <Building2 size={18} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-[16px] font-bold text-[#5A413A] tracking-tight">Mosque Information</h2>
                        </div>

                        <div className="grid gap-5">
                            <label className="block group">
                                <span className={labelClasses}>Mosque Name</span>
                                <input
                                    className={inputClasses}
                                    value={form.mosqueName}
                                    onChange={(e) => setForm({ ...form, mosqueName: e.target.value })}
                                    placeholder="Enter mosque name..."
                                />
                            </label>

                            <label className="block">
                                <span className={labelClasses}>Physical Address</span>
                                <div className="relative">
                                    <input
                                        className={inputClasses}
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        placeholder="Full address..."
                                    />
                                    <MapPin size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A68F80]/50 pointer-events-none" />
                                </div>
                            </label>

                            <label className="block">
                                <span className={labelClasses}>Facilities (comma-separated)</span>
                                <div className="relative">
                                    <input
                                        className={inputClasses}
                                        value={facilitiesStr}
                                        onChange={(e) => setFacilitiesStr(e.target.value)}
                                        placeholder="e.g. Wudhu, AC, Library"
                                    />
                                    <ListChecks size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A68F80]/50 pointer-events-none" />
                                </div>
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                <label className="block">
                                    <span className={labelClasses}>Parking</span>
                                    <div className="relative">
                                        <input
                                            className={inputClasses}
                                            value={form.parking}
                                            onChange={(e) => setForm({ ...form, parking: e.target.value })}
                                            placeholder="Available areas..."
                                        />
                                        <Car size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A68F80]/50 pointer-events-none" />
                                    </div>
                                </label>

                                <label className="block">
                                    <span className={labelClasses}>Qiyam Time</span>
                                    <div className="relative">
                                        <input
                                            className={inputClasses}
                                            value={form.qiyamTime}
                                            onChange={(e) => setForm({ ...form, qiyamTime: e.target.value })}
                                            placeholder="03:30"
                                        />
                                        <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A68F80]/50 pointer-events-none" />
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full h-14 bg-[#4D6A53] hover:bg-[#3D5542] text-white font-bold rounded-[1.25rem] shadow-[0_8px_25px_rgba(77,106,83,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden group"
                            >
                                {saved ? (
                                    <>
                                        <CheckCircle2 size={20} className="text-white" /> Settings Saved
                                    </>
                                ) : saving ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={19} className="group-hover:translate-y-[-1px] transition-transform" strokeWidth={2.5} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>

                <p className="text-center text-[#A68F80] text-[11px] font-bold uppercase tracking-wider opacity-60">
                    Proprietary Administration Access Portal
                </p>
            </div>
        </main>
    );
}
