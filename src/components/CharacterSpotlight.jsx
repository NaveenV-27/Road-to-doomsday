import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CHARACTERS from "../data/characters.json";

const AUTO_INTERVAL = 6000;

export default function CharacterSpotlight() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % CHARACTERS.length);
    }, AUTO_INTERVAL);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (newIndex, dir = 1) => {
    setDirection(dir);
    setIndex(newIndex);
    resetTimer();
  };

  const next = () => goTo((index + 1) % CHARACTERS.length, 1);
  const prev = () => goTo((index - 1 + CHARACTERS.length) % CHARACTERS.length, -1);

  const current = CHARACTERS[index];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/[0.08] bg-[#090b12]/90 backdrop-blur-2xl shadow-2xl">
      {/* Decorative ambient color field based on active character */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-20 transition-all duration-700">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-crimson blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[500px]">
        {/* Character Portrait with Animation */}
        <div className="lg:col-span-5 relative aspect-[3/4] lg:aspect-auto lg:h-[540px] overflow-hidden bg-black/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src={current.poster}
                alt={`${current.name} portrait`}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b12] via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:via-[#090b12]/30 lg:to-[#090b12]" />
            </motion.div>
          </AnimatePresence>

          {/* Quick arrow controls on image */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 z-20">
            <button
              onClick={prev}
              aria-label="Previous character"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-black/60 border border-white/15 text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next character"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-black/60 border border-white/15 text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Character Story Dossier */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-crimson-bright">
                MCU ROSTER SPOTLIGHT
              </span>
              <span className="w-6 h-px bg-white/20" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-dark">
                {index + 1} of {CHARACTERS.length}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
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
                  Portrayed by <strong className="text-white font-semibold">{current.actor}</strong>
                </p>

                <p className="text-sm text-muted leading-relaxed max-w-xl pt-2">
                  Key anchor of the Marvel Cinematic Universe whose decisions, battles, and sacrifices directly paved the trajectory toward Avengers: Doomsday.
                </p>

                {/* Character Film Highlights */}
                <div className="pt-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-dark block mb-2">
                    Key Appearances ({current.movieIds.length} titles):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {current.movieIds.slice(0, 5).map((mId) => (
                      <span
                        key={mId}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.04] border border-white/[0.08] text-muted-dark capitalize"
                      >
                        {mId.replace(/-/g, " ")}
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

          {/* Action Row & Tabs */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <a
              href={`/character/${current.slug}`}
              className="btn-primary text-xs tracking-[0.16em]"
            >
              Explore {current.name}'s MCU Arc &rarr;
            </a>

            {/* Quick Character Thumbnails Selector */}
            <div className="flex items-center gap-2">
              {CHARACTERS.map((char, i) => (
                <button
                  key={char.slug}
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  aria-label={`Select ${char.name}`}
                  className={`relative transition-all duration-300 rounded-lg overflow-hidden border ${
                    i === index
                      ? "w-11 h-11 border-crimson-bright shadow-[0_0_10px_rgba(220,38,38,0.5)] scale-105"
                      : "w-8 h-8 border-white/10 opacity-50 hover:opacity-90"
                  }`}
                >
                  <img
                    src={char.poster}
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}