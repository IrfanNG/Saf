"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Activity {
    id: string;
    title: string;
    timeSlot: string; // "AFTER MAGHRIB", "05:00 PM - 06:30 PM", "SATURDAY, 10 AM"
    location: string;
    image: string;
    dateISO: string; // YYYY-MM-DD format to match the selected calendar day
    createdAt?: any;
}

export function useActivities(selectedDateISO: string) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }

        // We only fetch for the currently selected date to keep the view clean
        const q = query(
            collection(db, "activities"),
            where("dateISO", "==", selectedDateISO),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const results: Activity[] = [];
                snapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() } as Activity);
                });
                setActivities(results);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching activities:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [selectedDateISO]);

    const addActivity = async (data: Omit<Activity, "id" | "createdAt">) => {
        if (!db) return;
        try {
            await addDoc(collection(db, "activities"), {
                ...data,
                createdAt: serverTimestamp(),
            });
        } catch (err: any) {
            console.error("Add failed:", err);
            throw err;
        }
    };

    const updateActivity = async (id: string, data: Partial<Omit<Activity, "id">>) => {
        if (!db) return;
        try {
            await updateDoc(doc(db, "activities", id), data);
        } catch (err: any) {
            console.error("Update failed:", err);
            throw err;
        }
    };

    const deleteActivity = async (id: string) => {
        if (!db) return;
        try {
            await deleteDoc(doc(db, "activities", id));
        } catch (err: any) {
            console.error("Delete failed:", err);
            throw err;
        }
    };

    return { activities, loading, error, addActivity, updateActivity, deleteActivity };
}
