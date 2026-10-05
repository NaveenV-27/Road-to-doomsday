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
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative scroll-mt-24 rounded-2xl overflow-hidden border transition-all duration-400 bg-surface/80 backdrop-blur-xl shadow-xl shadow-black/50 ${
        watched
          ? "border-accent/50 shadow-accent/10"
          : "border-white/[0.08] hover:border-white/20"
      } ${layout === "timeline" ? "w-full" : ""}`}
    >
      {/* Enhanced Top highlight edge with animation */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl
              bg-gradient-to-b from-white/[0.08] via-transparent to-transparent
              opacity-70 animate-[shine_2s_ease-in-out_infinite]" />

      <div className="relative aspect-[16/9] bg-black overflow-hidden">
        {posterIsPlaceholder ? (
          <div className="media-placeholder absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
            <span className="text-xs uppercase tracking-widest">Poster goes here</span>
            <span className="text-[10px] text-muted/60 font-mono">{movie.poster}</span>
          </div>
        ) : (
          <motion.img
            src={movie.poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-800"
            whileHover={{ scale: 1.06, rotate: [0, 2, -2, 0] }}
            whileTap={{ scale: 0.98 }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {isUpcoming && (
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
              Coming Soon
            </span>
            <span className="font-display text-lg text-white tracking-wide">
              {timeLeft.days}d {timeLeft.hours}h
            </span>
          </motion.div>
        )}
      </div>

      <div className="relative p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-block ${TYPE_COLOR[movie.type] ?? "bg-accent/20"} ${TYPE_TEXT_COLOR[movie.type] ?? "text-accent-bright"} text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full
                  transition-all duration-300
                  hover:${TYPE_TEXT_COLOR[movie.type] ?? "text-accent-bright"}
                  hover:bg-${TYPE_COLOR[movie.type] ?? "bg-accent/20"}/30`}>
            {TYPE_LABEL[movie.type] ?? movie.type}
          </span>
          {!isUpcoming && (
            <motion.button
              type="button"
              onClick={() => toggleWatched(movie.id)}
              aria-pressed={watched}
              whileTap={{ scale: 0.92 }}
              className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border transition-colors duration-300
                      ${watched
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-muted border-white/15 hover:border-accent/50 hover:text-white"}
                    `}
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

        <h3 className="font-display text-xl tracking-wide leading-none mt-1
                relative inline-block
                bg-gradient-to-r from-accent via-accent-bright to-accent/20 bg-clip-text text-transparent
                hover:bg-gradient-to-r from-accent-bright via-accent to-accent/30 bg-clip-text text-transparent
                transition-all duration-400">
          {movie.title}
        </h3>
        <p className="text-sm text-muted leading-snug
                transition-all duration-300
                hover:text-accent-bright/60">{movie.desc}</p>
        <p className="text-xs text-muted/70 mt-1 flex flex-wrap items-center gap-x-1.5">
          <span className={sortMode === "release" ? "text-white font-semibold" : ""}
                transition-all duration-300>
            {isUpcoming ? "Releases" : "Released"} {movie.year}
          </span>
          <span className="text-muted/40">•</span>
          <span className={sortMode === "story" ? "text-white font-semibold" : ""}
                transition-all duration-300>
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
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.4 }}
            className="mt-1 inline-flex items-center gap-1.5 self-start text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full bg-white/10 text-muted border border-white/15">
            ⏳ {timeLeft.days}d {timeLeft.hours}h until release
          </motion.div>
        ) : (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {/* Watch officially button - only show if official links exist */}
            {movie.watch.official.length > 0 ? (
              <>
                {movie.watch.official.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full bg-accent text-white hover:bg-accent-bright transition-colors duration-300"
                  >
                    ▶ Watch on {link.platform}
                  </motion.a>
                ))}
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full bg-white/10 text-muted/60 border border-white/10 cursor-not-allowed
                      transition-all duration-300
                      hover:bg-white/20 hover:text-white">
                Check official sources
              </span>
            )}

            {/* Legal availability locator */}
            {movie.watch.legalLocator && (
              <motion.a
                href={movie.watch.legalLocator}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full bg-white/10 text-muted hover:text-white border border-white/15
                        transition-all duration-300"
              >
                Where to watch
              </motion.a>
            )}

            {/* Detail page link */}
            <motion.a
              href={`/movie/${movie.id}`}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full bg-white/10 text-muted hover:text-white border border-white/15
                      transition-all duration-300"
            >
              Details
              </motion.a>
          </div>
        )}

        {/* Watchlist toggle */}
        <div className="mt-2 flex justify-center">
          <motion.button
            type="button"
            onClick={() => toggleWatchlist(movie.id)}
            whileTap={{ scale: 0.92 }}
            className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full transition-colors duration-300
                    ${inWatchlist
                      ? "bg-accent text-white hover:bg-accent-bright"
                      : "bg-transparent text-muted border-white/10 hover:border-white/20 hover:text-white"}
                  `}
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

      {/* Enhanced background elements for depth */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Subtle animated gradient */}
        <div className="absolute inset-0 -z-10
                bg-[repeating-linear-gradient(45deg,transparent_0%,transparent_1px,rgba(255,255,255,0.02)_1px,transparent_2px)]
                bg-[size:400%_400%]
                opacity-[0.008]
                animate-[gradientMove_12s_ease-in-out_infinite]"></div>

        {/* Corner particles */}
        <div className="absolute top-3 left-3 -z-10 w-3 h-3
                bg-gradient-to-r from-accent via-accent-bright to-accent/20
                blur-[2px] opacity-[0.2]
                animate-[float_3s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-3 right-3 -z-10 w-3 h-3
                bg-gradient-to-b from-accent via-accent-bright to-accent/20
                blur-[2px] opacity-[0.2]
                animate-[float_4s_ease-in-out_infinite]"></div>
      </div>
    </motion.div>
  );
}