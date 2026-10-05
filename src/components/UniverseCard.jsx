import { usePreferences } from "../hooks/useUserState.js";

export default function UniverseCard({ universe }) {
  const { preferences } = usePreferences();

  return (
    <a
      href={`/multiverse/${universe.id}`}
      className="group block rounded-xl overflow-hidden border border-white/[0.08] transition-all duration-300 hover:border-white/20 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-2xl shadow-black/60">
        {/* Universe representation - using initials or symbol for now */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-bg via-bg/80 to-black/60">
          <div className="text-center">
            <span className="font-display text-4xl tracking-wide text-white/90">
              {universe.name.substring(0, 2).toUpperCase()}
            </span>
            <span className="block text-xs font-bold uppercase tracking-widest text-accent-bright/80">
              {universe.label}
            </span>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>
      <div className="mt-4 p-4">
        <h3 className="font-display text-lg tracking-wide mb-2">
          {universe.name}
        </h3>
        <p className="text-muted text-sm">
          {universe.description}
        </p>
        {universe.relatedTitles.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted uppercase tracking-wider">Featured in:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {universe.relatedTitles.map((titleId) => (
                <span
                  key={titleId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface/80 border border-white/[0.08]"
                >
                  {titleId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </a>
  );
}