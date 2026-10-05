import { useMemo } from "react";
import { useWatched } from "../hooks/useUserState.js";
import ProgressBar from "./ProgressBar.jsx";
import milestones from "../data/milestones.json";

export default function MilestoneProgress() {
  const { watchedMap } = useWatched();

  // Calculate milestone progress
  const milestoneProgress = useMemo(() => {
    return milestones.map(milestone => {
      let completed = false;

      if (milestone.completionCondition === "watched-all") {
        // Check if all required movies are watched
        completed = milestone.movieIds.every(id => !!watchedMap[id]);
      }
      // Add other completion conditions as needed

      return {
        ...milestone,
        completed
      };
    });
  }, [watchedMap]);

  const completedCount = milestoneProgress.filter(m => m.completed).length;
  const totalCount = milestoneProgress.length;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl tracking-wide mb-6">Milestones</h2>

      {totalCount === 0 ? (
        <p className="text-center text-muted py-8">No milestones defined.</p>
      ) : (
        <div className="space-y-4">
          {milestoneProgress.map((milestone) => (
            <div key={milestone.id} className="bg-surface/80 backdrop-blur-xl rounded-xl border border-white/[0.08] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-lg tracking-wide">{milestone.title}</h3>
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                  milestone.completed
                    ? "bg-accent/20 text-accent-bright"
                    : "bg-white/10 text-muted"
                }`}>
                  {milestone.completed ? "Completed" : "In Progress"}
                </span>
              </div>
              <p className="text-muted">{milestone.description}</p>
              {!milestone.completed && milestone.movieIds && milestone.movieIds.length > 0 && (
                <div className="mt-3">
                  <ProgressBar
                    watchedCount={milestone.movieIds.filter(id => !!watchedMap[id]).length}
                    total={milestone.movieIds.length}
                    className="h-1.5"
                  />
                  <p className="text-xs text-muted/60 mt-1">
                    {milestone.movieIds.filter(id => !!watchedMap[id]).length} of {milestone.movieIds.length} movies watched
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/[0.08]">
        <h3 className="font-display text-lg tracking-wide mb-3">Overall Progress</h3>
        <ProgressBar
          watchedCount={completedCount}
          total={totalCount}
          className="mb-2"
        />
        <p className="text-center text-sm text-muted">
          {completedCount} of {totalCount} milestones completed
        </p>
      </div>
    </div>
  );
}