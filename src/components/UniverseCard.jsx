import { useState } from "react";
import movies from "../data/movies.json";

const UNIVERSE_THEMES = {
  "earth-616": {
    badge: "bg-crimson/20 border-crimson/40 text-crimson-bright",
    gradient: "from-crimson/15 via-transparent to-accent/15",
    glow: "hover:shadow-crimson/20",
    symbol: "616",
  },
  "fox-xmen": {
    badge: "bg-amber-500/20 border-amber-500/40 text-amber-300",
    gradient: "from-amber-500/15 via-transparent to-orange-500/15",
    glow: "hover:shadow-amber-500/20",
    symbol: "X",
  },
  "raimi-spiderman": {
    badge: "bg-red-500/20 border-red-500/40 text-red-300",
    gradient: "from-red-600/15 via-transparent to-blue-600/15",
    glow: "hover:shadow-red-500/20",
    symbol: "🕷️",
  },
  "amazing-spiderman": {
    badge: "bg-blue-500/20 border-blue-500/40 text-blue-300",
    gradient: "from-blue-600/15 via-transparent to-cyan-500/15",
    glow: "hover:shadow-blue-500/20",
    symbol: "🕸️",
  },
  "ssu": {
    badge: "bg-purple-500/20 border-purple-500/40 text-purple-300",
    gradient: "from-purple-600/15 via-transparent to-black",
    glow: "hover:shadow-purple-500/20",
    symbol: "V",
  },
  "whatif": {
    badge: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
    gradient: "from-emerald-600/15 via-transparent to-teal-500/15",
    glow: "hover:shadow-emerald-500/20",
    symbol: "👁️",
  },
  "netflix-defenders": {
    badge: "bg-red-700/20 border-red-700/40 text-red-400",
    gradient: "from-red-800/15 via-transparent to-stone-900",
    glow: "hover:shadow-red-800/20",
    symbol: "DD",
  },
};

export default function UniverseCard({ universe }) {
  const [expanded, setExpanded] = useState(false);
  const theme = UNIVERSE_THEMES[universe.id] || UNIVERSE_THEMES["earth-616"];

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0a0d18] transition-all duration-500 hover:border-white/20 hover:-translate-y-1.5 hover:shadow-2xl ${theme.glow} flex flex-col justify-between`}
    >
      {/* Decorative Ambient Radial Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-50 pointer-events-none`}
      />

      {/* Card Header & Symbol */}
      <div className="relative p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${theme.badge}`}>
            {universe.label} Reality
          </span>
          <span className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-display text-sm font-bold text-white">
            {theme.symbol}
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold text-white tracking-wide leading-tight">
          {universe.name}
        </h3>

        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          {universe.description}
        </p>

        {/* Featured Connections */}
        {universe.relatedTitles && universe.relatedTitles.length > 0 && (
          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-dark block">
              Featured In MCU Multiversal Crossovers:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {universe.relatedTitles.map((titleId) => {
                // Find matching movie if possible
                const matchingMovie = movies.find(
                  (m) => m.id === titleId || m.id.includes(titleId.replace("the-", ""))
                );
                return (
                  <a
                    key={titleId}
                    href={matchingMovie ? `/movie/${matchingMovie.id}` : "/timeline"}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.06] border border-white/10 text-text-secondary hover:text-white hover:border-white/30 transition-colors"
                  >
                    <span>✦ {matchingMovie ? matchingMovie.title : titleId.replace(/-/g, " ")}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Bar */}
      <div className="relative p-4 px-6 sm:px-7 border-t border-white/[0.05] bg-black/40 flex items-center justify-between text-xs font-mono text-muted-dark">
        <span>Reality Designation: {universe.id.toUpperCase()}</span>
        <span className="text-white/60">Charted Realm</span>
      </div>
    </div>
  );
}