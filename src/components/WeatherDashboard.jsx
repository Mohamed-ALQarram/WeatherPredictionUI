import React, { useState } from "react";
import { Sun, CloudRain, Wind, Droplets, CloudSnow, MountainSnow, Thermometer, Sparkles, Loader2 } from "lucide-react";

export default function WeatherDashboard({ data, location, date }) {
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  if (!data) return <p className="text-white">No data available</p>;

  const getAIRecommendations = async () => {
    setLoadingAI(true);
    setAiError(null);
    
    try {
      // Prepare the weather data message
      const weatherMessage = `
You are a helpful weather advisor. Based on the data below, perform the following tasks:
1.  Provide a short, friendly activity recommendation.
2.  Add a "Planning Tip:" with advice on what to wear or take.
3.  If the weather is potentially dangerous (e.g., extreme heat, heavy storms, high winds), add a "Danger Alert:" and advise staying indoors. If there is no danger, do not include this part.
4. be short and fast as possible.

Temperature Data:
- Maximum: ${data.temperature.maxTemp}°C
- Minimum: ${data.temperature.minTemp}°C
- Average: ${data.temperature.avgTemp}°C
- Cold Days: ${data?.temperature?.coldTempPercent?.toFixed(0) ?? 0}%
- Hot Days: ${data?.temperature?.hotTempPercent?.toFixed(0) ?? 0}%

Humidity:
- Average: ${data.humidity.avgHumidity}%
- High Humidity Days: ${data?.humidity?.highHumidityPercent?.toFixed(0) ?? 0}%

Precipitation:
- Average: ${data.precipitation.avgPrecipitation} mm
- Rainy Days: ${data?.precipitation?.precipitationPercent?.toFixed(0) ?? 0}%

Wind Speed:
- Average: ${data.windSpeed.avgWindSpeed} km/h
- Windy Days: ${data?.windSpeed?.highWindSpeedPercent?.toFixed(0) ?? 0}%

Snow Data:
- Snow Precipitation: ${data.snowPrecipitation?.avgSnowPrecipitation ?? 0} mm
- Snowy Days: ${data?.snowPrecipitation?.snowPrecipitationPercent?.toFixed(0) ?? 0}%
- Snow Depth: ${data.snowDepth.avgSnowDepth} cm
- Snow Coverage: ${data?.snowDepth?.snowDepthPercent?.toFixed(0) ?? 0}%

Based on this historical weather data, please provide:
1. Key insights about the weather conditions
2. Recommendations for activities suitable for this weather
3. What to wear and prepare for
4. Any weather-related warnings or precautions
Keep the response concise and practical.
      `.trim();

      const response = await fetch(
        'https://weatherprediction-production-2120.up.railway.app/api/GoogleAI',
        {
          method: 'POST',
          headers: {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            msg: weatherMessage
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get AI recommendations');
      }

      const result = await response.text();
      setAiRecommendations(result);
    } catch (error) {
      console.error('AI Error:', error);
      setAiError('Unable to fetch AI recommendations. Please try again.');
    } finally {
      setLoadingAI(false);
    }
  };

  // Determine which temperature prediction to show
  const coldPercent = data?.temperature?.coldTempPercent ?? 0;
  const hotPercent = data?.temperature?.hotTempPercent ?? 0;
  const isColder = coldPercent >= hotPercent;

  const weatherMetrics = [
    {
      title: "🌡️ Temperature",
      icon: Thermometer,
      stats: [
        { label: "Maximum", value: `${data.temperature.maxTemp}°C` },
        { label: "Minimum", value: `${data.temperature.minTemp}°C` },
        { label: "Average", value: `${data.temperature.avgTemp}°C` },
      ],
      prediction: {
        label: isColder ? "Very Cold percent" : "Hot Days",
        percent: isColder ? coldPercent.toFixed(0) : hotPercent.toFixed(0),
      },
      description: data.temperature.description,
      color: isColder ? "blue" : "orange",
    },
    {
      title: "💧 Humidity",
      icon: Droplets,
      stats: [
        { label: "Average", value: `${data.humidity.avgHumidity}%` },
      ],
      prediction: {
        label: "High Humidity percent",
        percent: data?.humidity?.highHumidityPercent?.toFixed(0) ?? 0,
      },
      description: data.humidity.description,
      color: "cyan",
    },
    {
      title: "🌧️ Precipitation",
      icon: CloudRain,
      stats: [
        { label: "Average", value: `${data.precipitation.avgPrecipitation} mm` },
      ],
      prediction: {
        label: "Heavy rain percent",
        percent: data?.precipitation?.precipitationPercent?.toFixed(0) ?? 0,
      },
      description: data.precipitation.description,
      color: "indigo",
    },
    {
      title: "🌬️ Wind Speed",
      icon: Wind,
      stats: [
        { label: "Average", value: `${data.windSpeed.avgWindSpeed} km/h` },
      ],
      prediction: {
        label: "very Windy percent",
        percent: data?.windSpeed?.highWindSpeedPercent?.toFixed(0) ?? 0,
      },
      description: data.windSpeed.description,
      color: "green",
    },
    {
      title: "❄️ Snow Precipitation",
      icon: CloudSnow,
      stats: [
        { label: "Average", value: `${data.snowPrecipitation?.avgSnowPrecipitation ?? 0} mm` },
      ],
      prediction: {
        label: "High Snowy percent",
        percent: data?.snowPrecipitation?.snowPrecipitationPercent?.toFixed(0) ?? 0,
      },
      description: data.snowPrecipitation?.description ?? "No snow data",
      color: "purple",
    },
    {
      title: "🏔️ Snow Depth",
      icon: MountainSnow,
      stats: [
        { label: "Average Depth", value: `${data.snowDepth.avgSnowDepth} cm` },
      ],
      prediction: {
        label: "Snow Coverage",
        percent: data?.snowDepth?.snowDepthPercent?.toFixed(0) ?? 0,
      },
      description: data.snowDepth.description,
      color: "slate",
    },
  ];

  const colorClasses = {
    blue: {
      border: "border-blue-500/30",
      gradient: "from-blue-500/20 to-blue-600/10",
      text: "text-blue-400",
      ring: "ring-blue-500/30",
      bg: "bg-blue-500/10",
    },
    orange: {
      border: "border-orange-500/30",
      gradient: "from-orange-500/20 to-orange-600/10",
      text: "text-orange-400",
      ring: "ring-orange-500/30",
      bg: "bg-orange-500/10",
    },
    cyan: {
      border: "border-cyan-500/30",
      gradient: "from-cyan-500/20 to-cyan-600/10",
      text: "text-cyan-400",
      ring: "ring-cyan-500/30",
      bg: "bg-cyan-500/10",
    },
    indigo: {
      border: "border-indigo-500/30",
      gradient: "from-indigo-500/20 to-indigo-600/10",
      text: "text-indigo-400",
      ring: "ring-indigo-500/30",
      bg: "bg-indigo-500/10",
    },
    green: {
      border: "border-green-500/30",
      gradient: "from-green-500/20 to-green-600/10",
      text: "text-green-400",
      ring: "ring-green-500/30",
      bg: "bg-green-500/10",
    },
    purple: {
      border: "border-purple-500/30",
      gradient: "from-purple-500/20 to-purple-600/10",
      text: "text-purple-400",
      ring: "ring-purple-500/30",
      bg: "bg-purple-500/10",
    },
    slate: {
      border: "border-slate-500/30",
      gradient: "from-slate-500/20 to-slate-600/10",
      text: "text-slate-400",
      ring: "ring-slate-500/30",
      bg: "bg-slate-500/10",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-white">Weather Dashboard</h2>
          <div className="flex items-center gap-3">
            {location && (
              <span className="text-cyan-400 text-sm font-semibold px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/30">
                📍 {location}
              </span>
            )}
            <button
              onClick={getAIRecommendations}
              disabled={loadingAI}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
            >
              {loadingAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">AI Recommendations</span>
                </>
              )}
            </button>
          </div>
        </div>
        {date && (
          <p className="text-white/60 text-sm">
            Data for: {new Date(date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}
      </div>

      {/* AI Recommendations Section */}
      {aiRecommendations && (
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
          </div>
          <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap bg-black/20 rounded-xl p-4">
            {aiRecommendations}
          </div>
          <button
            onClick={() => setAiRecommendations(null)}
            className="mt-4 text-purple-400 hover:text-purple-300 text-sm underline"
          >
            Close Recommendations
          </button>
        </div>
      )}

      {/* AI Error Message */}
      {aiError && (
        <div className="bg-red-900/40 backdrop-blur-xl rounded-2xl p-4 border border-red-500/30 shadow-xl">
          <p className="text-red-300 text-sm">{aiError}</p>
          <button
            onClick={() => setAiError(null)}
            className="mt-2 text-red-400 hover:text-red-300 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const colors = colorClasses[metric.color];
          
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${colors.gradient} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              {/* Header with Icon */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">{metric.title}</h3>
                <div className={`p-2 rounded-lg ${colors.bg} ${colors.ring} ring-1`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                {metric.stats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">{stat.label}:</span>
                    <span className="text-white font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Prediction Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/80 text-xs font-medium">
                    {metric.prediction.label}
                  </span>
                  <span className={`text-sm font-bold ${colors.text}`}>
                    {metric.prediction.percent}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.gradient} ${colors.ring} ring-1 transition-all duration-500`}
                    style={{ width: `${metric.prediction.percent}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              <p className="text-white/60 text-xs italic leading-relaxed">
                {metric.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}