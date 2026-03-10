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
const MAX_LENGTH = 120; // characters

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

                const fetchedHadiths: Hadith[] = [];
                let attempts = 0;
                let cardsToFetch = 3;
                let currentI = 0;

                while (fetchedHadiths.length < cardsToFetch && attempts < 10) {
                    attempts++;
                    // Deterministic salt for current index we're trying for
                    const salt = (seed + (currentI * 1337) + (attempts * 10)) * 1103515245 + 12345;
                    const hadithNumber = (Math.abs(salt) % (TOTAL_BUKHARI_HADITHS - 100)) + 1;

                    try {
                        const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ind-bukhari/${hadithNumber}.min.json?t=${seedString}`;
                        const response = await fetch(url, { cache: 'no-store' });

                        if (!response.ok) continue;

                        const data = await response.json();
                        const hadithData = data.hadiths[0];
                        if (!hadithData || !hadithData.text || hadithData.text.trim().length < 5) {
                            continue;
                        }

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

                        // Final check after cleaning
                        if (cleanedText.length < 5) continue;

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
                            color: COLORS[fetchedHadiths.length % COLORS.length],
                        });

                        currentI++;
                    } catch (e) {
                        console.warn(`Failed to fetch hadith attempt ${attempts}`, e);
                    }
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
