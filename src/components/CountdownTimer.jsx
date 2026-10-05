import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Edit this to the real target release date/time when known.
const TARGET_DATE = new Date("December 18, 2026 11:30:00");

function getTimeParts(target) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function Unit({ value, label }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center min-w-[4rem] sm:min-w-[5rem]">
      <div className="relative h-10 sm:h-14 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="block font-mono text-3xl sm:text-5xl font-bold text-white tabular-nums leading-tight"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[11px] sm:text-[12px] uppercase tracking-wider text-muted-dark mt-2">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [parts, setParts] = useState(() => getTimeParts(TARGET_DATE));

  useEffect(() => {
    const id = setInterval(() => setParts(getTimeParts(TARGET_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  if (!parts) {
    return (
      <div className="flex items-center gap-4 sm:gap-6">
        <span className="font-mono text-3xl sm:text-4xl font-bold text-crimson-bright">
          NOW
        </span>
        <span className="font-display text-2xl sm:text-3xl font-bold text-crimson-bright">
          IN THEATERS
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-6 sm:gap-8 px-6 py-5 sm:px-8 sm:py-6 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/40"
      aria-live="polite"
    >
      <Unit value={parts.days} label="Days" />
      <span className="text-crimson-bright/50 text-3xl sm:text-4xl -mt-2">:</span>
      <Unit value={parts.hours} label="Hrs" />
      <span className="text-crimson-bright/50 text-3xl sm:text-4xl -mt-2">:</span>
      <Unit value={parts.minutes} label="Min" />
      <span className="text-crimson-bright/50 text-3xl sm:text-4xl -mt-2">:</span>
      <Unit value={parts.seconds} label="Sec" />
    </div>
  );
}