import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import movies from "../data/movies.json";
import MovieCard from "./MovieCard.jsx";
import { useWatched } from "../hooks/useUserState.js";

export default function CharacterTimeline({ movieIds = [] }) {
  const { watchedMap, toggleWatched } = useWatched();
  const [view, setView] = useState("timeline");

  const items = useMemo(() => {
    const byId = new Map(movies.map((m) => [m.id, m]));
    return movieIds
      .map((id) => byId.get(id))
      .filter(Boolean)
      .sort((a, b) => a.chronologicalYear - b.chronologicalYear);
  }, [movieIds]);

  const watchedCount = items.filter((item) => watchedMap[item.id]).length;

  // Calculate character arc progress
  const firstAppearance = items[0]?.chronologicalYear || 0;
  const lastAppearance = items[items.length - 1]?.chronologicalYear || 0;
  const currentYear = new Date().getFullYear();
  const arcProgress = lastAppearance > 0
    ? Math.min(100, Math.round(((currentYear - firstAppearance) / (lastAppearance - firstAppearance || 1)) * 100))
    : 0;

  return (
    <div className="relative">
      {/* Enhanced Background for Character Pages */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/public/bg/character-faint-texture.png')] bg-repeat opacity-[0.01]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.01)_0%,transparent_70%)] bg-[size:800%_800%] animate-[floatGradient_15s_ease-in-out_infinite]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* Character Arc Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted/60 font-mono">CHARACTER ARC PROGRESS</span>
            <span className="font-display text-xs text-white">{arcProgress}%</span>
          </div>
          <div className="relative h-2.5 rounded-full bg-white/[0.03] overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]
                          animate-[shimmer_3s_linear_infinite]" />
            <div
              className="absolute left-0 top-0 bottom-0 h-full bg-gradient-to-r from-cosmic via-crimson to-warm rounded-full
                      shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transition-shadow duration-300
                      -z-10"
              style={{ width: `${arcProgress}%` }}
            />
            {/* Progress bar glow */}
            <div className="absolute inset-0 -z-10
                    bg-gradient-to-r from-cosmic/20 via-crimson/20 to-warm/20
                    blur-[6px] opacity-0
                    hover:opacity-50 transition-opacity duration-300"></div>
          </div>
          <div className="flex items-center justify-between mt-1 text-xs text-muted/60">
            <span>First Appearance</span>
            <span>{firstAppearance}</span>
            <span>Latest Appearance</span>
            <span>{lastAppearance || "TBD"}</span>
          </div>
        </div>

        {/* View Controls with Enhanced Design */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <motion.p
              whileInView={{ scale: [0.8, 1, 0.9, 1] }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-sm text-muted/60 font-mono">
              <span className="text-white font-semibold">{watchedCount}</span> of{" "}
              {items.length} appearances
            </motion.p>

            <div className="relative flex items-center gap-2 bg-surface/80 backdrop-blur-xl rounded-xl border border-white/[0.08] px-3 py-2">
              {["timeline", "grid"].map((v) => (
                <motion.button
                  key={v}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider
                            transition-all duration-400
                            ${view === v
                              ? "text-white bg-white/20"
                              : "text-muted/60 hover:text-white hover:bg-white/10"
                            }`}
                >
                  <span className="relative">{v === "timeline" ? "TIMELINE" : "GRID"}</span>
                  {view === v && (
                    <motion.span
                      layoutId="character-view-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white/20 -z-10"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline View */}
        {view === "timeline" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Enhanced Character Spine with Personal Touch */}
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2">
                {/* Main timeline line with softer, more personal gradient */}
                <div className="h-full w-1.5 bg-gradient-to-b from-[rgba(99,102,241,0.3)] via-[rgba(236,118,153,0.3)] to-[rgba(255,182,193,0.3)]" />
                {/* Outer glow with character-appropriate colors */}
                <div className="h-full w-3 bg-gradient-to-b from-[rgba(99,102,241,0.1)] via-[rgba(236,118,153,0.1)] to-[rgba(255,182,193,0.1)] blur-[8px] -z-10" />
                {/* Inner pulse */}
                <div className="h-full w-0.5 bg-gradient-to-b from-[rgba(99,102,241,0.6)] via-[rgba(236,118,153,0.6)] to-[rgba(255,182,193,0.6)]" />
              </div>

              {/* Phase Markers with Character-Appropriate Design */}
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2 pointer-events-none">
                {[1, 2, 3, 4, 5, 6].map((phase) => {
                  const phaseMovies = items.filter(movie => movie.phase === phase);
                  if (phaseMovies.length === 0) return null;

                  const firstMovie = phaseMovies[0];
                  const phaseYear = firstMovie.chronologicalYear;

                  return (
                    <div
                      key={phase}
                      className="absolute -top-3 sm:-top-5 left-1/2 -translate-x-1/2 flex flex-col items-start gap-1"
                    >
                      {/* Character-Appropriate Phase Ring */}
                      <div className="w-5 h-5 rounded-full border-2
                             border-[rgba(99,102,241,0.3)]">
                        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_var(--color-bg)_0%,_var(--color-bg)_70%)]"></div>
                      </div>

                      {/* Phase Label with Softer Styling */}
                      <div className="flex flex-col items-start text-xs font-bold uppercase tracking-widest">
                        <span className="text-[rgba(99,102,241,0.8)] tracking-widest">
                          PHASE {phase}
                        </span>
                        <span className="block text-xs text-[rgba(99,102,241,0.5)] mt-[-1px]">
                          {phaseYear}
                        </span>
                        {/* Softer phase divider */}
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[rgba(99,102,241,0.4)] to-transparent mt-1" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Movie Items with Enhanced Personal Touch */}
              <div className="relative">
                {items.map((item, index) => {
                  const watched = !!watchedMap[item.id];

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, y: 20 }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 250,
                          damping: 20
                        }
                      }}
                      className={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-12 pl-10 sm:pl-0 ${
                        index % 2 === 1 ? "sm:flex-row-reverse" : ""
                      }`}
                    >
                      {/* Enhanced Timeline Node with Personal Design */}
                      <motion.div
                        whileInView={{
                          scale: [0.7, 1.1, 0.9, 1],
                          rotate: [0, 3, -3, 0]
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25
                        }}
                        className={`absolute left-4 sm:left-1/2 top-4 -translate-x-1/2 w-7 h-7 rounded-full border-1.5 z-10
                                  ${watched
                                    ? "bg-gradient-to-b from-[rgba(99,102,241,0.4)] via-[rgba(236,118,153,0.4)] to-[rgba(255,182,193,0.4)]"
                                    : "bg-[rgba(20,20,24,0.3)] border-[rgba(255,255,255,0.1)]"
                                  }
                                  hover:bg-[rgba(255,255,255,0.05)] transition-all duration-500
                                `}
                      >
                        {/* Watched indicator pulse */}
                        {watched && (
                          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                                  bg-gradient-to-b from-[rgba(99,102,241,0.6)] via-[rgba(236,118,153,0.6)] to-[rgba(255,182,193,0.6)]
                                  opacity-0">
                          </div>
                        )}
                      </motion.div>

                      {/* Enhanced Movie Content with Personal Touch */}
                      <div className="sm:w-1/2 w-full relative">
                        <div className="relative">
                          {/* Personal Character Movie Card */}
                          <div className="relative overflow-hidden
                                  hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]
                                  transition-all duration-600">
                            {/* Background enhancement */}
                            <div className="absolute inset-0 -z-10
                                    ${index % 2 === 1 ? 'bg-gradient-to-r from-[rgba(99,102,241,0.03)] via-transparent to-[rgba(99,102,241,0.03)]' : 'bg-gradient-to-l from-[rgba(99,102,241,0.03)] via-transparent to-[rgba(99,102,241,0.03)]'}"
                                    pointer-events-none"></div>

                            {/* Main Content */}
                            <div className="relative">
                              <div className="glass-panel rounded-2xl border border-white/[0.06] backdrop-blur-xl p-5">
                                {/* Header with Year and Type - Personal Design */}
                                <div className="flex items-center gap-3 mb-3">
                                  {/* Year Badge - Softer Design */}
                                  <div className="relative w-8 h-8 flex-shrink-0 rounded-xl
                                          bg-gradient-to-b from-[rgba(99,102,241,0.15)] via-[rgba(236,118,153,0.15)] to-[rgba(255,182,193,0.15)]
                                          backdrop-blur-sm border border-white/[0.06]
                                          flex items-center justify-center text-xs font-bold tracking-wider
                                          shadow-[0_0_8px_rgba(99,102,241,0.1)]">
                                    <span className="relative z-10">{item.chronologicalYear}</span>
                                  </div>

                                  {/* Title and Type */}
                                  <div>
                                    <h3 className="font-display text-lg tracking-wide text-white
                                            hover:text-[rgba(99,102,241,0.8)] transition-colors duration-400
                                            leading-tight">
                                      {item.title}
                                    </h3>
                                    <p className="text-xs text-[rgba(99,102,241,0.5)]/60 uppercase tracking-wider flex items-center gap-2">
                                      {/* Type indicator with character-appropriate dot */}
                                      <span className="w-2 h-2 rounded-full
                                              bg-[rgba(99,102,241,0.2)]">
                                      </span>
                                      <span className="ml-1">
                                        {item.type === "series" ? "SERIES" : item.type === "special" ? "SPECIAL" : "FILM"}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                {/* Poster with Enhanced Personal Treatment */}
                                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden mb-3
                                            hover:scale-[1.01] transition-transform duration-500">
                                  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(99,102,241,0.05)] via-transparent to-[rgba(99,102,241,0.05)]
                                              pointer-events-none"></div>
                                  <img
                                    src={item.poster}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover
                                            transition-all duration-1000
                                            hover:scale-[1.015] hover:rotate-[0.5deg]"
                                    onMouseOver={(e) => {
                                      e.target.style.transform = 'scale(1.015) rotate(0.5deg)';
                                      e.target.style.transition = 'all 1s ease';
                                    }}
                                    onMouseOut={(e) => {
                                      e.target.style.transform = 'scale(1) rotate(0deg)';
                                      e.target.style.transition = 'all 1s ease';
                                    }}
                                  />
                                  {/* Film grain for personal touch */}
                                  <div className="absolute inset-0 bg-[url('/public/bg/film-grain.png')] bg-repeat opacity-[0.02] pointer-events-none" />
                                  {/* Watched indicator with personal touch */}
                                  {watched && (
                                    <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full
                                            border-2 border-white
                                            bg-gradient-to-b from-[rgba(99,102,241,0.4)] via-[rgba(236,118,153,0.4)] to-[rgba(255,182,193,0.4)]
                                            shadow-[0_0_6px_rgba(99,102,241,0.2)]">
                                      <div className="absolute inset-0 rounded-full bg-white/20" />
                                    </div>
                                  )}
                                  {/* Play indicator for unwatched */}
                                  {!watched && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm opacity-0
                                            hover:opacity-100 transition-opacity duration-300">
                                      <div className="w-3 h-3 rounded-full bg-white/20" />
                                      <span className="text-xs text-white font-bold">PLAY</span>
                                    </div>
                                  )}
                                </div>

                                {/* Description with Personal Touch */}
                                {item.desc && (
                                  <p className="text-[rgba(255,255,255,0.7)] mb-3 line-clamp-3
                                          hover:text-[rgba(99,102,241,0.6)] transition-colors duration-400">
                                    {item.desc}
                                  </p>
                                )}

                                {/* Cast with Personal Styling */}
                                {item.cast && (
                                  <div className="flex flex-wrap gap-1.5 mb-3">
                                    <span className="text-[xs] text-[rgba(99,102,241,0.5)] font-mono">Featuring:</span>
                                    <span className="text-[xs] text-[rgba(99,102,241,0.4)] font-mono">{item.cast}</span>
                                  </div>
                                )}

                                {/* Action Button with Personal Design */}
                                <div className="mt-3">
                                  <a
                                    href={`/movie/${item.id}`}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl
                                            border border-white/[0.08] backdrop-blur-md
                                            hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white transition-all duration-500
                                            shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                  >
                                    <span className="relative z-10">
                                      {watched ? "Rewatch" : "Watch"}
                                    </span>
                                    {/* Button glow with personal touch */}
                                    <div className="absolute inset-0 rounded-xl
                                            bg-gradient-to-r from-[rgba(99,102,241,0.15)] via-[rgba(236,118,153,0.15)] to-[rgba(255,182,193,0.15)]
                                            blur-[3px] -z-10 opacity-0
                                            hover:opacity-40 transition-opacity duration-300"></div>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Spacer for alternating layout */}
                          <div className="hidden sm:block sm:w-1/2" />
                        </motion.div>
                      );
                    })}
                </div>

                {/* Enhanced End Cap with Personal Touch */}
                <div className="absolute left-4 sm:left-1/2 bottom-0 -translate-x-1/2 flex items-start gap-3">
                  <div className="relative w-2.5 h-2.5 rounded-full bg-white/[0.15]">
                    <div className="absolute inset-0 rounded-full bg-white/[0.3]" />
                  </div>
                  <div className="flex flex-col items-start text-xs">
                    <span className="text-[rgba(99,102,241,0.5)]">The story continues...</span>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[rgba(99,102,241,0.3)] to-transparent mt-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid View with Enhanced Personal Touch */}
        {view === "grid" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <MovieCard
                    item={item}
                    watched={!!watchedMap[item.id]}
                    onToggleWatched={toggleWatched}
                    layout="grid"
                    className="hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-500"
                  />
                  {/* Personal background enhancement for grid items */}
                  <div className="absolute inset-0 -z-10
                          ${items.indexOf(item) % 2 === 1 ? 'bg-gradient-to-r from-[rgba(99,102,241,0.02)] via-transparent to-[rgba(99,102,241,0.02)]' : 'bg-gradient-to-l from-[rgba(99,102,241,0.02)] via-transparent to-[rgba(99,102,241,0.02)]'}"
                          pointer-events-none"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Floating cinematic elements for character pages */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/6 left-1/12 w-[250px] h-[150px] rounded-full bg-gradient-cosmic/3 blur-[60px]" />
        <div className="absolute bottom-1/6 right-1/12 w-[200px] h-[100px] rounded-full bg-gradient-[rgba(236,118,153,0.3)] blur-[40px]" />
        <div className="absolute top-1/3 left-2/3 w-[120px] h-[120px] rounded-full bg-gradient-warm/2 blur-[50px]" />
      </div>
    </div>
  );
}