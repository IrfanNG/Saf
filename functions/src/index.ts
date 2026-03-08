import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

// Coordinates for Masjid Al-Azim, Melaka
const LAT = 2.2173;
const LNG = 102.2472;

/**
 * Formats a Date object to OneSignal's preferred format: "YYYY-MM-DD HH:mm:ss GMT+0800"
 */
function formatDateForOneSignal(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    const s = pad(date.getSeconds());
    return `${y}-${m}-${d} ${h}:${min}:${s} GMT+0800`;
}

/**
 * Core logic to schedule notifications
 */
async function performScheduling() {
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
        console.error("Missing OneSignal credentials in environment variables.");
        throw new Error("Missing OneSignal credentials");
    }

    console.log(`Using App ID: ${ONESIGNAL_APP_ID}`);

    // 1. Fetch Prayer Times from API
    const url = `https://api.waktusolat.app/v2/solat/gps/${LAT}/${LNG}`;
    const res = await axios.get(url);
    const prayers = res.data.prayers;

    // Determine today's date in Malaysia context
    const now = new Date();
    const KL_OFFSET = 8 * 60; // UTC+8 in minutes
    const localNow = new Date(now.getTime() + (now.getTimezoneOffset() + KL_OFFSET) * 60000);
    const todayNum = localNow.getDate();

    const todayEntry = prayers.find((p: any) => p.day === todayNum);

    if (!todayEntry) {
        throw new Error(`Could not find prayer times for day ${todayNum} in API response.`);
    }

    // 2. Prepare Timings List
    const timings = [
        { name: "Fajr", time: todayEntry.fajr },
        { name: "Dhuhr", time: todayEntry.dhuhr },
        { name: "Asr", time: todayEntry.asr },
        { name: "Maghrib", time: todayEntry.maghrib },
        { name: "Isha", time: todayEntry.isha },
    ];

    // 3. Fetch Qiamullail from Firestore
    let qiamTimeStr = "03:30"; // Default
    try {
        const settingsDoc = await admin.firestore().doc("settings/mosque").get();
        if (settingsDoc.exists) {
            const data = settingsDoc.data();
            if (data && data.qiyamTime) {
                qiamTimeStr = data.qiyamTime;
            }
        }
    } catch (err) {
        console.log("Error fetching qiyamTime from Firestore, using default 03:30", err);
    }

    const [qH, qM] = qiamTimeStr.split(":").map(Number);
    const qiamDate = new Date(localNow);
    qiamDate.setHours(qH, qM, 0, 0);
    const qiamTimestamp = Math.floor(qiamDate.getTime() / 1000);

    timings.push({ name: "Qiamullail", time: qiamTimestamp });

    // 4. Send to OneSignal
    const results = [];
    for (const prayer of timings) {
        const prayerDate = new Date(prayer.time * 1000);
        const sendAfter = formatDateForOneSignal(prayerDate);

        // Don't schedule if the time has already passed for today
        if (prayerDate.getTime() < now.getTime()) {
            console.log(`Skipping ${prayer.name} because it has already passed (${sendAfter})`);
            continue;
        }

        try {
            const notification = {
                app_id: ONESIGNAL_APP_ID,
                headings: { en: "Waktu Solat" },
                contents: { en: `Dah masuk waktu ${prayer.name}. Jom ke Masjid Al-Azim!` },
                included_segments: ["All"],
                send_after: sendAfter,
            };

            const response = await axios.post("https://onesignal.com/api/v1/notifications", notification, {
                headers: {
                    "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`,
                    "Content-Type": "application/json",
                }
            });

            console.log(`✅ Scheduled ${prayer.name} for ${sendAfter}. ID: ${response.data.id}`);
            results.push({ prayer: prayer.name, status: "scheduled", id: response.data.id });
        } catch (err: any) {
            const errorData = err.response?.data || err.message;
            console.error(`❌ Failed to schedule ${prayer.name}:`, JSON.stringify(errorData));
            results.push({ prayer: prayer.name, status: "failed", error: errorData });
        }
    }
    return results;
}

export const schedulePrayerNotifications = functions.scheduler.onSchedule({
    schedule: "0 1 * * *", // 1:00 AM daily
    timeZone: "Asia/Kuala_Lumpur",
    memory: "256MiB",
}, async (event: any) => {
    console.log("Starting scheduled prayer notification task...");
    await performScheduling();
    console.log("Scheduled task complete.");
});

// Manual trigger for testing
export const forceTriggerScheduling = functions.https.onRequest(async (req, res) => {
    console.log("Manual trigger started...");
    try {
        const results = await performScheduling();
        res.status(200).json({
            message: "Manual scheduling process completed.",
            results: results
        });
    } catch (err: any) {
        console.error("Manual trigger failed:", err.message);
        res.status(500).json({ error: err.message });
    }
});
