"use server";

import axios from "axios";

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

export async function sendTestNotification() {
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
        throw new Error("OneSignal keys are missing in environment variables.");
    }

    try {
        const response = await axios.post(
            "https://onesignal.com/api/v1/notifications",
            {
                app_id: ONESIGNAL_APP_ID,
                headings: { en: "Salam Irfan!" },
                contents: {
                    en: "Saf push notifications are now active. Ready for Ramadhan? 🌙",
                },
                included_segments: ["Subscribed Users", "Total Subscriptions"],
                priority: 10, // High priority for instant delivery
                ttl: 3600, // Time to live 1 hour
                // Target: we could use include_external_user_ids or just All for testing
                // But normally "self-push" would be to the current user.
                // For a simple 'Test Notification' button that confirms everything is working, 
                // blasting to all subscribed users in dev is usually what's requested 
                // but let's stick to a broad segments for a generic test.
            },
            {
                headers: {
                    Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("OneSignal Error:", error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.errors?.[0] || error.message,
        };
    }
}
