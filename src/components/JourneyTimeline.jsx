import { useMemo } from "react";
import { useWatched } from "../hooks/useUserState.js";
import { motion } from "framer-motion";
import movies from "../data/movies.json";

// Extract dominant colors from movie posters for cinematic feel
function getPhaseColors() {
  // Define base colors for each phase that work with movie artwork
  return {
    // Setup Phases (1-2) - Cosmic Purple foundation
    1: {
      primary: "from-cosmic via-cosmic-bright to-cosmic",
      secondary: "from-cosmic/20 via-transparent to-cosmic/20",
      accent: "text-accent-bright",
      glow: "glow-cosmic",
      border: "border-cosmic/30"
    },
    2: {
      primary: "from-cosmic via-cosmic-bright to-cosmic",
      secondary: "from-cosmic/20 via-transparent to-cosmic/20",
      accent: "text-accent-bright",
      glow: "glow-cosmic",
      border: "border-cosmic/30"
    },
    // Infinity Saga (3) - Cinematic Crimson foundation
    3: {
      primary: "from-crimson via-crimson-bright to-crimson",
      secondary: "from-crimson/20 via-transparent to-crimson/20",
      accent: "text-crimson-bright",
      glow: "glow-crimson",
      border: "border-crimson/30"
    },
    // Multiverse Saga (4-6) - Journey foundation
    4: {
      primary: "from-warm via-warm-bright to-warm",
      secondary: "from-warm/20 via-transparent to-warm/20",
      accent: "text-warm-bright",
      glow: "glow-warm",
      border: "border-warm/30"
    },
    5: {
      primary: "from-warm via-warm-bright to-warm",
      secondary: "from-warm/20 via-transparent to-warm/20",
      accent: "text-warm-bright",
      glow: "glow-warm",
      border: "border-warm/30"
    },
    6: {
      primary: "from-cool via-cool-bright to-cool",
      secondary: "from-cool/20 via-transparent to-cool/20",
      accent: "text-cool-bright",
      glow: "glow-cool",
      border: "border-cool/30"
    }
  };
}

const phaseColors = getPhaseColors();

export default function JourneyTimeline() {
  const { watchedMap } = useWatched();

  // Sort movies by story order (chronologicalYear)
  const sortedByStory = useMemo(() => {
    return [...movies].sort((a, b) => a.chronologicalYear - b.chronologicalYear);
  }, []);

  const watchedCount = useMemo(() => {
    return sortedByStory.filter((item) => watchedMap[item.id]).length;
  }, [sortedByStory, watchedMap]);

  // Group movies by phase for phase labels and year ranges
  const moviesByPhase = useMemo(() => {
    const phases = {};
    sortedByStory.forEach(movie => {
      const phase = movie.phase;
      if (!phases[phase]) {
        phases[phase] = [];
      }
      phases[phase].push(movie);
    });
    return phases;
  }, [sortedByStory]);

  return (
    <section className="relative pt-24 pb-32">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/public/bg/stars.png')] bg-repeat opacity-[0.02]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0)_0%,rgba(8,8,10,0.8)_100%)]"></div>

        {/* Floating particles for cinematic feel */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.03)_0%,transparent_50%)] bg-[size:200%_200%] animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(220,38,38,0.03)_0%,transparent_50%)] bg-[size:200%_200%] animate-[float_8s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-display text-5xl sm:text-6xl tracking-wider text-center mb-16 bg-gradient-to-r from-cosmic via-crimson to-warm-cream bg-clip-text text-transparent">
            YOUR JOURNEY THROUGH THE MCU TIMELINE
          </h2>

          {/* Timeline Container with enhanced cinematic design */}
          <div className="relative">
            {/* Enhanced Timeline Spine with glowing effect */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2">
              {/* Main timeline line with gradient */}
              <div className="h-full w-1.5 bg-gradient-to-b from-cosmic via-crimson to-warm-cream/40" />
              {/* Outer glow */}
              <div className="h-full w-3 bg-gradient-to-b from-cosmic/10 via-crimson/10 to-warm-cream/10 blur-[8px] -z-10" />
              {/* Inner pulse */}
              <div className="h-full w-0.5 bg-gradient-to-b from-cosmic-bright via-crimson-bright to-warm-bright/60" />
            </div>

            {/* Phase Markers with larger, more prominent design */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2 pointer-events-none">
              {[1, 2, 3, 4, 5, 6].map((phase) => {
                const phaseMovies = moviesByPhase[phase];
                if (!phaseMovies || phaseMovies.length === 0) return null;

                const firstMovie = phaseMovies[0];
                const phaseYear = firstMovie.chronologicalYear;
                const phaseConfig = phaseColors[phase] || phaseColors[1];

                return (
                  <div
                    key={phase}
                    className="absolute -top-3 sm:-top-5 left-1/2 -translate-x-1/2 flex flex-col items-start gap-1"
                  >
                    {/* Phase Ring */}
                    <div className={`w-6 h-6 rounded-full border-2 ${phaseConfig.border} ${watchedCount >= firstMovie.id ? phaseConfig.accent : 'border-white/10'}`}>
                      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_var(--color-bg)_0%,_var(--color-bg)_70%)]"></div>
                    </div>

                    {/* Phase Label with cinematic styling */}
                    <div className="flex flex-col items-start text-xs font-bold uppercase tracking-widest">
                      <span className={`${phaseConfig.accent}/90 tracking-widest`}>
                        PHASE {phase}
                      </span>
                      <span className="block text-xs text-muted/60 mt-[-1px]">
                        {phaseYear}
                      </span>
                      {/* Phase divider line */}
                      <div className={`w-16 h-0.5 bg-gradient-to-r from-transparent via-${phaseConfig.accent.replace('text-', '')}/40 to-transparent mt-1`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Movie Items with enhanced cinematic motion and alternating layout */}
            <div className="relative">
              {sortedByStory.map((movie, index) => {
                const watched = !!watchedMap[movie.id];
                const phaseConfig = phaseColors[movie.phase] || phaseColors[1];
                const isFirstInPhase = index === 0 ||
                  sortedByStory[index-1].phase !== movie.phase;
                const isLastInPhase = index === sortedByStory.length - 1 ||
                  sortedByStory[index+1]?.phase !== movie.phase;

                return (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, y: 20 }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }}
                    className={`relative flex flex-col sm:flex-row items-start gap-8 sm:gap-12 pl-10 sm:pl-0 ${
                      index % 2 === 1 ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Enhanced Timeline Node with cinematic design */}
                    <motion.div
                      whileInView={{
                        scale: [0.7, 1.1, 0.9, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }}
                      className={`absolute left-4 sm:left-1/2 top-4 -translate-x-1/2 w-8 h-8 rounded-full border-2 z-10
                                ${watched
                                  ? `bg-gradient-to-b from-${movie.phase === 3 ? 'crimson-bright' : movie.phase >= 4 ? 'warm-bright' : 'cosmic-bright'}
                                     via-${movie.phase === 3 ? 'crimson-bright' : movie.phase >= 4 ? 'warm-bright' : 'cosmic-bright'}/50
                                     to-${movie.phase === 3 ? 'crimson-bright' : movie.phase >= 4 ? 'warm-bright' : 'cosmic-bright'}/20`
                                  : "bg-muted/30 border-muted/50"}
                                ${watched ? phaseConfig.glow : ""}
                              `}
                    >
                      {/* Phase indicator ring for first item in phase */}
                      {isFirstInPhase && (
                        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2
                                ${phaseConfig.border} opacity-70">
                          <div className="absolute inset-0 rounded-full
                                  bg-[radial-gradient(circle_at_center,_var(--color-bg)_0%,_var(--color-bg)_70%)]"></div>
                        </div>
                      )}

                      {/* Watched indicator pulse */}
                      {watched && (
                        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full
                                ${phaseConfig.glow} opacity-0">
                        </div>
                      )}
                    </motion.div>

                    {/* Enhanced Movie Content with cinematic card design */}
                    <div className="sm:w-1/2 w-full relative">
                      <div className="relative">
                        {/* Cinematic Movie Card */}
                        <div className={`glass-panel rounded-3xl border border-white/10 backdrop-blur-xl p-6
                                hover:border-white/20 hover:shadow-cosmic/30 transition-all duration-500
                                ${isFirstInPhase ? `border-l-4 ${phaseConfig.border}` : ""}`}>

                          {/* Header with Year and Type - Enhanced Design */}
                          <div className="flex items-center gap-4 mb-4">
                            {/* Year Badge */}
                            <div className="relative w-10 h-10 flex-shrink-0 rounded-xl
                                    bg-gradient-to-b from-cosmic via-crimson to-warm-cream/20
                                    backdrop-blur-sm border border-white/10
                                    flex items-center justify-center text-xs font-bold tracking-wider
                                    shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                              <span className="relative z-10">{movie.chronologicalYear}</span>
                              {/* Year glow effect */}
                              <div className="absolute inset-0 rounded-xl
                                      bg-gradient-to-b from-cosmic via-crimson to-warm-cream/30
                                      blur-[4px] -z-10"></div>
                            </div>

                            {/* Title and Type */}
                            <div>
                              <h3 className="font-display text-lg tracking-wide text-white
                                      hover:text-crimson-bright/80 transition-colors duration-300
                                      leading-tight">
                                {movie.title}
                              </h3>
                              <p className="text-xs text-muted/60 uppercase tracking-wider flex items-center gap-2">
                                {/* Type indicator with colored dot */}
                                <span className={`w-2 h-2 rounded-full
                                        bg-${movie.type === "series" ? 'steel-bright' : movie.type === "special" ? 'warm-yellow' : 'accent-bright'}/20`}>
                                </span>
                                <span className="ml-1">
                                  {movie.type === "series" ? "SERIES" : movie.type === "special" ? "SPECIAL" : "FILM"}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Poster Container with enhanced cinematic feel */}
                          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden mb-4
                                      hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-b from-cosmic/10 via-transparent to-cosmic/10
                                          pointer-events-none"></div>
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="absolute inset-0 w-full h-full object-cover
                                      transition-all duration-1000
                                      hover:scale-[1.04] hover:rotate-[1deg]"
                              onMouseOver={(e) => {
                                e.target.style.transform = 'scale(1.04) rotate(1deg)';
                                e.target.style.transition = 'all 1s ease';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.transform = 'scale(1) rotate(0deg)';
                                e.target.style.transition = 'all 1s ease';
                              }}
                            />
                            {/* Film grain overlay for cinematic feel */}
                            <div className="absolute inset-0 bg-[url('/public/bg/film-grain.png')] bg-repeat opacity-[0.03] pointer-events-none" />
                            {/* Light leak effect */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,100,100,0.1)_0%,transparent_30%)]
                                      bg-[size:200%_200%] animate-[float_4s_ease-in-out_infinite] pointer-events-none" />
                            {/* Watched indicator with enhanced design */}
                            {watched && (
                              <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full
                                      border-2 border-white
                                      bg-gradient-to-b from-${movie.phase === 3 ? 'var(--color-crimson-bright)' : movie.phase >= 4 ? 'var(--color-warm-yellow)' : 'var(--color-accent-bright')}
                                      via-${movie.phase === 3 ? 'var(--color-crimson-bright)' : movie.phase >= 4 ? 'var(--color-warm-yellow)' : 'var(--color-accent-bright')}/50
                                      to-${movie.phase === 3 ? 'var(--color-crimson-bright)' : movie.phase >= 4 ? 'var(--color-warm-yellow)' : 'var(--color-accent-bright')}/20
                                      shadow-[0_0_8px_rgba(220,38,38,0.3)]">
                                <div className="absolute inset-0 rounded-full bg-white/20" />
                              </div>
                            )}
                            {/* Play button for unwatched */}
                            {!watched && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0
                                      hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-white/20" />
                                  <span className="text-xs text-white font-bold">PLAY</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Description with cinematic typography */}
                          <p className="text-muted mb-4 line-clamp-4
                                      hover:text-crimson-bright/60 transition-colors duration-300">
                            {movie.desc}
                          </p>

                          {/* Cast with enhanced styling */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-xs text-muted/60 font-mono">Featuring:</span>
                            <span className="text-xs text-muted/40 font-mono">{movie.cast}</span>
                          </div>

                          {/* Action Button with enhanced cinematic design */}
                          <div className="mt-4">
                            <a
                              href={`/movie/${movie.id}`}
                              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl
                                      border border-white/10 backdrop-blur-md
                                      hover:border-white/20 hover:bg-white/5 hover:text-white transition-all duration-500
                                      shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                              >
                                <span className="relative z-10">
                                  {watched ? "Rewatch" : "Watch"}
                                </span>
                                {/* Button glow effect */}
                                <div className="absolute inset-0 rounded-xl
                                        bg-gradient-to-r from-cosmic via-crimson to-warm/30
                                        blur-[4px] -z-10 opacity-0
                                        hover:opacity-60 transition-opacity duration-300"></div>
                              </a>
                          </div>
                        </div>

                        {/* Background enhancement for alternating rows */}
                        <div className={`absolute inset-0 -z-10
                                ${index % 2 === 1 ? 'bg-gradient-to-r from-cosmic/5 via-transparent to-cosmic/5' : 'bg-gradient-to-l from-cosmic/5 via-transparent to-cosmic/5'}`}
                                style={{ pointerEvents: 'none' }}></div>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden sm:block sm:w-1/2" />
                  </motion.div>
                );
              })}
            </div>

            {/* Enhanced End Cap with cinematic design */}
            <div className="absolute left-4 sm:left-1/2 bottom-0 -translate-x-1/2 flex items-start gap-3">
              <div className="relative w-3 h-3 rounded-full bg-white/20">
                <div className="absolute inset-0 rounded-full bg-white/5" />
              </div>
              <div className="flex flex-col items-start text-xs">
                <span className="text-muted/60">The journey continues...</span>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent mt-1" />
              </div>
            </div>
          </div>

          {/* Progress Summary with enhanced cinematic design */}
          <div className="mt-20">
            <div className="glass-panel rounded-3xl border border-white/10 backdrop-blur-xl p-8
                    shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <div className="space-y-6">
                <h3 className="font-display text-xl tracking-wide text-center mb-4
                        bg-gradient-to-r from-cosmic via-crimson to-warm-cream bg-clip-text text-transparent">
                  Journey Progress
                </h3>

                {/* Progress counter */}
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-b from-cosmic via-crimson to-warm-cream/20
                            flex items-center justify-center text-xs font-bold">
                      {watchedCount}
                    </div>
                    <span className="text-xs text-muted/60">of</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-b from-cosmic via-crimson to-warm-cream/20
                            flex items-center justify-center text-xs font-bold">
                      {sortedByStory.length}
                    </div>
                  </div>
                  <div className="w-0.5 h-8 bg-gradient-to-b from-cosmic via-crimson to-warm-cream/30" />
                </div>

                {/* Enhanced progress bar */}
                <div className="relative h-3 rounded-full bg-white/[0.03] overflow-hidden border border-white/10">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]
                            animate-[shimmer_3s_linear_infinite]" />
                  <div
                    className="absolute left-0 top-0 bottom-0 h-full bg-gradient-to-r from-cosmic via-crimson to-warm rounded-full
                            shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-shadow duration-300
                            -z-10"
                    style={{ width: `${Math.round((watchedCount / sortedByStory.length) * 100)}%` }}
                  />
                  {/* Progress bar glow */}
                  <div className="absolute inset-0 -z-10
                          bg-gradient-to-r from-cosmic/20 via-crimson/20 to-warm/20
                          blur-[8px] opacity-0
                          hover:opacity-60 transition-opacity duration-300"></div>
                </div>

                {/* Progress text with enhanced styling */}
                <div className="flex items-center justify-center gap-4 mt-3">
                  <span className="text-xs text-muted/60">Completion Rate:</span>
                  <span className="font-display text-xs
                          bg-gradient-to-r from-cosmic via-crimson to-warm-cream bg-clip-text text-transparent">
                    {Math.round((watchedCount / sortedByStory.length) * 100)}%
                  </span>
                  <span className="text-xs text-muted/60">Complete</span>
                </div>

                {/* Phase progress indicator */}
                {watchedCount > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-6">
                      {[1, 2, 3, 4, 5, 6].map((phase) => {
                        const phaseMovies = moviesByPhase[phase] || [];
                        const watchedInPhase = phaseMovies.filter(m => watchedMap[m.id]).length;
                        const phaseProgress = phaseMovies.length > 0 ? Math.round((watchedInPhase / phaseMovies.length) * 100) : 0;
                        const phaseConfig = phaseColors[phase] || phaseColors[1];

                        return (
                          <div key={phase} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full
                                    bg-gradient-to-b from-${phaseConfig.accent.replace('text-', '')}/20 via-transparent to-${phaseConfig.accent.replace('text-', '')}/20">
                            </div>
                            <span className="text-xs text-muted/40">{phase}:</span>
                            <div className="w-16 h-0.5 rounded-full bg-white/[0.05]">
                              <div className={`h-full bg-gradient-to-r from-${phaseConfig.accent.replace('text-', '')} via-${phaseConfig.accent.replace('text-', '')}/50 to-${phaseConfig.accent.replace('text-', '')}
                                      rounded-full`}
                                      style={{ width: `${phaseProgress}%` }}></div>
                            </div>
                            <span className="text-xs text-muted/60">{phaseProgress}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating cinematic elements */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/6 left-1/12 w-[300px] h-[200px] rounded-full bg-gradient-cosmic/5 blur-[80px]" />
          <div className="absolute bottom-1/6 right-1/12 w-[250px] h-[150px] rounded-full bg-gradient-crimson/5 blur-[60px]" />
          <div className="absolute top-1/3 left-2/3 w-[150px] h-[150px] rounded-full bg-gradient-warm/3 blur-[50px]" />
        </div>
      </div>
    </section>
  );
}