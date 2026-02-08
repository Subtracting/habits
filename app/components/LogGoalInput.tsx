import DatePicker from "react-datepicker";
import { Option } from "@/types/option.types";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";

type LogHabitInputProps = {
  options: Option[];
  updateGoals: (yearToUpdate: Date, count: number, selectedOptionValue: string) => void;
  selectedOptionValue: string;
  selectedOption: Option | null;
  setSelectedOption: (value: Option | null) => void;
};

export default function LogGoalInput({
    options,
    updateGoals,
    selectedOptionValue,
    selectedOption,
    setSelectedOption,
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
                <CreatableSelect
                    onChange={(newValue) => setSelectedOption(newValue)}
                    options={options}
                    value={selectedOption}
                    placeholder="Select habit..."
                    className="my-4"
                    styles={{
                        input: base => ({
                            ...base,
                            color: "white",
                        }),
                        singleValue: base => ({
                            ...base,
                            color: "white",
                        }),
                        control: base => ({
                            ...base,
                            border: "none",
                            boxShadow: "none",
                            backgroundColor: "black",
                            minHeight: "0",
                            minWidth: "140px",
                            maxWidth: "240px",
                            height: "32px",
                        }),
                        menu: base => ({
                            ...base,
                            backgroundColor: "black",
                            width: "auto",
                            marginTop: "4px",
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? "#1a1a1a" : "black",
                            color: "white",
                    }),
                }}
                />
              </div>

              <div className='flex'>
                <button
                  onClick={() => updateGoals(selectedYear, goalValue, selectedOptionValue)}
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
