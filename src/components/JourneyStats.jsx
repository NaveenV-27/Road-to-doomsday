import { useMemo } from "react";
import { useWatched } from "../hooks/useUserState.js";
import ProgressBar from "./ProgressBar.jsx";
import movies from "../data/movies.json";

export default function JourneyStats() {
  const { watchedMap } = useWatched();
  const totalMovies = movies.length;

  // Calculate stats
  const stats = useMemo(() => {
    const watchedMovies = movies.filter(movie => watchedMap[movie.id]);

    return {
      total: totalMovies,
      watched: watchedMovies.length,
      movies: movies.filter(m => m.type === "movie" && watchedMap[m.id]).length,
      series: movies.filter(m => m.type === "series" && watchedMap[m.id]).length,
      specials: movies.filter(m => m.type === "special" && watchedMap[m.id]).length,
    };
  }, [watchedMap]);

  // Calculate phase progress
  const phaseProgress = useMemo(() => {
    const phases = {};
    movies.forEach(movie => {
      const phase = movie.phase;
      if (!phases[phase]) {
        phases[phase] = { total: 0, watched: 0 };
      }
      phases[phase].total++;
      if (watchedMap[movie.id]) {
        phases[phase].watched++;
      }
    });
    return phases;
  }, [watchedMap]);

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6">
        <h3 className="font-display text-lg tracking-wide mb-4">Overall Progress</h3>
        <ProgressBar
          watchedCount={stats.watched}
          total={stats.total}
          className="mb-3"
        />
        <div className="text-center">
          <p className="text-sm text-muted">
            <span className="text-white font-semibold">{stats.watched}</span> of{" "}
            {stats.total} completed
          </p>
          <p className="text-xs text-muted/60 mt-1">
            {Math.round((stats.watched / stats.total) * 100)}% Complete
          </p>
        </div>
      </div>

      {/* Progress by Type */}
      <div className="bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6">
        <h3 className="font-display text-lg tracking-wide mb-4">Progress by Type</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-mono">
            <span>Movies</span>
            <span>{stats.movies} of {movies.filter(m => m.type === "movie").length}</span>
          </div>
          <ProgressBar
            watchedCount={stats.movies}
            total={movies.filter(m => m.type === "movie").length}
            className="h-1.5"
          />

          <div className="flex justify-between text-sm font-mono">
            <span>Series</span>
            <span>{stats.series} of {movies.filter(m => m.type === "series").length}</span>
          </div>
          <ProgressBar
            watchedCount={stats.series}
            total={movies.filter(m => m.type === "series").length}
            className="h-1.5"
          />

          <div className="flex justify-between text-sm font-mono">
            <span>Specials</span>
            <span>{stats.specials} of {movies.filter(m => m.type === "special").length}</span>
          </div>
          <ProgressBar
            watchedCount={stats.specials}
            total={movies.filter(m => m.type === "special").length}
            className="h-1.5"
          />
        </div>
      </div>

      {/* Phase Progress */}
      <div className="bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6">
        <h3 className="font-display text-lg tracking-wide mb-4">Phase Progress</h3>
        <div className="space-y-3">
          {Object.keys(phaseProgress).sort((a, b) => Number(a) - Number(b)).map(phase => (
            <div key={phase} className="space-y-2">
              <div className="flex justify-between text-sm font-mono mb-1">
                <span>Phase {phase}</span>
                <span>{phaseProgress[phase].watched} of {phaseProgress[phase].total}</span>
              </div>
              <ProgressBar
                watchedCount={phaseProgress[phase].watched}
                total={phaseProgress[phase].total}
                className="h-1.5"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}