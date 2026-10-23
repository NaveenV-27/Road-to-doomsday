import { useMemo, useState } from "react";
import { useWatched } from "../hooks/useUserState.js";
import { motion } from "framer-motion";
import movies from "../data/movies.json";
import { getMovieData, sortMovies } from "../lib/movieUtils.js";

const PHASE_COLORS = {
  1: { name: "Phase 1: Assemble", color: "#f59e0b", badgeClass: "phase-badge-1" },
  2: { name: "Phase 2: Fractured", color: "#38bdf8", badgeClass: "phase-badge-2" },
  3: { name: "Phase 3: Infinity War", color: "#ef4444", badgeClass: "phase-badge-3" },
  4: { name: "Phase 4: Multiverse Dawns", color: "#a78bfa", badgeClass: "phase-badge-4" },
  5: { name: "Phase 5: Secret Invasions", color: "#ec4899", badgeClass: "phase-badge-5" },
  6: { name: "Phase 6: Doomsday", color: "#34d399", badgeClass: "phase-badge-6" },
};

export default function JourneyProgress() {
  const { watchedMap } = useWatched();
  const total = movies.length;

  // Normalized story order via canonical movieUtils logic
  const storyMovies = useMemo(() => {
    return sortMovies(movies, "story");
  }, []);

  const watchedCount = useMemo(() => {
    return storyMovies.filter((m) => !!watchedMap[m.id]).length;
  }, [storyMovies, watchedMap]);

  const percentage = total === 0 ? 0 : Math.round((watchedCount / total) * 100);

  // Next up movie in story order
  const nextMovie = useMemo(() => {
    return storyMovies.find((m) => !watchedMap[m.id]) || null;
  }, [storyMovies, watchedMap]);

  // Current active phase
  const currentPhaseNum = nextMovie && nextMovie.phase ? nextMovie.phase : 6;
  const currentPhaseInfo = PHASE_COLORS[currentPhaseNum] || PHASE_COLORS[1];

  // Milestone phases completion
  const phaseProgress = useMemo(() => {
    const map = {};
    for (let p = 1; p <= 6; p++) {
      const pMovies = storyMovies.filter((m) => m.phase === p);
      const pWatched = pMovies.filter((m) => !!watchedMap[m.id]).length;
      map[p] = {
        total: pMovies.length,
        watched: pWatched,
        completed: pMovies.length > 0 && pWatched === pMovies.length,
      };
    }
    return map;
  }, [storyMovies, watchedMap]);

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-dark">
              MISSION STATUS
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide">
            ROAD TO DOOMSDAY <span className="text-crimson-bright">TRACKER</span>
          </h2>
          <p className="text-muted text-sm max-w-xl mt-2 leading-relaxed">
            {watchedCount === 0
              ? "Your timeline awaits. Mark titles as watched to chart your course across all 6 Phases."
              : watchedCount === total
              ? `All ${total} chapters cleared. You are fully prepared for Avengers: Doomsday.`
              : `You have cleared ${watchedCount} of ${total} Marvel Cinematic Universe stories (${percentage}%).`}
          </p>
        </div>

        {/* Global Progress Gauge */}
        <div className="flex items-center gap-6 bg-[#0a0d15]/80 border border-white/[0.08] px-6 py-4 rounded-2xl backdrop-blur-md">
          <div className="text-right">
            <span className="block font-mono text-2xl sm:text-3xl font-extrabold text-white leading-none">
              {percentage}%
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-dark font-mono">
              COMPLETED
            </span>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="text-left">
            <span className="block font-mono text-2xl sm:text-3xl font-extrabold text-crimson-bright leading-none">
              {watchedCount}<span className="text-muted-dark text-base font-normal">/{total}</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-dark font-mono">
              TITLES WATCHED
            </span>
          </div>
        </div>
      </div>

      {/* Cinematic Phase Spine */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center justify-between text-xs font-mono text-muted-dark">
          <span>PHASE 1</span>
          <span>PHASE 2</span>
          <span>PHASE 3 (INFINITY SAGA)</span>
          <span>PHASE 4</span>
          <span>PHASE 5</span>
          <span>PHASE 6 (DOOMSDAY)</span>
        </div>
        <div className="relative h-3 w-full bg-[#111420] rounded-full overflow-hidden border border-white/[0.06] p-[2px]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-crimson-dim via-crimson to-accent-bright shadow-[0_0_12px_rgba(220,38,38,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Content Split: Next Objective vs Phase Checkpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Next Objective Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#101424]/90 to-[#090b12]/95 border border-white/[0.09] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-crimson-bright">
                {nextMovie ? "NEXT IN STORY ORDER" : "STATUS: READY"}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${currentPhaseInfo.badgeClass}`}>
                {nextMovie && nextMovie.phase ? `Phase ${nextMovie.phase}` : "Multiverse"}
              </span>
            </div>

            {nextMovie ? (
              <div className="flex gap-5 items-start mt-4">
                <div className="relative w-24 sm:w-28 aspect-[2/3] shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/60">
                  {nextMovie.poster ? (
                    <img
                      src={nextMovie.poster}
                      alt={nextMovie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-[#101424]">
                      <span className="text-crimson-bright text-xs font-bold">★</span>
                      <span className="text-[9px] font-display text-white mt-1 line-clamp-2">{nextMovie.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl sm:text-2xl text-white font-bold leading-tight">
                    {nextMovie.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs font-mono text-muted">
                    <span>Story: <strong className="text-white">{nextMovie.chronologicalYear || "Unplaced"}</strong></span>
                    <span>•</span>
                    <span className="capitalize">{nextMovie.type}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed line-clamp-3 mt-3">
                    {nextMovie.desc}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <span className="text-4xl">👑</span>
                <h3 className="font-display text-2xl text-white font-bold">
                  All Timelines Conquered
                </h3>
                <p className="text-xs text-muted max-w-xs mx-auto">
                  You've watched all {total} entries leading toward Doomsday. Ready for the theatre premiere.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between gap-4">
            {nextMovie ? (
              <>
                <a
                  href={`/movie/${nextMovie.id}`}
                  className="btn-primary text-xs py-2.5 px-5 w-full sm:w-auto"
                >
                  View Details &amp; Stream
                </a>
                <span className="text-[11px] font-mono text-muted-dark hidden sm:inline">
                  {nextMovie.year} Theatrical
                </span>
              </>
            ) : (
              <a href="/timeline" className="btn-secondary text-xs py-2 px-4">
                Review Timeline Archive
              </a>
            )}
          </div>
        </div>

        {/* Phase Checkpoints Breakdown */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((phaseNum) => {
            const pInfo = PHASE_COLORS[phaseNum];
            const pData = phaseProgress[phaseNum] || { total: 0, watched: 0, completed: false };
            const pPercent = pData.total > 0 ? Math.round((pData.watched / pData.total) * 100) : 0;

            return (
              <div
                key={phaseNum}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  pData.completed
                    ? "bg-emerald-950/20 border-emerald-500/30"
                    : "bg-[#0a0d16]/70 border-white/[0.07] hover:border-white/15"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold tracking-wider text-white">
                      {pInfo.name}
                    </span>
                    {pData.completed && (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                        CLEARED
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between text-xs font-mono text-muted-dark mb-2">
                    <span>Progress</span>
                    <span className="text-white">
                      {pData.watched} / {pData.total}
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-[#141828] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pPercent}%`,
                        backgroundColor: pData.completed ? "#10b981" : pInfo.color,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-muted-dark">
                  <span>{pPercent}% complete</span>
                  <a
                    href={`/timeline`}
                    className="hover:text-white transition-colors"
                  >
                    View Phase &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
