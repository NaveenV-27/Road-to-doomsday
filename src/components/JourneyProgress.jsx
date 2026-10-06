import { useMemo } from "react";
import { useWatched } from "../hooks/useUserState.js";
import { motion } from "framer-motion";
import movies from "../data/movies.json";
import { getMovieData } from "../lib/movieUtils.js";

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

  // Normalized story order
  const storyMovies = useMemo(() => {
    return [...movies].sort((a, b) => a.chronologicalYear - b.chronologicalYear);
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
  const currentPhaseNum = nextMovie ? nextMovie.phase : 6;
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
              ? "All 54 chapters cleared. You are fully prepared for Avengers: Doomsday."
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
                Phase {currentPhaseNum}
              </span>
            </div>

            {nextMovie ? (
              <div className="flex gap-5 items-start mt-4">
                <div className="relative w-24 sm:w-28 aspect-[2/3] shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src={nextMovie.poster}
                    alt={nextMovie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl sm:text-2xl text-white font-bold leading-tight">
                    {nextMovie.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs font-mono text-muted">
                    <span>Story Year: <strong className="text-white">{nextMovie.chronologicalYear}</strong></span>
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
                  You've watched all 54 entries leading toward Doomsday. Ready for the theatre premiere.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between gap-4">
            {nextMovie ? (
              <>
                <a
                  href={`/movie/${nextMovie.id}`}
                  class="btn-primary text-xs py-2.5 px-5 w-full sm:w-auto"
                >
                  View Details &amp; Stream
                </a>
                <a
                  href="/timeline"
                  class="text-xs text-muted hover:text-white transition-colors uppercase tracking-wider font-mono font-medium"
                >
                  Jump to timeline &rarr;
                </a>
              </>
            ) : (
              <a
                href="/timeline"
                class="btn-secondary text-xs py-2.5 px-5 w-full text-center"
              >
                Explore Full MCU Catalog
              </a>
            )}
          </div>
        </div>

        {/* Phase Breakdown Grid */}
        <div className="lg:col-span-7 bg-[#0b0e18]/60 border border-white/[0.06] rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">
              MCU Saga Milestones
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {[1, 2, 3, 4, 5, 6].map((p) => {
                const info = PHASE_COLORS[p];
                const stats = phaseProgress[p];
                const pct = stats.total > 0 ? Math.round((stats.watched / stats.total) * 100) : 0;
                return (
                  <div
                    key={p}
                    className={`p-3.5 rounded-xl border transition-all ${
                      stats.completed
                        ? "bg-[#141b2b]/80 border-accent/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                        : "bg-[#0f121d]/70 border-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[11px] font-bold text-white font-display">
                        Phase {p}
                      </span>
                      {stats.completed ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">✓ DONE</span>
                      ) : (
                        <span className="text-[10px] font-mono text-muted-dark">{pct}%</span>
                      )}
                    </div>
                    <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-crimson rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted block truncate">
                      {stats.watched}/{stats.total} titles
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs text-muted font-mono">
            <span>Current Saga: <strong className="text-text-secondary">Multiverse Saga (Phases 4–6)</strong></span>
            <span className="text-muted-dark">Target: Avengers: Doomsday</span>
          </div>
        </div>
      </div>
    </section>
  );
}