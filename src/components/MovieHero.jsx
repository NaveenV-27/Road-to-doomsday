import { useState } from "react";
import { motion } from "framer-motion";
import { useWatched, useWatchlist } from "../hooks/useUserState.js";
import { getMovieData, formatReadableDate } from "../lib/movieUtils.js";

const PHASE_CLASSES = {
  1: "phase-badge-1",
  2: "phase-badge-2",
  3: "phase-badge-3",
  4: "phase-badge-4",
  5: "phase-badge-5",
  6: "phase-badge-6",
};

function HeroPoster({ movie }) {
  const initialSrc = movie.poster || movie.posterFallbackUrl || "";
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [hasFailed, setHasFailed] = useState(!initialSrc);

  const handleError = () => {
    if (!fallbackAttempted && movie.posterFallbackUrl && imgSrc !== movie.posterFallbackUrl) {
      setFallbackAttempted(true);
      setImgSrc(movie.posterFallbackUrl);
    } else {
      setHasFailed(true);
    }
  };

  if (!hasFailed && imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={`${movie.title} poster`}
        onError={handleError}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 text-center bg-gradient-to-b from-[#131726] via-[#0b0e17] to-[#05060b] border border-white/[0.08] relative select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-crimson/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 pt-4">
        <span className="px-3 py-1 rounded text-[10px] font-mono uppercase tracking-widest font-bold bg-white/[0.06] text-muted-dark border border-white/10">
          {movie.type === "series" ? "MCU SERIES" : movie.type === "special" ? "SPECIAL PRESENTATION" : "MCU PRODUCTION"}
        </span>
      </div>

      <div className="relative z-10 my-auto px-4 space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-crimson/15 border border-crimson/40 flex items-center justify-center text-crimson-bright text-lg font-mono font-bold">
          ★
        </div>
        <h4 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
          {movie.title}
        </h4>
        <span className="text-xs font-mono text-muted-dark block">
          {movie.year || "Release Pending"}
        </span>
      </div>

      <div className="relative z-10 pb-4">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-dark/80">
          Official Production Archive
        </span>
      </div>
    </div>
  );
}

export default function MovieHero({ movie }) {
  const data = getMovieData(movie);
  const { watchedMap, toggleWatched } = useWatched();
  const { watchlist, toggleWatchlist } = useWatchlist();

  const watched = !!watchedMap[data.id];
  const inWatchlist = watchlist.includes(data.id);
  const isUpcoming = data.releaseStatus === "upcoming" || data.id === "avengers-doomsday" || data.id === "avengers-secret-wars";
  const badgeClass = data.phase ? (PHASE_CLASSES[data.phase] || "phase-badge-1") : "bg-white/10 text-muted border border-white/10";
  const formattedReleaseDate = formatReadableDate(data.releaseDate);

  // Watch CTA data
  const officialWatchList = Array.isArray(data.officialWatch) ? data.officialWatch : [];
  const primaryWatch = officialWatchList.length > 0 ? officialWatchList[0] : null;

  const hasLink1 = !!data.link;
  const hasLink2 = !!data.play && data.play !== data.link;

  return (
    <div className="relative w-full overflow-hidden min-h-[70vh] flex items-center">
      {/* Dynamic Atmospheric Backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {data.poster && (
          <img
            src={data.poster}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-20 brightness-50 contrast-125"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg/90" />
        <div className="absolute inset-0 hero-vignette opacity-80" />
      </div>

      {/* Main Editorial Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">
          {/* Controlled Foreground Poster (Natural 2:3 ratio, never distorted) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[280px] sm:max-w-[320px] lg:w-[32%] shrink-0"
          >
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/15 bg-black/70 shadow-2xl shadow-black/80">
              <HeroPoster movie={data} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Watched Badge on Poster */}
              {watched && (
                <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-md text-emerald-400 text-xs font-mono font-bold shadow-lg">
                  <span>✓ WATCHED</span>
                </div>
              )}

              {/* Upcoming Badge on Poster */}
              {isUpcoming && !watched && (
                <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-950/90 border border-amber-400/50 backdrop-blur-md text-amber-300 text-xs font-mono font-bold shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>{data.releaseStatusLabel || "NOT YET RELEASED"}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Movie Intel & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex-1 space-y-6 text-center lg:text-left"
          >
            {/* Breadcrumb / Category Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a
                href="/timeline"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-white transition-colors uppercase tracking-wider"
              >
                <span>&larr; Timeline</span>
              </a>
              <span className="text-white/20">•</span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${badgeClass}`}>
                {data.phase ? `Phase ${data.phase}` : "Multiverse & Specials"}
              </span>
              <span className="text-white/20">•</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-white/[0.06] text-text-secondary border border-white/10">
                {data.type}
              </span>

              {isUpcoming && (
                <>
                  <span className="text-white/20">•</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[11px] font-mono font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>{data.releaseStatusLabel || "NOT YET RELEASED"}</span>
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-wide leading-tight title-glow">
              {data.title}
            </h1>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-lg bg-[#111422] border border-white/10 text-white">
                Story Era: <strong className="text-crimson-bright font-bold">{data.chronologicalYear || "Unplaced"}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#111422] border border-white/10 text-white">
                Theatrical Year: <strong className="text-white font-bold">{data.year}</strong>
              </span>
              {formattedReleaseDate && (
                <span className="px-3 py-1 rounded-lg bg-[#111422] border border-amber-500/30 text-amber-300 font-bold">
                  Premiere: {formattedReleaseDate}
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

            {/* Action Buttons & Strict Watch Hierarchy */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              {isUpcoming ? (
                /* Upcoming: NO watch/stream CTAs */
                data.officialInfoUrl ? (
                  <a
                    href={data.officialInfoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs py-3 px-6 text-cyan-400 border-cyan-500/40 hover:border-cyan-400 inline-flex items-center gap-2"
                  >
                    <span>{data.officialInfoLabel || "Official Film Information"}</span>
                    <span>&nearr;</span>
                  </a>
                ) : (
                  <div className="px-5 py-3 rounded-lg text-xs font-mono bg-amber-500/10 border border-amber-400/30 text-amber-300 font-bold">
                    Theatrical Premiere: {formattedReleaseDate || data.year}
                  </div>
                )
              ) : (
                /* Released: Strict Watch CTAs */
                <>
                  {primaryWatch ? (
                    primaryWatch.urlType === "direct-title" ? (
                      <a
                        href={primaryWatch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs py-3 px-6 font-bold"
                      >
                        ▶ Watch Officially
                      </a>
                    ) : (
                      <a
                        href={primaryWatch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs py-3 px-6 text-amber-300 border-amber-500/40 hover:border-amber-400 font-bold inline-flex items-center gap-2"
                        title={primaryWatch.verificationStatus || "Provider title destination"}
                      >
                        <span>Open Official Provider Page</span>
                        <span>&nearr;</span>
                      </a>
                    )
                  ) : data.officialInfoUrl ? (
                    <a
                      href={data.officialInfoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs py-3 px-6 text-crimson-bright border-crimson/50 hover:border-crimson inline-flex items-center gap-2"
                    >
                      <span>{data.officialInfoLabel || "Official Title Page"}</span>
                      <span>&nearr;</span>
                    </a>
                  ) : null}

                  {/* Secondary Curated Links */}
                  {hasLink1 && (
                    <a
                      href={data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-crimson-bright hover:text-white px-4 py-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                      title="User Curated Link 1"
                    >
                      Watch Link 1
                    </a>
                  )}

                  {hasLink2 && (
                    <a
                      href={data.play}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-crimson-bright hover:text-white px-4 py-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                      title="User Curated Link 2"
                    >
                      Watch Link 2
                    </a>
                  )}
                </>
              )}

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
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
