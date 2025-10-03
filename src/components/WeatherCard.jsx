import { Droplets, Thermometer, Wind, CloudSun } from "lucide-react";

function WeatherCard({ data, location, date }) {
  if (!data) return null;

  const stats = [
    {
      label: "Avg Temp",
      value: `${data.avgTemp.toFixed(1)}°C`,
      icon: Thermometer,
    },
    {
      label: "Avg Humidity",
      value: `${data.avgHumidity.toFixed(1)}%`,
      icon: Droplets,
    },
    {
      label: "Avg Wind",
      value: `${data.avgWindSpeed.toFixed(1)} m/s`,
      icon: Wind,
    },
    {
      label: "Precipitation",
      value: `${data.avgPrecipitation.toFixed(1)} mm`,
      icon: CloudSun,
    },
  ];

  // Function to assign theme colors based on the label
  const getTheme = (label) => {
    if (label.includes("Temp"))
      return { iconColor: "text-orange-400", iconBg: "bg-orange-700/50" };
    if (label.includes("Humidity") || label.includes("Precipitation"))
      return { iconColor: "text-blue-400", iconBg: "bg-blue-700/50" };
    if (label.includes("Wind"))
      return { iconColor: "text-green-400", iconBg: "bg-green-700/50" };
    return { iconColor: "text-cyan-400", iconBg: "bg-indigo-700/50" };
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl shadow-lg p-6 text-white backdrop-blur-md border border-white/10">
      {/* Location and Date */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          {location || "Unknown Location"}
        </h2>
        <p className="text-2xl sm:text-2xl font-extrabold text-cyan-200">
          {date}
        </p>
      </div>

      {/* Weather Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const { iconColor, iconBg } = getTheme(stat.label);

          return (
            <div
              key={stat.label}
              className="bg-black/40 rounded-xl p-4 flex items-center space-x-4 hover:bg-white/5 transition-all"
            >
              <div className={`p-3 rounded-lg ${iconBg}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-white/60">{stat.label}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherCard;
