"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { useMosqueSettings, type MosqueSettings } from "@/hooks/use-mosque-settings";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { ShieldX, Save, CheckCircle2 } from "lucide-react";

export default function AdminMosquePage() {
    const { isAdmin, loading: adminLoading } = useAdmin();
    const { settings, loading: settingsLoading } = useMosqueSettings();

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
            setTimeout(() => setSaved(false), 2500);
        } catch (e) {
            console.error("Error saving mosque settings:", e);
        } finally {
            setSaving(false);
        }
    };

    if (adminLoading || settingsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 gap-4">
                <ShieldX className="w-12 h-12 text-red-500/60" />
                <h1 className="text-xl font-medium">Access Denied</h1>
                <p className="text-muted-foreground text-sm">You need admin privileges to view this page.</p>
            </div>
        );
    }

    return (
        <motion.main
            className="p-6 space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div>
                <h1 className="text-xl font-semibold tracking-tight">Mosque Settings</h1>
                <p className="text-muted-foreground text-sm">Edit your mosque information for the dashboard.</p>
            </div>

            <div className="space-y-4">
                <label className="block">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Mosque Name</span>
                    <input
                        className="w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-lg text-sm text-[#4A352D] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={form.mosqueName}
                        onChange={(e) => setForm({ ...form, mosqueName: e.target.value })}
                    />
                </label>

                <label className="block">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Address</span>
                    <input
                        className="w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-lg text-sm text-[#4A352D] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                </label>

                <label className="block">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Facilities (comma-separated)</span>
                    <input
                        className="w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-lg text-sm text-[#4A352D] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={facilitiesStr}
                        onChange={(e) => setFacilitiesStr(e.target.value)}
                        placeholder="Wudhu Area, Women's Section, AC"
                    />
                </label>

                <label className="block">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Parking</span>
                    <input
                        className="w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-lg text-sm text-[#4A352D] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={form.parking}
                        onChange={(e) => setForm({ ...form, parking: e.target.value })}
                    />
                </label>

                <label className="block">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Qiyam Time (HH:MM)</span>
                    <input
                        className="w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-lg text-sm text-[#4A352D] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={form.qiyamTime}
                        onChange={(e) => setForm({ ...form, qiyamTime: e.target.value })}
                        placeholder="03:30"
                    />
                </label>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-emerald-600 text-white p-3 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {saved ? (
                    <>
                        <CheckCircle2 size={18} /> Saved
                    </>
                ) : saving ? (
                    "Saving…"
                ) : (
                    <>
                        <Save size={18} /> Save Settings
                    </>
                )}
            </button>
        </motion.main>
    );
}
