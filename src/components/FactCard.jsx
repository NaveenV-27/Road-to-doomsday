import { useState } from "react";
import movies from "../data/movies.json";

const TYPE_CONFIG = {
  history: { label: "MCU History", color: "text-amber-400 bg-amber-400/10 border-amber-400/30", stamp: "CANON" },
  production: { label: "Behind the Scenes", color: "text-sky-400 bg-sky-400/10 border-sky-400/30", stamp: "PRODUCTION" },
  comic: { label: "Comic Origins", color: "text-purple-400 bg-purple-400/10 border-purple-400/30", stamp: "MARVEL COMICS" },
  "easter-egg": { label: "Easter Egg", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", stamp: "NEXUS" },
  character: { label: "Character Dossier", color: "text-rose-400 bg-rose-400/10 border-rose-400/30", stamp: "CLASSIFIED" },
};

export default function FactCard({ fact }) {
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const cfg = TYPE_CONFIG[fact.type] || TYPE_CONFIG.history;

  // Find related movies
  const relatedMovies = (fact.relatedMovies || [])
    .map((id) => movies.find((m) => m.id === id))
    .filter(Boolean);

  const isSpoiler = fact.spoilerLevel > 0;

  return (
    <div className="cinematic-card p-6 sm:p-7 flex flex-col justify-between space-y-5 relative overflow-hidden group">
      {/* Top Header Row with Dossier Stamp */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${cfg.color}`}>
            {cfg.label}
          </span>
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-white/30 border border-white/10 px-2 py-0.5 rounded">
            FILE #{fact.id}
          </span>
        </div>

        <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-text-secondary transition-colors">
          {fact.title}
        </h3>

        {/* Content Body */}
        <div className="mt-3">
          {isSpoiler && !spoilerRevealed ? (
            <div
              onClick={() => setSpoilerRevealed(true)}
              className="p-4 rounded-xl bg-white/[0.03] border border-dashed border-white/15 text-center cursor-pointer hover:bg-white/[0.06] transition-colors"
            >
              <span className="text-[11px] font-mono text-amber-300 block font-semibold">
                ⚠️ LEVEL {fact.spoilerLevel} SPOILER WARNING
              </span>
              <span className="text-[10px] font-mono text-muted mt-1 block">
                Click to reveal classified record
              </span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {fact.body}
            </p>
          )}
        </div>
      </div>

      {/* Related Movies Footer */}
      {relatedMovies.length > 0 && (
        <div className="pt-4 border-t border-white/[0.06] space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-dark block">
            Referenced Titles:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {relatedMovies.map((m) => (
              <a
                key={m.id}
                href={`/movie/${m.id}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.05] border border-white/10 text-muted hover:text-white hover:border-white/30 transition-colors"
              >
                <span>✦ {m.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}