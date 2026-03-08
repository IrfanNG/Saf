import * as functionsV2 from "firebase-functions/v2";
import * as functionsV1 from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

// Coordinates for Masjid Al-Azim, Melaka
const LAT = 2.2173;
const LNG = 102.2472;

/**
 * Formats a Date object as a UTC string for OneSignal
 * format: "YYYY-MM-DD HH:mm:ss GMT+0000"
 */
function formatDateForOneSignal(tsSeconds: number) {
    const date = new Date(tsSeconds * 1000);
    const pad = (n: number) => n.toString().padStart(2, '0');

    const y = date.getUTCFullYear();
    const m = pad(date.getUTCMonth() + 1);
    const d = pad(date.getUTCDate());
    const h = pad(date.getUTCHours());
    const min = pad(date.getUTCMinutes());
    const s = pad(date.getUTCSeconds());

    return `${y}-${m}-${d} ${h}:${min}:${s} GMT+0000`;
}

/**
 * Core logic to schedule notifications
 */
async function performScheduling() {
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
        throw new Error("Missing OneSignal credentials");
    }

    // 1. Fetch Prayer Times from API (Same as app)
    const url = `https://api.waktusolat.app/v2/solat/gps/${LAT}/${LNG}`;
    const res = await axios.get(url);
    const prayers = res.data.prayers;

    // Get current date in KL to find correct day index
    // Note: API returns 1-31 based on day of month
    const nowInKL = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }));
    const todayNum = nowInKL.getDate();

    const todayEntry = prayers.find((p: any) => p.day === todayNum);

    if (!todayEntry) {
        throw new Error(`Could not find prayer times for day ${todayNum}`);
    }

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
        console.log("Error fetching qiyamTime from Firestore, using default 03:30");
    }

    // Qiamullail processing: convert KL HH:mm of "today" into UTC string
    const [qH, qM] = qiamTimeStr.split(":").map(Number);
    // Create date for today in KL
    const qDate = new Date(nowInKL);
    qDate.setHours(qH, qM, 0, 0);
    const qiamSeconds = Math.floor(qDate.getTime() / 1000);

    // 4. Send to OneSignal
    const results = [];

    for (const prayer of timings) {
        const sendAfter = formatDateForOneSignal(prayer.time);

        // Skip if already passed (1 min buffer)
        if ((prayer.time * 1000) < (Date.now() - 60000)) {
            console.log(`Skipping ${prayer.name} (${sendAfter}) - already passed.`);
            continue;
        }

        try {
            const notification = {
                app_id: ONESIGNAL_APP_ID,
                headings: { en: "Waktu Solat" },
                contents: { en: `Dah masuk waktu ${prayer.name}. Jom ke Masjid Al-Azim! 🕌` },
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

            console.log(`✅ Scheduled ${prayer.name} for ${sendAfter} (UTC). ID: ${response.data.id}`);
            results.push({ prayer: prayer.name, status: "scheduled", id: response.data.id });
        } catch (err: any) {
            console.error(`❌ Failed ${prayer.name}:`, err.response?.data || err.message);
            results.push({ prayer: prayer.name, status: "failed", error: err.message });
        }
    }

    // Handle Qiamullail
    if ((qiamSeconds * 1000) >= Date.now()) {
        const qiamSendAfter = formatDateForOneSignal(qiamSeconds);
        try {
            const response = await axios.post("https://onesignal.com/api/v1/notifications", {
                app_id: ONESIGNAL_APP_ID,
                headings: { en: "Waktu Qiamullail" },
                contents: { en: "Dah masuk waktu Qiamullail. Jom ke Masjid Al-Azim! 🌙" },
                included_segments: ["Subscribed Users", "Total Subscriptions"],
                send_after: qiamSendAfter,
                priority: 10
            }, {
                headers: {
                    "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`,
                    "Content-Type": "application/json",
                }
            });
            results.push({ prayer: "Qiamullail", status: "scheduled", id: response.data.id });
        } catch (err: any) {
            results.push({ prayer: "Qiamullail", status: "failed", error: err.message });
        }
    }

    return results;
}

// v2 Scheduler (runs at 1AM KL)
export const schedulePrayerNotifications = functionsV2.scheduler.onSchedule({
    schedule: "0 1 * * *",
    timeZone: "Asia/Kuala_Lumpur",
    memory: "256MiB",
}, async () => {
    await performScheduling();
});

// v1 HTTP Trigger for reliable URL (easier for manual trigger)
export const forceTrigger = functionsV1.region("us-central1").https.onRequest(async (req, res) => {
    try {
        const results = await performScheduling();
        res.status(200).send({ message: "Done", results });
    } catch (err: any) {
        res.status(500).send({ error: err.message });
    }
});
