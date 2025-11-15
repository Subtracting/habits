'use client';

import { useState, useEffect } from 'react';

import DatePicker from 'react-datepicker';
import HeatMap from './components/HeatMap';
import InputSelect from './components/InputSelect';

import type { Option } from '@/types/option.types';
import type { DaysState, DayData } from '@/types/days.types';

import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-dark.css';
import DeletePopup from './components/DeletePopup';
import HabitRadarChart from './components/HabitRadarChart';
import { MonthData, MonthState } from '@/types/months.types';

const createOption = (label: string) => ({
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
  const [selectedMinValue, setSelectedMinValue] = useState<number>(0);
  const [selectedMaxValue, setSelectedMaxValue] = useState<number>(0);

  const [countValue, setCountValue] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [days, setDays] = useState<DaysState>({});
  const [months, setMonths] = useState<MonthState>({});

  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
      const savedDays = localStorage.getItem('habits-data');
      if (savedDays) {
        const parsed: DaysState = JSON.parse(savedDays);
        setDays(parsed);
        const savedOptions = Object.keys(parsed).map(key => createOption(key));
        setOptions(prev => {
          const all = [...prev];
          savedOptions.forEach(opt => {
            if (!all.some(o => o.value === opt.value)) {
              all.push(opt);
            }
          });
          return all;
        });
      };
      const savedMonths = localStorage.getItem('months-data');
      if (savedMonths) {
        const parsed: MonthState = JSON.parse(savedMonths);
        setMonths(parsed);
        const savedOptions = Object.keys(parsed).map(key => createOption(key));
        setOptions(prev => {
          const all = [...prev];
          savedOptions.forEach(opt => {
            if (!all.some(o => o.value === opt.value)) {
              all.push(opt);
            }
          });
          return all;
        });
      };

      const handleResize = () => setScreenWidth(window.innerWidth);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
          window.removeEventListener('resize', handleResize);
      }
  }, []);

  const handleCreate = (inputValue: string) => {
      const newOption = createOption(inputValue);
      setOptions((prev) => [...prev, newOption]);
      setSelectedOption(newOption);
  };

  const computeMinMax = (newSelectedOption: string) => {
      const selectedKey = newSelectedOption ? newSelectedOption : "";

      if (!days[selectedKey] || days[selectedKey].length === 0) {
          return { minValue: 0, maxValue: 0 };
      }
      const minValue = Math.min(...days[selectedKey].map((item: DayData) => item.count));
      const maxValue = Math.max(...days[selectedKey].map((item: DayData) => item.count));
    return { minValue, maxValue };
  };

const calculateMonthsFromDays = (daysState: Record<string, DayData[]>, habitId: string): MonthData[] => {
  const habitDays = daysState[habitId] || [];
  
  const allMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthData: MonthData[] = allMonths.map(month => ({
    month,
    count: 0
  }));
  
  habitDays.forEach((dayData: DayData) => {
    const date = new Date(dayData.date);
    const monthIndex = date.getMonth(); // 0-11
    monthData[monthIndex].count += dayData.count;
  });
  
  return monthData;
};

const updateDays = (selectedDate: Date, countValue: number) => {
  setDays(prev => {
    const selectedOptionValue = selectedOption ? selectedOption.value : "";
    const habitDays = prev[selectedOptionValue] || [];
    const dateStr = selectedDate.toISOString().split('T')[0]; // '2025-11-01'
    const existingIndex = habitDays.findIndex((d: DayData) => d.date === dateStr);
    
    const updated = existingIndex >= 0
      ? habitDays.map((d: DayData, i: number) => 
          i === existingIndex ? { ...d, count: d.count + countValue } : d
        )
      : [...habitDays, { date: dateStr, count: countValue }];
    const daysState = { ...prev, [selectedOptionValue]: updated };
      
    const { minValue, maxValue } = computeMinMax(selectedOptionValue); 
    setSelectedMinValue(minValue);
    setSelectedMaxValue(maxValue);
    
    // Calculate month state from days state
    const monthsData = calculateMonthsFromDays(daysState, selectedOptionValue);
    const monthState = { ...months, [selectedOptionValue]: monthsData };
    setMonths(monthState);
    
    localStorage.setItem('habits-data', JSON.stringify(daysState));
    localStorage.setItem('months-data', JSON.stringify(monthState));
    return daysState;
  });
};

  const handleSelectUpdate = (newSelectedOption: Option | null) => {
      setSelectedOption(newSelectedOption);
    
      const { minValue, maxValue } = computeMinMax(newSelectedOption ? newSelectedOption.value : "");

      setSelectedMinValue(minValue);
      setSelectedMaxValue(maxValue);

  };

  return (
    <div className="flex min-h-screen items-center justify-center font-mono bg-black">
      <main className="flex min-h-screen w-full flex-col py-16 px-16 text-white bg-black sm:items-start">
        <h1 className='text-6xl'>habits.</h1>
          
        <DatePicker 
            selected={selectedDate} 
            onChange={(date: Date | null) => date && setSelectedDate(date)} 
            className='bg-zinc-950 text-white rounded-md px-4 py-2 my-4'
            calendarClassName='react-datepicker'
        />

        <div className='cal-container'>
            <InputSelect
               countValue={countValue}
               setCountValue={setCountValue}
               handleSelectUpdate={handleSelectUpdate}
               handleCreate={handleCreate}
               options={options}
               selectedOption={selectedOption}
               >
            </InputSelect>
              
            <div>
              <button 
                onClick={() => updateDays(selectedDate, countValue)}
                className='my-4 bg-black hover:bg-zinc-950 text-zinc-100 hover:text-zinc-100 border-zinc-900 hover:border-zinc-700 border-2 px-4 py-1 rounded'
              >
                submit 
              </button>
              <DeletePopup
                setDays={setDays}
                selectedOptionValue={selectedOption ? selectedOption.value : ""}
                ></DeletePopup>
            </div>
            <HeatMap 
                screenWidth={screenWidth}
                selectedOption={selectedOption}
                days={days}
                selectedMinValue={selectedMinValue}
                selectedMaxValue={selectedMaxValue}
                >
            </HeatMap>
        </div>
            <HabitRadarChart months={months} selectedOption={selectedOption}></HabitRadarChart>
      </main>
    </div>
  );
}
