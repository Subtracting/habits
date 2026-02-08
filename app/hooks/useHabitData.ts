import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toLocalDateString, allMonths, allWeekDays } from '../utils/habitCalculations';
import type { DaysState, DayData } from '@/types/days.types';
import type { Option } from '@/types/option.types';
import { createOption } from '../utils/optionHelpers';

export function useHabitData(userId: string | null, setOptions: React.Dispatch<React.SetStateAction<Option[]>>) {
    const [days, setDays] = useState<DaysState>({});
    
    /* initial habits-data load */ 
    useEffect(() => {
        if (!userId) return;

        const loadHabits = async () => {
            const { data: activities, error } = await supabase
                .from('activities')
                .select(`
                    id,
                    date,
                    value,
                    habits (name)
                `)
                .eq('habits.user_id', userId);

            if (error) {
                console.error('Error loading habits:', error);
                return;
            }

            const parsed: DaysState = {};
            activities?.forEach((activity: any) => {
                const habitName = activity.habits.name;
                const dateObj = new Date(activity.date);
                const dateStr = toLocalDateString(dateObj);
                const year = dateObj.getFullYear();
                const month = allMonths[dateObj.getMonth()];
                const weekday = (dateObj.getDay() + 6) % allWeekDays.length;

                if (!parsed[habitName]) {
                    parsed[habitName] = [];
                }

                parsed[habitName].push({
                    date: dateStr,
                    year,
                    month,
                    weekday,
                    count: activity.value
                });
            });

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
        };

        loadHabits();
    }, [setOptions, userId]);

    const updateDays = useCallback(async (dateToUpdate: Date, count: number, selectedOptionValue: string) => {
        if (!selectedOptionValue || !userId) return;

        const dateStr = toLocalDateString(dateToUpdate);
        const year = dateToUpdate.getFullYear();
        const month = allMonths[dateToUpdate.getMonth()];
        const weekday = (dateToUpdate.getDay() + 6) % allWeekDays.length;

        // Get or create habit
        const { data: habit } = await supabase
            .from('habits')
            .select('id')
            .eq('user_id', userId)
            .eq('name', selectedOptionValue)
            .single();

        let habitId = habit?.id;

        if (!habitId) {
            const { data: newHabit } = await supabase
                .from('habits')
                .insert({ user_id: userId, name: selectedOptionValue })
                .select('id')
                .single();
            habitId = newHabit?.id;
        }

        await supabase
        .from('activities')
        .upsert({
            habit_id: habitId,
            date: dateStr,
            value: count
        }, {
            onConflict: 'habit_id,date',
            ignoreDuplicates: false
        });

        setDays((prev) => {
            const habitDays = prev[selectedOptionValue] || [];
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

            return { ...prev, [selectedOptionValue]: updatedList };
        });
    }, [userId]);

    return { days, setDays, updateDays };
}
