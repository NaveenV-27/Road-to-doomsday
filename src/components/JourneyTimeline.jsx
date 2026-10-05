import { useMemo } from "react";
import { useWatched } from "../hooks/useUserState.js";
import { motion } from "framer-motion";
import movies from "../data/movies.json";

// Define phase color mappings based on specification
const phaseColors = {
  // Setup Phases (1-2) - Cosmic Purple
  1: {
    gradient: "bg-gradient-cosmic",
    color: "from-cosmic via-cosmic-bright to-cosmic",
    accent: "text-accent-bright",
    glow: "glow-cosmic"
  },
  2: {
    gradient: "bg-gradient-cosmic",
    color: "from-cosmic via-cosmic-bright to-cosmic",
    accent: "text-accent-bright",
    glow: "glow-cosmic"
  },
  // Infinity Saga (3) - Cinematic Crimson
  3: {
    gradient: "bg-gradient-crimson",
    color: "from-crimson via-crimson-bright to-crimson",
    accent: "text-crimson-bright",
    glow: "glow-crimson"
  },
  // Multiverse Saga (4-6) - Warm then Cool Journey Tones
  4: {
    gradient: "bg-gradient-warm",
    color: "from-warm via-warm-bright to-warm",
    accent: "text-warm-bright",
    glow: "glow-warm"
  },
  5: {
    gradient: "bg-gradient-warm",
    color: "from-warm via-warm-bright to-warm",
    accent: "text-warm-bright",
    glow: "glow-warm"
  },
  6: {
    gradient: "bg-gradient-cool",
    color: "from-cool via-cool-bright to-cool",
    accent: "text-cool-bright",
    glow: "glow-cool"
  }
};

export default function JourneyTimeline() {
  const { watchedMap } = useWatched();

  // Sort movies by story order (chronologicalYear)
  const sortedByStory = useMemo(() => {
    return [...movies].sort((a, b) => a.chronologicalYear - b.chronologicalYear);
  }, []);

  const watchedCount = useMemo(() => {
    return sortedByStory.filter((item) => watchedMap[item.id]).length;
  }, [sortedByStory, watchedMap]);

  // Group movies by phase for phase labels
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
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="font-display text-4xl sm:text-5xl tracking-wide text-center mb-12">
          YOUR JOURNEY THROUGH TIME
        </h2>

        {/* Timeline Container */}
        <div className="relative">
          {/* Timeline Spine */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2">
            {/* Gradient timeline line */}
            <div className="h-full w-full bg-gradient-to-b from-cosmic via-crimson to-warm-cream/20" />
          </div>

          {/* Phase Markers */}
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
                  className="absolute -top-2 sm:-top-4 left-1/2 -translate-x-1/2 flex items-center gap-2"
                >
                  {/* Phase Dot */}
                  <div className="w-2 h-2 rounded-full" />
                  {/* Phase Label */}
                  <div className="flex flex-col items-start text-xs font-bold uppercase tracking-widest">
                    <span className={`${phaseConfig.accent}/80`}>
                      PHASE {phase}
                    </span>
                    <span className="text-muted/60 ml-2">
                      {phaseYear}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Movie Items */}
          <div className="flex flex-col gap-16">
            {sortedByStory.map((movie, index) => {
              const watched = !!watchedMap[movie.id];
              const phaseConfig = phaseColors[movie.phase] || phaseColors[1];
              const isFirstInPhase = index === 0 ||
                sortedByStory[index-1].phase !== movie.phase;
              const isLastInPhase = index === sortedByStory.length - 1 ||
                sortedByStory[index+1]?.phase !== movie.phase;

              return (
                <div
                  key={movie.id}
                  className={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-12 pl-10 sm:pl-0 ${
                    index % 2 === 1 ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Node */}
                  <motion.div
                    whileInView={{ scale: [0.8, 1, 0.9, 1] }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`absolute left-4 sm:left-1/2 top-3 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white/10 z-10 ${
                      watched
                        ? `bg-${movie.phase === 3 ? 'crimson-bright' : movie.phase >= 4 ? 'warm-bright' : 'cosmic-bright'}`
                        : "bg-muted/50"
                    }`}
                  >
                    {/* Phase indicator for first item in phase */}
                    {isFirstInPhase && (
                      <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full opacity-0">
                        <div className="absolute inset-0 rounded-full
                            bg-gradient-to-b from-cosmic via-crimson to-warm-cream/20
                            blur-[4px] -z-10"></div>
                        <div className="absolute inset-0 rounded-full
                            border-2 border-white/10
                            bg-[radial-gradient(circle_at_center,_var(--color-bg)_0%,_var(--color-bg)_70%)]"></div>
                      </div>
                    )}
                  </motion.div>

                  {/* Movie Content */}
                  <div className="sm:w-1/2 w-full">
                    <div className="glass-panel rounded-3xl border border-white/10 backdrop-blur-xl p-6">
                      {/* Header with Year and Type */}
                      <div className="flex items-center gap-4 mb-3">
                        <span className="w-8 h-8 flex-shrink-0 rounded-full
                            bg-gradient-to-b from-cosmic via-crimson to-warm-cream/20
                            flex items-center justify-center text-xs font-bold">
                          {movie.chronologicalYear}
                        </span>
                        <div>
                          <h3 className="font-display text-lg tracking-wide text-white">
                            {movie.title}
                          </h3>
                          <p className="text-xs text-muted/60 uppercase tracking-wider">
                            {movie.type === "series" ? "SERIES" : movie.type === "special" ? "SPECIAL" : "FILM"}
                          </p>
                        </div>
                      </div>

                      {/* Poster */}
                      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden mb-4">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        />
                        {/* Watched indicator */}
                        {watched && (
                          <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full
                              border-2 border-white
                              bg-[${movie.phase === 3 ? 'var(--color-crimson-bright)' : movie.phase >= 4 ? 'var(--color-warm-yellow)' : 'var(--color-accent-bright')}]
                            ">
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-muted mb-4 line-clamp-3">
                        {movie.desc}
                      </p>

                      {/* Cast */}
                      <p className="text-xs text-muted/60 font-mono">
                        Featuring: {movie.cast}
                      </p>

                      {/* Action Button */}
                      <div className="mt-4">
                        <a
                          href={`/movie/${movie.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
                        >
                          {watched ? "Rewatch" : "Watch"}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              );
            })}
          </div>

          {/* End Cap */}
          <div className="absolute left-4 sm:left-1/2 bottom-0 -translate-x-1/2 flex items-start gap-2">
            <div className="w-2 h-2 bg-white/20 rounded-full" />
            <span className="text-xs text-muted/60">
              The journey continues...
            </span>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-12">
          <div className="glass-panel rounded-3xl border border-white/10 backdrop-blur-xl p-8 text-center">
            <h3 className="font-display text-xl tracking-wide mb-6">
              Journey Progress
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-dark">
                <span className="font-display text-white">{watchedCount}</span> of{" "}
                <span className="font-display text-white">{sortedByStory.length}</span> experienced
              </p>
              <div className="h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cosmic via-crimson to-warm rounded-full shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                  style={{ width: `${Math.round((watchedCount / sortedByStory.length) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted/60 mt-1">
                {Math.round((watchedCount / sortedByStory.length) * 100)}% Complete
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}