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
 * Formats a Date object specifically for Kuala Lumpur (GMT+0800)
 * formatted as "YYYY-MM-DD HH:mm:ss GMT+0800"
 */
function formatDateForKL(tsSeconds: number) {
    const date = new Date(tsSeconds * 1000);

    // Use Intl to get parts in KL timezone
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const p: any = {};
    parts.forEach(part => { p[part.type] = part.value; });

    // OneSignal prefers "YYYY-MM-DD HH:mm:ss GMT+0800"
    return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} GMT+0800`;
}

/**
 * Core logic to schedule notifications
 */
async function performScheduling() {
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
        console.error("Missing OneSignal credentials in environment variables.");
        throw new Error("Missing OneSignal credentials");
    }

    // 1. Fetch Prayer Times from API (Same as app)
    const url = `https://api.waktusolat.app/v2/solat/gps/${LAT}/${LNG}`;
    const res = await axios.get(url);
    const prayers = res.data.prayers;

    // Get current date in KL
    const now = new Date();
    const klParts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).formatToParts(now);

    const kp: any = {};
    klParts.forEach(part => { kp[part.type] = part.value; });

    const todayNum = parseInt(kp.day);

    const todayEntry = prayers.find((p: any) => p.day === todayNum);

    if (!todayEntry) {
        throw new Error(`Could not find prayer times for day ${todayNum} in API response.`);
    }

    // 2. Build Timings List (using the seconds from API)
    // Using names Subuh, Zuhur, Asar, Maghrib, Isyak as requested/displayed in app
    const timings = [
        { name: "Subuh", time: todayEntry.fajr },
        { name: "Zuhur", time: todayEntry.dhuhr },
        { name: "Asar", time: todayEntry.asr },
        { name: "Maghrib", time: todayEntry.maghrib },
        { name: "Isyak", time: todayEntry.isha },
    ];

    // 3. Handle Qiamullail from Firestore
    let qiamTimeStr = "03:30";
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
    // Qiamullail SendAfter for today's date
    const qiamSendAfter = `${kp.year}-${kp.month}-${kp.day} ${qH.toString().padStart(2, '0')}:${qM.toString().padStart(2, '0')}:00 GMT+0800`;

    // 4. Send to OneSignal
    const results = [];

    // Process Prayer Times
    for (const prayer of timings) {
        const sendAfter = formatDateForKL(prayer.time);
        const prayerTimestampMs = prayer.time * 1000;

        // Skip if already passed (buffer of 1 minute to avoid race conditions if triggered exactly at time)
        if (prayerTimestampMs < (Date.now() - 60000)) {
            console.log(`Skipping ${prayer.name} because it has already passed (${sendAfter})`);
            continue;
        }

        try {
            const notification = {
                app_id: ONESIGNAL_APP_ID,
                headings: { en: "Waktu Solat" },
                contents: { en: `Dah masuk waktu ${prayer.name}. Jom ke Masjid Al-Azim!` },
                included_segments: ["Subscribed Users", "Total Subscriptions"],
                send_after: sendAfter,
                priority: 10
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
            console.error(`❌ Failed ${prayer.name}:`, JSON.stringify(err.response?.data || err.message));
            results.push({ prayer: prayer.name, status: "failed", error: err.response?.data?.errors?.[0] || err.message });
        }
    }

    // Process Qiamullail separately
    try {
        const notification = {
            app_id: ONESIGNAL_APP_ID,
            headings: { en: "Waktu Qiamullail" },
            contents: { en: "Dah masuk waktu Qiamullail. Jom ke Masjid Al-Azim!" },
            included_segments: ["Subscribed Users", "Total Subscriptions"],
            send_after: qiamSendAfter,
            priority: 10
        };
        const response = await axios.post("https://onesignal.com/api/v1/notifications", notification, {
            headers: {
                "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`,
                "Content-Type": "application/json",
            }
        });
        results.push({ prayer: "Qiamullail", status: "scheduled", id: response.data.id });
    } catch (err: any) {
        results.push({ prayer: "Qiamullail", status: "failed", error: err.message });
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
