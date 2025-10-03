// src/services/weatherAPI.js

const BASE_URL = "https://awake-solace-production.up.railway.app/api/Weather";

// 🔹 Fetch weather by coordinates and date
export const getWeather = async (lat, lon, date, numOfYears = 10) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${lat}/${lon}/${date}?NumOfYears=${numOfYears}`
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
