"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getUserLocation, type UserLocation } from "@/lib/geolocation";
import {
    fetchPrayerTimes,
    getNextPrayer,
    type PrayerTimings,
    type NextPrayer,
} from "@/lib/prayer-times";

interface UsePrayerTimesReturn {
    prayerTimes: PrayerTimings | null;
    nextPrayer: NextPrayer | null;
    location: UserLocation | null;
    loading: boolean;
    error: string | null;
}

export function usePrayerTimes(): UsePrayerTimesReturn {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimings | null>(null);
    const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const timingsRef = useRef<PrayerTimings | null>(null);

    const init = useCallback(async () => {
        try {
            const loc = await getUserLocation();
            setLocation(loc);

            const timings = await fetchPrayerTimes(loc.lat, loc.lng);
            setPrayerTimes(timings);
            timingsRef.current = timings;

            const next = getNextPrayer(timings);
            setNextPrayer(next);
        } catch (e: any) {
            setError(e.message || "Failed to load prayer times");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        init();
    }, [init]);

    // Tick every second to update countdown
    useEffect(() => {
        const interval = setInterval(() => {
            if (timingsRef.current) {
                const next = getNextPrayer(timingsRef.current);
                setNextPrayer(next);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return { prayerTimes, nextPrayer, location, loading, error };
}
