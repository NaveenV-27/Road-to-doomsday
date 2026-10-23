import { useMemo } from "react";

const STANDARD_PHASES = [1, 2, 3, 4, 5, 6];

export default function PhaseTabs({ activePhase, onSelect }) {
  return (
    <div id="phases" className="scroll-mt-24 max-w-5xl mx-auto px-4 sm:px-6 pt-2 pb-6">
      <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {/* All Titles */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`shrink-0 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all ${
            activePhase === null
              ? "border-crimson text-white bg-white/[0.04]"
              : "border-transparent text-muted hover:text-white"
          }`}
        >
          All Sagas
        </button>

        {/* Phase 1 to Phase 6 */}
        {STANDARD_PHASES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onSelect(p)}
            className={`shrink-0 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all ${
              activePhase === p
                ? "border-crimson text-white bg-white/[0.04]"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            Phase {p}
          </button>
        ))}

        {/* Multiverse & Specials (Titles with phase: null) */}
        <button
          type="button"
          onClick={() => onSelect("other")}
          className={`shrink-0 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all ${
            activePhase === "other"
              ? "border-accent-bright text-white bg-white/[0.04]"
              : "border-transparent text-muted hover:text-white"
          }`}
        >
          Multiverse &amp; Specials
        </button>
      </div>
    </div>
  );
}
