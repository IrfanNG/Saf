const axios = require('axios');
const LAT = 2.2173;
const LNG = 102.2472;

async function test() {
    const url = `https://api.waktusolat.app/v2/solat/gps/${LAT}/${LNG}`;
    const res = await axios.get(url);
    const prayers = res.data.prayers;
    const now = new Date();
    // Simplified day check
    const todayNum = now.getDate();
    const todayEntry = prayers.find(p => p.day === todayNum);

    if (todayEntry) {
        console.log("JSON Entry for today:", JSON.stringify(todayEntry, null, 2));
        const format = (ts) => {
            const date = new Date(ts * 1000);
            return date.toISOString();
        }
        console.log("Fajr:", format(todayEntry.fajr));
        console.log("Dhuhr:", format(todayEntry.dhuhr));
        console.log("Asr:", format(todayEntry.asr));
        console.log("Maghrib:", format(todayEntry.maghrib));
        console.log("Isha:", format(todayEntry.isha));
    }
}

test();
