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

                // Deterministic daily seed based on UTC date
                const today = new Date();
                const seedString = `${today.getUTCFullYear()}${today.getUTCMonth()}${today.getUTCDate()}`;
                const seed = parseInt(seedString);

                // Fetch 3 non-consecutive hadiths to make them feel more varied
                const fetchedHadiths: Hadith[] = [];
                const indices = [0, 1, 2].map(i => {
                    // Simple deterministic salt
                    const salt = (seed + (i * 1337)) * 1103515245 + 12345;
                    return (Math.abs(salt) % (TOTAL_BUKHARI_HADITHS - 100)) + 1;
                });

                console.log("Saf Debug: Selecting hadith indices for today:", indices);

                for (let i = 0; i < 3; i++) {
                    const hadithNumber = indices[i];
                    // Switching to ind-bukhari for Malay/Indonesian content
                    const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ind-bukhari/${hadithNumber}.min.json?t=${seedString}`;

                    const response = await fetch(url, { cache: 'no-store' });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch hadith ${hadithNumber}`);
                    }

                    const data = await response.json();
                    const hadithData = data.hadiths[0];
                    let text = hadithData.text;

                    // Cleaning Indonesian preambles and extracting quoted speech if possible
                    // Often starts with "Telah menceritakan... bersabda: "
                    if (text.includes('bersabda: "')) {
                        const parts = text.split('bersabda: "');
                        if (parts.length > 1) {
                            text = parts[1].replace(/"$/, '');
                        }
                    } else if (text.includes('berkata: "')) {
                        const parts = text.split('berkata: "');
                        if (parts.length > 1) {
                            text = parts[1].replace(/"$/, '');
                        }
                    }

                    // Remove bracketed names if they clutter the start
                    text = text.replace(/^\[.*?\]\s*/, "");
                    text = text.replace(/^"|"$/g, "");

                    if (text.length > MAX_LENGTH) {
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
