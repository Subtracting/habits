import { useState, useEffect, useCallback } from 'react';
import { toLocalDateString, allMonths, allWeekDays } from '../utils/habitCalculations';
import type { DaysState, DayData } from '@/types/days.types';
import type { Option } from '@/types/option.types';
import { createOption } from '../utils/optionHelpers';

export function useHabitData(setOptions: React.Dispatch<React.SetStateAction<Option[]>>) {
    const [days, setDays] = useState<DaysState>({});

    /* initial habits-data load */ 
    useEffect(() => {
        const savedDays = localStorage.getItem('habits-data');
        if (!savedDays) return;

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
    }, [setOptions]);

    const updateDays = useCallback((dateToUpdate: Date, count: number, selectedOptionValue: string) => {
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
                    { date: dateStr, year, month, weekday, count },
                ];
            }

            const newDaysState = { ...prev, [selectedOptionValue]: updatedList };
            localStorage.setItem('habits-data', JSON.stringify(newDaysState));

            return newDaysState;
        });
    }, []);

    return { days, setDays, updateDays };
}

