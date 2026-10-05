import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWatched, useWatchlist } from "../hooks/useUserState.js";
import { getMovieData } from "../lib/movieUtils.js";

export default function MovieCard({ item, layout = "timeline", sortMode = "story" }) {
  const movie = getMovieData(item);
  const { watchedMap, toggleWatched } = useWatched();
  const { watchlist, toggleWatchlist } = useWatchlist();

  const watched = !!watchedMap[movie.id];
  const inWatchlist = watchlist.includes(movie.id);

  const posterIsPlaceholder = movie.poster?.includes("PLACEHOLDER") || !movie.poster;
  const timeLeft = movie.releaseDate
    ? (() => {
        const diff = new Date(movie.releaseDate).getTime() - Date.now();
        if (diff <= 0) return null;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        return { days, hours };
      })()
    : null;
  const isUpcoming = !!timeLeft;

  const TYPE_LABEL = { movie: "Movie", series: "Series", special: "Special" };
  const TYPE_COLOR = { movie: "bg-accent/20", series: "bg-steel/20", special: "bg-accent/20" };
  const TYPE_TEXT_COLOR = { movie: "text-accent-bright", series: "text-steel-bright", special: "text-accent-bright" };

  return (
    <motion.div
      id={movie.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -2, scale: 1.005 }}
      className={`group relative scroll-mt-24 rounded-2xl overflow-hidden border transition-all duration-300 bg-surface/80 backdrop-blur-xl shadow-xl shadow-black/50 ${
        watched
          ? "border-accent/50 shadow-accent/10"
          : "border-white/[0.08] hover:border-white/20"
      } ${layout === "timeline" ? "w-full" : ""}`}
    >
      {/* Top highlight edge */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] via-transparent to-transparent opacity-60" />

      <div className="relative aspect-[16/9] bg-black overflow-hidden">
        {posterIsPlaceholder ? (
          <div className="media-placeholder absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
            <span className="text-xs uppercase tracking-widest">Poster goes here</span>
            <span className="text-[10px] text-muted/60 font-mono">{movie.poster}</span>
          </div>
        ) : (
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {isUpcoming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
              Coming Soon
            </span>
            <span className="font-display text-lg text-white tracking-wide">
              {timeLeft.days}d {timeLeft.hours}h
            </span>
          </div>
        )}
      </div>

      <div className="relative p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-block ${TYPE_COLOR[movie.type] ?? "bg-accent/20"} ${TYPE_TEXT_COLOR[movie.type] ?? "text-accent-bright"} text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full`}>
            {TYPE_LABEL[movie.type] ?? movie.type}
          </span>
          {!isUpcoming && (
            <motion.button
              type="button"
              onClick={() => toggleWatched(movie.id)}
              aria-pressed={watched}
              whileTap={{ scale: 0.92 }}
              className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border transition-colors ${
                watched
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-muted border-white/15 hover:border-accent/50 hover:text-white"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={watched ? "on" : "off"}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  className="inline-block"
                >
                  {watched ? "✓ Watched" : "Mark watched"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          )}
        </div>

        <h3 className="font-display text-xl tracking-wide leading-none mt-1">
          {movie.title}
        </h3>
        <p className="text-sm text-muted leading-snug">{movie.desc}</p>
        <p className="text-xs text-muted/70 mt-1 flex flex-wrap items-center gap-x-1.5">
          <span className={sortMode === "release" ? "text-white font-semibold" : ""}>
            {isUpcoming ? "Releases" : "Released"} {movie.year}
          </span>
          <span className="text-muted/40">•</span>
          <span className={sortMode === "story" ? "text-white font-semibold" : ""}>
            Story {movie.chronologicalYear}
          </span>
          {movie.cast ? (
            <>
              <span className="text-muted/40">•</span>
              <span>{movie.cast}</span>
            </>
          ) : null}
        </p>

        {isUpcoming ? (
          <span className="mt-1 inline-flex items-center gap-1.5 self-start text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full bg-white/10 text-muted border border-white/15">
            ⏳ {timeLeft.days}d {timeLeft.hours}h until release
          </span>
        ) : (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {/* Watch officially button - only show if official links exist */}
            {movie.watch.official.length > 0 ? (
              <>
                {movie.watch.official.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full bg-accent text-white hover:bg-accent-bright transition-colors"
                  >
                    ▶ Watch on {link.platform}
                  </a>
                ))}
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full bg-white/10 text-muted/60 border border-white/10 cursor-not-allowed">
                Check official sources
              </span>
            )}

            {/* Legal availability locator */}
            {movie.watch.legalLocator && (
              <a
                href={movie.watch.legalLocator}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full bg-white/10 text-muted hover:text-white border border-white/15"
              >
                Where to watch
              </a>
            )}

            {/* Detail page link */}
            <a
              href={`/movie/${movie.id}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full bg-white/10 text-muted hover:text-white border border-white/15"
            >
              Details
              </a>
          </div>
        )}

        {/* Watchlist toggle */}
        <div className="mt-2 flex justify-center">
          <motion.button
            type="button"
            onClick={() => toggleWatchlist(movie.id)}
            whileTap={{ scale: 0.92 }}
            className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full transition-colors ${
              inWatchlist
                ? "bg-accent text-white hover:bg-accent-bright"
                : "bg-transparent text-muted border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={inWatchlist ? "in" : "out"}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                className="inline-block"
              >
                {inWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}