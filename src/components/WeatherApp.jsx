import React, { useState } from "react";
import { useWeather } from "../hooks/useWeather";
import WeatherCard from "./WeatherCard";
import WeatherForecast from "./WeatherForecast";
import Searchbar from "./Searchbar";

function WeatherApp() {
  const { currentWeather, loading, error, fetchWeather } = useWeather();
  const [date, setDate] = useState("");

  // Dummy city → coordinates mapping (replace with geocoding API later)
  const cityToCoords = (city) => {
    const cities = {
      cairo: { lat: "30.0444", lon: "31.2357" },
      london: { lat: "51.5072", lon: "-0.1276" },
      paris: { lat: "48.8566", lon: "2.3522" },
    };
    return cities[city.toLowerCase()] || null;
  };

  const handleSearch = (input) => {
    if (!date) {
      alert("Please select a date first!");
      return;
    }

    let lat, lon;

    // Case 1: coordinates directly provided
    if (input.lat && input.lon) {
      lat = input.lat;
      lon = input.lon;
    }
    // Case 2: city name provided
    else if (input.city) {
      const coords = cityToCoords(input.city);
      if (!coords) {
        alert("Unknown city. Please try coordinates instead.");
        return;
      }
      lat = coords.lat;
      lon = coords.lon;
    }

    fetchWeather(lat, lon, date, 10);
  };

  const handleLocationSearch = () => {
    if (!date) {
      alert("Please select a date first!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(latitude, longitude, date, 10);
      },
      () =>
        alert("Unable to fetch your location. Please allow location access.")
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Searchbar for city, coordinates, or location */}
      <Searchbar
        onSearch={handleSearch}
        onLocationSearch={handleLocationSearch}
        loading={loading}
      />

      {/* Date picker */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="p-2 rounded-md border border-gray-300 w-full max-w-xs"
      />

      {/* Loading / Error */}
      {loading && <p>Loading weather data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Weather results */}
      {currentWeather && (
        <>
          <WeatherCard data={currentWeather} />
          <WeatherForecast data={currentWeather} />
        </>
      )}
    </div>
  );
}

export default WeatherApp;
