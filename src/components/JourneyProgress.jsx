import { useMemo } from "react";
import { useWatched } from "../hooks/useUserState.js";
import ProgressBar from "./ProgressBar.jsx";
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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-3xl sm:text-4xl tracking-wide text-center mb-8">
          YOUR JOURNEY
        </h2>

        <div className="bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent-dim/20 rounded-full flex items-center justify-center">
              <span className="text-accent-bright text-2xl font-display">0</span>
            </div>

            <h3 className="font-display text-xl tracking-wide">
              Start your journey
            </h3>

            <p className="text-muted max-w-md">
              Begin with <span className="font-semibold">Iron Man</span> and follow the
              chronological path through the Marvel Cinematic Universe.
            </p>

            <a
              href="#timeline"
              className="btn-primary"
            >
              Begin Journey
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h2 className="font-display text-3xl sm:text-4xl tracking-wide text-center mb-8">
        YOUR JOURNEY
      </h2>

      <div className="grid gap-8 sm:grid-cols-[1fr_1fr] sm:gap-12">
        {/* Progress Card */}
        <div className="bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/[0.08]">
          <div className="p-6">
            <ProgressBar
              watchedCount={watchedCount}
              total={totalMovies}
              className="mb-4"
            />
            <div className="text-center">
              <p className="text-sm text-muted">
                <span className="text-white font-semibold">{watchedCount}</span> of{" "}
                {totalMovies} completed
              </p>

              {currentPhase !== null && (
                <div className="mt-4">
                  <p className="text-xs text-muted uppercase tracking-wider">
                    CURRENTLY IN
                  </p>
                  <p className="font-display text-lg text-accent-bright">
                    PHASE {currentPhase}
                  </p>
                </div>
              )}

              {nextUnwatched && (
                <div className="mt-6">
                  <p className="text-xs text-muted uppercase tracking-wider">
                    NEXT
                  </p>
                  <h3 className="font-display text-xl tracking-wide">
                    {nextUnwatched.title}
                  </h3>
                  <p className="text-xs text-muted/70 mt-1">
                    {nextUnwatched.year} • {nextUnwatched.type === "series" ? "Series" : "Movie"}
                  </p>
                  <a
                    href={`/movie/${nextUnwatched.id}`}
                    className="btn-primary mt-4 w-full"
                  >
                    Continue
                  </a>
                </div>
              )}

              {!nextUnwatched && (
                <div className="mt-6">
                  <p className="text-xs text-muted uppercase tracking-wider">
                    JOURNEY COMPLETE
                  </p>
                  <p className="font-display text-lg text-accent-bright">
                    All films watched!
                  </p>
                  <a
                    href="#timeline"
                    className="btn-primary mt-4 w-full"
                  >
                    Rewatch Timeline
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/[0.08]">
          <div className="p-6 space-y-5">
            <div className="space-y-4">
              <p className="text-xs text-muted uppercase tracking-wider">
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
                  className="h-1.5"
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted uppercase tracking-wider">
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
                  className="h-1.5"
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted uppercase tracking-wider">
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
                  className="h-1.5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}