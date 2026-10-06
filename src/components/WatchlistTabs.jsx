import { useState, useMemo } from "react";
import movies from "../data/movies.json";
import MovieCard from "./MovieCard.jsx";
import { useWatchlist, useWatched, useCurrentlyWatching } from "../hooks/useUserState.js";

export default function WatchlistTabs() {
  const [activeTab, setActiveTab] = useState("watchlist");
  const { watchlist } = useWatchlist();
  const { watchedMap } = useWatched();
  const { currentlyWatching } = useCurrentlyWatching();

  // Filtered lists
  const watchlistMovies = useMemo(() => {
    const set = new Set(watchlist);
    return movies.filter((m) => set.has(m.id));
  }, [watchlist]);

  const watchedMovies = useMemo(() => {
    return movies.filter((m) => !!watchedMap[m.id]);
  }, [watchedMap]);

  const inProgressMovies = useMemo(() => {
    const set = new Set(currentlyWatching);
    return movies.filter((m) => set.has(m.id));
  }, [currentlyWatching]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Shelf Tabs Navigation ── */}
      <div className="flex items-center justify-between border-b border-white/[0.08] mb-10 overflow-x-auto no-scrollbar gap-4">
        <div className="flex items-center gap-2 sm:gap-6">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`pb-4 px-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "watchlist"
                ? "border-crimson text-white"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            <span>Watchlist</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.08] text-white">
              {watchlistMovies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("watched")}
            className={`pb-4 px-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "watched"
                ? "border-crimson text-white"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            <span>Watched Collection</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              {watchedMovies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("in-progress")}
            className={`pb-4 px-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "in-progress"
                ? "border-crimson text-white"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            <span>Currently Watching</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.08] text-white">
              {inProgressMovies.length}
            </span>
          </button>
        </div>

        <a
          href="/timeline"
          className="pb-4 text-xs font-mono text-muted hover:text-white transition-colors shrink-0"
        >
          Explore Timeline &rarr;
        </a>
      </div>

      {/* ── Tab Content ── */}
      <div>
        {/* Tab 1: Watchlist */}
        {activeTab === "watchlist" && (
          <div>
            {watchlistMovies.length === 0 ? (
              <div className="py-24 text-center max-w-md mx-auto space-y-4">
                <span className="text-4xl block">🌌</span>
                <h3 className="font-display text-2xl text-white font-bold">
                  Your multiverse is suspiciously empty.
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  You haven't saved any titles yet. Browse the timeline and tap "+ Watchlist" on movies you want to queue up.
                </p>
                <div className="pt-2">
                  <a href="/timeline" class="btn-primary text-xs">
                    Browse MCU Timeline
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {watchlistMovies.map((movie) => (
                  <MovieCard key={movie.id} item={movie} layout="grid" sortMode="story" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Watched Collection */}
        {activeTab === "watched" && (
          <div>
            {watchedMovies.length === 0 ? (
              <div className="py-24 text-center max-w-md mx-auto space-y-4">
                <span className="text-4xl block">📼</span>
                <h3 className="font-display text-2xl text-white font-bold">
                  Zero titles logged so far.
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Still pretending you haven't seen Iron Man four times? Start checking off the films you've already experienced.
                </p>
                <div className="pt-2">
                  <a href="/timeline" class="btn-primary text-xs">
                    Open Timeline to Log Films
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex items-center justify-between text-xs font-mono text-muted-dark">
                  <span>
                    Logged <strong className="text-emerald-400 font-bold">{watchedMovies.length}</strong> of {movies.length} MCU chapters ({Math.round((watchedMovies.length / movies.length) * 100)}% complete)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {watchedMovies.map((movie) => (
                    <MovieCard key={movie.id} item={movie} layout="grid" sortMode="story" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Currently Watching */}
        {activeTab === "in-progress" && (
          <div>
            {inProgressMovies.length === 0 ? (
              <div className="py-24 text-center max-w-md mx-auto space-y-4">
                <span className="text-4xl block">⏳</span>
                <h3 className="font-display text-2xl text-white font-bold">
                  Nothing currently on your screen.
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Start an MCU marathon today. Jump into your next chapter and mark your journey.
                </p>
                <div className="pt-2">
                  <a href="/timeline" class="btn-primary text-xs">
                    Pick a Movie to Stream
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {inProgressMovies.map((movie) => (
                  <MovieCard key={movie.id} item={movie} layout="grid" sortMode="story" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}