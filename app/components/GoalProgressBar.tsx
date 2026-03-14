import { useState } from "react";
import type { GoalData } from "@/types/goal.types";
import type { PeriodType } from "../hooks/useGoalData";

const PERIOD_OPTIONS: { key: PeriodType; label: string }[] = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

const CURRENT_YEAR = new Date().getFullYear();

function getCount(counts: { week: number; month: number; year: number }, period: PeriodType) {
  return counts[period] ?? 0;
}

function daysIntoYear(date: Date){
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

function calcPrediction(count: number, period: PeriodType) {
    const today = new Date();
    if (period == 'week') {
        const daysPassed = today.getDay();
        return (count / daysPassed) * 7
    }
    else if (period == 'month') {
        const daysPassed = today.getDate(); 
        return (count / daysPassed) * 31 
    }
    else {
        const daysPassed = daysIntoYear(today); 
        return (count / daysPassed) * 365 
    }
}

interface BarRowProps {
  goal: GoalData | null;
  counts: { week: number; month: number; year: number };
  onSave: (period: PeriodType, target: number) => void;
  onDelete: () => void;
  isOnly: boolean;
}

function BarRow({ goal, counts, onSave, onDelete, isOnly }: BarRowProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(goal?.period_type ?? "year");
  const [editing, setEditing] = useState(!goal);
  const [draft, setDraft] = useState(goal?.target_count ? String(goal.target_count) : "");
  const [hovered, setHovered] = useState(false);

  const activePeriod: PeriodType = goal ? goal.period_type : selectedPeriod;
  const target = goal?.target_count ?? 0;
  const count = getCount(counts, activePeriod);
  const prediction = Math.round(calcPrediction(count, selectedPeriod));
  const progress = target > 0 ? Math.min(100, (count / target) * 100) : 0;
  const percentage = target > 0 ? (count / target * 100).toFixed(1) : "0.0";
  const textDark = !editing;
  const dimColor = textDark ? "rgba(0,0,0,0.45)" : "#7d7c7c";

  const commit = () => {
    const num = parseInt(draft, 10);
    if (!isNaN(num) && num > 0) {
      onSave(selectedPeriod, num);
      setEditing(false);
    }
  };

  const showTrash = hovered && (!isOnly || goal);

  return (
    <div
      className="relative w-full h-8 rounded-sm grid mb-2 transition-colors duration-200"
      style={{ background: editing ? "#111113" : "#27272a" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!editing && (
        <div
          className="h-full bg-green-500 rounded-sm transition-all duration-500 ease-in-out col-start-1 row-start-1"
          style={{ width: goal ? `${progress}%` : "0%" }}
        />
      )}

      <div className="col-start-1 row-start-1 h-full flex items-center justify-between px-2">

        {editing ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              type="number"
              placeholder="+ add goal"
              min="1"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={e => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") {
                  setEditing(false);
                  setDraft(goal?.target_count ? String(goal.target_count) : "");
                }
              }}
              className="text-sm bg-transparent text-white outline-none tabular-nums"
              style={{ fontFamily: "inherit" }}
            />
          </div>
        ) : (
          <button
            onClick={() => { setDraft(String(target)); setEditing(true); }}
            className="text-m tabular-nums"
            style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", color: 'black'}}
          >
            {count} / {target}
            <span className="ml-1.5" style={{ color: dimColor }}>({percentage}%)</span>
          </button>
        )}

        <div className="flex items-center gap-1 shrink-0">
          {goal ? (
            <span className="text-zinc-500"
              style={{
                fontFamily: "inherit",
                letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "10px",
                marginRight: showTrash ? "20px" : "0", transition: "margin 0.15s"
              }}
            >
                <span className="mr-4 text-white">
                  current pace: {prediction} 
                </span>
              {PERIOD_OPTIONS.find(p => p.key === activePeriod)?.label}
            </span>
          ) : (
            <div className="flex items-center gap-0.5 shrink-0" style={{ marginRight: showTrash ? "20px" : "0", transition: "margin 0.15s" }}>
              {PERIOD_OPTIONS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPeriod(p.key)}
                  style={{
                    background: selectedPeriod === p.key ? "rgba(255,255,255,0.12)" : "transparent",
                    color: selectedPeriod === p.key ? "#f4f4f5" : "#3f3f46",
                    fontFamily: "inherit",
                    border: selectedPeriod === p.key ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase" as const,
                    fontSize: "9px",
                    padding: "2px 4px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showTrash && (
        <button
          onClick={onDelete}
          className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors"
          title="Remove goal"
          style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", color: dimColor }}
          onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
          onMouseLeave={e => e.currentTarget.style.color = dimColor}
        >
          ✕
        </button>
      )}
    </div>
  );
}

interface GoalProgressBarProps {
  goals: GoalData[];
  counts: { week: number; month: number; year: number };
  updateGoals: (targetCount: number, habitName: string, periodType: PeriodType, goalYear?: number) => Promise<void>;
  deleteGoal: (habitName: string, periodType: PeriodType, goalYear?: number) => Promise<void>;
  selectedOptionValue: string;
}

export default function GoalProgressBar({
  goals,
  counts,
  updateGoals,
  deleteGoal,
  selectedOptionValue,
}: GoalProgressBarProps) {
  const [pendingBar, setPendingBar] = useState(false);

  const currentGoals = goals.filter(g => g.goal_year === CURRENT_YEAR);
  const showPlus = currentGoals.length < 3 && !pendingBar;

  const handleSave = async (period: PeriodType, target: number) => {
    await updateGoals(target, selectedOptionValue, period, CURRENT_YEAR);
    setPendingBar(false);
  };

  const handleDelete = async (period: PeriodType) => {
    await deleteGoal(selectedOptionValue, period, CURRENT_YEAR);
  };

  if (!selectedOptionValue) return null;

  return (
    <div className="w-full mb-4">
      {currentGoals.map(goal => (
        <BarRow
          key={goal.id}
          goal={goal}
          counts={counts}
          onSave={(period, target) => handleSave(period, target)}
          onDelete={() => handleDelete(goal.period_type)}
          isOnly={currentGoals.length === 1 && !pendingBar}
        />
      ))}

      {pendingBar && (
        <BarRow
          goal={null}
          counts={counts}
          onSave={handleSave}
          onDelete={() => setPendingBar(false)}
          isOnly={false}
        />
      )}

      {showPlus && (
        <button
          onClick={() => setPendingBar(true)}
          className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors mt-1"
          style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          + add goal
        </button>
      )}
    </div>
  );
}
