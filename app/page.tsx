'use client';

import { useState, useEffect } from 'react';

import CreatableSelect from 'react-select/creatable';
import CalendarHeatmap from 'react-calendar-heatmap';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar-heatmap/dist/styles.css';
import './datepicker-dark.css';

interface Option {
    readonly label: string;
    readonly value: string;
}

interface DayData {
    date: string;
    count: number;
}

interface DaysState {
    [key: string]: DayData[];
}

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
  const [options, setOptions] = useState(defaultOptions);
  const [selectedOption, setSelectedOption] = useState<Option | null>();
  const [countValue, setCountValue] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [days, setDays] = useState<DaysState>({});

  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
      const saved = localStorage.getItem('habits-data');
      if (saved) {
        const parsed: DaysState = JSON.parse(saved);
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

      const handleResize = () => setScreenWidth(window.innerWidth);

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
        <div className='flex'>

          <input 
            type='number' 
            value={countValue}
            onChange={(e) => setCountValue(Number(e.target.value))} 
            className='w-16 my-4 bg-zinc-950 text-zinc-100 bborder-2 px-4 py-1 mr-4 rounded'
            />

        <CreatableSelect
            isClearable
            onChange={(newValue) => setSelectedOption(newValue)}
            onCreateOption={handleCreate}
            options={options}
            value={selectedOption}
            placeholder="Add habit..."
            className="my-4 mr-4"
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
          
        <div>
          <button 
            onClick={() => updateDays(selectedOption ? selectedOption.value : "", selectedDate, countValue)}
            className='my-4 bg-black text-zinc-100 border-zinc-900 border-2 px-4 py-1 rounded'
          >
            submit 
          </button>
        </div>
          
          <CalendarHeatmap
            horizontal={screenWidth > 786 || screenWidth == 0}
            startDate={new Date('2025-01-01')}
            endDate={new Date('2025-12-31')}
            values={selectedOption ? days[selectedOption.value] || [] : []}
            onClick={(value) => { 
              if (value) {
                alert(`Date: ${value.date}, Count: ${value.count}`);
              }
            }}
            classForValue={(value) => {
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
