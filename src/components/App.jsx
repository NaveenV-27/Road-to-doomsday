import { useMemo, useState } from "react";
import movies from "../data/movies.json";
import MovieCard from "./MovieCard.jsx";
import PhaseTabs from "./PhaseTabs.jsx";
import Timeline from "./Timeline.jsx";
import { useWatched, usePreferences } from "../hooks/useUserState.js";
import { getMovieData, sortMovies } from "../lib/movieUtils.js";

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

  const view = preferences.viewMode || "timeline";
  const sortMode = preferences.sortMode || "story";

  const setView = (v) => {
    updatePreferences({ viewMode: v });
  };

  const setSortMode = (s) => {
    updatePreferences({ sortMode: s });
  };

  // Filter list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return movies.filter((item) => {
      const data = getMovieData(item);
      if (typeFilter !== "all" && data.type !== typeFilter) return false;
      if (activePhase !== null && data.phase !== activePhase) return false;
      if (!q) return true;
      const haystack = `${data.title} ${data.desc} ${data.cast} ${data.year} ${data.chronologicalYear}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, typeFilter, activePhase]);

  // Sort list with canonical movieUtils logic
  const sorted = useMemo(() => {
    return sortMovies(filtered, sortMode);
  }, [filtered, sortMode]);

  const watchedCount = useMemo(
    () => movies.filter((item) => !!watchedMap[item.id]).length,
    [watchedMap]
  );

  return (
    <div id="timeline" className="w-full scroll-mt-20">
      {/* ── Compact Cinematic Controls Header ── */}
      <div className="sticky top-16 z-30 w-full border-b border-white/[0.08] bg-[#06070a]/90 backdrop-blur-xl py-3.5 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input & Quick Type Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title, cast, year..."
                  aria-label="Search timeline"
                  className="w-full bg-[#10131e] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-muted-dark focus:outline-none focus:border-crimson"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-dark hover:text-white text-xs font-mono"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Type Pills */}
              <div className="flex items-center bg-[#10131e] border border-white/10 rounded-xl p-1 shrink-0">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setTypeFilter(f.key)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-mono font-semibold uppercase transition-all ${
                      typeFilter === f.key
                        ? "bg-white/15 text-white"
                        : "text-muted hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort & View Mode Switches */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Order Mode (Story Order vs Theatrical Release Order) */}
              <div className="flex items-center bg-[#10131e] border border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setSortMode("story")}
                  aria-pressed={sortMode === "story"}
                  title="In-universe chronological story sequence"
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono font-semibold uppercase transition-all ${
                    sortMode === "story"
                      ? "bg-crimson text-white shadow-sm"
                      : "text-muted hover:text-white"
                  }`}
                >
                  Story Order
                </button>
                <button
                  type="button"
                  onClick={() => setSortMode("release")}
                  aria-pressed={sortMode === "release"}
                  title="Theatrical release sequence from 2008 Iron Man to 2026 Doomsday"
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono font-semibold uppercase transition-all ${
                    sortMode === "release"
                      ? "bg-crimson text-white shadow-sm"
                      : "text-muted hover:text-white"
                  }`}
                >
                  Release Order
                </button>
              </div>

              {/* View Layout (Timeline spine vs 3-col Grid) */}
              <div className="flex items-center bg-[#10131e] border border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setView("timeline")}
                  aria-pressed={view === "timeline"}
                  aria-label="Timeline View"
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    view === "timeline" ? "bg-white/15 text-white" : "text-muted hover:text-white"
                  }`}
                  title="Timeline Spine View"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-pressed={view === "grid"}
                  aria-label="Grid View"
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    view === "grid" ? "bg-white/15 text-white" : "text-muted hover:text-white"
                  }`}
                  title="Poster Grid View"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Phase Filter Tabs ── */}
      <PhaseTabs activePhase={activePhase} onSelect={setActivePhase} />

      {/* ── Section Status & Result Summary ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center justify-between text-xs font-mono text-muted-dark">
        <span>
          Showing <strong className="text-white">{sorted.length}</strong> of {movies.length} titles
          {activePhase ? ` (Phase ${activePhase})` : ""}
          {sortMode === "story" ? " · Story Chronology" : " · Theatrical Release Order"}
        </span>

        <span>
          Watched: <strong className="text-emerald-400">{watchedCount}</strong> / {movies.length}
        </span>
      </div>

      {/* ── Empty State ── */}
      {sorted.length === 0 && (
        <div className="py-24 text-center max-w-md mx-auto space-y-3">
          <p className="text-3xl">🔍</p>
          <h3 className="font-display text-lg text-white font-bold">
            No Records Found
          </h3>
          <p className="text-xs text-muted">
            No Marvel titles match "{query}". Try resetting your filters.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setTypeFilter("all");
              setActivePhase(null);
            }}
            className="btn-secondary text-xs mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── View Rendering ── */}
      {view === "timeline" && sorted.length > 0 && (
        <Timeline
          items={sorted}
          watchedMap={watchedMap}
          toggleWatched={toggleWatched}
          sortMode={sortMode}
        />
      )}

      {view === "grid" && sorted.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sorted.map((item) => (
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
