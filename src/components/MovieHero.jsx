import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// Extract dominant colors from movie poster for cinematic feel
function getMovieColors(posterUrl) {
  // In a real implementation, we would extract colors from the poster
  // For now, we'll return a default cinematic color scheme based on movie type/year
  // This is a placeholder - in production, this would use a color extraction library
  return {
    primary: "from-cosmic via-crimson to-warm-cream",
    secondary: "from-cosmic/10 via-transparent to-cosmic/10",
    accent: "text-accent-bright",
    glow: "glow-cosmic",
    textLight: "text-white",
    textDark: "text-black"
  };
}

export default function MovieHero({ movie, posterIsPlaceholder = false }) {
  const data = getMovieData(movie);
  const movieColors = getMovieColors(data.poster);
  const TYPE_LABEL = { movie: "Movie", series: "Series", special: "Special" };
  const TYPE_COLOR = { movie: "bg-accent/20", series: "bg-steel/20", special: "bg-accent/20" };
  const TYPE_TEXT_COLOR = { movie: "text-accent-bright", series: "text-steel-bright", special: "text-accent-bright" };

  return (
    <div className="relative">
      {/* Enhanced Cinematic Background Layers */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Base poster with enhanced treatment */}
        {posterIsPlaceholder ? (
          <div className="media-placeholder absolute inset-0" />
        ) : (
          <>
            {/* Poster layer */}
            <div className="absolute inset-0">
              <img
                src={data.poster}
                alt={`${data.title} poster`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover
                        transition-all duration-1000
                        hover:scale-[1.02]"
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.transition = 'all 1s ease';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.transition = 'all 1s ease';
                }}
              />
            </div>

            {/* Color grading overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,8,10,0.3)] via-[rgba(15,15,18,0.5)] to-[rgba(8,8,10,0.7)]" />

            {/* Light leak effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.1)_0%,transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.08)_0%,transparent_40%)]
                        bg-[size:400%_400%] animate-[lightLeak_8s_ease-in-out_infinite]" />

            {/* Film grain */}
            <div className="absolute inset-0 bg-[url('/public/bg/film-grain.png')] bg-repeat opacity-[0.02]" />

            {/* Floating particles */}
            <div className="absolute inset-0 bg-[url('/public/bg/floating-particles.png')] bg-repeat opacity-[0.01]
                        animate-[floatParticles_6s_linear_infinite]" />
          </>
        )}

        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="pt-20 pb-16">
          <div className="relative">
            {/* Poster */}
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/60
                    hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-shadow duration-500">
              {posterIsPlaceholder ? (
                <div className="media-placeholder absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
                  <span className="text-xs uppercase tracking-widest">Poster goes here</span>
                  <span className="text-[10px] text-muted/60 font-mono">{data.poster}</span>
                </div>
              ) : (
                <>
                  <img
                    src={data.poster}
                    alt={`${data.title} poster`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover
                            transition-all duration-1000
                            hover:scale-[1.01] hover:rotate-[0.5deg]"
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.01) rotate(0.5deg)';
                      e.target.style.transition = 'all 1s ease';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1) rotate(0deg)';
                      e.target.style.transition = 'all 1s ease';
                    }}
                  />
                  {/* Film grain overlay */}
                  <div className="absolute inset-0 bg-[url('/public/bg/film-grain.png')] bg-repeat opacity-[0.015] pointer-events-none" />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-radial-gradient(from-black/0 to-black/60) pointer-events-none" />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="mt-8 space-y-5">
              {/* Type and Phase Badges */}
              <div className="flex flex-wrap items-center gap-x-3">
                {/* Type Badge */}
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl
                                ${TYPE_COLOR[data.type] ?? "bg-accent/20"}
                                ${TYPE_TEXT_COLOR[data.type] ?? "text-accent-bright"}
                                text-[11px] font-bold uppercase tracking-wider
                                backdrop-blur-sm border border-white/10
                                hover:bg-white/5 hover:text-white transition-all duration-300`}>
                  {TYPE_LABEL[data.type] ?? data.type}
                </span>

                {/* Phase Badge - Enhanced */}
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl
                                bg-surface/80 backdrop-blur-xl border border-white/10
                                text-[11px] font-bold uppercase tracking-wider
                                backdrop-blur-sm
                                hover:bg-white/5 hover:text-white transition-all duration-300`}>
                  PHASE {data.connections.characters.length > 0 ? "?" : data.connections.relatedTitles.length > 0 ? "?" : "?"}
                </span>

                {/* Year Badges */}
                <div className="flex gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl
                                  bg-gradient-to-b from-cosmic via-crimson to-warm-cream/20
                                  text-[10px] font-bold text-white tracking-wider
                                  backdrop-blur-sm border border-white/10`}>
                    Released {data.year}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl
                                  bg-gradient-to-b from-cosmic via-crimson to-warm-cream/20
                                  text-[10px] font-bold text-white tracking-wider
                                  backdrop-blur-sm border border-white/10`}>
                    Story {data.chronologicalYear}
                  </span>
                </div>
              </div>

              {/* Title with Cinematic Treatment */}
              <h1 className="font-display text-4xl sm:text-5xl tracking-[-0.02em] leading-none mb-4
                      relative inline-block
                      bg-gradient-to-r from-cosmic via-crimson to-warm-cream bg-clip-text text-transparent
                      drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                {data.title}
              </h1>

              {/* Cast with Enhanced Styling */}
              {data.cast && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs text-muted/60 font-mono">Featuring:</span>
                  <span className="text-xs text-muted/40 font-mono">{data.cast}</span>
                </div>
              )}

              {/* Description with Cinematic Typography */}
              <p className="text-sm text-muted leading-snug mb-6
                      relative
                      pl-4
                      border-l-2 border-l-gradient-to-b from-cosmic via-crimson to-warm-cream/30">
                {data.desc}
              </p>

              {/* Watch Call-to-Action */}
              <div className="flex items-center gap-4 mb-6">
                <a
                  href="#watch-options"
                  className="flex items-center gap-3 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl
                          border border-white/10 backdrop-blur-md
                          hover:border-white/20 hover:bg-white/5 hover:text-white transition-all duration-500
                          shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  <span className="relative z-10">WATCH NOW</span>
                  <div className="absolute inset-0 rounded-xl
                          bg-gradient-to-r from-cosmic via-crimson to-warm/30
                          blur-[4px] -z-10 opacity-0
                          hover:opacity-60 transition-opacity duration-300"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating cinematic elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/6 left-1/12 w-[300px] h-[200px] rounded-full bg-gradient-cosmic/3 blur-[100px]" />
        <div className="absolute bottom-1/6 right-1/12 w-[250px] h-[150px] rounded-full bg-gradient-crimson/3 blur-[80px]" />
        <div className="absolute top-1/3 left-2/3 w-[150px] h-[150px] rounded-full bg-gradient-warm/2 blur-[60px]" />
      </div>
    </div>
  );
}