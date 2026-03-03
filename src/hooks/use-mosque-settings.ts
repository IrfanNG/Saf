"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface MosqueSettings {
    mosqueName: string;
    address: string;
    facilities: string[];
    parking: string;
    qiyamTime: string;
}

const DEFAULTS: MosqueSettings = {
    mosqueName: "Masjid Al-Azim Negeri Melaka",
    address: "Jalan Utama, Bukit Piatu, 75150 Melaka",
    facilities: ["Spacious Wudhu", "Air-Conditioned", "Parking Area"],
    parking: "Ample parking — Free for congregants",
    qiyamTime: "03:30",
};

export function useMosqueSettings() {
    const [settings, setSettings] = useState<MosqueSettings>(DEFAULTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const snap = await getDoc(doc(db, "mosque_info", "default"));
                if (snap.exists()) {
                    const data = snap.data() as Partial<MosqueSettings>;
                    setSettings({
                        mosqueName: data.mosqueName || DEFAULTS.mosqueName,
                        address: data.address || DEFAULTS.address,
                        facilities: data.facilities || DEFAULTS.facilities,
                        parking: data.parking || DEFAULTS.parking,
                        qiyamTime: data.qiyamTime || DEFAULTS.qiyamTime,
                    });
                }
            } catch (e: any) {
                if (e.code === "permission-denied") {
                    console.warn("Firestore: Permission denied. Using default mosque settings.");
                } else {
                    console.error("Error loading mosque settings:", e);
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return { settings, loading };
}
