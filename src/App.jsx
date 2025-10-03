/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Searchbar from "./components/Searchbar";
import WeatherCard from "./components/WeatherCard";
import WeatherForecast from "./components/WeatherForecast";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { useWeather } from "./hooks/useWeather";
import WeatherMap from "./components/WeatherMap";
import DatePicker from "./components/DatePicker";

function App() {
  const { weatherData, loading, error, fetchWeather } = useWeather();
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [locationName, setLocationName] = useState("");
  const [mapVisible, setMapVisible] = useState(true);

  const fetchLocationName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      const name =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.display_name;
      setLocationName(name);
    } catch (_err) {
      setLocationName(`Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`);
    }
  };

  const handleSearch = (query) => {
    if (!date) return alert("Please select a date first!");
    const cityToCoords = {
      cairo: { lat: 30.0444, lon: 31.2357 },
      london: { lat: 51.5072, lon: -0.1276 },
      paris: { lat: 48.8566, lon: 2.3522 },
    };
    const { lat, lon } =
      cityToCoords[query.toLowerCase()] || cityToCoords.cairo;
    fetchWeather(lat, lon, date, 10);
    setLocationName(query);
    setMapVisible(false);
  };

  const handleLocationSearch = () => {
    if (!date) return alert("Please select a date first!");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(latitude, longitude, date, 10);
        fetchLocationName(latitude, longitude);
        setMapVisible(false);
      },
      () =>
        alert("Unable to fetch your location. Please allow location access.")
    );
  };

  const handleMapClick = (lat, lon) => {
    fetchWeather(lat, lon, date, 10);
    fetchLocationName(lat, lon);
    setMapVisible(false);
  };

  const handleRetry = () => fetchWeather(30.0444, 31.2357, date, 10);

  // Starry background
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const newStars = Array.from({ length: 200 }).map(() => ({
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 3,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="min-h-screen relative overflow-auto bg-[#0a1429] font-orbitron p-4 sm:p-8">
      {/* Starry Background */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
        <div className="w-1/3 h-1/3 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 absolute top-1/4 left-1/4 animate-pulse"></div>
        <div className="w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 absolute bottom-1/4 right-1/4 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Weather{" "}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Prediction
            </span>
          </h1>
          <p className="text-white/70 text-sm mb-4">
            Explore climate averages and historical weather insights
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 items-center">
            <DatePicker date={date} onChange={setDate} />
            <Searchbar
              onSearch={handleSearch}
              onLocationSearch={handleLocationSearch}
              loading={loading}
            />
          </div>
        </div>

        {/* Map */}
        {mapVisible && !loading && !weatherData && (
          <div className="max-w-3xl mx-auto mb-8 overflow-hidden shadow-2xl border border-white/20 rounded-2xl">
            <WeatherMap onSelect={handleMapClick} />
            <p className="text-white/60 text-center p-3 text-sm">
              Click anywhere on the map to fetch weather for that location
            </p>
          </div>
        )}

        {/* Content */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {loading && (
            <div className="flex justify-center mt-12">
              <div className="bg-black/50 backdrop-blur-lg rounded-3xl p-6 border border-white/20 flex flex-col items-center">
                <LoadingSpinner />
                <p className="text-white/70 mt-3 text-base">
                  Fetching climate data...
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="max-w-md mx-auto mt-12">
              <ErrorMessage message={error} onRetry={handleRetry} />
            </div>
          )}

          {weatherData && !loading && !error && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WeatherCard
                  data={weatherData}
                  location={locationName}
                  date={date}
                />
                <WeatherForecast data={weatherData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
