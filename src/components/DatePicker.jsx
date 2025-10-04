import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function DatePicker({ date, onChange }) {
  const [selectedDate, setSelectedDate] = useState(date ? new Date(date) : null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const calendarRef = useRef(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleDateClick = (day) => {
    if (!day) return;
    setSelectedDate(day);
    if (onChange) {
      const formatted = day.toISOString().split("T")[0];
      onChange(formatted);
    }
    setIsOpen(false);
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative w-full max-w-xs" ref={calendarRef}>
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 pr-12 rounded-xl 
                  border-2 border-cyan-500/30 
                  bg-gradient-to-br from-gray-900/90 to-gray-800/90 
                  text-white placeholder-cyan-300/40 
                  shadow-[0_0_20px_rgba(6,182,212,0.15)]
                  cursor-pointer
                  hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]
                  transition-all duration-300 ease-in-out
                  backdrop-blur-sm"
      >
        <span className={selectedDate ? "text-white" : "text-cyan-300/40"}>
          {selectedDate ? formatDate(selectedDate) : "Select a date"}
        </span>
      </div>

      {/* Calendar Icon */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Calendar
          className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
          strokeWidth={2.5}
        />
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-gray-900 border-2 border-cyan-500/30 rounded-xl shadow-2xl p-4 z-[9999]">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-cyan-400" />
            </button>
            <div className="text-white font-semibold">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-cyan-400" />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-cyan-400 text-xs font-semibold text-center py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={!day}
                className={`
                  py-2 rounded-lg text-sm transition-all duration-200
                  ${!day ? "invisible" : ""}
                  ${isSameDay(day, selectedDate)
                    ? "bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/50"
                    : isToday(day)
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                    : "text-white hover:bg-cyan-500/20"
                  }
                `}
              >
                {day ? day.getDate() : ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Demo Component
function App() {
  const [date, setDate] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-cyan-950 flex items-center justify-center p-8">
      <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-cyan-500/20 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Select Date
        </h2>

        <DatePicker
          date={date}
          onChange={(newDate) => {
            setDate(newDate);
            console.log("Selected date:", newDate);
          }}
        />

        {date && (
          <div className="mt-6 text-center">
            <p className="text-cyan-300 text-sm mb-1">Selected Date:</p>
            <p className="text-white font-mono text-lg bg-gray-800/50 px-4 py-2 rounded-lg border border-cyan-500/30">
              {date}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}