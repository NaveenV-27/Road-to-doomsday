
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CHARACTERS from "../data/characters.json";

const AUTO_INTERVAL = 6000;

// Only these 8 characters appear in the homepage spotlight.
// Keep this list separate from the complete character catalogue.
const SPOTLIGHT_SLUGS = [
  "iron-man",
  "captain-america",
  "thor",
  "spider-man",
  "star-lord",
  "hulk",
  "black-widow",
  "hawkeye",
];

const SPOTLIGHT_CHARACTERS = SPOTLIGHT_SLUGS
  .map((slug) => CHARACTERS.find((character) => character.slug === slug))
  .filter(Boolean);

export default function CharacterSpotlight() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const count = SPOTLIGHT_CHARACTERS.length;

  const current = SPOTLIGHT_CHARACTERS[index];

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (count <= 1 || paused) return;

    timerRef.current = setInterval(() => {
      setIndex((previous) => (previous + 1) % count);
    }, AUTO_INTERVAL);
  };

  useEffect(() => {
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [paused, count]);

  const goTo = (newIndex) => {
    setIndex((newIndex + count) % count);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (!paused && count > 1) {
      timerRef.current = setInterval(() => {
        setIndex((previous) => (previous + 1) % count);
      }, AUTO_INTERVAL);
    }
  };

  if (!current) return null;

  const getCharacterImage = (character) =>
    character.poster || character.fallbackPoster || "";

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-white/[0.08] bg-[#090b12]/90 backdrop-blur-2xl shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      {/* Ambient colour */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-crimson blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center min-h-[500px]">
        {/* Active character portrait */}
        <div className="lg:col-span-5 relative aspect-[3/4] lg:aspect-auto lg:h-[540px] overflow-hidden bg-black/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {getCharacterImage(current) ? (
                <img
                  src={getCharacterImage(current)}
                  alt={`${current.name} character portrait`}
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#111522] text-white/50">
                  <span className="font-display text-xl">
                    {current.name}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#090b12] via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:via-[#090b12]/30 lg:to-[#090b12]" />
            </motion.div>
          </AnimatePresence>

          {/* Previous / next */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 z-20">
            <button
              onClick={() => goTo(index - 1)}
              aria-label="Previous spotlight character"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-black/60 border border-white/15 text-white hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-bright"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => goTo(index + 1)}
              aria-label="Next spotlight character"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-black/60 border border-white/15 text-white hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-bright"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Character details */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-crimson-bright">
                MCU ROSTER SPOTLIGHT
              </span>
              <span className="w-6 h-px bg-white/20" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-dark">
                {index + 1} of {count}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-wide">
                    {current.name}
                  </h3>

                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/[0.08] text-white border border-white/10">
                    {current.tagline}
                  </span>
                </div>

                <p className="text-base text-text-secondary font-medium">
                  Portrayed by{" "}
                  <strong className="text-white font-semibold">
                    {current.actor}
                  </strong>
                </p>

                <p className="text-sm text-muted leading-relaxed max-w-xl pt-2">
                  Explore this character's key appearances and cinematic
                  journey across the Marvel Cinematic Universe.
                </p>

                <div className="pt-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-dark block mb-2">
                    Key Appearances ({current.movieIds.length} titles)
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {current.movieIds.slice(0, 5).map((movieId) => (
                      <span
                        key={movieId}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.04] border border-white/[0.08] text-muted-dark capitalize"
                      >
                        {movieId.replace(/-/g, " ")}
                      </span>
                    ))}

                    {current.movieIds.length > 5 && (
                      <span className="px-2 py-1 text-[11px] font-mono text-muted-dark">
                        +{current.movieIds.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Actions and limited thumbnail selector */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <a
              href={`/character/${current.slug}`}
              className="btn-primary text-xs tracking-[0.16em]"
            >
              Explore {current.name}'s MCU Arc &rarr;
            </a>

            <div
              className="flex items-center gap-2"
              aria-label="Choose spotlight character"
            >
              {SPOTLIGHT_CHARACTERS.map((character, i) => (
                <button
                  key={character.slug}
                  onClick={() => goTo(i)}
                  aria-label={`Select ${character.name}`}
                  aria-pressed={i === index}
                  className={`relative rounded-lg overflow-hidden border transition-all duration-300 ${
                    i === index
                      ? "w-11 h-11 border-crimson-bright shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                      : "w-8 h-8 border-white/10 opacity-50 hover:opacity-90"
                  }`}
                >
                  {getCharacterImage(character) ? (
                    <img
                      src={getCharacterImage(character)}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-[9px] text-white">
                      {character.name.slice(0, 2)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
