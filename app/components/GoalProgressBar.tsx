export default function GoalProgressBar({
  selectedOptionGoal,
  selectedOptionCount,
} : {
  selectedOptionGoal: number,
  selectedOptionCount: number,
}) {
    const progress = Math.min(100, selectedOptionGoal > 0 ? (selectedOptionCount / selectedOptionGoal) * 100 : 0);
    const percentage = selectedOptionGoal > 0 
        ? (selectedOptionCount/selectedOptionGoal * 100).toFixed(1)
        : '0.0'; 
  return (
        <div className="w-full h-6 mb-8 border-2 border-zinc-950 bg-zinc-900 rounded-sm grid">
          <div
            className="h-6 bg-green-500 rounded-sm transition-all duration-500 ease-in-out col-start-1 row-start-1"
            style={{ width: `${progress}%` }}
            aria-valuenow={selectedOptionCount}
            aria-valuemin={0}
            aria-valuemax={selectedOptionGoal}
            role="progressbar"
            aria-label={`Progress: ${selectedOptionCount} out of ${selectedOptionGoal}`}
          />
          <div className="h-6 pl-2 text-mono text-black whitespace-nowrap overflow-visible flex items-center col-start-1 row-start-1">
            {selectedOptionCount}/{selectedOptionGoal} ({percentage}%)
          </div>
        </div>
  );
}
