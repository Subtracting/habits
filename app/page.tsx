'use client';

import { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar-heatmap/dist/styles.css';
import './datepicker-dark.css';

interface DayData {
  date: string;
  count: number;
}

interface DaysState {
  [key: string]: DayData[];
}

export default function Home() {
  const [options, setOptions] = useState<string[]>(["movies", "pages", "books"]);
  const [selectedOption, setSelectedOption] = useState<string>("movies");
  
  const [countValue, setCountValue] = useState<number>(1);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [days, setDays] = useState<DaysState>({
    "movies": [],
    "pages": [],
    "books": []
  });

  useEffect(() => {
      const saved = localStorage.getItem('habits-data');
    if (saved) {
      setDays(JSON.parse(saved));
    }
  }, []);

  const updateDays = (selectedOption: string, selectedDate: Date, countValue: number) => {
    setDays(prev => {
      const habitDays = prev[selectedOption] || [];
      const dateStr = selectedDate.toISOString().split('T')[0]; // '2025-11-01'
      const existingIndex = habitDays.findIndex((d: DayData) => d.date === dateStr);
      
      const updated = existingIndex >= 0
        ? habitDays.map((d: DayData, i: number) => 
            i === existingIndex ? { ...d, count: d.count + countValue } : d
          )
        : [...habitDays, { date: dateStr, count: countValue }];
      
      const newState = { ...prev, [selectedOption]: updated };
      
      localStorage.setItem('habits-data', JSON.stringify(newState));
      
      return newState;
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-mono dark:bg-black">
      <main className="flex min-h-screen w-full flex-col py-16 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className='text-6xl'>habits.</h1>
          
        <DatePicker 
            selected={selectedDate} 
            onChange={(date: Date | null) => date && setSelectedDate(date)} 
            className='bg-zinc-950 text-white rounded-md px-4 py-2 my-4'
            calendarClassName='react-datepicker'
        />

        <div className='cal-container'>
        <div>

          <input 
            type='number' 
            value={countValue}
            onChange={(e) => setCountValue(Number(e.target.value))} 
            className='w-16 my-4 bg-zinc-950 text-zinc-100 bborder-2 px-4 py-1 mr-4 rounded'
          />

          <select 
            value={selectedOption} 
            onChange={(e) => setSelectedOption(e.target.value)}
            className='my-4 bg-black px-4 py-2 mr-4 '
          >
            {options.map((value) => ( 
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          
        </div>
          
        <div>
          <button 
            onClick={() => updateDays(selectedOption, selectedDate, countValue)}
            className='my-4 bg-black text-zinc-100 border-zinc-900 border-2 px-4 py-1 rounded'
          >
            submit 
          </button>
        </div>
          
          <CalendarHeatmap
            startDate={new Date('2025-01-01')}
            endDate={new Date('2025-12-31')}
            values={days[selectedOption] || []}
            onClick={(value: DayData | undefined) => { 
              if (value) {
                alert(`Date: ${value.date}, Count: ${value.count}`);
              }
            }}
            classForValue={(value: DayData | undefined) => {
              if (!value || value.count === 0) {
                return 'color-empty';
              }
              return `color-scale-${Math.min(value.count, 10)}`;
            }}
          />
        </div>
      </main>
    </div>
  );
}
