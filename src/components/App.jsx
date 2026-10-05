import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import movies from "../data/movies.json";
import MovieCard from "./MovieCard.jsx";
import ProgressBar from "./ProgressBar.jsx";
import PhaseTabs from "./PhaseTabs.jsx";
import Timeline from "./Timeline.jsx";
import { useWatched, usePreferences } from "../hooks/useUserState.js";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "movie", label: "Movies" },
  { key: "series", label: "Series" },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activePhase, setActivePhase] = useState(null); // null = all phases
  const { watchedMap, toggleWatched } = useWatched();
  const { preferences, updatePreferences } = usePreferences();

  const view = preferences.viewMode;
  const sortMode = preferences.sortMode;

  const setView = (v) => {
    updatePreferences({ viewMode: v });
  };

  const setSortMode = (s) => {
    updatePreferences({ sortMode: s });
  };

  // Helper to get movie data from either schema
  const getMovieData = (item) => {
    // New schema
    if (item.mediaType) {
      return {
        id: item.id,
        title: item.title,
        type: item.mediaType,
        year: item.release.year,
        releaseDate: item.release.date,
        chronologicalYear: item.timeline.storyYear,
        poster: item.art.poster,
        desc: item.content.description,
        cast: item.content.cast,
        watch: item.watch,
        phase: item.timeline.phase
      };
    }
    // Old schema fallback
    return {
      id: item.id,
      title: item.title,
      type: item.type,
      year: item.year,
      releaseDate: item.releaseDate,
      chronologicalYear: item.chronologicalYear,
      poster: item.poster,
      desc: item.desc,
      cast: item.cast,
      watch: item.watch || { official: [], legalLocator: null },
      phase: item.phase
    };
  };

  const sorted = useMemo(() => {
    const key = sortMode === "story" ? "chronologicalYear" : "year";
    return [...movies].sort((a, b) => {
      const dataA = getMovieData(a);
      const dataB = getMovieData(b);
      return dataA[key] - dataB[key];
    });
  }, [sortMode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((item) => {
      const data = getMovieData(item);
      if (typeFilter !== "all" && data.type !== typeFilter) return false;
      if (activePhase !== null && data.phase !== activePhase) return false;
      if (!q) return true;
      const haystack = `${data.title} ${data.desc} ${data.cast} ${data.year}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [sorted, query, typeFilter, activePhase]);

  const watchedCount = useMemo(
    () => sorted.filter((item) => watchedMap[getMovieData(item).id]).length,
    [sorted, watchedMap]
  );

  return (
    <div id="timeline" className="w-full scroll-mt-24">
      {/* Controls row — glass panel */}
      <div className="sticky top-3 z-30 max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-wrap items-center gap-3 justify-between rounded-3xl border border-white/10 backdrop-blur-xl px-5 py-4">
          <div className="flex items-center gap-3 flex-wrap flex-1 min-w-[280px]">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 min-w-[280px] flex-1 max-w-md border border-white/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-dark shrink-0">
                <path d="M21 21l-4.35-4.35" />
                <circle cx="11" cy="11" r="6" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, year, cast..."
                aria-label="Search timeline"
                className="bg-transparent outline-none text-sm w-full placeholder:text-muted-dark/60"
              />
            </div>

            <div className="relative flex items-center gap-2 flex-wrap" role="list" aria-label="Type filters">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setTypeFilter(f.key)}
                  className={`relative text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-full transition-all ${
                    typeFilter === f.key ? "bg-white/20 text-white" : "bg-transparent text-muted-dark hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {typeFilter === f.key && (
                    <motion.span
                      layoutId="filter-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white/20"
                    />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-2 bg-white/5 rounded-xl p-2 border border-white/10">
            {["story", "release"].map((s) => (
              <button
                key={s}
                onClick={() => setSortMode(s)}
                aria-pressed={sortMode === s}
                title={
                  s === "story"
                    ? "Sort by MCU in-universe chronology"
                    : "Sort by real-world theatrical release date"
                }
                className={`relative px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  sortMode === s ? "bg-white/20 text-white" : "bg-transparent text-muted-dark hover:bg-white/10 hover:text-white"
                }`}
              >
                {sortMode === s && (
                  <motion.span
                    layoutId="sort-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-white/20"
                  />
                )}
                <span className="relative">{s === "story" ? "Story Order" : "Release Order"}</span>
              </button>
            ))}
          </div>

          <div className="relative flex items-center gap-2 bg-white/5 rounded-xl p-2 border border-white/10">
            {["timeline", "grid"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`relative px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  view === v ? "bg-white/20 text-white" : "bg-transparent text-muted-dark hover:bg-white/10 hover:text-white"
                }`}
              >
                {view === v && (
                  <motion.span
                    layoutId="view-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-white/20"
                  />
                )}
                <span className="relative">{v === "timeline" ? "Timeline" : "Grid"}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phase tabs */}
      <PhaseTabs activePhase={activePhase} onSelect={setActivePhase} />

      {/* Progress */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <ProgressBar watchedCount={watchedCount} total={sorted.length} />
      </div>

      {/* Section heading */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/10" />
          <h2 className="font-display text-xl sm:text-2xl tracking-[0.3em] text-muted-dark uppercase whitespace-nowrap">
            Timeline
          </h2>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/10" />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-center text-muted-dark py-12">
          Nothing matches "{query}". Try a different title, year, or cast member.
        </p>
      )}

      {/* Timeline view */}
      {view === "timeline" && filtered.length > 0 && (
        <Timeline
          items={filtered}
          watchedMap={watchedMap}
          toggleWatched={toggleWatched}
          sortMode={sortMode}
        />
      )}

      {/* Grid view */}
      {view === "grid" && filtered.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <MovieCard
              key={item.id}
              item={item}
              layout="grid"
              sortMode={sortMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
