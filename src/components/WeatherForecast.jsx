import { Sun, CloudRain, Wind, Droplets } from "lucide-react";

function WeatherForecast({ data }) {
  if (!data) return null;

  const insights = [
    {
      label: "Cold Days",
      value: `${data.coldTempPercent.toFixed(0)}%`,
      icon: Sun,
    },
    {
      label: "Rainy Days",
      value: `${data.precipitationPercent.toFixed(0)}%`,
      icon: CloudRain,
    },
    {
      label: "Humid Days",
      value: `${data.highHumidityPercent.toFixed(0)}%`,
      icon: Droplets,
    },
    {
      label: "Windy Days",
      value: `${data.highWindSpeedPercent.toFixed(0)}%`,
      icon: Wind,
    },
  ];

  // Function to assign theme colors based on the label
  const getTheme = (label) => {
    if (label.includes("Cold"))
      return { iconColor: "text-blue-400", iconBg: "bg-blue-700/50" };
    if (label.includes("Rain") || label.includes("Humid"))
      return { iconColor: "text-cyan-300", iconBg: "bg-cyan-700/50" };
    if (label.includes("Wind"))
      return { iconColor: "text-green-400", iconBg: "bg-green-700/50" };
    return { iconColor: "text-white/70", iconBg: "bg-gray-700/30" };
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl shadow-lg p-4 text-white backdrop-blur-md border border-white/10">
      <h2 className="text-lg font-bold mb-3">Weather Insights</h2>
      <div className="grid grid-cols-2 gap-3">
        {insights.map((item) => {
          const Icon = item.icon;
          const { iconColor, iconBg } = getTheme(item.label);

          return (
            <div
              key={item.label}
              className="flex items-center justify-between bg-black/40 rounded-xl p-3 hover:bg-white/5 transition-all"
            >
              <div className={`p-2 rounded-lg ${iconBg} flex items-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="ml-2">
                <p className="text-xs text-white/60">{item.label}</p>
                <p className="text-sm font-semibold">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherForecast;
