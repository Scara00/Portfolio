/**
 * Ottiene la posizione corrente dell'utente e la restituisce nel formato "City, COUNTRY_CODE"
 * @returns Promise che si risolve con la stringa della posizione
 */
export const getPosition = (): Promise<string> => {
    return new Promise((resolve) => {
        // Default fallback nel caso in cui la geolocalizzazione fallisca
        const defaultLocation = "Milan, IT";

        // Verifica se la geolocalizzazione è supportata
        if (!navigator.geolocation) {
            console.log("Geolocation not supported");
            resolve(defaultLocation);
            return;
        }

        // Imposta un timeout in caso la geolocalizzazione impieghi troppo tempo
        const timeoutId = setTimeout(() => {
            console.log("Geolocation timeout");
            resolve(defaultLocation);
        }, 5000);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                clearTimeout(timeoutId);

                try {
                    const { latitude, longitude } = position.coords;

                    // Usa un proxy CORS o un'API alternativa
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );

                    if (response.ok) {
                        const data = await response.json();

                        // Estrai città e paese dalla risposta di BigDataCloud
                        const city = data.city || data.locality;
                        const country = data.countryCode;

                        if (city && country) {
                            resolve(`${city}, ${country}`);
                        } else {
                            resolve(defaultLocation);
                        }
                    } else {
                        resolve(defaultLocation);
                    }
                } catch (error) {
                    console.error("Error fetching location:", error);
                    resolve(defaultLocation);
                }
            },
            (error) => {
                clearTimeout(timeoutId);
                console.error("Geolocation error:", error);
                resolve(defaultLocation);
            },
            { timeout: 10000, enableHighAccuracy: false }
        );
    });
};