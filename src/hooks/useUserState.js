import { useEffect, useState, useCallback } from "react";

const STATE_KEY = "waytodoomsday:state";
const OLD_WATCHED_KEY = "waytodoomsday:watched";
const OLD_VIEW_KEY = "waytodoomsday:view";
const OLD_SORT_KEY = "waytodoomsday:sortMode";

const listeners = new Set();

const DEFAULT_STATE = {
  version: 1,
  watched: {},
  watchlist: [],
  currentlyWatching: [],
  ratings: {},
  notes: {},
  preferences: {
    sortMode: "story",
    viewMode: "timeline",
    spoilers: false,
  },
};

/**
 * Migrate from old localStorage keys to new unified structure.
 * Preserves existing user progress.
 */
function migrateOldState() {
  if (typeof window === "undefined") return null;

  try {
    // Check if new state already exists
    const existing = window.localStorage.getItem(STATE_KEY);
    if (existing) return JSON.parse(existing);

    // Migrate from old keys
    const oldWatched = window.localStorage.getItem(OLD_WATCHED_KEY);
    const oldView = window.localStorage.getItem(OLD_VIEW_KEY);
    const oldSort = window.localStorage.getItem(OLD_SORT_KEY);

    const migratedState = { ...DEFAULT_STATE };

    if (oldWatched) {
      try {
        migratedState.watched = JSON.parse(oldWatched);
      } catch (e) {
        console.warn("Failed to migrate watched state:", e);
      }
    }

    if (oldView === "timeline" || oldView === "grid") {
      migratedState.preferences.viewMode = oldView;
    }

    if (oldSort === "story" || oldSort === "release") {
      migratedState.preferences.sortMode = oldSort;
    }

    // Save migrated state
    window.localStorage.setItem(STATE_KEY, JSON.stringify(migratedState));

    // Clean up old keys
    window.localStorage.removeItem(OLD_WATCHED_KEY);
    window.localStorage.removeItem(OLD_VIEW_KEY);
    window.localStorage.removeItem(OLD_SORT_KEY);

    return migratedState;
  } catch (e) {
    console.error("Migration failed:", e);
    return DEFAULT_STATE;
  }
}

function readState() {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const migrated = migrateOldState();
    if (migrated) return migrated;

    const stored = window.localStorage.getItem(STATE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_STATE;
  } catch (e) {
    console.error("Failed to read state:", e);
    return DEFAULT_STATE;
  }
}

function writeState(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
    listeners.forEach((fn) => fn(state));
  } catch (e) {
    console.error("Failed to write state:", e);
  }
}

/**
 * Main hook for accessing user state.
 * Returns full state and update function.
 */
export function useUserState() {
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
    setState(readState());
    listeners.add(setState);
    return () => listeners.delete(setState);
  }, []);

  const updateState = useCallback((updater) => {
    const current = readState();
    const next = typeof updater === "function" ? updater(current) : updater;
    writeState(next);
  }, []);

  return [state, updateState];
}

/**
 * Hook for watched state.
 * Returns watched map and toggle function.
 */
export function useWatched() {
  const [state, updateState] = useUserState();

  const toggleWatched = useCallback(
    (id) => {
      updateState((prev) => ({
        ...prev,
        watched: {
          ...prev.watched,
          [id]: !prev.watched[id],
        },
      }));
    },
    [updateState]
  );

  return {
    watchedMap: state.watched,
    toggleWatched,
  };
}

/**
 * Hook for watchlist state.
 */
export function useWatchlist() {
  const [state, updateState] = useUserState();

  const addToWatchlist = useCallback(
    (id) => {
      updateState((prev) => ({
        ...prev,
        watchlist: prev.watchlist.includes(id)
          ? prev.watchlist
          : [...prev.watchlist, id],
      }));
    },
    [updateState]
  );

  const removeFromWatchlist = useCallback(
    (id) => {
      updateState((prev) => ({
        ...prev,
        watchlist: prev.watchlist.filter((item) => item !== id),
      }));
    },
    [updateState]
  );

  const toggleWatchlist = useCallback(
    (id) => {
      updateState((prev) => ({
        ...prev,
        watchlist: prev.watchlist.includes(id)
          ? prev.watchlist.filter((item) => item !== id)
          : [...prev.watchlist, id],
      }));
    },
    [updateState]
  );

  return {
    watchlist: state.watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
  };
}

/**
 * Hook for currently watching state.
 */
export function useCurrentlyWatching() {
  const [state, updateState] = useUserState();

  const setCurrentlyWatching = useCallback(
    (ids) => {
      updateState((prev) => ({
        ...prev,
        currentlyWatching: Array.isArray(ids) ? ids : [ids],
      }));
    },
    [updateState]
  );

  const addCurrentlyWatching = useCallback(
    (id) => {
      updateState((prev) => ({
        ...prev,
        currentlyWatching: prev.currentlyWatching.includes(id)
          ? prev.currentlyWatching
          : [...prev.currentlyWatching, id],
      }));
    },
    [updateState]
  );

  const removeCurrentlyWatching = useCallback(
    (id) => {
      updateState((prev) => ({
        ...prev,
        currentlyWatching: prev.currentlyWatching.filter((item) => item !== id),
      }));
    },
    [updateState]
  );

  return {
    currentlyWatching: state.currentlyWatching,
    setCurrentlyWatching,
    addCurrentlyWatching,
    removeCurrentlyWatching,
  };
}

/**
 * Hook for ratings.
 */
export function useRatings() {
  const [state, updateState] = useUserState();

  const setRating = useCallback(
    (id, rating) => {
      updateState((prev) => ({
        ...prev,
        ratings: {
          ...prev.ratings,
          [id]: rating,
        },
      }));
    },
    [updateState]
  );

  const removeRating = useCallback(
    (id) => {
      updateState((prev) => {
        const { [id]: removed, ...rest } = prev.ratings;
        return { ...prev, ratings: rest };
      });
    },
    [updateState]
  );

  return {
    ratings: state.ratings,
    setRating,
    removeRating,
  };
}

/**
 * Hook for notes.
 */
export function useNotes() {
  const [state, updateState] = useUserState();

  const setNote = useCallback(
    (id, note) => {
      updateState((prev) => ({
        ...prev,
        notes: {
          ...prev.notes,
          [id]: note,
        },
      }));
    },
    [updateState]
  );

  const removeNote = useCallback(
    (id) => {
      updateState((prev) => {
        const { [id]: removed, ...rest } = prev.notes;
        return { ...prev, notes: rest };
      });
    },
    [updateState]
  );

  return {
    notes: state.notes,
    setNote,
    removeNote,
  };
}

/**
 * Hook for preferences.
 */
export function usePreferences() {
  const [state, updateState] = useUserState();

  const updatePreferences = useCallback(
    (updates) => {
      updateState((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ...updates,
        },
      }));
    },
    [updateState]
  );

  return {
    preferences: state.preferences,
    updatePreferences,
  };
}
