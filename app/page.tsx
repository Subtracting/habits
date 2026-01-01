'use client';

import { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';

import HeatMap from './components/HeatMap';
import InputSelect from './components/InputSelect';
import DeletePopup from './components/DeletePopup';
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
    // import { GoalState } from '@/types/goal.types';

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
        const [selectedYear, setSelectedYear] = useState<number>(2026);
        const [screenWidth, setScreenWidth] = useState<number>(0);

        const [stats, setStats] = useState<StatsState>({});

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
            const daysDataForOption = days[selectedOptionValue];

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
        }, [days, selectedOptionValue]); 

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

  return (
    <div className="flex min-h-screen items-center justify-center font-mono bg-black">
      <main className="flex min-h-screen flex-col py-16 px-16  text-white bg-black sm:items-start">
        <h1 className="text-6xl">habits.</h1>


        <div className="cal-container">
          <div className='flex justify-between py-4'>
            <div>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => date && setSelectedDate(date)}
                className="bg-zinc-950 text-white rounded-md px-4 py-2 my-4"
                calendarClassName="react-datepicker"
              />
                <InputSelect
                    countValue={countValue}
                    setCountValue={setCountValue}
                    handleSelectUpdate={handleSelectUpdate}
                    handleCreate={handleCreate}
                    options={options}
                    selectedOption={selectedOption}
                />

              <div className='flex'>
                <button
                  onClick={() => updateDays(selectedDate, countValue)}
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
                  submit
                </button>
                <DeletePopup
                  setDays={setDays}
                  selectedOptionValue={selectedOptionValue}
                />
              </div>
             </div>


              {currentStats ? (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th align='left'>Statistic</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Count</td>
                                <td>{currentStats.total}</td>
                            </tr>
                            <tr>
                                <td>Max Daily Count&nbsp;</td>
                                <td>{currentStats.max}</td>
                            </tr>
                            <tr>
                                <td>Min Daily Count</td>
                                <td>{currentStats.min}</td>
                            </tr>
                            <tr>
                                <td>Current Streak</td>
                                <td>{currentStats.streak}</td>
                            </tr>
                            <tr>
                                <td>7-Day Total</td>
                                <td>{currentStats.weekTotal}</td>
                            </tr>
                            <tr>
                                <td>Month Total</td>
                                <td>{currentStats.monthTotal}</td>
                            </tr>
                        </tbody>
                    </table>
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
