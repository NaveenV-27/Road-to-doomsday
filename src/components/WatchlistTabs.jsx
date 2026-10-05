import { useState } from "react";
import { motion } from "framer-motion";
import { useWatchlist, useWatched } from "../hooks/useUserState.js";
import MovieCard from "./MovieCard.jsx";

// Helper functions to get data from either old or new schema
function getMovieData(item) {
  // Handle new schema
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
      connections: item.connections,
      journey: item.journey
    };
  }

  // Handle old schema (fallback for migration)
  return {
    id: item.id,
    title: item.title,
    type: item.type,
    year: item.year,
    releaseDate: item.releaseDate || null,
    chronologicalYear: item.chronologicalYear,
    poster: item.poster,
    desc: item.desc,
    cast: item.cast,
    watch: {
      official: item.link ? [{ platform: "Disney+", url: item.link }] : [],
      legalLocator: item.play || item.link || null
    },
    connections: {
      characters: [],
      relatedTitles: []
    },
    journey: {
      importance: "essential",
      spoilerLevel: 0
    }
  };
}

export default function WatchlistTabs() {
  const { watchlist, toggleWatchlist } = useWatchlist();
  const { watchedMap } = useWatched();
  const [activeTab, setActiveTab] = useState("watchlist"); // watchlist, watched, currently-watching

  // Get all movies data
  // Note: In a real implementation, we would import movies.json here
  // For now, we'll pass it as a prop or use context

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      {/* Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap border-b border-white/[0.08]">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === "watchlist"
                ? "text-white border-b-2 border-accent-bright"
                : "text-muted hover:text-white"
            }`}
          >
            Watch Later
          </button>
          <button
            onClick={() => setActiveTab("watched")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === "watched"
                ? "text-white border-b-2 border-accent-bright"
                : "text-muted hover:text-white"
            }`}
          >
            Watched
          </button>
          <button
            onClick={() => setActiveTab("currently-watching")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === "currently-watching"
                ? "text-white border-b-2 border-accent-bright"
                : "text-muted hover:text-white"
            }`}
          >
            Currently Watching
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "watchlist" && (
        <div className="space-y-6">
          <h2 className="font-display text-xl tracking-wide mb-6">Watch Later</h2>
          {watchlist.length === 0 ? (
            <p className="text-center text-muted py-12">
              Your watchlist is empty. Add movies to your watchlist to see them here.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Would map through watchlist and get movie details */}
              <div className="col-span-3 text-center py-12">
                <p className="text-muted">Movie data would be loaded here based on watchlist IDs</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "watched" && (
        <div className="space-y-6">
          <h2 className="font-display text-xl tracking-wide mb-6">Watched Movies</h2>
          {/* Would map through watched movies */}
          <div className="col-span-3 text-center py-12">
            <p className="text-muted">Watched movies would be displayed here</p>
          </div>
        </div>
      )}

      {activeTab === "currently-watching" && (
        <div className="space-y-6">
          <h2 className="font-display text-xl tracking-wide mb-6">Currently Watching</h2>
          <div className="col-span-3 text-center py-12">
            <p className="text-muted">Currently watching movies would be displayed here</p>
          </div>
        </div>
      )}
    </div>
  );
}