// Canonical Theatrical Release Order Sequence for MCU Titles
export const MCU_RELEASE_ORDER = [
  "iron-man", // May 2008
  "incredible-hulk", // Jun 2008
  "iron-man-2", // May 2010
  "thor", // May 2011
  "captain-america-first-avenger", // Jul 2011
  "avengers", // May 2012
  "iron-man-3", // May 2013
  "thor-dark-world", // Nov 2013
  "captain-america-winter-soldier", // Apr 2014
  "guardians-vol-1", // Aug 2014
  "avengers-age-of-ultron", // May 2015
  "ant-man", // Jul 2015
  "captain-america-civil-war", // May 2016
  "doctor-strange", // Nov 2016
  "guardians-vol-2", // May 2017
  "spider-man-homecoming", // Jul 2017
  "thor-ragnarok", // Nov 2017
  "black-panther", // Feb 2018
  "avengers-infinity-war", // Apr 2018
  "ant-man-wasp", // Jul 2018
  "captain-marvel", // Mar 2019
  "avengers-endgame", // Apr 2019
  "spider-man-far-from-home", // Jul 2019
  "wandavision", // Jan 2021
  "falcon-winter-soldier", // Mar 2021
  "loki", // Jun 2021
  "black-widow", // Jul 2021
  "what-if", // Aug 2021
  "shang-chi", // Sep 2021
  "eternals", // Nov 2021
  "hawkeye", // Nov 2021
  "spider-man-no-way-home", // Dec 2021
  "moon-knight", // Mar 2022
  "doctor-strange-multiverse-of-madness", // May 2022
  "ms-marvel", // Jun 2022
  "thor-love-and-thunder", // Jul 2022
  "she-hulk", // Aug 2022
  "werewolf-by-night", // Oct 2022
  "black-panther-wakanda-forever", // Nov 2022
  "ant-man-quantumania", // Feb 2023
  "guardians-vol-3", // May 2023
  "secret-invasion", // Jun 2023
  "the-marvels", // Nov 2023
  "echo", // Jan 2024
  "deadpool-and-wolverine", // Jul 2024
  "agatha-all-along", // Sep 2024
  "captain-america-brave-new-world", // Feb 2025
  "daredevil-born-again", // Mar 2025
  "thunderbolts", // May 2025
  "ironheart", // Jun 2025
  "fantastic-four-first-steps", // Jul 2025
  "wonder-man", // Dec 2025
  "spider-man-brand-new-day", // 2026
  "avengers-doomsday", // Dec 2026
  "avengers-secret-wars", // Dec 2027
];

const releaseOrderMap = new Map();
MCU_RELEASE_ORDER.forEach((id, index) => {
  releaseOrderMap.set(id, index);
});

/**
 * Formats an ISO date string (e.g. "2026-12-18") into a human-friendly format (e.g. "December 18, 2026")
 */
export function formatReadableDate(dateStr) {
  if (!dateStr) return null;
  try {
    const parts = dateStr.split("-").map(Number);
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const [y, m, d] = parts;
      const date = new Date(Date.UTC(y, m - 1, d));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

// Helper function to extract and normalize data from the canonical movies.json format
// Preserves all original fields and values intact
export function getMovieData(item) {
  if (!item) return null;

  return {
    // Preserve canonical original fields
    id: item.id,
    title: item.title,
    type: item.type,
    year: item.year,
    phase: item.phase,
    chronologicalYear: item.chronologicalYear,
    poster: item.poster || "",
    desc: item.desc || "",
    cast: item.cast || "",
    link: item.link || "",
    play: item.play || "",
    releaseDate: item.releaseDate || null,

    // Schema extensions
    officialWatch: Array.isArray(item.officialWatch) ? item.officialWatch : [],
    availability: item.availability || null,
    scope: item.scope || null,
    contentCategory: item.contentCategory || null,
    officialInfoUrl: item.officialInfoUrl || null,
    officialInfoLabel: item.officialInfoLabel || null,
    releaseStatus: item.releaseStatus || "released",
    releaseStatusLabel: item.releaseStatusLabel || (item.releaseStatus === "upcoming" ? "NOT YET RELEASED" : null),
    posterFallbackUrl: item.posterFallbackUrl || null,

    // Expose normalized property names
    mediaType: item.type,
    releaseYear: item.year,
    storyYear: item.chronologicalYear,
    description: item.desc,

    // Release order index
    releaseOrderIndex: releaseOrderMap.has(item.id) ? releaseOrderMap.get(item.id) : 999,

    // Watch fields (normalized helper)
    watch: {
      official: Array.isArray(item.officialWatch) ? item.officialWatch : [],
      legalLocator: item.play || item.link || null,
    },

    // Connections
    connections: {
      characters: [],
      relatedTitles: [],
    },

    // Journey
    journey: {
      importance: "essential",
      spoilerLevel: 0,
    },
  };
}

/**
 * Sorts movie items by either "story" (chronological in-universe) or "release" (theatrical)
 * Null chronologicalYear values sort to the end when in story order.
 */
export function sortMovies(items, sortMode = "story") {
  const cloned = [...items];

  if (sortMode === "release") {
    return cloned.sort((a, b) => {
      const yearA = typeof a.year === "number" ? a.year : 9999;
      const yearB = typeof b.year === "number" ? b.year : 9999;

      if (yearA !== yearB) {
        return yearA - yearB;
      }

      // If releaseDate exists on both, sort by releaseDate
      if (a.releaseDate && b.releaseDate) {
        if (a.releaseDate < b.releaseDate) return -1;
        if (a.releaseDate > b.releaseDate) return 1;
      }

      // If mapped in MCU_RELEASE_ORDER, use that order
      const idxA = releaseOrderMap.has(a.id) ? releaseOrderMap.get(a.id) : 999;
      const idxB = releaseOrderMap.has(b.id) ? releaseOrderMap.get(b.id) : 999;
      if (idxA !== idxB) {
        return idxA - idxB;
      }

      return (a.title || "").localeCompare(b.title || "");
    });
  }

  // Story order:
  // Items with chronologicalYear sort by story era (e.g. 1942 -> 1995 -> 2010...)
  // Items with null/undefined chronologicalYear sort to the end (Infinity), ordered by release year.
  return cloned.sort((a, b) => {
    const chronoA = a.chronologicalYear !== null && a.chronologicalYear !== undefined ? a.chronologicalYear : Infinity;
    const chronoB = b.chronologicalYear !== null && b.chronologicalYear !== undefined ? b.chronologicalYear : Infinity;

    if (chronoA !== chronoB) {
      return chronoA - chronoB;
    }

    // Tie-breaker when both have same chronologicalYear or both are null (Infinity)
    const yearA = typeof a.year === "number" ? a.year : 9999;
    const yearB = typeof b.year === "number" ? b.year : 9999;
    if (yearA !== yearB) {
      return yearA - yearB;
    }

    const idxA = releaseOrderMap.has(a.id) ? releaseOrderMap.get(a.id) : 999;
    const idxB = releaseOrderMap.has(b.id) ? releaseOrderMap.get(b.id) : 999;
    if (idxA !== idxB) {
      return idxA - idxB;
    }

    return (a.title || "").localeCompare(b.title || "");
  });
}
