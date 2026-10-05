import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import movies from "../data/movies.json";
import MovieCard from "./MovieCard.jsx";
import ProgressBar from "./ProgressBar.jsx";
import PhaseTabs from "./PhaseTabs.jsx";
import { useWatched, usePreferences } from "../hooks/useUserState.js";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "movie", label: "Movies" },
  { key: "series", label: "Series" },
];

// function BraveBanner() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className="max-w-6xl mx-auto px-4 sm:px-6 mb-10"
//     >
//       <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-white/5 to-orange-500/10 backdrop-blur-xl shadow-lg shadow-black/40 px-5 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
//         <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-400/20 blur-3xl" />
//         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

//         <div className="flex items-center gap-4 flex-1 min-w-0">
//           <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/5 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-400/10 overflow-hidden p-2">
//             <img
//               src="/banner/brave.png"
//               alt="Brave Browser"
//               className="w-full h-full object-contain"
//             />
//           </div>

//           <div className="min-w-0">
//             <h3 className="font-display text-sm sm:text-base tracking-wide text-amber-300 uppercase">
//               ⚠ Warning: Ads &amp; Cookie Popups Ahead
//             </h3>

//             <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
//               If you don't want ads and cookies, use Brave Browser — no ads, no cookie trackers,
//               buffering-free clip playback. Highly recommended for this site.
//             </p>
//             <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
//               अगर आपको विज्ञापन और कुकीज़ बिल्कुल नहीं चाहिए, तो Brave Browser इस्तेमाल करें — कोई
//               विज्ञापन नहीं, कोई कुकी ट्रैकर नहीं, बिना बफरिंग के क्लिप प्लेबैक। इस साइट के लिए अत्यधिक अनुशंसित।
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
//           <a
//             href={BRAVE_DOWNLOAD_URL}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex-1 sm:flex-none text-center text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-400/30 hover:brightness-110 active:scale-95 transition"
//           >
//             Download for PC
//           </a>
//           <a
//             href={BRAVE_DOWNLOAD_MOBILE_URL}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex-1 sm:flex-none text-center text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-xl border border-amber-400/40 text-amber-300 hover:bg-amber-400/10 active:scale-95 transition"
//           >
//             Download for Mobile
//           </a>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

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
      <div className="sticky top-3 z-30 max-w-6xl mx-auto px-4 sm:px-6 mb-4">
        <div className="flex flex-wrap items-center gap-3 justify-between rounded-2xl border border-white/[0.08] bg-surface/80 backdrop-blur-2xl shadow-lg shadow-black/50 px-3 py-3">
          <div className="flex items-center gap-3 flex-wrap flex-1 min-w-[260px]">
            <div className="flex items-center gap-2 bg-white/[0.06] rounded-xl px-3 py-2 min-w-[260px] flex-1 max-w-sm border border-white/[0.06]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted shrink-0">
                <path d="M21 21l-4.35-4.35" />
                <circle cx="11" cy="11" r="6" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, year, cast..."
                aria-label="Search timeline"
                className="bg-transparent outline-none text-sm w-full placeholder:text-muted/70"
              />
            </div>

            <div className="relative flex items-center gap-1 flex-wrap" role="list" aria-label="Type filters">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setTypeFilter(f.key)}
                  className={`relative text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-full transition-colors ${
                    typeFilter === f.key ? "text-white" : "text-muted hover:text-white"
                  }`}
                >
                  {typeFilter === f.key && (
                    <motion.span
                      layoutId="filter-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-accent shadow-sm shadow-accent/20"
                    />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-1 bg-white/[0.06] rounded-xl p-1 border border-white/[0.04]">
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
                className={`relative px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                  sortMode === s ? "text-white" : "text-muted hover:text-white"
                }`}
              >
                {sortMode === s && (
                  <motion.span
                    layoutId="sort-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-accent"
                  />
                )}
                <span className="relative">{s === "story" ? "Story Order" : "Release Order"}</span>
              </button>
            ))}
          </div>

          <div className="relative flex items-center gap-1 bg-white/[0.06] rounded-xl p-1 border border-white/[0.04]">
            {["timeline", "grid"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`relative px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                  view === v ? "text-white" : "text-muted hover:text-white"
                }`}
              >
                {view === v && (
                  <motion.span
                    layoutId="view-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-accent"
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
        <ProgressBar watchedCount={watchedCount} total={sorted.length} />
      </div>

      {/* Brave browser banner */}
      {/* <BraveBanner /> */}

      {/* Section heading */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/10" />
          <h2 className="font-display text-lg tracking-[0.3em] text-muted uppercase whitespace-nowrap">
            Timeline
          </h2>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/10" />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-center text-muted py-16">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
