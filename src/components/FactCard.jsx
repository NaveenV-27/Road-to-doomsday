import { usePreferences } from "../hooks/useUserState.js";
import { getMovieData } from "../lib/movieUtils.js";
import movies from "../data/movies.json";

export default function FactCard({ fact }) {
  const { preferences } = usePreferences();

  // Check if we should show this fact based on spoiler preferences
  const shouldShow = !fact.spoilerLevel || preferences.spoilers;

  if (!shouldShow) {
    return null; // Don't render at all if spoiler hidden
  }

  // Get related movie data for links
  const relatedMovieData = fact.relatedMovies?.map(id =>
    movies.find(m => m.id === id)
  ).filter(Boolean) || [];

  return (
    <div className="bg-surface/80 backdrop-blur-xl rounded-xl border border-white/[0.08] p-6">
      <h3 className="font-display text-lg tracking-wide mb-2">{fact.title}</h3>

      {!fact.spoilerLevel || preferences.spoilers ? (
        <p className="text-muted">{fact.body}</p>
      ) : (
        <>
          <p className="text-muted">
            This fact contains spoilers. Enable spoilers in preferences to view.
          </p>
          <button
            onClick={() => {
              // This would typically update preferences to show spoilers
              // For now, we'll just show it directly for simplicity
            }}
            className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-transparent text-muted border-white/10 hover:border-white/20 hover:text-white"
          >
            Show Spoiler
          </button>
        </>
      )}

      {relatedMovieData.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-muted uppercase tracking-wider">Related Movies:</p>
          <div className="flex flex-wrap gap-2">
            {relatedMovieData.map((movie) => (
              <a
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-white/10 text-muted hover:bg-white/20 transition-colors"
              >
                {movie.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}