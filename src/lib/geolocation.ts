// Default: Kuala Lumpur
const DEFAULT_LAT = 3.139;
const DEFAULT_LNG = 101.6869;

export interface UserLocation {
    lat: number;
    lng: number;
    city: string;
}

export async function getUserLocation(): Promise<UserLocation> {
    try {
        const coords = await new Promise<GeolocationCoordinates>(
            (resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error("Geolocation not supported"));
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve(pos.coords),
                    (err) => reject(err),
                    { timeout: 8000, maximumAge: 300000 }
                );
            }
        );

        const city = await getCityName(coords.latitude, coords.longitude);
        return { lat: coords.latitude, lng: coords.longitude, city };
    } catch {
        const city = await getCityName(DEFAULT_LAT, DEFAULT_LNG);
        return { lat: DEFAULT_LAT, lng: DEFAULT_LNG, city };
    }
}

async function getCityName(lat: number, lng: number): Promise<string> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
            { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        return (
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            data.address?.state ||
            "Kuala Lumpur"
        );
    } catch {
        return "Kuala Lumpur";
    }
}
