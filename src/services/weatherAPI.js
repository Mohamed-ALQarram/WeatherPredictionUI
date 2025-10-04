// src/services/weatherAPI.js

const BASE_URL = "https://weatherprediction-production-2120.up.railway.app/api/weather";

// 🔹 Fetch weather by coordinates and date
export const getWeather = async (lat, lon, date, HigherAccuracy= true) => {
  try {
    const response = await fetch(
      `${BASE_URL}?lat=${lat}&lon=${lon}&date=${date}&HigherAccuracy=${HigherAccuracy}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Weather service unavailable.");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch weather data.");
  }
};
