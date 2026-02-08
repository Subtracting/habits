import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { GoalData, GoalsState } from '@/types/goal.types';
import type { Option } from '@/types/option.types';
import { createOption } from '../utils/optionHelpers';

export function useGoalData(userId: string | null, setOptions: React.Dispatch<React.SetStateAction<Option[]>>) {
    const [goals, setGoals] = useState<GoalsState>({});

    /* initial goals-data load */ 
        useEffect(() => {
        if (!userId) return;

        const loadGoals = async () => {
            const { data: goalsData, error } = await supabase
            .from('goals')
            .select(`
                    id,
                    habit_id,
                    target_count,
                    end_date,
                    created_at,
                    habits (name)
                    `)
                    .eq('habits.user_id', userId);

                    if (error) {
                        console.error('Error loading goals:', error);
                        return;
                    }

                    // Transform to GoalsState format (array per habit)
                    const parsed: GoalsState = {};
                    goalsData?.forEach((goal: any) => {
                        const habitName = goal.habits.name;

                        if (!parsed[habitName]) {
                            parsed[habitName] = [];
                        }

                        parsed[habitName].push({
                            id: goal.id,
                            habit_id: goal.habit_id,
                            target_count: goal.target_count,
                            end_date: goal.end_date,
                            created_at: goal.created_at
                        });
                    });

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
        };

        loadGoals();
    }, [setOptions, userId]);

    const updateGoals = useCallback(async (
        endDate: Date, 
        targetCount: number, 
        selectedOptionValue: string
    ) => {
        if (!selectedOptionValue || !userId) return;

        const endDateStr = endDate.toISOString().split('T')[0];

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

        // Upsert goal
        const { data: upsertedGoal } = await supabase
        .from('goals')
        .upsert(
            {
                habit_id: habitId,
                end_date: endDateStr,
                target_count: targetCount
            },
            {
                onConflict: 'habit_id,end_date'
            }
        )
        .select()
        .single();

        // Update local state
        setGoals((prev) => {
            const habitGoals = prev[selectedOptionValue] || [];
            const existingIndex = habitGoals.findIndex(g => g.end_date === endDateStr);

            let updatedList: GoalData[];
            if (existingIndex >= 0) {
                // Update existing
                updatedList = habitGoals.map((g, i) =>
                                             i === existingIndex
                                                 ? {
                                                     id: upsertedGoal?.id || g.id,
                                                     habit_id: habitId!,
                                                     target_count: targetCount,
                                                     end_date: endDateStr,
                                                     created_at: upsertedGoal?.created_at || g.created_at
                                                 }
                                                     : g
                                            );
            } else {
                // Add new
                updatedList = [
                    ...habitGoals,
                    {
                        id: upsertedGoal?.id || '',
                        habit_id: habitId!,
                        target_count: targetCount,
                        end_date: endDateStr,
                        created_at: upsertedGoal?.created_at || new Date().toISOString()
                    }
                ];
            }

            return { ...prev, [selectedOptionValue]: updatedList };
        });
    }, [userId]);

    return { goals, updateGoals };
}
