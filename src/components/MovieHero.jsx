import { motion } from "framer-motion";
import { useWatched, useWatchlist } from "../hooks/useUserState.js";
import { getMovieData } from "../lib/movieUtils.js";

const PHASE_CLASSES = {
  1: "phase-badge-1",
  2: "phase-badge-2",
  3: "phase-badge-3",
  4: "phase-badge-4",
  5: "phase-badge-5",
  6: "phase-badge-6",
};

export default function MovieHero({ movie }) {
  const data = getMovieData(movie);
  const { watchedMap, toggleWatched } = useWatched();
  const { watchlist, toggleWatchlist } = useWatchlist();

  const watched = !!watchedMap[data.id];
  const inWatchlist = watchlist.includes(data.id);
  const badgeClass = PHASE_CLASSES[data.phase] || "phase-badge-1";

  return (
    <div className="relative w-full overflow-hidden min-h-[70vh] flex items-center">
      {/* ── Dynamic Atmospheric Backdrop Generated From Movie Poster ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {data.poster && (
          <img
            src={data.poster}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-25 brightness-50 contrast-125"
          />
        )}
        {/* Layered gradients: dark vignette and bottom seamless transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg/90" />
        <div className="absolute inset-0 hero-vignette opacity-80" />
      </div>

      {/* Main Editorial Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">
          {/* ── Controlled Foreground Poster (25-35% desktop width, Natural 2:3 ratio) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[280px] sm:max-w-[320px] lg:w-[32%] shrink-0"
          >
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/15 bg-black/70 shadow-2xl shadow-black/80">
              <img
                src={data.poster}
                alt={`${data.title} poster`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Watched Badge on Poster */}
              {watched && (
                <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-md text-emerald-400 text-xs font-mono font-bold shadow-lg">
                  <span>✓ WATCHED</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Movie Intel & Actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex-1 space-y-6 text-center lg:text-left"
          >
            {/* Breadcrumb / Back Link */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <a
                href="/timeline"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-white transition-colors uppercase tracking-wider"
              >
                <span>&larr; Timeline</span>
              </a>
              <span className="text-white/20">•</span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${badgeClass}`}>
                Phase {data.phase}
              </span>
              <span className="text-white/20">•</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-white/[0.06] text-text-secondary border border-white/10">
                {data.type}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-wide leading-tight title-glow">
              {data.title}
            </h1>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-lg bg-[#111422] border border-white/10 text-white">
                Story Year: <strong className="text-crimson-bright font-bold">{data.chronologicalYear}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#111422] border border-white/10 text-white">
                Theatrical Release: <strong className="text-white font-bold">{data.year}</strong>
              </span>
              {data.releaseDate && (
                <span className="px-3 py-1 rounded-lg bg-[#111422] border border-white/10 text-muted">
                  Premiere: {data.releaseDate}
                </span>
              )}
            </div>

            {/* Cast */}
            {data.cast && (
              <p className="text-xs font-mono text-muted-dark">
                Key Cast: <span className="text-text-secondary font-medium">{data.cast}</span>
              </p>
            )}

            {/* Description */}
            <p className="text-base text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {data.desc}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              {/* Preserved Original Stream Link / Watch */}
              {data.link ? (
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-3 px-6"
                >
                  ▶ Watch on Disney+ / Stream
                </a>
              ) : data.play ? (
                <a
                  href={data.play}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-3 px-6"
                >
                  ▶ Watch Now
                </a>
              ) : null}

              {/* Watched Toggle */}
              <button
                type="button"
                onClick={() => toggleWatched(data.id)}
                className={`px-5 py-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all border ${
                  watched
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                    : "bg-white/[0.06] text-white border-white/15 hover:bg-white/[0.12] hover:border-white/25"
                }`}
              >
                {watched ? "✓ In Your Watched Archive" : "+ Mark as Watched"}
              </button>

              {/* Watchlist Toggle */}
              <button
                type="button"
                onClick={() => toggleWatchlist(data.id)}
                className={`px-5 py-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all border flex items-center gap-2 ${
                  inWatchlist
                    ? "bg-accent/20 text-accent-bright border-accent/40"
                    : "bg-white/[0.06] text-muted border-white/15 hover:text-white hover:bg-white/[0.12]"
                }`}
              >
                <svg className="w-4 h-4" fill={inWatchlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{inWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}