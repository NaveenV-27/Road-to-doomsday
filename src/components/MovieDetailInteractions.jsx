import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWatched, useWatchlist, useRatings, useNotes, usePreferences } from "../hooks/useUserState.js";
import { getMovieData } from "../lib/movieUtils.js";

export default function MovieDetailInteractions({ movie, relatedFacts, moviePostCredits }) {
  const movieData = getMovieData(movie);
  const { watchedMap, toggleWatched } = useWatched();
  const { watchlist, toggleWatchlist } = useWatchlist();
  const { ratings, setRating } = useRatings();
  const { notes, setNote } = useNotes();
  const { preferences, updatePreferences } = usePreferences();

  const watched = !!watchedMap[movieData.id];
  const inWatchlist = watchlist.includes(movieData.id);
  const userRating = ratings[movieData.id] || 0;
  const userNote = notes[movieData.id] || "";

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/public/bg/faint-film-grain.png')] bg-repeat opacity-[0.01]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.02)_0%,transparent_70%)] bg-[size:800%_800%] animate-[floatGradient_12s_ease-in-out_infinite]" />
      </div>

      {/* Actions Bar with Enhanced Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-10"
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Watched Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleWatched(movieData.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px]
                      transition-all duration-500
                      ${watched
                        ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        : "bg-transparent text-muted border-white/15 hover:border-accent/50 hover:text-white hover:bg-white/5"
                      }`}
          >
            {watched ? (
              <>
                <motion.span whileInView={{ scale: [0.8, 1, 0.9, 1] }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  ✓
                </motion.span>
                <span>Watched</span>
              </>
            ) : (
              <>
                <motion.span whileInView={{ scale: [0.8, 1, 0.9, 1] }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  +
                </motion.span>
                <span>Mark watched</span>
              </>
            )}
          </motion.button>

          {/* Watchlist Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleWatchlist(movieData.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px]
                      transition-all duration-500
                      ${inWatchlist
                        ? "bg-accent text-white hover:bg-accent-bright shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                        : "bg-transparent text-muted border-white/10 hover:border-white/20 hover:text-white hover:bg-white/5"
                      }`}
          >
            {inWatchlist ? (
              <>
                <motion.span whileInView={{ scale: [0.8, 1, 0.9, 1] }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  ✓
                </motion.span>
                <span>In Watchlist</span>
              </>
            ) : (
              <>
                <motion.span whileInView={{ scale: [0.8, 1, 0.9, 1] }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  +
                </motion.span>
                <span>+ Watchlist</span>
              </>
            )}
          </motion.button>

          {/* Rating Section */}
          <motion.div
            whileInView={{ scale: [0.8, 1, 0.9, 1] }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs text-muted">Your Rating:</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(movieData.id, star)}
                  className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-[12px]
                            transition-all duration-300
                            ${star <= userRating
                              ? "text-accent-bright glow-cosmic"
                              : "text-muted/50 hover:text-accent-bright hover:bg-white/5"
                            }`}
                >
                  ★
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Note Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const newNote = prompt("Add your notes:", userNote) || "";
              if (newNote !== null) setNote(movieData.id, newNote);
            }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px]
                      transition-all duration-500
                      bg-transparent text-muted border-white/10 hover:border-white/20 hover:text-white hover:bg-white/5`}
          >
            {userNote ? (
              <>
                <motion.span whileInView={{ scale: [0.8, 1, 0.9, 1] }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  📝
                </motion.span>
                <span>Edit Note</span>
              </>
            ) : (
              <>
                <motion.span whileInView={{ scale: [0.8, 1, 0.9, 1] }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  +
                </motion.span>
                <span>Add Note</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs with Enhanced Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12"
      >
        <div className="flex flex-wrap border-b border-white/[0.08]">
          {[{
            tab: "synopsis",
            label: "Synopsis",
            icon: "📖"
          }, {
            tab: "journey",
            label: "Journey",
            icon: "🛤️"
          }, {
            tab: "connections",
            label: "Connections",
            icon: "🔗"
          }, ...(relatedFacts.length > 0 ? [{
            tab: "facts",
            label: "Facts",
            icon: "💡"
          }] : []),
          ...(moviePostCredits.length > 0 ? [{
            tab: "postcredits",
            label: "Post-Credits",
            icon: "🎬"
          }] : [])
          ].map((tabItem) => (
            <motion.button
              key={tabItem.tab}
              whileTap={{ scale: 0.95 }}
              onClick={() => updatePreferences({ activeTab: tabItem.tab })}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider
                        transition-all duration-500
                        ${preferences.activeTab === tabItem.tab
                          ? "text-white border-b-2 border-accent-bright glow-cosmic"
                          : "text-muted hover:text-white hover:border-white/20"
                        }`}
            >
              <span className="text-xl">{tabItem.icon}</span>
              <span>{tabItem.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content with Enhanced Motion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-10"
      >
        {/* Synopsis Tab */}
        {preferences.activeTab === "synopsis" && (
          <motion.div
            key="synopsis"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div>
              <h2 className="font-display text-xl tracking-wide mb-6
                      relative inline-block
                      bg-gradient-to-r from-cosmic via-crimson to-warm-cream bg-clip-text text-transparent">
                Synopsis
              </h2>
              <p className="text-muted leading-snug text-base mb-6">
                {data.desc}
              </p>

              {moviePostCredits.length > 0 && (
                <SpoilerGuard
                  title="Post-Credit Scenes"
                  description="These scenes contain spoilers for future movies."
                >
                  <div className="space-y-6">
                    {moviePostCredits.map((scene, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-4"
                      >
                        <h3 className="font-display text-lg text-accent-broken/80 mb-3
                                relative inline-block
                                bg-gradient-to-r from-cosmic via-crimson to-warm-cream/30 bg-clip-text text-transparent">
                          {scene.title}
                        </h3>
                        <p className="text-muted">{scene.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </SpoilerGuard>
              )}
            </div>
          </>
        )}

        {/* Journey Tab */}
        {preferences.activeTab === "journey" && (
          <motion.div
            key="journey"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div>
              <h2 className="font-display text-xl tracking-wide mb-6
                      relative inline-block
                      bg-gradient-to-r from-cosmic via-crimson to-warm-cream bg-clip-text text-transparent">
                Journey Significance
              </h2>
              <div className="bg-surface/80 backdrop-blur-xl rounded-xl border border-white/[0.08] p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center
                                  bg-gradient-to-b from-cosmic via-crimson to-warm-cream/20
                                  text-accent-bright font-display
                                  shadow-[0_0_10px_rgba(99,102,241,0.2)]`}>
                    {movieData.journey.importance.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display text-lg tracking-wide mb-2">
                      Importance: {movieData.journey.importance}
                    </h3>
                    <p className="text-muted">
                      Spoiler Level: {movieData.journey.spoilerLevel}/4
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Connections Tab */}
        {preferences.activeTab === "connections" && (
          <motion.div
            key="connections"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div>
              <h2 className="font-display text-xl tracking-wide mb-6
                      relative inline-block
                      bg-gradient-to-r from-cosmic via-crimson to-warm-cream bg-clip-text text-transparent">
                Connections
              </h2>
              {movieData.connections.characters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <div>
                    <h3 className="font-display text-lg tracking-wide mb-3">
                      Featured Characters
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {movieData.connections.characters.map((charId) => (
                        <motion.div
                          key={charId}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
                                  bg-surface/80 backdrop-blur-xl border border-white/[0.08]
                                  hover:bg-white/5 hover:text-white transition-all duration-300"
                        >
                          {charId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              {movieData.connections.relatedTitles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <div>
                    <h3 className="font-display text-lg tracking-wide mb-3">
                      Related Titles
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {movieData.connections.relatedTitles.map((relatedId) => {
                        const relatedMovie = movies.find(m => m.id === relatedId);
                        return (
                          <motion.a
                            key={relatedId}
                            href={`/movie/${relatedId}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="group block rounded-xl overflow-hidden border border-white/[0.08]
                                    transition-all duration-500
                                    hover:border-white/20 hover:shadow-lg hover:scale-[1.02]"
                          >
                            {relatedMovie && (
                              <>
                                <div className="p-4">
                                  <h3 className="font-display text-lg tracking-wide mb-3">{relatedMovie.title}</h3>
                                  <p className="text-muted text-sm">{relatedMovie.year}</p>
                                </div>
                                <div className="absolute inset-0 -z-10
                                        bg-gradient-to-b from-cosmic via-crimson to-warm-cream/10
                                        blur-[4px] opacity-0
                                        hover:opacity-40 transition-opacity duration-300"></div>
                              </>
                            )}
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}

        {/* Facts Tab */}
        {preferences.activeTab === "facts" && relatedFacts.length > 0 && (
          <motion.div
            key="facts"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div>
              <h2 className="font-display text-xl tracking-wide mb-6
                      relative inline-block
                      bg-gradient-to-r from-cosmic via-crimson to-warm-cream bg-clip-text text-transparent">
                Fun Facts
              </h2>
              <div className="space-y-6">
                {relatedFacts.map((fact) => (
                  <motion.div
                    key={fact.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-surface/80 backdrop-blur-xl rounded-xl border border-white/[0.08] p-6"
                  >
                    <h3 className="font-display text-lg tracking-wide mb-3">{fact.title}</h3>
                    <SpoilerGuard
                      title="Spoiler Warning"
                      description="This fact may contain spoilers."
                      showWhen={fact.spoilerLevel > 0 && !preferences.spoilers}
                    >
                      <p className="text-muted">{fact.body}</p>
                    </SpoilerGuard>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Post-Credits Tab */}
        {preferences.activeTab === "postcredits" && moviePostCredits.length > 0 && (
          <motion.div
            key="postcredits"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div>
              <h2 className="font-display text-xl tracking-wide mb-6
                      relative inline-block
                      bg-gradient-to-r from-cosmic via-crimson to-warm-cream bg-clip-text text-transparent">
                Post-Credit Scenes
              </h2>
              <div className="space-y-6">
                {moviePostCredits.map((scene, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <SpoilerGuard
                      title="Spoiler Warning"
                      description="This scene contains spoilers for future movies."
                      showWhen={scene.spoiler && !preferences.spoilers}
                    >
                      <h3 className="font-display text-lg text-accent-broken/80 mb-3">{scene.title}</h3>
                      <p className="text-muted">{scene.description}</p>
                    </SpoilerGuard>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Watch Options with Enhanced Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-14 pt-10 border-t border-white/[0.08]"
      >
        <h2 className="font-display text-xl tracking-wide mb-6
                relative inline-block
                bg-gradient-to-r from-cosmic via-crimson to-warm-cream bg-clip-text text-transparent">
          How to Watch
        </h2>
        <div className="space-y-5">
          {movieData.watch.official.length > 0 ? (
            <>
              {movieData.watch.official.map((option, index) => (
                <motion.a
                  key={index}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-4 px-6 py-4 rounded-xl
                          border border-accent/30 bg-accent/20
                          hover:bg-accent/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.2)]
                          transition-all duration-500"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold">
                      ▶
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide">Watch on</span>
                  </span>
                  <span className="font-display text-lg">{option.platform}</span>
                </motion.a>
              ))}
            </>
          ) : (
            <p className="text-muted">
              No official streaming links available. Check your local providers.
            </p>
          )}
          {movieData.watch.legalLocator && (
            <motion.a
              href={movieData.watch.legalLocator}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-4 px-6 py-4 rounded-xl
                      border border-white/20 bg-white/10
                      hover:bg-white/20 hover:shadow-[0_0_5px_rgba(255,255,255,0.1)]
                      transition-all duration-500"
            >
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                  🔍
                </span>
                <span className="text-xs font-bold uppercase tracking-wide">Where to watch</span>
              </span>
              <span className="font-display text-lg">JustWatch</span>
            </motion.a>
          )}
        </div>
      </motion.div>
    </div>
  );
}