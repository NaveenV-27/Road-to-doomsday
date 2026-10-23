import { useMemo } from "react";
import { useWatched } from "../hooks/useUserState.js";
import movies from "../data/movies.json";
import { sortMovies } from "../lib/movieUtils.js";
import MovieCard from "./MovieCard.jsx";

const PHASE_METADATA = {
  1: { title: "Phase 1: Avengers Assembled", subtitle: "Origins, Super Soldiers, and Gods", color: "#f59e0b" },
  2: { title: "Phase 2: The Age of Heroes", subtitle: "Fractured Alliances & Cosmic Horizons", color: "#38bdf8" },
  3: { title: "Phase 3: The Infinity Saga", subtitle: "Civil War, Thanos, and Endgame", color: "#ef4444" },
  4: { title: "Phase 4: Multiverse Unbound", subtitle: "Grief, Nexus Beings, and Alternate Realities", color: "#a78bfa" },
  5: { title: "Phase 5: Secret Invasions", subtitle: "Convergences, Incursions, and Mutants", color: "#ec4899" },
  6: { title: "Phase 6: The Road to Doomsday", subtitle: "The Ultimate Collision", color: "#34d399" },
  other: { title: "Multiverse, Specials & Catalog", subtitle: "Expanded Continuity, Specials, and One-Shots", color: "#06b6d4" },
};

export default function JourneyTimeline() {
  const { watchedMap } = useWatched();

  // Story order sequence
  const storyMovies = useMemo(() => {
    return sortMovies(movies, "story");
  }, []);

  const watchedCount = useMemo(() => {
    return storyMovies.filter((m) => !!watchedMap[m.id]).length;
  }, [storyMovies, watchedMap]);

  // Group by phase
  const phasesGrouped = useMemo(() => {
    const map = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], other: [] };
    storyMovies.forEach((m) => {
      if (m.phase && map[m.phase]) {
        map[m.phase].push(m);
      } else {
        map.other.push(m);
      }
    });
    return map;
  }, [storyMovies]);

  const allSections = [1, 2, 3, 4, 5, 6, "other"];

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      {/* Journey Progress Header */}
      <div className="mb-16 p-8 rounded-3xl border border-white/10 bg-[#0c0e18]/90 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-crimson-bright font-bold">
              THE CHRONOLOGICAL ODYSSEY
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-wide mt-1">
              MCU STORYLINE <span className="text-crimson-bright">ROADMAP</span>
            </h1>
            <p className="text-xs text-muted mt-2 max-w-xl">
              Chronological in-universe order starting in 1943 with Captain America and advancing toward the future Doomsday convergence.
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
            <span className="block font-mono text-3xl font-extrabold text-white">
              {Math.round((watchedCount / movies.length) * 100)}%
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-dark">
              {watchedCount} of {movies.length} cleared
            </span>
          </div>
        </div>

        {/* Global Progress bar */}
        <div className="w-full bg-[#111422] h-2.5 rounded-full overflow-hidden border border-white/[0.06]">
          <div
            className="h-full bg-gradient-to-r from-crimson to-accent-bright rounded-full transition-all duration-700"
            style={{ width: `${(watchedCount / movies.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Phase-by-Phase Roadmap Spine */}
      <div className="space-y-20">
        {allSections.map((secKey) => {
          const secMovies = phasesGrouped[secKey] || [];
          if (secMovies.length === 0) return null;

          const meta = PHASE_METADATA[secKey] || PHASE_METADATA.other;
          const secWatched = secMovies.filter((m) => !!watchedMap[m.id]).length;
          const isSecDone = secWatched === secMovies.length;

          return (
            <div key={secKey} className="relative">
              {/* Phase Banner Header */}
              <div className="sticky top-20 z-20 mb-8 py-3 px-6 rounded-2xl bg-[#090b12]/95 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: meta.color, color: meta.color }}
                  />
                  <div>
                    <h2 className="font-display text-base sm:text-lg font-bold text-white leading-tight">
                      {meta.title}
                    </h2>
                    <span className="text-[11px] font-mono text-muted-dark">
                      {meta.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-muted">
                  <span>
                    {secWatched}/{secMovies.length} Completed
                  </span>
                  {isSecDone && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40">
                      ✓ SECTION CLEARED
                    </span>
                  )}
                </div>
              </div>

              {/* Items in this Section */}
              <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-white/[0.08] ml-4 sm:ml-6">
                {secMovies.map((movie) => {
                  const watched = !!watchedMap[movie.id];
                  return (
                    <div key={movie.id} className="relative">
                      {/* Node on the spine */}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
