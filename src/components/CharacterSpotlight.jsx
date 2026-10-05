import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CHARACTERS from "../data/characters.json";

const AUTO_INTERVAL = 5000;

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

  const goTo = (newIndex, dir) => {
    setDirection(dir);
    setIndex(newIndex);
    resetTimer();
  };

  const next = () => goTo((index + 1) % CHARACTERS.length, 1);
  const prev = () => goTo((index - 1 + CHARACTERS.length) % CHARACTERS.length, -1);

  const current = CHARACTERS[index];

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 30 : -30, scale: 0.95 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -30 : 30, scale: 0.95 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-[400px] mx-auto lg:mx-0 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-3xl shadow-black/50"
    >
      {/* Poster area with character-specific gradient overlay */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={current.slug}
            src={current.poster}
            alt={current.name}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--character-gradient-start)_0%,_transparent_70%)]" />
        </div>

        {/* Nav arrows */}
        <button
          onClick={prev}
          aria-label="Previous character"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white transition-colors"
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label="Next character"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white transition-colors"
        >
          ›
        </button>

        {/* Label overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="text-[11px] uppercase tracking-widest font-bold text-white/90">
            Character Spotlight
          </span>
          <h3 className="font-display text-3xl sm:text-4xl text-white leading-none mt-2">
            {current.name}
          </h3>
          <p className="text-muted mt-3 max-w-md">{current.tagline}</p>
        </div>
      </div>

      {/* CTA — real navigation to the character's dedicated page */}
      <div className="p-6">
        <a
          href={`/character/${current.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-bold uppercase tracking-wide rounded-3xl border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
        >
          Explore {current.name}'s Story
        </a>

        {/* Character dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {CHARACTERS.map((c, i) => (
            <button
              key={c.slug}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              aria-label={`Go to ${c.name}`}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "w-6 h-6 bg-white/90" : "w-2 h-2 bg-white/20 hover:bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
