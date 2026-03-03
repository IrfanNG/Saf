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
                    console.log("Firebase: User data located:", data);
                    const role = String(data?.role || "").toLowerCase().trim();
                    if (role === "admin") {
                        setIsAdmin(true);
                    } else {
                        console.warn(`Firebase: Role mismatch. Expected 'admin', got '${role}'`);
                        setIsAdmin(false);
                    }
                } else {
                    console.warn(`Firebase: No user document found at collection 'users' with UID '${user.uid}'`);
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
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
