import { useState, useEffect } from "react";

export interface Hadith {
    id: string;
    text: string;
    fullText: string;
    isLong: boolean;
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
                    let rawText = hadithData.text;

                    // Cleaning Indonesian preambles
                    let cleanedText = rawText;
                    if (cleanedText.includes('bersabda: "')) {
                        const parts = cleanedText.split('bersabda: "');
                        if (parts.length > 1) {
                            cleanedText = parts[1].replace(/"$/, '');
                        }
                    } else if (cleanedText.includes('berkata: "')) {
                        const parts = cleanedText.split('berkata: "');
                        if (parts.length > 1) {
                            cleanedText = parts[1].replace(/"$/, '');
                        }
                    }

                    cleanedText = cleanedText.replace(/^\[.*?\]\s*/, "");
                    cleanedText = cleanedText.replace(/^"|"$/g, "").trim();

                    const isLong = cleanedText.length > MAX_LENGTH;
                    let previewText = cleanedText;

                    if (isLong) {
                        const truncated = cleanedText.slice(0, MAX_LENGTH);
                        const lastSpaceIndex = truncated.lastIndexOf(" ");
                        previewText = (lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) : truncated) + "…";
                    }

                    fetchedHadiths.push({
                        id: `bukhari-${hadithNumber}`,
                        text: previewText,
                        fullText: cleanedText,
                        isLong: isLong,
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
