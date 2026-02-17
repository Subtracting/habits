'use client';

import { useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';

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
import Menu from './components/Menu';
import Auth from './components/Auth';

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
    const [inputType, setInputType] = useState<'habits' | 'goals'>("habits");

    const [user, setUser] = useState<User | null>(null);

    const selectedOptionValue = selectedOption?.value ?? "";

    /* custom hooks */
    const { goals, updateGoals } = useGoalData(user ? user.id : null, setOptions);
    const { days, setDays, updateDays } = useHabitData(user ? user.id : null, setOptions);
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

    const handleUserChange = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

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
      <Auth onUserChange={handleUserChange} />
      <main className="flex min-h-screen flex-col py-8 px-4 sm:py-16 sm:px-16 text-white bg-black w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl sm:text-6xl">{inputType}.</h1>
          <div className="flex">
            <Menu inputType={inputType} setInputType={setInputType} user={user}/>
          </div>
        </div>
        <div className="cal-container w-full overflow-x-auto">
          <div className='flex flex-col sm:flex-row justify-between py-4 gap-4'>
            {inputType === 'habits' ? (
              <div className={`transition-all duration-500 ease-in-out ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
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
              <div className={`transition-all duration-500 ease-in-out ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                <LogGoalInput
                  options={options}
                  updateGoals={updateGoals}
                  selectedOptionValue={selectedOptionValue}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                />
              </div>
            )}
            {currentStats ? (
              <div>
                <CurrentStats currentStats={currentStats}/>
              </div>
            ) : (
              <p className="text-sm sm:text-base">Select a habit to view statistics.</p>
            )}
          </div>
          <GoalProgressBar
            selectedOptionGoal={
              goals[selectedOptionValue]?.find(g =>
                new Date(g.end_date).getFullYear() === selectedDate.getFullYear()
              )?.target_count ?? 0
            }
            selectedOptionCount={currentStats ? currentStats.total : 0}
          />
          <div className="overflow-x-auto">
            <div style={{ minWidth: '700px' }} className='min-w-max'>
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
        </div>
        <div className="flex flex-col sm:flex-row justify-around w-full sm:h-[400px] gap-4 mt-4">
          <WeekdayChart weekdays={weekdaysData} />
          <SimpleLineChart days={days[selectedOptionValue]} />
        </div>
      </main>
    </div>
  );
}
