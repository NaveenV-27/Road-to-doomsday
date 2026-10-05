import { useMemo } from "react";
import { motion } from "framer-motion";
import MovieCard from "./MovieCard.jsx";
import { getMovieData } from "../lib/movieUtils.js";

export default function Timeline({ items, watchedMap, toggleWatched, sortMode }) {
  const sortedItems = useMemo(() => {
    const key = sortMode === "story" ? "chronologicalYear" : "year";
    return [...items].sort((a, b) => {
      const dataA = getMovieData(a);
      const dataB = getMovieData(b);
      return dataA[key] - dataB[key];
    });
  }, [items, sortMode]);

  const watchedCount = useMemo(() => {
    return sortedItems.filter((item) => watchedMap[getMovieData(item).id]).length;
  }, [sortedItems, watchedMap]);

  if (sortedItems.length === 0) {
    return (
      <div className="text-center text-muted py-16">
        Nothing matches your current filters.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* the spine */}
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-bright/50 via-accent/20 to-transparent sm:-translate-x-1/2" />

      {/* phase markers */}
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2 pointer-events-none">
        {[1, 2, 3, 4, 5, 6].map((phase) => {
          const phaseItems = sortedItems.filter(
            (item) => getMovieData(item).phase === phase
          );
          if (phaseItems.length === 0) return null;

          const firstItem = phaseItems[0];
          const firstData = getMovieData(firstItem);
          const phaseYear = sortMode === "story" ? firstData.chronologicalYear : firstData.year;

          return (
            <div
              key={phase}
              className="absolute -top-2 sm:-top-4 left-1/2 -translate-x-1/2 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-accent-bright rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-accent-bright/80">
                PHASE {phase}
              </span>
              <span className="text-xs text-muted/60 ml-2">
                {phaseYear}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-10">
        {sortedItems.map((item, i) => {
          const data = getMovieData(item);
          const watched = !!watchedMap[data.id];

          return (
            <div
              key={item.id}
              className={`relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8 pl-10 sm:pl-0 ${
                i % 2 === 1 ? "sm:flex-row-reverse" : ""
              }`}
            >
              {/* node dot on the spine */}
              <span
                className={`absolute left-4 sm:left-1/2 top-2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-bg z-10 ${
                  watched ? "bg-accent" : "bg-muted/50"
                }`}
              />

              <div className="sm:w-1/2 w-full">
                <MovieCard
                  item={item}
                  watched={watched}
                  onToggleWatched={toggleWatched}
                  layout="timeline"
                  sortMode={sortMode}
                />
              </div>
              <div className="hidden sm:block sm:w-1/2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}