import { useMemo, useState } from "react";
import movies from "../data/movies.json";
import MovieCard from "./MovieCard.jsx";
import { useWatched } from "../hooks/useUserState.js";

export default function CharacterTimeline({ movieIds = [] }) {
  const { watchedMap } = useWatched();
  const [view, setView] = useState("timeline");

  const items = useMemo(() => {
    const byId = new Map(movies.map((m) => [m.id, m]));
    return movieIds
      .map((id) => byId.get(id))
      .filter(Boolean)
      .sort((a, b) => a.chronologicalYear - b.chronologicalYear);
  }, [movieIds]);

  const watchedCount = items.filter((item) => !!watchedMap[item.id]).length;
  const pct = items.length === 0 ? 0 : Math.round((watchedCount / items.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* ── Progress and View Controls ── */}
      <div className="mb-12 p-6 sm:p-7 rounded-2xl border border-white/[0.08] bg-[#0c0e18]/80 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-crimson-bright font-bold block mb-1">
            CHARACTER ARC COMPLETION
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-extrabold text-white">
              {watchedCount} of {items.length} Titles
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
              {pct}% Watched
            </span>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-[#10131e] border border-white/10 rounded-xl p-1 self-start sm:self-auto">
          <button
            onClick={() => setView("timeline")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              view === "timeline" ? "bg-white/15 text-white" : "text-muted hover:text-white"
            }`}
          >
            Chronological
          </button>
          <button
            onClick={() => setView("grid")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              view === "grid" ? "bg-white/15 text-white" : "text-muted hover:text-white"
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* ── Items View ── */}
      {view === "timeline" ? (
        <div className="relative pl-6 sm:pl-8 space-y-10 border-l-2 border-white/[0.08] ml-2 sm:ml-4">
          {items.map((movie, index) => {
            const watched = !!watchedMap[movie.id];
            return (
              <div key={movie.id} className="relative">
                {/* Node dot on the spine */}
                <span
                  className={`absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full border-2 border-bg transition-colors duration-300 ${
                    watched
                      ? "bg-emerald-400 ring-4 ring-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                      : "bg-[#181d2e] ring-2 ring-white/10"
                  }`}
                />

                <MovieCard
                  item={movie}
                  layout="timeline"
                  sortMode="story"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((movie) => (
            <MovieCard
              key={movie.id}
              item={movie}
              layout="grid"
              sortMode="story"
            />
          ))}
        </div>
      )}
    </div>
  );
}