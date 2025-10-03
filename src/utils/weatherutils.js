const iconMap = {
  Clear: "Sun", // ☀️ Clear sky
  Clouds: "Cloud", // ☁️ Cloudy
  Rain: "CloudRain", // 🌧️ Rain
  Drizzle: "CloudDrizzle", // 🌦️ Light rain/drizzle
  Thunderstorm: "CloudLightning", // ⛈️ Thunderstorm
  Snow: "CloudSnow", // ❄️ Snow
  Mist: "CloudFog", // 🌫️ Mist
  Fog: "CloudFog", // 🌫️ Fog
  Haze: "CloudFog", // 🌫️ Haze
  Dust: "Wind", // 💨 Dust
  Sand: "Wind", // 💨 Sandstorm
  Ash: "Wind", // 💨 Volcanic ash
  Squall: "Wind", // 💨 Strong squall winds
  Tornado: "Tornado", // 🌪️ Tornado
};

// 🔹 Get the correct icon name for a given weather condition
//    Example: { main: "Rain" } → "CloudRain"
export const getWeatherIcon = (weatherData) => {
  return iconMap[weatherData.main] || "Cloud"; // fallback: use "Cloud"
};

// 🔹 Format a temperature into Celsius or Fahrenheit
//    - `temp` should be in Celsius by default (from API)
//    - If unit is "F", convert Celsius → Fahrenheit
export const formatTemperature = (temp, unit) => {
  if (unit === "F") {
    // Formula: (C × 9/5) + 32
    return Math.round((temp * 9) / 5 + 32);
  }
  // Default: round Celsius to nearest whole number
  return Math.round(temp);
};

// 🔹 Format a timestamp into a localized time string (hh:mm AM/PM)
//    Example: 1696190400 → "07:00 PM"
export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 🔹 Format a timestamp into a readable date string
//    Example: 1696190400 → "Mon, Oct 2"
export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "short", // "Mon"
    month: "short", // "Oct"
    day: "numeric", // "2"
  });
};

// 🔹 Convert wind degrees (0–360) into compass directions
//    Example: 90 → "E", 225 → "SW"
export const getWindDirection = (deg) => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  // Divide 360° circle into 16 sectors (22.5° each)
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};
