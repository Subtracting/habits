import { useState, useEffect, useCallback } from 'react';
import type { GoalsState, GoalData } from '@/types/goal.types';
import type { Option } from '@/types/option.types';
import { createOption } from '../utils/optionHelpers';

export function useGoalData(setOptions: React.Dispatch<React.SetStateAction<Option[]>>) {
    const [goals, setGoals] = useState<GoalsState>({});

    /* initial goals-data load */ 
    useEffect(() => {
        const savedGoals = localStorage.getItem('goals-data');
        if (!savedGoals) return;

        const parsed: GoalsState = JSON.parse(savedGoals);
        setGoals(parsed);

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

    const updateGoals = useCallback((yearToUpdate: Date, count: number, selectedOptionValue: string) => {
        if (!selectedOptionValue) return;

        setGoals((prev) => {
            const habitGoals = prev[selectedOptionValue] || [];

            const year = yearToUpdate.getFullYear();
            const existingIndex = habitGoals.findIndex((d) => d.year === year);

            let updatedList: GoalData[];

            if (existingIndex >= 0) {
                updatedList = habitGoals.map((d, i) =>
                                            i === existingIndex
                                                ? { ...d, year, goal: count }
                                                : d
                                           );
            } else {
                updatedList = [
                    ...habitGoals,
                    { year, goal: count },
                ];
            }

            const newGoalsState = { ...prev, [selectedOptionValue]: updatedList };
            localStorage.setItem('goals-data', JSON.stringify(newGoalsState));

            return newGoalsState;
        });
    }, []);

    return { goals, updateGoals };
}

