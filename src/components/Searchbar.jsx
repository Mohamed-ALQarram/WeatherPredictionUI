import React, { useState } from "react";
import { Search, X, MapPin } from "lucide-react";

function Searchbar({ onSearch, onLocationSearch, loading }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const clearSearch = () => setQuery("");

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full max-w-md bg-black/30 backdrop-blur-xl rounded-full px-4 py-2 shadow-2xl border border-white/10 transition-all hover:bg-white/5"
    >
      <Search className="w-5 h-5 text-cyan-300 mr-2" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="City name or coordinates"
        className="flex-1 bg-transparent text-white placeholder-white/60 outline-none"
      />
      {query && (
        <button type="button" onClick={clearSearch} className="p-1">
          <X className="w-4 h-4 text-red-400 hover:text-red-300 transition-colors" />
        </button>
      )}
      <button
        type="button"
        onClick={onLocationSearch}
        disabled={loading}
        className="ml-2 p-2 rounded-full bg-cyan-700/50 hover:bg-cyan-600/50 transition-all disabled:opacity-50"
      >
        <MapPin className="w-5 h-5 text-white" />
      </button>
    </form>
  );
}

export default Searchbar;
