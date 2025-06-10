// src/hooks/useWeather.ts

import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

// ← Paste your key here (no extra spaces):
const OWM_API_KEY = 'cfa4742f27c44aa6c7f308c4ba23ae44';

// VIT-AP Amaravati coordinates:
const VIT_AP_LAT = 16.5417;
const VIT_AP_LON = 80.5152;

/**
 * Fetch temperature, humidity, and wind speed from OpenWeatherMap for given lat/lon.
 * Returns an object: { temp: "XX°C", humidity: "YY%", wind: "ZZ km/h" }.
 * On any failure (invalid API key, missing fields, network error), returns { "–", "–", "–" }.
 */
async function fetchWeatherDetails(
  lat: number,
  lon: number
): Promise<{ temp: string; humidity: string; wind: string }> {
  try {
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?` +
        `lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`
    );
    const json = await resp.json();

    // If OWM returns an error code (e.g. 401 for invalid key), bail out:
    if (typeof json.cod === 'number' && json.cod !== 200) {
      console.warn('[useWeather] OWM error:', json.message || json);
      return { temp: '–', humidity: '–', wind: '–' };
    }

    // Pull out main.temp, main.humidity, wind.speed
    const main = json.main || {};
    const windObj = json.wind || {};
    if (
      typeof main.temp !== 'number' ||
      typeof main.humidity !== 'number' ||
      typeof windObj.speed !== 'number'
    ) {
      console.warn('[useWeather] Missing fields in OWM response:', json);
      return { temp: '–', humidity: '–', wind: '–' };
    }

    const tempC = Math.round(main.temp);
    const humidityPct = main.humidity;
    const windKmh = Math.round(windObj.speed * 3.6); // convert m/s → km/h

    return {
      temp: `${tempC}°C`,
      humidity: `${humidityPct}%`,
      wind: `${windKmh} km/h`,
    };
  } catch (err) {
    console.warn('[useWeather] fetch error:', err);
    return { temp: '–', humidity: '–', wind: '–' };
  }
}

/**
 * Custom hook that returns six strings:
 * [ userTemp, userHumidity, userWind, amaravatiTemp, amaravatiHumidity, amaravatiWind ]
 *
 * • On mount, immediately fetch Amaravati’s weather.
 * • Then request location permission; if granted, attempt to fetch user’s weather, but timeout after 5 s.
 * • If anything fails, that slice remains “–”.
 */
export default function useWeather(): [
  string,
  string,
  string,
  string,
  string,
  string
] {
  const [userTemp, setUserTemp] = useState<string>('–');
  const [userHumidity, setUserHumidity] = useState<string>('–');
  const [userWind, setUserWind] = useState<string>('–');

  const [amaravatiTemp, setAmaravatiTemp] = useState<string>('–');
  const [amaravatiHumidity, setAmaravatiHumidity] = useState<string>('–');
  const [amaravatiWind, setAmaravatiWind] = useState<string>('–');

  useEffect(() => {
    // 1) Fetch Amaravati’s weather immediately:
    fetchWeatherDetails(VIT_AP_LAT, VIT_AP_LON)
      .then(({ temp, humidity, wind }) => {
        setAmaravatiTemp(temp);
        setAmaravatiHumidity(humidity);
        setAmaravatiWind(wind);
      })
      .catch((e) => {
        console.warn('[useWeather] Amaravati fetch failed:', e);
        setAmaravatiTemp('–');
        setAmaravatiHumidity('–');
        setAmaravatiWind('–');
      });

    // 2) Attempt to get the user’s coordinates, but timeout after 5 s:
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('[useWeather] Location permission denied');
          setUserTemp('–');
          setUserHumidity('–');
          setUserWind('–');
          return;
        }

        // Create a 5-second timeout promise alongside getCurrentPositionAsync:
        const locationPromise = Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Location timeout')), 5000)
        );

        let pos;
        try {
          pos = await Promise.race([locationPromise, timeoutPromise]);
        } catch {
          console.warn('[useWeather] Location fetch timed out');
          setUserTemp('–');
          setUserHumidity('–');
          setUserWind('–');
          return;
        }

        const { latitude, longitude } = (pos as any).coords;
        fetchWeatherDetails(latitude, longitude)
          .then(({ temp, humidity, wind }) => {
            setUserTemp(temp);
            setUserHumidity(humidity);
            setUserWind(wind);
          })
          .catch((e) => {
            console.warn('[useWeather] User fetch failed:', e);
            setUserTemp('–');
            setUserHumidity('–');
            setUserWind('–');
          });
      } catch (err) {
        console.warn('[useWeather] Location error:', err);
        setUserTemp('–');
        setUserHumidity('–');
        setUserWind('–');
      }
    })();
  }, []);

  return [
    userTemp,
    userHumidity,
    userWind,
    amaravatiTemp,
    amaravatiHumidity,
    amaravatiWind,
  ];
}
