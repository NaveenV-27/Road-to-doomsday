import MovieCard from "./MovieCard.jsx";
import { getMovieData } from "../lib/movieUtils.js";

const PHASE_COLORS = {
  1: "#f59e0b",
  2: "#38bdf8",
  3: "#ef4444",
  4: "#a78bfa",
  5: "#ec4899",
  6: "#34d399",
};

export default function Timeline({ items, watchedMap, toggleWatched, sortMode }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-muted py-16 font-mono text-xs">
        No titles match your active filters.
      </div>
    );
  }

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
      {/* Central Spine */}
      <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-crimson/60 via-accent/30 to-emerald-500/40 sm:-translate-x-1/2" />

      <div className="flex flex-col gap-10">
        {items.map((item, i) => {
          const data = getMovieData(item);
          const watched = !!watchedMap[data.id];
          const phaseColor = data.phase ? (PHASE_COLORS[data.phase] || "#ef4444") : "#06b6d4";

          // Detect if phase changes from previous item
          const prevItem = i > 0 ? getMovieData(items[i - 1]) : null;
          const isNewPhase = !prevItem || prevItem.phase !== data.phase;

          return (
            <div key={item.id} className="relative">
              {/* Phase Marker Divider when Phase changes */}
              {isNewPhase && (
                <div className="relative flex items-center justify-center my-6 z-20">
                  <div className="px-4 py-1.5 rounded-full bg-[#0b0e17] border border-white/15 text-[11px] font-mono font-bold uppercase tracking-[0.2em] shadow-xl flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: phaseColor }}
                    />
                    <span className="text-white">
                      {data.phase ? `Phase ${data.phase}` : "Multiverse & Specials"}
                    </span>
                    <span className="text-muted-dark">•</span>
                    <span className="text-muted-dark">
                      {sortMode === "story"
                        ? (data.chronologicalYear ? `Story Era ${data.chronologicalYear}` : "Multiverse Slate")
                        : `Theatrical Year ${data.year}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Timeline Item Row */}
              <div
                className={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-10 pl-12 sm:pl-0 ${
                  i % 2 === 1 ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Node dot on the spine */}
                <span
                  className={`absolute left-6 sm:left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-bg z-20 transition-all duration-300 ${
                    watched
                      ? "bg-emerald-400 ring-4 ring-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      : "bg-[#1f2436] ring-2 ring-white/10"
                  }`}
                />

                <div className="sm:w-1/2 w-full">
                  <MovieCard
                    item={item}
                    layout="timeline"
                    sortMode={sortMode}
                  />
                </div>
                <div className="hidden sm:block sm:w-1/2" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
