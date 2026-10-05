import { useState } from "react";
import { motion } from "framer-motion";
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      {/* Actions Bar */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <button
          onClick={() => toggleWatched(movieData.id)}
          className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full transition-colors ${
            watched
              ? "bg-white text-black border-white"
              : "bg-transparent text-muted border-white/15 hover:border-accent/50 hover:text-white"
          }`}
        >
          {watched ? "✓ Watched" : "Mark watched"}
        </button>

        <button
          onClick={() => toggleWatchlist(movieData.id)}
          className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full transition-colors ${
            inWatchlist
              ? "bg-accent text-white hover:bg-accent-bright"
              : "bg-transparent text-muted border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          {inWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
        </button>

        {/* Rating */}
        <div className="relative flex items-center gap-2">
          <span className="text-xs text-muted">Your Rating:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(movieData.id, star)}
                className={`text-[12px] ${
                  star <= userRating
                    ? "text-accent-bright"
                    : "text-muted/50 hover:text-accent-bright"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <button
          onClick={() => {
            const newNote = prompt("Add your notes:", userNote) || "";
            if (newNote !== null) setNote(movieData.id, newNote);
          }}
          className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-transparent text-muted border-white/10 hover:border-white/20 hover:text-white"
        >
          {userNote ? "📝 Edit Note" : "+ Add Note"}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap border-b border-white/[0.08]">
          <button
            onClick={() => updatePreferences({ activeTab: "synopsis" })}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
              preferences.activeTab === "synopsis"
                ? "text-white border-b-2 border-accent-bright"
                : "text-muted hover:text-white"
            }`}
          >
            Synopsis
          </button>
          <button
            onClick={() => updatePreferences({ activeTab: "journey" })}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
              preferences.activeTab === "journey"
                ? "text-white border-b-2 border-accent-bright"
                : "text-muted hover:text-white"
            }`}
          >
            Journey
          </button>
          <button
            onClick={() => updatePreferences({ activeTab: "connections" })}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
              preferences.activeTab === "connections"
                ? "text-white border-b-2 border-accent-bright"
                : "text-muted hover:text-white"
            }`}
          >
            Connections
          </button>
          {relatedFacts.length > 0 && (
            <button
              onClick={() => updatePreferences({ activeTab: "facts" })}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
                preferences.activeTab === "facts"
                  ? "text-white border-b-2 border-accent-bright"
                  : "text-muted hover:text-white"
              }`}
            >
              Facts
            </button>
          )}
          {moviePostCredits.length > 0 && (
            <button
              onClick={() => updatePreferences({ activeTab: "postcredits" })}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
                preferences.activeTab === "postcredits"
                  ? "text-white border-b-2 border-accent-bright"
                  : "text-muted hover:text-white"
              }`}
            >
              Post-Credits
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* Synopsis Tab */}
        {preferences.activeTab === "synopsis" && (
          <div>
            <h2 className="font-display text-xl tracking-wide mb-4">Synopsis</h2>
            <p className="text-muted leading-snug">{movieData.desc}</p>

            {moviePostCredits.length > 0 && (
              <SpoilerGuard title="Post-Credit Scenes" description="These scenes contain spoilers for future movies.">
                {moviePostCredits.map((scene, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-display text-lg text-accent-broken/80 mb-2">
                      {scene.title}
                    </h3>
                    <p className="text-muted">{scene.description}</p>
                  </div>
                ))}
              </SpoilerGuard>
            )}
          </div>
        )}

        {/* Journey Tab */}
        {preferences.activeTab === "journey" && (
          <div>
            <h2 className="font-display text-xl tracking-wide mb-4">Journey Significance</h2>
            <div className="bg-surface/80 backdrop-blur-xl rounded-xl border border-white/[0.08] p-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-accent/20 text-accent-bright font-display`}>
                  {movieData.journey.importance.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display text-lg tracking-wide">
                    Importance: {movieData.journey.importance}
                  </h3>
                  <p className="text-muted">
                    Spoiler Level: {movieData.journey.spoilerLevel}/4
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connections Tab */}
        {preferences.activeTab === "connections" && (
          <div>
            <h2 className="font-display text-xl tracking-wide mb-4">Connections</h2>
            {movieData.connections.characters.length > 0 && (
              <div className="mb-6">
                <h3 className="font-display text-lg tracking-wide mb-2">Featured Characters</h3>
                <div className="flex flex-wrap gap-2">
                  {movieData.connections.characters.map((charId) => (
                    <span
                      key={charId}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-surface/80 border border-white/[0.08]"
                    >
                      {charId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {movieData.connections.relatedTitles.length > 0 && (
              <div className="mb-6">
                <h3 className="font-display text-lg tracking-wide mb-2">Related Titles</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {movieData.connections.relatedTitles.map((relatedId) => {
                    const relatedMovie = movies.find(m => m.id === relatedId);
                    return (
                      <a
                        key={relatedId}
                        href={`/movie/${relatedId}`}
                        className="group block rounded-xl overflow-hidden border border-white/[0.08] transition-all duration-300 hover:border-white/20 hover:shadow-lg"
                      >
                        {relatedMovie && (
                          <div className="p-4">
                            <h3 className="font-display text-lg tracking-wide mb-2">{relatedMovie.title}</h3>
                            <p className="text-muted text-sm">{relatedMovie.year}</p>
                          </div>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Facts Tab */}
        {preferences.activeTab === "facts" && relatedFacts.length > 0 && (
          <div>
            <h2 className="font-display text-xl tracking-wide mb-4">Fun Facts</h2>
            <div className="space-y-4">
              {relatedFacts.map((fact) => (
                <div key={fact.id} className="bg-surface/80 backdrop-blur-xl rounded-xl border border-white/[0.08] p-6">
                  <h3 className="font-display text-lg tracking-wide mb-2">{fact.title}</h3>
                  <SpoilerGuard
                    title="Spoiler Warning"
                    description="This fact may contain spoilers."
                    showWhen={fact.spoilerLevel > 0 && !preferences.spoilers}
                  >
                    <p className="text-muted">{fact.body}</p>
                  </SpoilerGuard>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post-Credits Tab */}
        {preferences.activeTab === "postcredits" && moviePostCredits.length > 0 && (
          <div>
            <h2 className="font-display text-xl tracking-wide mb-4">Post-Credit Scenes</h2>
            <div className="space-y-4">
              {moviePostCredits.map((scene, index) => (
                <SpoilerGuard
                  key={index}
                  title="Spoiler Warning"
                  description="This scene contains spoilers for future movies."
                  showWhen={scene.spoiler && !preferences.spoilers}
                >
                  <h3 className="font-display text-lg text-accent-broken/80 mb-2">{scene.title}</h3>
                  <p className="text-muted">{scene.description}</p>
                </SpoilerGuard>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Watch Options */}
      <div className="mt-10 pt-8 border-t border-white/[0.08]">
        <h2 className="font-display text-xl tracking-wide mb-6">How to Watch</h2>
        <div className="space-y-4">
          {movieData.watch.official.length > 0 ? (
            <>
              {movieData.watch.official.map((option, index) => (
                <a
                  key={index}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border border-accent/30 bg-accent/20 hover:bg-accent/30 transition-colors"
                >
                  <span className="text-xs font-bold uppercase tracking-wide">▶ Watch on</span>
                  <span className="font-display text-lg">{option.platform}</span>
                </a>
              ))}
            </>
          ) : (
            <p className="text-muted">
              No official streaming links available. Check your local providers.
            </p>
          )}
          {movieData.watch.legalLocator && (
            <a
              href={movieData.watch.legalLocator}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
            >
              <span className="text-xs font-bold uppercase tracking-wide">🔍 Where to watch</span>
              <span className="font-display text-lg">JustWatch</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}