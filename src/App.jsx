/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Searchbar from "./components/Searchbar";
import WeatherDashboard from "./components/WeatherDashboard";
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
  const [validationError, setValidationError] = useState("");

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

  // Validate date
  const validateDate = () => {
    if (!date) {
      setValidationError("⚠️ Please select a date first!");
      return false;
    }

    const selectedDate = new Date(date);
    const todayDate = new Date(today);
    

    // Check if date is too old (optional: limit to last 50 years)
    const fiftyYearsAgo = new Date();
    fiftyYearsAgo.setFullYear(fiftyYearsAgo.getFullYear() - 50);
    
    if (selectedDate < fiftyYearsAgo) {
      setValidationError("⚠️ Date is too old! Please select a date within the last 50 years.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSearch = (query) => {
    if (!validateDate()) return;
  };

  const handleLocationSearch = () => {
    if (!validateDate()) return;
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(latitude, longitude, date, true);
        fetchLocationName(latitude, longitude);
        setMapVisible(false);
      },
      () =>
        alert("Unable to fetch your location. Please allow location access.")
    );
  };

  const handleMapClick = (lat, lon) => {
    if (!validateDate()) return;
    
    fetchWeather(lat, lon, date, true);
    fetchLocationName(lat, lon);
    setMapVisible(false);
  };

  const handleRetry = () => fetchWeather(30.0444, 31.2357, date, true);

  // Clear validation error when date changes
  useEffect(() => {
    if (validationError) {
      setValidationError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

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
          
          {/* Validation Error Message */}
          {validationError && (
            <div className="mt-4 max-w-md mx-auto">
              <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/50 rounded-xl p-3 animate-shake">
                <p className="text-red-300 text-sm font-semibold flex items-center justify-center gap-2">
                  {validationError}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        {mapVisible && !loading && !weatherData && (
          <div className="max-w-3xl mx-auto mb-8 overflow-hidden shadow-2xl border border-white/20 rounded-2xl relative z-0">
            <WeatherMap onSelect={handleMapClick} />
            <p className="text-white/60 text-center p-3 text-sm">
              {date 
                ? "Click anywhere on the map to fetch weather for that location" 
                : "⚠️ Please select a date first before using the map"}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="space-y-8 max-w-6xl mx-auto">
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
              {/* Dashboard */}
              <WeatherDashboard
                data={weatherData}
                location={locationName}
                date={date}
              />
            </div>
          )}
        </div>
      </div>

      {/* Extra styling */}
      <style>{`
        .react-datepicker {
          z-index: 50 !important;
          background: white !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
          padding: 10px;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #3b82f6 !important;
          color: white !important;
          border-radius: 50% !important;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default App;