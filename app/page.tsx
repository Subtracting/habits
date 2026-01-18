'use client';

import { useEffect, useState } from 'react';

import HeatMap from './components/HeatMap';
import WeekdayChart from './components/WeekdayChart';
import SimpleLineChart from './components/LineChart';
import CurrentStats from './components/CurrentStats';
import LogHabitInput from './components/LogHabitInput';
import LogGoalInput from './components/LogGoalInput';

import { useHabitData } from './hooks/useHabitData';
import { useHabitStats } from './hooks/useHabitStats';
import { useHabitCalculations } from './hooks/useHabitCalculations';
import { useScreenWidth } from './hooks/useScreenWidth';
import { createOption } from './utils/optionHelpers';

import type { Option } from '@/types/option.types';

import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-dark.css';
import { useGoalData } from './hooks/useGoalData';
import GoalProgressBar from './components/GoalProgressBar';

const defaultOptions = [
    createOption("movies"),
    createOption("books"),
    createOption("pages"),
];

export default function Home() {
    const [options, setOptions] = useState<Option[]>(defaultOptions);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [countValue, setCountValue] = useState<number>(1);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [inputType, setInputType] = useState<string>("habits");

    const selectedOptionValue = selectedOption?.value ?? "";

    /* custom hooks */
    const { goals, updateGoals } = useGoalData(setOptions);
    const { days, setDays, updateDays } = useHabitData(setOptions);
    const stats = useHabitStats(days, selectedOptionValue, selectedDate);
    const { minMax, weekdaysData } = useHabitCalculations(days, selectedOptionValue);
    const screenWidth = useScreenWidth();

    const currentStats = stats[selectedOptionValue];

    const [isAnimating, setIsAnimating] = useState(true);
    const [displayType, setDisplayType] = useState(inputType);

    const handleCreate = (inputValue: string) => {
        const newOption = createOption(inputValue);
        setOptions((prev) => [...prev, newOption]);
        setSelectedOption(newOption);
    };

    const handleSelectUpdate = (newSelectedOption: Option | null) => {
        setSelectedOption(newSelectedOption);
    };

    const handleInputTypeSelect = () => {
        setInputType(inputType === 'habits' ? 'goals' : 'habits');
    };

    useEffect(() => {
        if (inputType !== displayType) {
            setIsAnimating(false);
            setTimeout(() => {
                setDisplayType(inputType);
                setTimeout(() => setIsAnimating(true), 250);
            }, 250); 
        }
    }, [inputType, displayType]);

    return (
    <div className="flex min-h-screen items-center justify-center font-mono bg-black">
      <main className="flex min-h-screen flex-col py-16 px-16 text-white bg-black sm:items-start">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-6xl">{inputType}.</h1>
       <div className="flex">
        <button 
          onClick={handleInputTypeSelect}
          className="w-10 h-6 bg-zinc-800 rounded-full relative transition-colors duration-200 hover:bg-zinc-600"
        >
          <div className={`absolute top-1 w-4 h-4 bg-zinc-300 rounded-full transition-transform duration-200 ${
            inputType === 'habits' ? 'left-1' : 'left-5'
          }`} />
        </button>
        </div> 
       </div>

        <div className="cal-container">
          <div className='flex justify-between py-4'>

          {inputType === 'habits' ? (
              <div 
                className={`
                  transition-all duration-500 ease-in-out
                  ${isAnimating 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-full opacity-0'
                  }
                `}
              >
                <LogHabitInput 
                  setSelectedDate={setSelectedDate}
                  countValue={countValue}
                  setCountValue={setCountValue}
                  handleSelectUpdate={handleSelectUpdate}
                  handleCreate={handleCreate}
                  options={options}
                  selectedOption={selectedOption}
                  selectedDate={selectedDate}
                  updateDays={updateDays}
                  setDays={setDays}
                  selectedOptionValue={selectedOptionValue}
                />
              </div>
            ) : (
              <div 
                className={`
                  transition-all duration-500 ease-in-out
                  ${isAnimating 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-full opacity-0'
                  }
                `}
              >
                <LogGoalInput 
                  options={options}
                  updateGoals={updateGoals}
                  selectedOptionValue={selectedOptionValue}
                  setSelectedOption={setSelectedOption}
                />
              </div>
            )}

            {currentStats ? (
              <div>
                <CurrentStats currentStats={currentStats}/>
              </div>
            ) : (
              <p>Select a habit to view statistics.</p>
            )}
          </div>

          <GoalProgressBar
              selectedOptionGoal={goals[selectedOptionValue]?.find(g => g.year === selectedDate.getFullYear())?.goal ?? 0}
              selectedOptionCount={currentStats ? currentStats.total : 0}
          />

          <div>
            <HeatMap
              screenWidth={screenWidth}
              selectedOption={selectedOption}
              days={days}
              selectedYear={selectedDate.getFullYear()}
              selectedMinValue={minMax.minValue}
              selectedMaxValue={minMax.maxValue}
            />
          </div>
        </div>

        <div className="flex justify-around h-[400px] space-x-4">
          <WeekdayChart weekdays={weekdaysData} />
          <SimpleLineChart days={days[selectedOptionValue]} />
        </div>
      </main>
    </div>
  );
}
