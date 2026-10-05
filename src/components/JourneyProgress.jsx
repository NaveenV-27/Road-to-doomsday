import { useMemo } from "react";
import { useWatched } from "../hooks/useUserState.js";
import ProgressBar from "./ProgressBar.jsx";
import { motion } from "framer-motion";
import movies from "../data/movies.json";

export default function JourneyProgress() {
  const { watchedMap } = useWatched();
  const totalMovies = movies.length;

  // Sort movies by story order for determining "next up"
  const sortedByStory = useMemo(() => {
    return [...movies].sort((a, b) => a.chronologicalYear - b.chronologicalYear);
  }, []);

  const watchedCount = useMemo(() => {
    return sortedByStory.filter((item) => watchedMap[item.id]).length;
  }, [sortedByStory, watchedMap]);

  const progressPct = totalMovies === 0 ? 0 : Math.round((watchedCount / totalMovies) * 100);

  // Find next unwatched movie in story order
  const nextUnwatched = sortedByStory.find((item) => !watchedMap[item.id]);

  // Get current phase based on next unwatched or last watched
  let currentPhase = null;
  let phaseProgress = { watched: 0, total: 0 };

  if (nextUnwatched) {
    currentPhase = nextUnwatched.phase;
    // Count movies in this phase
    const phaseMovies = movies.filter((m) => m.phase === currentPhase);
    phaseProgress.total = phaseMovies.length;
    phaseProgress.watched = phaseMovies.filter((m) => watchedMap[m.id]).length;
  } else {
    // All watched - show final phase
    const lastWatched = sortedByStory
      .filter((item) => watchedMap[item.id])
      .pop();
    if (lastWatched) {
      currentPhase = lastWatched.phase;
      const phaseMovies = movies.filter((m) => m.phase === currentPhase);
      phaseProgress.total = phaseMovies.length;
      phaseProgress.watched = phaseMovies.filter((m) => watchedMap[m.id]).length;
    }
  }

  if (watchedCount === 0) {
    // Empty state - starting point
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-display text-4xl sm:text-5xl tracking-wide text-center mb-6">
            YOUR JOURNEY
          </h2>

          <div className="glass-panel rounded-3xl border border-white/10 backdrop-blur-xl p-10 text-center">
            <div className="flex flex-col items-center gap-8">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-gradient-cosmic/20 blur-[10px]" />
                <div className="relative w-full h-full flex items-center justify-center rounded-full border-2 border-white/20 bg-white/5">
                  <span className="font-display text-3xl text-crimson-bright">
                    {watchedCount}
                  </span>
                </div>
              </div>

              <h3 className="font-display text-2xl tracking-wide text-crimson-bright">
                Start your journey
              </h3>

              <p className="text-muted-dark max-w-2xl">
                Begin with <span className="font-display text-crimson-bright">Iron Man</span> and follow the
                chronological path through the Marvel Cinematic Universe.
              </p>

              <a
                href="#timeline"
                className="btn-primary btn-neon px-8 py-3 text-base sm:text-lg"
              >
                Begin Journey
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="font-display text-4xl sm:text-5xl tracking-wide text-center mb-6">
          YOUR JOURNEY
        </h2>

        <div className="grid gap-10 sm:grid-cols-[1fr_1fr] sm:gap-12">
          {/* Progress Card */}
          <div className="glass-panel rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="p-8">
              <ProgressBar
                watchedCount={watchedCount}
                total={totalMovies}
                className="mb-6"
              />
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-dark">
                  <span className="font-display text-white">{watchedCount}</span> of{" "}
                  <span className="font-display text-white">{totalMovies}</span> completed
                </p>

                {currentPhase !== null && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-dark uppercase tracking-wider">
                      CURRENTLY IN
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-[phase-{currentPhase}--color]">
                        <span className="absolute -inset-0.5 bg-gradient-to-r from-[phase-{currentPhase}--start] to-[phase-{currentPhase}--end] rounded-full -z-10 blur-[4px]" />
                      </div>
                      <span className="font-display text-xl text-white">
                        PHASE {currentPhase}
                      </span>
                    </div>
                  </div>
                )}

                {nextUnwatched && (
                  <div className="space-y-5">
                    <p className="text-xs text-muted-dark uppercase tracking-wider">
                      NEXT
                    </p>
                    <h3 className="font-display text-2xl tracking-wide text-white">
                      {nextUnwatched.title}
                    </h3>
                    <p className="text-muted mt-2">
                      {nextUnwatched.year} • {nextUnwatched.type === "series" ? "Series" : "Movie"}
                    </p>
                    <a
                      href={`/movie/${nextUnwatched.id}`}
                      className="btn-primary btn-neon px-8 py-3 text-base sm:text-lg w-full"
                    >
                      Continue
                    </a>
                  </div>
                )}

                {!nextUnwatched && (
                  <div className="space-y-5">
                    <p className="text-xs text-muted-dark uppercase tracking-wider">
                      JOURNEY COMPLETE
                    </p>
                    <p className="font-display text-xl text-crimson-bright">
                      All films watched!
                    </p>
                    <a
                      href="#timeline"
                      className="btn-primary btn-neon px-8 py-3 text-base sm:text-lg w-full"
                    >
                      Rewatch Timeline
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="glass-panel rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <p className="text-xs text-muted-dark uppercase tracking-wider">
                  SERIES
                </p>
                <div className="flex justify-between text-sm font-mono">
                  <span>
                    {movies.filter((m) => m.type === "series" && watchedMap[m.id]).length} of{
                      " "}
                    {movies.filter((m) => m.type === "series").length}
                  </span>
                  <ProgressBar
                    watchedCount={movies.filter((m) => m.type === "series" && watchedMap[m.id]).length}
                    total={movies.filter((m) => m.type === "series").length}
                    className="h-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-muted-dark uppercase tracking-wider">
                  MOVIES
                </p>
                <div className="flex justify-between text-sm font-mono">
                  <span>
                    {movies.filter((m) => m.type === "movie" && watchedMap[m.id]).length} of{
                      " "}
                    {movies.filter((m) => m.type === "movie").length}
                  </span>
                  <ProgressBar
                    watchedCount={movies.filter((m) => m.type === "movie" && watchedMap[m.id]).length}
                    total={movies.filter((m) => m.type === "movie").length}
                    className="h-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-muted-dark uppercase tracking-wider">
                  SPECIALS
                </p>
                <div className="flex justify-between text-sm font-mono">
                  <span>
                    {movies.filter((m) => m.type === "special" && watchedMap[m.id]).length} of{
                      " "}
                    {movies.filter((m) => m.type === "special").length}
                  </span>
                  <ProgressBar
                    watchedCount={movies.filter((m) => m.type === "special" && watchedMap[m.id]).length}
                    total={movies.filter((m) => m.type === "special").length}
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}