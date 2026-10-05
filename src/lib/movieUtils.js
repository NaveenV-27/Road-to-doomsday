// Helper functions to get data from the original movies.json format
// This normalizes the data for application use while preserving original fields
export function getMovieData(item) {
  // Map from original movies.json format to application-expected format
  // while preserving all original fields exactly as they exist

  return {
    // Preserve original fields exactly
    id: item.id,
    title: item.title,
    type: item.type,
    year: item.year,
    phase: item.phase,
    chronologicalYear: item.chronologicalYear,
    poster: item.poster,
    desc: item.desc,
    cast: item.cast,
    link: item.link,
    play: item.play,
    releaseDate: item.releaseDate || null,

    // Provide normalized/exposed field names that the application expects
    mediaType: item.type,
    releaseYear: item.year,
    storyYear: item.chronologicalYear,
    description: item.desc,

    // For now, keep watch fields empty as per instructions (do not populate officialWatch yet)
    watch: {
      official: [],  // Empty array - do not populate from link/play yet
      legalLocator: null  // Null - do not populate from link/play yet
    },

    // Provide empty arrays for connections (to be added in separate datasets later)
    connections: {
      characters: [],
      relatedTitles: []
    },

    // Provide default journey values (to be enhanced later)
    journey: {
      importance: "essential",
      spoilerLevel: 0
    }
  };
}