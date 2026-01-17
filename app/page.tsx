'use client';

import { useState } from 'react';

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
    const { days, setDays, updateDays } = useHabitData(setOptions);
    const stats = useHabitStats(days, selectedOptionValue, selectedDate);
    const { minMax, weekdaysData } = useHabitCalculations(days, selectedOptionValue);
    const screenWidth = useScreenWidth();

    const currentStats = stats[selectedOptionValue];

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

    return (
    <div className="flex min-h-screen items-center justify-center font-mono bg-black">
      <main className="flex min-h-screen flex-col py-16 px-16 text-white bg-black sm:items-start">
        <h1 className="text-6xl">{inputType}.</h1>
        <button onClick={handleInputTypeSelect}>huh</button>

        <div className="cal-container">
          <div className='flex justify-between py-4'>
            {inputType === 'habits' ? (
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
            ) : (
              <LogGoalInput 
                options={options}
                setGoals={setGoals}
              />
            )}

            {currentStats ? (
              <div>
                <CurrentStats currentStats={currentStats}/>
              </div>
            ) : (
              <p>Select a habit to view statistics.</p>
            )}
          </div>

          <div className="relative">
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
