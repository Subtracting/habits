'use client';

import { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';

import HeatMap from './components/HeatMap';
import InputSelect from './components/InputSelect';
import DeletePopup from './components/DeletePopup';
import HabitRadarChart from './components/HabitRadarChart';
import WeekdayChart from './components/WeekdayChart';

import type { Option } from '@/types/option.types';
import type { DaysState, DayData } from '@/types/days.types';
import type { WeekDaysData } from '@/types/weekdays.types';
import type { MonthData } from '@/types/months.types';

import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-dark.css';

const createOption = (label: string): Option => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

const defaultOptions = [
  createOption("movies"),
  createOption("books"),
  createOption("pages"),
];

const allMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const allWeekDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

/* helper functions */
const toLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const computeMinMax = (data: DayData[]) => {
  if (!data || data.length === 0) {
    return { minValue: 0, maxValue: 0 };
  }
  const counts = data.map((item) => item.count);
  return {
    minValue: Math.min(...counts),
    maxValue: Math.max(...counts),
  };
};

const calculateMonths = (habitDays: DayData[]): MonthData[] => {
  const monthData: MonthData[] = allMonths.map((month) => ({
    month,
    count: 0,
  }));

  if (!habitDays) return monthData;

  habitDays.forEach((dayData) => {
    const monthIndex = allMonths.indexOf(dayData.month);
    if (monthIndex >= 0) {
      monthData[monthIndex].count += dayData.count;
    }
  });

  return monthData;
};

const calculateWeekDays = (habitDays: DayData[]): WeekDaysData[] => {
    const weekDaysData: WeekDaysData[] = allWeekDays.map((weekday) => ({
        weekday,
        count: 0,
    }));

    if (!habitDays) return weekDaysData;

    habitDays.forEach((dayData) => {
        const weekDayIndex = allWeekDays.indexOf(dayData.weekday);
        if (weekDayIndex >= 0) {
            weekDaysData[weekDayIndex].count += dayData.count;
        }
    });

    return weekDaysData;
};

export default function Home() {
  const [options, setOptions] = useState<Option[]>(defaultOptions);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [countValue, setCountValue] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [days, setDays] = useState<DaysState>({});
  const [screenWidth, setScreenWidth] = useState<number>(0);

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

  /* calculations */
  const selectedOptionValue = selectedOption ? selectedOption.value : "";

  const { minValue, maxValue } = useMemo(() => {
    const data = days[selectedOptionValue] || [];
    return computeMinMax(data);
  }, [days, selectedOptionValue]);

  const monthsData = useMemo(() => {
    const data = days[selectedOptionValue] || [];
    return calculateMonths(data);
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
      const weekday = allWeekDays[(dateToUpdate.getDay() + 6) % allWeekDays.length];

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
      <main className="flex min-h-screen w-full flex-col py-16 px-16 text-white bg-black sm:items-start">
        <h1 className="text-6xl">habits.</h1>

        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => date && setSelectedDate(date)}
          className="bg-zinc-950 text-white rounded-md px-4 py-2 my-4"
          calendarClassName="react-datepicker"
        />

        <div className="cal-container">
          <InputSelect
            countValue={countValue}
            setCountValue={setCountValue}
            handleSelectUpdate={handleSelectUpdate}
            handleCreate={handleCreate}
            options={options}
            selectedOption={selectedOption}
          />

          <div>
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

          <HeatMap
            screenWidth={screenWidth}
            selectedOption={selectedOption}
            days={days}
            selectedMinValue={minValue}
            selectedMaxValue={maxValue}
          />
        </div>
        <div className="flex justify-around space-x-4">
            <WeekdayChart 
                weekdays={weekdaysData}
            />
            
            <HabitRadarChart 
                months={monthsData}
            />
        </div>
      </main>
    </div>
  );
}
