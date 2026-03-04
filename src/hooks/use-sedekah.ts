"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export interface SedekahSettings {
    bankName: string;
    accountNumber: string;
    qrCodeUrl: string;
}

const DEFAULTS: SedekahSettings = {
    bankName: "Bank Islamic",
    accountNumber: "1234567890",
    qrCodeUrl: "", // If empty, displays a placeholder or error
};

export function useSedekah() {
    const [settings, setSettings] = useState<SedekahSettings>(DEFAULTS);
    const [loading, setLoading] = useState(true);

    const loadSettings = async () => {
        try {
            const snap = await getDoc(doc(db, "sedekah_info", "default"));
            if (snap.exists()) {
                const data = snap.data();
                setSettings({
                    bankName: data.bankName || DEFAULTS.bankName,
                    accountNumber: data.accountNumber || DEFAULTS.accountNumber,
                    qrCodeUrl: data.qrCodeUrl || DEFAULTS.qrCodeUrl,
                });
            }
        } catch (e: any) {
            console.error("Error loading sedekah settings:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const updateSettings = async (newData: Partial<SedekahSettings>, file: File | null) => {
        try {
            let fileUrl = settings.qrCodeUrl;
            if (file) {
                const fileRef = ref(storage, `sedekah/qr_code_${Date.now()}`);
                const uploadResult = await uploadBytes(fileRef, file);
                fileUrl = await getDownloadURL(uploadResult.ref);
            }

            const updatedData = { ...settings, ...newData, qrCodeUrl: fileUrl };
            await setDoc(doc(db, "sedekah_info", "default"), updatedData, { merge: true });
            setSettings(updatedData);
        } catch (error) {
            console.error("Error updating sedekah settings:", error);
            throw error;
        }
    };

    return { settings, loading, updateSettings };
}
