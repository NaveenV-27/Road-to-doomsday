// Helper functions to get data from either old or new schema
export function getMovieData(item) {
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
      watch: item.watch,
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
    watch: {
      official: item.link ? [{ platform: "Disney+", url: item.link }] : [],
      legalLocator: item.play || item.link || null
    },
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