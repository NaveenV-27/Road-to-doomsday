import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWatched, useWatchlist } from "../hooks/useUserState.js";
import { getMovieData } from "../lib/movieUtils.js";

const PHASE_TAGS = {
  1: "phase-badge-1",
  2: "phase-badge-2",
  3: "phase-badge-3",
  4: "phase-badge-4",
  5: "phase-badge-5",
  6: "phase-badge-6",
};

export default function MovieCard({ item, layout = "timeline", sortMode = "story" }) {
  const movie = getMovieData(item);
  const { watchedMap, toggleWatched } = useWatched();
  const { watchlist, toggleWatchlist } = useWatchlist();

  const watched = !!watchedMap[movie.id];
  const inWatchlist = watchlist.includes(movie.id);

  const posterIsPlaceholder = movie.poster?.includes("PLACEHOLDER") || !movie.poster;
  const badgeClass = PHASE_TAGS[movie.phase] || "phase-badge-1";

  // Check if upcoming
  const isUpcoming = movie.id === "avengers-doomsday" || movie.year >= 2026;

  // Grid Layout
  if (layout === "grid") {
    return (
      <motion.div
        id={movie.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 bg-[#0b0e17] flex flex-col justify-between ${
          watched
            ? "border-emerald-500/40 shadow-[0_4px_24px_rgba(16,185,129,0.1)]"
            : "border-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-1"
        }`}
      >
        {/* Top Poster Box (Natural 2:3 Portrait Aspect Ratio - NEVER distorted) */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/60">
          {!posterIsPlaceholder ? (
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#121522] text-muted">
              <span className="font-display text-sm font-bold">{movie.title}</span>
              <span className="text-[10px] font-mono mt-1">Artwork Pending</span>
            </div>
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-transparent to-black/40" />

          {/* Top Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md ${badgeClass}`}>
              Phase {movie.phase}
            </span>

            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/70 backdrop-blur-md text-white/90 border border-white/10">
              {movie.type}
            </span>
          </div>

          {/* Watched status ribbon on poster */}
          {watched && (
            <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 backdrop-blur-md text-emerald-400 text-[10px] font-mono font-bold">
              <span>✓ WATCHED</span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-muted mb-1.5">
              <span>Story {movie.chronologicalYear}</span>
              <span>•</span>
              <span>Rel. {movie.year}</span>
            </div>

            <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-text-secondary transition-colors line-clamp-1">
              <a href={`/movie/${movie.id}`} className="hover:underline">
                {movie.title}
              </a>
            </h3>

            <p className="text-xs text-muted line-clamp-2 mt-2 leading-relaxed">
              {movie.desc}
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleWatched(movie.id)}
                aria-label={watched ? "Mark as unwatched" : "Mark as watched"}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  watched
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                    : "bg-white/[0.05] text-muted border border-white/10 hover:text-white hover:bg-white/[0.09]"
                }`}
              >
                {watched ? "✓ Seen" : "Mark"}
              </button>

              <button
                type="button"
                onClick={() => toggleWatchlist(movie.id)}
                aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                className={`p-1.5 rounded-lg text-xs border transition-all ${
                  inWatchlist
                    ? "bg-accent/20 text-accent-bright border-accent/40"
                    : "bg-white/[0.05] text-muted border-white/10 hover:text-white"
                }`}
                title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
              >
                <svg className="w-4 h-4" fill={inWatchlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>

            <a
              href={`/movie/${movie.id}`}
              className="text-xs font-mono text-muted hover:text-white transition-colors"
            >
              Details &rarr;
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  // Timeline Layout (Cinematic horizontal row card)
  return (
    <motion.div
      id={movie.id}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45 }}
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 bg-[#0b0e17] shadow-xl ${
        watched
          ? "border-emerald-500/30 shadow-[0_4px_24px_rgba(16,185,129,0.08)]"
          : "border-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-0.5"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Poster (Controlled 2:3 portrait, not stretched) */}
        <div className="relative w-full sm:w-44 md:w-48 aspect-[2/3] shrink-0 bg-black/60 overflow-hidden">
          {!posterIsPlaceholder ? (
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#121522] text-muted">
              <span className="font-display text-sm font-bold">{movie.title}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-60" />

          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase backdrop-blur-md ${badgeClass}`}>
              Phase {movie.phase}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-muted">
                <span className={sortMode === "story" ? "text-crimson-bright font-bold" : "text-white"}>
                  Story: {movie.chronologicalYear}
                </span>
                <span>•</span>
                <span className={sortMode === "release" ? "text-crimson-bright font-bold" : "text-white"}>
                  Theatrical: {movie.year}
                </span>
                <span>•</span>
                <span className="capitalize">{movie.type}</span>
              </div>

              {watched && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30">
                  ✓ WATCHED
                </span>
              )}
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-text-secondary transition-colors leading-tight">
              <a href={`/movie/${movie.id}`}>
                {movie.title}
              </a>
            </h3>

            {movie.cast && (
              <p className="text-xs font-mono text-muted-dark mt-1 line-clamp-1">
                Featuring: <span className="text-muted">{movie.cast}</span>
              </p>
            )}

            <p className="text-sm text-muted leading-relaxed mt-3 line-clamp-3">
              {movie.desc}
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleWatched(movie.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  watched
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                    : "bg-white/[0.06] text-muted border border-white/10 hover:text-white hover:bg-white/[0.1]"
                }`}
              >
                {watched ? "✓ Watched" : "Mark as Watched"}
              </button>

              <button
                type="button"
                onClick={() => toggleWatchlist(movie.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all flex items-center gap-1.5 ${
                  inWatchlist
                    ? "bg-accent/20 text-accent-bright border-accent/40"
                    : "bg-white/[0.06] text-muted border-white/10 hover:text-white hover:bg-white/[0.1]"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill={inWatchlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{inWatchlist ? "In Watchlist" : "+ Watchlist"}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {movie.link && (
                <a
                  href={movie.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold text-crimson-bright hover:text-crimson-bright/80 transition-colors uppercase tracking-wider"
                >
                  ▶ Watch Link
                </a>
              )}
              <a
                href={`/movie/${movie.id}`}
                className="btn-secondary text-xs py-1.5 px-4"
              >
                Full Intel &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}