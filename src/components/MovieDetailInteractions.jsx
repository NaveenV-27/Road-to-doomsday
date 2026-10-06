import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRatings, useNotes } from "../hooks/useUserState.js";
import { getMovieData } from "../lib/movieUtils.js";

export default function MovieDetailInteractions({ movie, relatedFacts = [], moviePostCredits = [] }) {
  const data = getMovieData(movie);
  const { ratings, setRating } = useRatings();
  const { notes, setNote } = useNotes();

  const userRating = ratings[data.id] || 0;
  const userNote = notes[data.id] || "";

  const [activeTab, setActiveTab] = useState("synopsis");
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(userNote);
  const [revealedPostCredits, setRevealedPostCredits] = useState({});

  const handleSaveNote = () => {
    setNote(data.id, noteDraft);
    setEditingNote(false);
  };

  const toggleRevealScene = (idx) => {
    setRevealedPostCredits((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/[0.08]">
      {/* ── User Log: Rating & Personal Journal ── */}
      <div className="mb-12 p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#0c0e18]/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        {/* Star Rating */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-dark block mb-2">
            YOUR PERSONAL RATING
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(data.id, star === userRating ? 0 : star)}
                aria-label={`Rate ${star} stars`}
                className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
              >
                <span className={star <= userRating ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "text-white/20 hover:text-white/40"}>
                  ★
                </span>
              </button>
            ))}
            <span className="ml-3 text-xs font-mono text-muted">
              {userRating > 0 ? `${userRating}/5 Stars` : "Not rated yet"}
            </span>
          </div>
        </div>

        {/* Personal Note Preview / Button */}
        <div className="flex-1 md:max-w-md md:text-right">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-dark block mb-2">
            FAN NOTES &amp; MEMORIES
          </span>
          {userNote && !editingNote ? (
            <div className="flex items-center justify-between md:justify-end gap-3">
              <p className="text-xs text-text-secondary italic line-clamp-1 max-w-xs text-left">
                "{userNote}"
              </p>
              <button
                onClick={() => {
                  setNoteDraft(userNote);
                  setEditingNote(true);
                }}
                className="text-xs font-mono text-crimson-bright hover:underline shrink-0"
              >
                Edit
              </button>
            </div>
          ) : !editingNote ? (
            <button
              onClick={() => {
                setNoteDraft(userNote);
                setEditingNote(true);
              }}
              className="text-xs font-mono text-muted hover:text-white border border-white/10 px-3.5 py-1.5 rounded-lg transition-colors"
            >
              + Add personal note / thoughts
            </button>
          ) : null}
        </div>
      </div>

      {/* Note Editor Modal / Inline Area */}
      {editingNote && (
        <div className="mb-12 p-6 rounded-2xl border border-white/15 bg-[#121624] shadow-2xl space-y-4">
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
            Your Personal Review / Notes for {data.title}
          </h4>
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="What were your favorite scenes, cameos, or theories?"
            rows={3}
            className="w-full bg-[#0a0d16] border border-white/15 rounded-xl p-3 text-sm text-white placeholder:text-muted-dark focus:outline-none focus:border-crimson"
          />
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setEditingNote(false)}
              className="text-xs font-mono px-4 py-2 rounded-lg text-muted hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              className="btn-primary text-xs py-2 px-5"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* ── Content Tabs ── */}
      <div className="border-b border-white/[0.08] flex items-center gap-6 overflow-x-auto no-scrollbar mb-10">
        <button
          onClick={() => setActiveTab("synopsis")}
          className={`pb-4 text-xs font-mono uppercase tracking-[0.16em] font-bold border-b-2 transition-colors shrink-0 ${
            activeTab === "synopsis"
              ? "border-crimson text-white"
              : "border-transparent text-muted hover:text-white"
          }`}
        >
          Overview &amp; Story
        </button>

        {moviePostCredits.length > 0 && (
          <button
            onClick={() => setActiveTab("postcredits")}
            className={`pb-4 text-xs font-mono uppercase tracking-[0.16em] font-bold border-b-2 transition-colors shrink-0 flex items-center gap-2 ${
              activeTab === "postcredits"
                ? "border-crimson text-white"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            <span>Post-Credit Scenes</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-crimson/30 text-crimson-bright">
              {moviePostCredits.length}
            </span>
          </button>
        )}

        {relatedFacts.length > 0 && (
          <button
            onClick={() => setActiveTab("facts")}
            className={`pb-4 text-xs font-mono uppercase tracking-[0.16em] font-bold border-b-2 transition-colors shrink-0 flex items-center gap-2 ${
              activeTab === "facts"
                ? "border-crimson text-white"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            <span>Archive Intel</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-accent/30 text-accent-bright">
              {relatedFacts.length}
            </span>
          </button>
        )}
      </div>

      {/* ── Tab Content ── */}
      <div>
        {/* Synopsis Tab */}
        {activeTab === "synopsis" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <h3 className="font-display text-2xl text-white font-bold">
                Narrative Synopsis
              </h3>
              <p className="text-base text-text-secondary leading-relaxed">
                {data.desc}
              </p>

              <div className="pt-6 border-t border-white/[0.06] space-y-3">
                <h4 className="font-display text-xs font-bold uppercase tracking-widest text-muted-dark">
                  Timeline Significance
                </h4>
                <p className="text-sm text-muted leading-relaxed">
                  Takes place during MCU in-universe year <strong className="text-white">{data.chronologicalYear}</strong>.
                  Categorized within Phase {data.phase} of the Marvel Cinematic Universe storytelling hierarchy.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4 bg-[#0a0d15] border border-white/[0.06] p-6 rounded-2xl h-fit">
              <h4 className="font-display text-xs font-bold uppercase tracking-widest text-text-secondary">
                Production Dossier
              </h4>
              <dl className="space-y-3 text-xs font-mono">
                <div>
                  <dt className="text-muted-dark">Canonical Format</dt>
                  <dd className="text-white capitalize">{data.type}</dd>
                </div>
                <div>
                  <dt className="text-muted-dark">Theatrical Release Year</dt>
                  <dd className="text-white">{data.year}</dd>
                </div>
                <div>
                  <dt className="text-muted-dark">Chronological Story Order</dt>
                  <dd className="text-crimson-bright font-bold">{data.chronologicalYear}</dd>
                </div>
                <div>
                  <dt className="text-muted-dark">Phase</dt>
                  <dd className="text-white">Phase {data.phase}</dd>
                </div>
                {data.cast && (
                  <div>
                    <dt className="text-muted-dark">Headlining Cast</dt>
                    <dd className="text-white">{data.cast}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}

        {/* Post-Credits Tab with Interactive Spoiler Guard */}
        {activeTab === "postcredits" && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs font-mono flex items-center gap-3">
              <span>⚠️</span>
              <span>Spoiler Warning: Post-credit scenes reveal pivotal story twists connecting future MCU events.</span>
            </div>

            <div className="space-y-6">
              {moviePostCredits.map((scene, idx) => {
                const isRevealed = !!revealedPostCredits[idx];
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0e18] space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-crimson/20 text-crimson-bright font-bold">
                          {scene.position || "Post-Credits"}
                        </span>
                        <h4 className="font-display text-lg font-bold text-white">
                          {scene.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => toggleRevealScene(idx)}
                        className="text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-muted hover:text-white transition-colors"
                      >
                        {isRevealed ? "Hide Spoiler" : "Reveal Scene"}
                      </button>
                    </div>

                    {isRevealed ? (
                      <p className="text-sm text-text-secondary leading-relaxed pt-2 border-t border-white/[0.05]">
                        {scene.description}
                      </p>
                    ) : (
                      <div
                        onClick={() => toggleRevealScene(idx)}
                        className="p-4 rounded-xl bg-white/[0.03] border border-dashed border-white/10 text-center cursor-pointer hover:bg-white/[0.06] transition-colors"
                      >
                        <p className="text-xs font-mono text-muted">
                          [CLASSIFIED POST-CREDIT INTEL — CLICK TO DECRYPT]
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Archive Intel Tab */}
        {activeTab === "facts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {relatedFacts.map((fact) => (
              <div
                key={fact.id}
                className="cinematic-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono text-crimson-bright uppercase">
                      FILE #{fact.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/[0.05] text-muted">
                      {fact.type}
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-white mb-2">
                    {fact.title}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed">
                    {fact.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}