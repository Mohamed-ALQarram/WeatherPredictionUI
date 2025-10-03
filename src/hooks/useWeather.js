import { useState } from "react";
import { getWeather } from "../services/weatherAPI"; // new API service

// 🔹 Custom React hook for fetching and managing weather data
export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null); // stores the whole API response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch weather from your .NET API
  const fetchWeather = async (
    lat,
    lon,
    date = "2025-12-25",
    numOfYears = 10
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeather(lat, lon, date, numOfYears);

      setWeatherData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  return {
    weatherData, // <-- use this directly in WeatherCard & WeatherForecast
    loading,
    error,
    fetchWeather,
  };
};
