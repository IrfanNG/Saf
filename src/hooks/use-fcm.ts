"use client";

import { useState, useEffect } from "react";
import { messaging, db } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";

export function useFCM() {
    const { user } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [permission, setPermission] = useState<NotificationPermission>("default");
    const [loading, setLoading] = useState(false);

    // Refresh permission state and register SW on mount
    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            setPermission(Notification.permission);
        }

        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            navigator.serviceWorker.register("/firebase-messaging-sw.js", {
                scope: "/"
            }).then((reg) => {
                console.log("FCM: SW Registered on mount:", reg.scope);
            }).catch((err) => {
                console.error("FCM: SW Registration failed on mount:", err);
            });
        }
    }, []);

    const requestPermission = async () => {
        if (typeof window === "undefined" || !("Notification" in window)) {
            console.warn("FCM: Notifications not supported.");
            return;
        }

        try {
            setLoading(true);
            console.log("FCM: Requesting permission...");
            const status = await Notification.requestPermission();
            setPermission(status);
            console.log("FCM: Permission status received:", status);

            if (status === "granted") {
                console.log("FCM: Waiting for Service Worker to be ready...");
                const registration = await navigator.serviceWorker.ready;
                console.log("FCM: Service Worker ready:", registration.active?.state);

                const fcmMessaging = await messaging();
                if (fcmMessaging) {
                    console.log("FCM: Fetching token...");
                    const currentToken = await getToken(fcmMessaging, {
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                        serviceWorkerRegistration: registration
                    });

                    if (currentToken) {
                        console.log("FCM: Token acquired.");
                        setToken(currentToken);
                        if (user) {
                            const userRef = doc(db, "users", user.uid);
                            await updateDoc(userRef, {
                                fcmTokens: arrayUnion(currentToken),
                                notificationsEnabled: true
                            });
                            console.log("FCM: Token updated in Firestore.");
                        }
                    } else {
                        console.warn("FCM: No token returned.");
                    }
                }
            } else if (status === "denied") {
                alert("Notifications are disabled. Please enable them in your browser/app settings to receive Qiyamullail alerts.");
            }
        } catch (error: any) {
            console.error("FCM: Error in requestPermission:", error);
            alert("Error: " + (error?.message || "Failed to enable notifications"));
        } finally {
            setLoading(false);
        }
    };

    const unsubscribeFromNotifications = async () => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                notificationsEnabled: false
            });
            setPermission("denied"); // Simulate optic-out
        }
    };

    // Listen for foreground messages
    useEffect(() => {
        let unsubscribe: () => void = () => { };

        const setupListener = async () => {
            const fcmMessaging = await messaging();
            if (fcmMessaging) {
                unsubscribe = onMessage(fcmMessaging, (payload) => {
                    console.log("FCM: Foreground message received:", payload);
                    // You could show a toast here
                });
            }
        };

        setupListener();
        return () => unsubscribe();
    }, []);

    return { token, permission, loading, requestPermission, unsubscribeFromNotifications };
}
