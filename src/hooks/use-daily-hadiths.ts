import { useState, useEffect } from "react";

export interface Hadith {
    id: string;
    text: string;
    source: string;
    color: string;
}

const COLORS = ["#7A4A3A", "#4D6A53", "#5A4070"];
const TOTAL_BUKHARI_HADITHS = 7000; // Safe upper bound for Sahih Bukhari
const MAX_LENGTH = 200; // characters

export function useDailyHadiths() {
    const [hadiths, setHadiths] = useState<Hadith[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchHadiths() {
            try {
                setLoading(true);
                setError(null);

                // Calculate a deterministic offset based on the current date
                // Math.floor(Date.now() / 86400000) gives the number of days since epoch
                const todayOffset = Math.floor(Date.now() / 86400000);

                // We'll fetch 3 consecutive hadiths, using todayOffset to pick the starting number
                // Modulo ensures we stay within the valid bounds of Sahih Bukhari (mostly 1-7000)
                // Adding 1 because hadith numbers are 1-indexed
                const startNumber = (todayOffset % (TOTAL_BUKHARI_HADITHS - 3)) + 1;

                const fetchedHadiths: Hadith[] = [];

                for (let i = 0; i < 3; i++) {
                    const hadithNumber = startNumber + i;
                    const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari/${hadithNumber}.min.json`;

                    const response = await fetch(url);

                    if (!response.ok) {
                        throw new Error(`Failed to fetch hadith ${hadithNumber}`);
                    }

                    const data = await response.json();
                    const hadithData = data.hadiths[0];

                    let text = hadithData.text;

                    // Truncate if too long, and remove leading/trailing quotes often present in API
                    text = text.replace(/^Narrated.*?:\\s*/i, ""); // Sometimes starts with Narrated xyz:...
                    text = text.replace(/^"|"$/g, ""); // Remove outer quotes if present

                    if (text.length > MAX_LENGTH) {
                        // Find a good breaking point (space) before MAX_LENGTH
                        const truncated = text.slice(0, MAX_LENGTH);
                        const lastSpaceIndex = truncated.lastIndexOf(" ");
                        text = (lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) : truncated) + "…";
                    }

                    fetchedHadiths.push({
                        id: `bukhari-${hadithNumber}`,
                        text: text.trim(),
                        source: "SAHIH AL-BUKHARI",
                        color: COLORS[i % COLORS.length],
                    });
                }

                if (isMounted) {
                    setHadiths(fetchedHadiths);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching daily hadiths:", err);
                    setError(err instanceof Error ? err : new Error("Unknown error"));
                    setLoading(false);
                }
            }
        }

        fetchHadiths();

        return () => {
            isMounted = false;
        };
    }, []);

    return { hadiths, loading, error };
}
