import { useState } from "react";
import { motion } from "framer-motion";

export default function SpoilerGuard({ children, title = "Spoiler Warning", description = "This section contains spoilers. Proceed with caution." }) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="space-y-4">
      {!showContent && (
        <div className="bg-surface/80 backdrop-blur-xl rounded-xl border border-white/[0.08] p-6 text-center">
          <h3 className="font-display text-lg text-accent-broken/80 mb-3">
            {title}
          </h3>
          <p className="text-muted mb-4">
            {description}
          </p>
          <motion.button
            onClick={() => setShowContent(true)}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
          >
            Show Spoiler Content
          </motion.button>
        </div>
      )}

      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}