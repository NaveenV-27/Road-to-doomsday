import { useMemo } from "react";
import { motion } from "framer-motion";

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

export default function MovieHero({ movie, posterIsPlaceholder = false }) {
  const data = getMovieData(movie);
  const TYPE_LABEL = { movie: "Movie", series: "Series", special: "Special" };
  const TYPE_COLOR = { movie: "bg-accent/20", series: "bg-steel/20", special: "bg-accent/20" };
  const TYPE_TEXT_COLOR = { movie: "text-accent-bright", series: "text-steel-bright", special: "text-accent-bright" };

  return (
    <div className="relative">
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
        {posterIsPlaceholder ? (
          <div className="media-placeholder absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
            <span className="text-xs uppercase tracking-widest">Poster goes here</span>
            <span className="text-[10px] text-muted/60 font-mono">{data.poster}</span>
          </div>
        ) : (
          <img
            src={data.poster}
            alt={`${data.title} poster`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-block ${TYPE_COLOR[data.type] ?? "bg-accent/20"} ${TYPE_TEXT_COLOR[data.type] ?? "text-accent-bright"} text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full`}>
            {TYPE_LABEL[data.type] ?? data.type}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-accent-bright/60">
            PHASE {data.connections.characters.length > 0 ? "?" : data.connections.relatedTitles.length > 0 ? "?" : "?"}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl tracking-wide leading-none mb-2">
          {data.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted/70">
          <span>Released {data.year}</span>
          <span className="text-muted/40">•</span>
          <span>Story {data.chronologicalYear}</span>
          {data.cast ? (
            <>
              <span className="text-muted/40">•</span>
              <span>{data.cast}</span>
            </>
          ) : null}
        </div>

        <p className="text-sm text-muted leading-snug">
          {data.desc}
        </p>
      </div>
    </div>
  );
}