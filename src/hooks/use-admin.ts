"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useAdmin() {
    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, "users", user.uid);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    console.log("useAdmin: Raw Firestore Data:", data);
                    const role = String(data?.role || "").toLowerCase().trim();
                    console.log(`useAdmin: Parsed role: "${role}"`);
                    if (role === "admin") {
                        setIsAdmin(true);
                    } else {
                        console.warn(`useAdmin: Role mismatch for UID ${user.uid}. Expected 'admin', got '${role}'`);
                        setIsAdmin(false);
                    }
                } else {
                    console.warn(`useAdmin: No user document found for UID ${user.uid} in 'users' collection.`);
                    setIsAdmin(false);
                }
            } catch (error: any) {
                console.error("useAdmin: Error fetching admin doc:", error?.message || error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            checkAdmin();
        }
    }, [user, authLoading]);

    return { isAdmin, loading: loading || authLoading };
}
