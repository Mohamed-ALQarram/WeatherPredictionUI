export default function DatePicker({ date, onChange }) {
  return (
    <div className="relative">
      <input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
        className="px-5 py-3 rounded-full border border-white/30 bg-black/40 text-white shadow-inner focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"></span>
    </div>
  );
}
