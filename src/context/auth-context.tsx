"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (e: string, p: string) => Promise<void>;
    signUpWithEmail: (e: string, p: string, username?: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const syncUserToFirestore = async (currentUser: User) => {
        if (!currentUser) return;
        const docRef = doc(db, "users", currentUser.uid);
        try {
            const snap = await getDoc(docRef);
            if (!snap.exists()) {
                await setDoc(docRef, {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                    role: "user",
                    streak: 0,
                    createdAt: serverTimestamp(),
                });
            }
        } catch (error) {
            console.error("Error syncing user to Firestore:", error);
        }
    };

    useEffect(() => {
        if (!auth.app) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await syncUserToFirestore(currentUser);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const checkFirebaseConfig = () => {
        if (!auth.app) {
            alert("Firebase is not configured! Please add your Firebase credentials to an .env.local file.");
            throw new Error("Firebase is not configured");
        }
    };

    const signInWithGoogle = async () => {
        checkFirebaseConfig();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await syncUserToFirestore(result.user);
    };

    const signInWithEmail = async (e: string, p: string) => {
        checkFirebaseConfig();
        await signInWithEmailAndPassword(auth, e, p);
    };

    const signUpWithEmail = async (e: string, p: string, username?: string) => {
        checkFirebaseConfig();
        const result = await createUserWithEmailAndPassword(auth, e, p);

        if (username) {
            await import("firebase/auth").then(({ updateProfile }) => {
                return updateProfile(result.user, { displayName: username });
            });
            // Update local user state immediately so UI refresh catches it
            setUser({ ...result.user, displayName: username } as User);

            // Re-sync explicitly to catch new displayName
            const docRef = doc(db, "users", result.user.uid);
            await setDoc(docRef, {
                uid: result.user.uid,
                email: result.user.email,
                displayName: username,
                photoURL: result.user.photoURL,
                role: "user",
                streak: 0,
                createdAt: serverTimestamp(),
            }, { merge: true });
        } else {
            await syncUserToFirestore(result.user);
        }
    };

    const signOut = async () => {
        if (!auth.app) return;
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signInWithGoogle,
                signInWithEmail,
                signUpWithEmail,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
