import { usePreferences } from "../hooks/useUserState.js";
import { getMovieData } from "../lib/movieUtils.js";
import movies from "../data/movies.js";
import { motion } from "framer-motion";

export default function FactCard({ fact }) {
  const { preferences } = usePreferences();

  // Check if we should show this fact based on spoiler preferences
  const shouldShow = !fact.spoilerLevel || preferences.spoilers;

  if (!shouldShow) {
    return null; // Don't render at all if spoiler hidden
  }

  // Get related movie data for links
  const relatedMovieData = fact.relatedMovies?.map(id =>
    movies.find(m => m.id === id)
  ).filter(Boolean) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      {/* Enhanced Fact Card with Deep Collectible Feel */}
      <div className="relative bg-[rgba(20,20,24,0.3)] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6
              hover:border-white/[0.12] hover:bg-[rgba(20,20,24,0.4)] transition-all duration-500
              shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">

        {/* Aged Paper Effect */}
        <div className="absolute inset-0 -z-10 pointer-events-none
                bg-[url('/public/bg/fact-aged-paper.png')] bg-repeat opacity-[0.02]" />

        {/* Collectible Badge with Enhanced Design */}
        <div className="absolute top-3 left-3 -z-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <span className="text-xs text-muted/60">ARCHIVE ITEM</span>
        </div>

        {/* Enhanced Header with Collectible Treatment */}
        <div className="mb-4">
          <h3 className="font-display text-lg tracking-wide text-white
                  relative inline-block
                  bg-gradient-to-r from-cosmic via-crimson to-warm-cream/20 bg-clip-text text-transparent
                  pl-2 pr-1
                  border-l-2 border-l-gradient-to-r from-cosmic via-crimson to-warm-cream/50">
            {fact.title}
          </h3>

          {/* Fact Type Indicator with Collectible Stamp */}
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full
                    bg-${fact.type === 'history' ? 'accent-bright' :
                          fact.type === 'production' ? 'warm-yellow' :
                          fact.type === 'comic' ? 'steel-bright' :
                          fact.type === 'easter-egg' ? 'cosmic-bright' :
                          fact.type === 'character' ? 'crimson-bright' : 'accent-bright'}/20">
            </span>
            <span className="text-xs text-muted/40 font-mono uppercase tracking-wider">
              {fact.type.charAt(0).toUpperCase() + fact.type.slice(1).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Fact Body with Enhanced Typography and Collectible Feel */}
        {!fact.spoilerLevel || preferences.spoilers ? (
          <motion.p
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.4 }}
            className="text-muted leading-snug text-base
                    [&::first-letter]:drop-cap-[initial-letter:2]"
          >
            {fact.body}
          </motion.p>
        ) : (
          <>
            <p className="text-muted">
              This fact contains spoilers. Enable spoilers in preferences to view.
            </p>
            <motion.button
              onClick={() => {
                // This would typically update preferences to show spoilers
                // For now, we'll just show it directly for simplicity
              }}
              whileTap={{ scale: 0.95 }}
              className="mt-3 flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider
                      rounded-xl border border-white/[0.15] bg-white/[0.08] backdrop-blur-md
                      hover:border-white/[0.20] hover:bg-white/[0.12] hover:text-white transition-all duration-300"
            >
              <span className="text-xs">Show Spoiler</span>
              <motion.span
                whileInView={{ scale: [0.8, 1, 0.9, 1] }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                ▶
              </motion.span>
            </motion.button>
          </>
        )}

        {/* Related Movies with Enhanced Collectible Presentation */}
        {relatedMovieData.length > 0 && (
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <p className="text-xs text-muted uppercase tracking-wider mb-2">
              APPEARS IN
            </p>
            <div className="flex flex-wrap gap-3">
              {relatedMovieData.map((movie) => (
                <motion.a
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="group block rounded-xl overflow-hidden border border-white/[0.10]
                          transition-all duration-500
                          hover:border-white/[0.20] hover:shadow-[0_0_10px_rgba(99,102,241,0.2)]
                          hover:scale-[1.02]"
                >
                  {/* Movie Poster with Enhanced Collectible Frame */}
                  <div className="relative aspect-[2/3] w-24 h-36 rounded-xl overflow-hidden
                          border border-white/[0.08]
                          hover:border-white/[0.15] transition-all duration-500">
                    {/* Aged Paper Effect for Poster */}
                    <div className="absolute inset-0 -z-10
                            bg-[url('/public/bg/poster-aged.png')] bg-contain opacity-[0.015]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10
                            pointer-events-none"></div>
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="absolute inset-0 w-full h-full object-cover
                              transition-all duration-1000
                              hover:scale-[1.02]"
                    />
                    {/* Collectible Corner Ribbon */}
                    <div className="absolute top-2 right-2 -z-10
                            w-6 h-6 rounded-full
                            bg-gradient-to-r from-cosmic via-crimson to-warm-cream/20
                            blur-[2px] opacity-80">
                    </div>
                    {/* Watched Indicator for Related Movies */}
                    {false && (
                      <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full
                              border-2 border-white
                              bg-gradient-to-b from-cosmic-bright via-transparent to-cosmic-bright/50">
                      </div>
                    )}
                  </div>
                  <span className="mt-2 block text-xs text-[rgba(255,255,255,0.7)] font-mono tracking-wider">
                    {movie.title}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Collectible Footer with Enhanced Stamp Effect */}
        <div className="mt-5 pt-4 border-t border-white/[0.04]">
          <div className="flex items-center justify-between">
            {/* Archive Number with Collectible Stamp */}
            <div className="text-xs text-muted/60 font-mono">
              Archive #{(fact.id || 0).toString().padStart(4, '0')}
            </div>
            {/* Enhanced Collectible Stamp */}
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full
                      bg-gradient-to-r from-cosmic via-crimson to-warm-cream/20
                      border-2 border-white/[0.20]">
                <div className="absolute inset-0 rounded-full
                        bg-[radial-gradient(circle_at_center,_var(--color-bg)_0%,_var(--color-bg)_70%)]"></div>
                <span className="absolute inset-[2px] flex items-center justify-center
                        text-[xs] font-bold text-white tracking-wider">
                  ✓
                </span>
              </div>
              {/* Stamp Animation with Multiple Layers */}
              <div className="absolute inset-0 -z-10
                      bg-gradient-to-r from-cosmic/30 via-crimson/30 to-warm-cream/30
                      blur-[4px] opacity-0
                      hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute inset-0 -z-10
                      bg-[url('/public/bg/stamp-texture.png')] bg-contain opacity-[0.1]
                      hover:opacity-[0.15] transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Background Elements for Deep Collectible Feel */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {/* Faint Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('/public/bg/archive-faint-pattern.png')]
                  bg-repeat opacity-[0.015]" />

          {/* Corner Accents with Enhanced Design */}
          <div className="absolute top-3 left-3 -z-10 w-4 h-4
                  bg-gradient-to-r from-cosmic via-crimson to-warm-cream/12
                  blur-[2px] opacity-[0.35]"
                  hover:blur-[1px] hover:opacity-[0.45] transition-all duration-300"></div>
          <div className="absolute bottom-3 right-3 -z-10 w-4 h-4
                  bg-gradient-to-b from-cosmic via-crimson to-warm-cream/12
                  blur-[2px] opacity-[0.35]"
                  hover:blur-[1px] hover:opacity-[0.45] transition-all duration-300"></div>

          {/* Subtle Light Leaks */}
          <div className="absolute inset-0 -z-10
                  bg-[repeating-linear-gradient(45deg,transparent_0%,transparent_1px,rgba(255,255,255,0.02)_1px,transparent_2px)]
                  bg-[size:400%_400%]
                  opacity-[0.008]
                  animate-[lightLeakFact_12s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </motion.div>
  );
}