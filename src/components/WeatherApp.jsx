import React, { useState } from "react";
import { useWeather } from "../hooks/useWeather";
import WeatherCard from "./WeatherCard";
import WeatherForecast from "./WeatherForecast";
import Searchbar from "./Searchbar";

function WeatherApp() {
  const { weatherData, loading, error, fetchWeather } = useWeather();
  const [date, setDate] = useState("");
  const [locationName, setLocationName] = useState("");

  // Dummy city → coordinates mapping (replace with geocoding API later)

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
      setLocationName(`${lat}, ${lon}`);
    }
    // Case 2: city name provided

    fetchWeather(lat, lon, date, true);
  };

  const handleLocationSearch = () => {
    if (!date) {
      alert("Please select a date first!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationName("Your Location");
        fetchWeather(latitude, longitude, date, true);
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
      {weatherData && (
        <>
          <WeatherCard data={weatherData} location={locationName} date={date} />
          <WeatherForecast data={weatherData} />
        </>
      )}
    </div>
  );
}

export default WeatherApp;
