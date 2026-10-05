import { motion } from "framer-motion";

export default function ProgressBar({ watchedCount, total }) {
  const pct = total === 0 ? 0 : Math.round((watchedCount / total) * 100);

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 py-4 shadow-2xl shadow-black/40">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-sm text-muted-dark">
          <span className="font-display text-white">{watchedCount}</span> of{" "}
          <span className="font-display text-white">{total}</span> watched
        </span>
        <span className="text-base font-mono font-bold text-white tracking-tight">
          {pct}%
        </span>
      </div>
      <div
        className="h-2.5 rounded-full bg-white/[0.05] overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-crimson-bright to-cosmic rounded-full shadow-[0_0_10px_rgba(220,38,38,0.4)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}
