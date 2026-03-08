import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

const ONESIGNAL_APP_ID = "8ecc3f70-159f-45ed-b93c-cceb724a9885";
const ONESIGNAL_REST_API_KEY = "8ecc3f70-159f-45ed-b93c-cceb724a9885";

// Coordinates for Masjid Al-Azim, Melaka
const LAT = 2.2173;
const LNG = 102.2472;

export const schedulePrayerNotifications = functions.scheduler.onSchedule({
    schedule: "0 1 * * *", // 1:00 AM daily
    timeZone: "Asia/Kuala_Lumpur",
    memory: "256MiB",
}, async (event: any) => {
    try {
        console.log("Starting prayer notification scheduling...");

        // 1. Fetch Prayer Times from API
        const url = `https://api.waktusolat.app/v2/solat/gps/${LAT}/${LNG}`;
        const res = await axios.get(url);
        const prayers = res.data.prayers;

        const now = new Date();
        const KL_OFFSET = 8 * 60; // UTC+8
        const localNow = new Date(now.getTime() + (now.getTimezoneOffset() + KL_OFFSET) * 60000);
        const todayNum = localNow.getDate();

        const todayEntry = prayers.find((p: any) => p.day === todayNum);

        if (!todayEntry) {
            console.error("Could not find prayer times for today.");
            return;
        }

        // 2. Format Prayer Times
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

        // Parse Qiamullail time to Unix timestamp
        const [qH, qM] = qiamTimeStr.split(":").map(Number);
        const qiamDate = new Date(localNow);
        qiamDate.setHours(qH, qM, 0, 0);
        const qiamTimestamp = Math.floor(qiamDate.getTime() / 1000);

        timings.push({ name: "Qiamullail", time: qiamTimestamp });

        // 4. Schedule Notifications via OneSignal
        for (const prayer of timings) {
            const prayerDate = new Date(prayer.time * 1000);

            // Generate ISO 8601 string in Format for OneSignal (e.g. "2024-03-08 19:30:00 GMT+0800")
            // OneSignal send_after expects a string or date.
            const sendAfter = prayerDate.toString();

            try {
                const notification = {
                    app_id: ONESIGNAL_APP_ID,
                    headings: { en: "Waktu Solat" },
                    contents: { en: `Dah masuk waktu ${prayer.name}. Jom ke Masjid Al-Azim!` },
                    included_segments: ["All"],
                    send_after: sendAfter,
                };

                await axios.post("https://onesignal.com/api/v1/notifications", notification, {
                    headers: {
                        "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`,
                        "Content-Type": "application/json",
                    }
                });

                console.log(`Scheduled ${prayer.name} for ${sendAfter}`);
            } catch (err: any) {
                console.error(`Failed to schedule ${prayer.name}:`, err.response?.data || err.message);
            }
        }

        console.log("Finished scheduling all notifications.");
    } catch (err) {
        console.error("Critical error in schedulePrayerNotifications:", err);
    }
});
