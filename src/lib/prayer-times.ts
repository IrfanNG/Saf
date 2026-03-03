export interface PrayerTimings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
}

export interface NextPrayer {
    name: string;
    time: string;
    remainingMs: number;
    remainingFormatted: string;
}

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

let cache: { date: string; lat: number; lng: number; timings: PrayerTimings } | null = null;

export async function fetchPrayerTimes(
    lat: number,
    lng: number,
    date?: Date
): Promise<PrayerTimings> {
    const d = date || new Date();
    const dateStr = `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;

    // Return cached if same day & location
    if (cache && cache.date === dateStr && cache.lat === lat && cache.lng === lng) {
        return cache.timings;
    }

    // api.waktusolat.app V2 endpoint for GPS (no /get/)
    const url = `https://api.waktusolat.app/v2/solat/gps/${lat}/${lng}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch prayer times");

    const json = await res.json();

    // Find current day's timing in the prayers array
    const todayNum = d.getDate();
    const todayEntry = json.prayers.find((p: any) => p.day === todayNum);

    if (!todayEntry) throw new Error("Could not find prayer times for today");

    // Times are unix timestamps (seconds) - convert to HH:mm
    const formatTime = (ts: number) => {
        const date = new Date(ts * 1000);
        const h = String(date.getHours()).padStart(2, "0");
        const m = String(date.getMinutes()).padStart(2, "0");
        return `${h}:${m}`;
    };

    const timings: PrayerTimings = {
        Fajr: formatTime(todayEntry.fajr),
        Sunrise: formatTime(todayEntry.syuruk),
        Dhuhr: formatTime(todayEntry.dhuhr),
        Asr: formatTime(todayEntry.asr),
        Maghrib: formatTime(todayEntry.maghrib),
        Isha: formatTime(todayEntry.isha),
    };

    cache = { date: dateStr, lat, lng, timings };
    return timings;
}

function parseTimeToMs(timeStr: string): number {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 3600000 + m * 60000;
}

export function getNextPrayer(timings: PrayerTimings): NextPrayer {
    const now = new Date();
    const nowMs =
        now.getHours() * 3600000 +
        now.getMinutes() * 60000 +
        now.getSeconds() * 1000;

    for (const name of PRAYER_NAMES) {
        const raw = timings[name];
        if (!raw) continue;
        // Aladhan may return "HH:MM (TZ)", strip parentheses
        const clean = raw.split(" ")[0];
        const prayerMs = parseTimeToMs(clean);
        if (prayerMs > nowMs) {
            return {
                name,
                time: clean,
                remainingMs: prayerMs - nowMs,
                remainingFormatted: formatRemaining(prayerMs - nowMs),
            };
        }
    }

    // All prayers passed → next is tomorrow's Fajr (approx +24h offset)
    const fajrClean = timings.Fajr.split(" ")[0];
    const fajrMs = parseTimeToMs(fajrClean);
    const remaining = 86400000 - nowMs + fajrMs;
    return {
        name: "Fajr",
        time: fajrClean,
        remainingMs: remaining,
        remainingFormatted: formatRemaining(remaining),
    };
}

export function formatRemaining(ms: number): string {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
