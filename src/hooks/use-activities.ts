"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, where, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";


export interface Activity {
    id: string;
    title: string;
    timeSlot: string; // "AFTER MAGHRIB", "05:00 PM - 06:30 PM", "SATURDAY, 10 AM"
    location: string;
    image: string;
    description: string;
    type: string; // "class", "event", etc.
    dateISO: string; // YYYY-MM-DD format to match the selected calendar day
    createdAt?: any;
}

export function useActivities(selectedDateISO?: string | null) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }

        // If no date is provided, we fetch all activities, ordered by date
        const q = selectedDateISO
            ? query(
                collection(db, "activities"),
                where("dateISO", "==", selectedDateISO),
                orderBy("createdAt", "asc")
            )
            : query(
                collection(db, "activities"),
                orderBy("dateISO", "asc"),
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
            toast.success("Activity deleted");
        } catch (err: any) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete activity");
            throw err;
        }
    };

    const joinActivity = async (activityId: string, userId: string, userData: { name: string, email: string, photoURL: string | null }) => {
        if (!db) return;
        try {
            const participantDoc = doc(db, "activities", activityId, "participants", userId);
            await setDoc(participantDoc, {
                ...userData,
                joinedAt: serverTimestamp()
            });
        } catch (err: any) {
            console.error("Join failed:", err);
            throw err;
        }
    };

    return { activities, loading, error, addActivity, updateActivity, deleteActivity, joinActivity };
}

export function useActivityParticipants(activityId: string | null, isEnabled: boolean = true) {
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db || !activityId || !isEnabled) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "activities", activityId, "participants"),
            orderBy("joinedAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: any[] = [];
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });
            setParticipants(results);
            setLoading(false);
        }, (err) => {
            console.error("Participants fetch failed:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [activityId, isEnabled]);

    return { participants, loading };
}

export function useUpcomingActivities(limitCount = 5) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        const q = query(
            collection(db, "activities"),
            where("dateISO", ">=", today),
            orderBy("dateISO", "asc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const results: Activity[] = [];
                snapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() } as Activity);
                });
                setActivities(results.slice(0, limitCount));
                setLoading(false);
            },
            (err) => {
                console.error("Upcoming activities fetch failed:", err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [limitCount]);

    return { activities, loading };
}
