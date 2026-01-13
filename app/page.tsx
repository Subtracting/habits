'use client';

import { useState, useEffect, useMemo } from 'react';

import HeatMap from './components/HeatMap';
import WeekdayChart from './components/WeekdayChart';

import { allMonths, 
    allWeekDays, 
    toLocalDateString, 
    computeMinMax, 
    calculateWeekDays, 
    calculateHabitStats } from './utils/habitCalculations';

import type { StatsState } from '@/types/stats.types';
import type { Option } from '@/types/option.types';
import type { DaysState, DayData } from '@/types/days.types';

import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-dark.css';
import SimpleLineChart from './components/LineChart';
import CurrentStats from './components/CurrentStats';
import LogHabitInput from './components/LogHabitInput';

    const createOption = (label: string): Option => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    });

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
        const [days, setDays] = useState<DaysState>({});
        const [screenWidth, setScreenWidth] = useState<number>(0);
        const [stats, setStats] = useState<StatsState>({});
        // const [inputType, setInputType] = useState<string>("habits");


        const selectedOptionValue = selectedOption ? selectedOption.value : "";

        /* initial habits-data load */
        useEffect(() => {
            const savedDays = localStorage.getItem('habits-data');
            if (savedDays) {
                const parsed: DaysState = JSON.parse(savedDays);
                setDays(parsed);

                const savedOptions = Object.keys(parsed).map((key) => createOption(key));
                setOptions((prev) => {
                    const all = [...prev];
                    savedOptions.forEach((opt) => {
                        if (!all.some((o) => o.value === opt.value)) {
                            all.push(opt);
                        }
                    });
                    return all;
                });
            }

            const handleResize = () => setScreenWidth(window.innerWidth);
            handleResize(); 
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }, []);

        useEffect(() => {
            const daysDataForOption = days[selectedOptionValue]?.filter(day => day.year === selectedDate.getFullYear()) ?? [];

            if (daysDataForOption) {
                const newStats = calculateHabitStats(daysDataForOption);
                setStats(prevStats => ({
                    ...prevStats,
                    [selectedOptionValue]: newStats,
                }));
            } else if (selectedOptionValue && days[selectedOptionValue] === undefined) {
                setStats(prevStats => {
                    const updatedStats = { ...prevStats };
                    delete updatedStats[selectedOptionValue];
                    return updatedStats;
                });
            }
        }, [days, selectedDate, selectedOptionValue]); 

        const currentStats = stats[selectedOptionValue];

        /* calculations */
        const { minValue, maxValue } = useMemo(() => {
            const data = days[selectedOptionValue] || [];
            return computeMinMax(data);
        }, [days, selectedOptionValue]);

        const weekdaysData = useMemo(() => {
            const data = days[selectedOptionValue] || [];
            return calculateWeekDays(data);
        }, [days, selectedOptionValue]);

        /* update habits-data with new date */
        const updateDays = (dateToUpdate: Date, count: number) => {
            if (!selectedOptionValue) return;

            setDays((prev) => {
                const habitDays = prev[selectedOptionValue] || [];
                const dateStr = toLocalDateString(dateToUpdate);

                const year = dateToUpdate.getFullYear();
                const month = allMonths[dateToUpdate.getMonth()];
                const weekday = (dateToUpdate.getDay() + 6) % allWeekDays.length;

                const existingIndex = habitDays.findIndex((d) => d.date === dateStr);

                let updatedList: DayData[];

                if (existingIndex >= 0) {
                    updatedList = habitDays.map((d, i) =>
                                                i === existingIndex
                                                    ? { ...d, year, month, weekday, count: d.count + count }
                                                    : d
                                               );
                } else {
                    updatedList = [
                        ...habitDays,
                        { date: dateStr, year, month, weekday, count: count },
                    ];
                }

                const newDaysState = { ...prev, [selectedOptionValue]: updatedList };
                localStorage.setItem('habits-data', JSON.stringify(newDaysState));

                return newDaysState;
            });
        };

        /* handlers */
        const handleCreate = (inputValue: string) => {
            const newOption = createOption(inputValue);
            setOptions((prev) => [...prev, newOption]);
            setSelectedOption(newOption);
        };

        const handleSelectUpdate = (newSelectedOption: Option | null) => {
            setSelectedOption(newSelectedOption);
        };

        //
        // const handleInputTypeSelect = () => {
        //
        // };

  return (
    <div className="flex min-h-screen items-center justify-center font-mono bg-black">
      <main className="flex min-h-screen flex-col py-16 px-16  text-white bg-black sm:items-start">
        <h1 className="text-6xl">habits.</h1>


        <div className="cal-container">
          <div className='flex justify-between py-4'>
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
                selectedMinValue={minValue}
                selectedMaxValue={maxValue}
              />
            </div>
        </div>

        <div className="flex justify-around h-[400px] space-x-4">
            <WeekdayChart 
                weekdays={weekdaysData}
            />
            <SimpleLineChart days={days[selectedOptionValue]}/>
        </div>
      </main>
    </div>
  );
}
