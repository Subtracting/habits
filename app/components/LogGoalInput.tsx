import DatePicker from "react-datepicker";
import { Option } from "@/types/option.types";
import { GoalsState } from "@/types/goal.types";
import { useState } from "react";

type LogHabitInputProps = {
  options: Option[];
  setGoals: React.Dispatch<React.SetStateAction<GoalsState>>; 
};

export default function LogGoalInput({
  options,
  setGoals,
}: LogHabitInputProps) {
    const [selectedYear, setSelectedYear] = useState<Date>(new Date(2026, 0, 1));
    const [goalValue, setGoalValue] = useState<number>(1);

    const renderYearContent = (year: number): React.ReactNode => {
        const tooltipText = `Tooltip for year: ${year}`;
        return <span title={tooltipText}>{year}</span>;
  };
  return (
    <>
            <div>
              <DatePicker
                selected={selectedYear}
                onChange={(date: Date | null) => date && setSelectedYear(date)}
                renderYearContent={renderYearContent}
                showYearPicker
                className="bg-zinc-950 text-white rounded-md px-4 py-2 my-4"
                calendarClassName="react-datepicker"
                dateFormat="yyyy"
              />
    <div className='flex'>
      <input
        type='number'
        value={goalValue}
        onChange={(e) => setGoalValue(Number(e.target.value))}
        className='w-16 my-4 bg-zinc-950 text-zinc-100 px-4 py-1 mr-4 rounded'
      />
    <select
      className="w-auto my-4 bg-black text-zinc-100 px-4 py-1 rounded"
      value={goalValue}
      onChange={(e) => setGoalValue(Number(e.target.value))}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    </div>

              <div className='flex'>
                <button
                  className="
                    my-4 
                    bg-black 
                    hover:bg-zinc-950 
                    text-zinc-100 
                    hover:text-zinc-100 
                    border-zinc-900 
                    hover:border-zinc-700 
                    border-2 
                    px-4 
                    py-1 
                    rounded"
                >
                    add goal 
                </button>
              </div>
             </div>
    </>
  )
}
