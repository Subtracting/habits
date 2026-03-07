import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { GoalData, GoalsState } from '@/types/goal.types';
import type { Option } from '@/types/option.types';
import { createOption } from '../utils/optionHelpers';

export type PeriodType = 'week' | 'month' | 'year';

export function useGoalData(userId: string | null, setOptions: React.Dispatch<React.SetStateAction<Option[]>>) {
    const [goals, setGoals] = useState<GoalsState>({});

    useEffect(() => {
        if (!userId) return;

        const loadGoals = async () => {
            const { data: goalsData, error } = await supabase
                .from('goals')
                .select(`
                    id,
                    habit_id,
                    target_count,
                    goal_year,
                    period_type,
                    created_at,
                    habits!inner (name, user_id)
                `)
                .eq('habits.user_id', userId);

            if (error) {
                console.error('Error loading goals:', error);
                return;
            }

            const parsed: GoalsState = {};
            goalsData?.forEach((goal: any) => {
                const habitName = goal.habits.name;
                if (!parsed[habitName]) parsed[habitName] = [];
                parsed[habitName].push({
                    id: goal.id,
                    habit_id: goal.habit_id,
                    target_count: goal.target_count,
                    goal_year: goal.goal_year,
                    period_type: goal.period_type,
                    created_at: goal.created_at,
                });
            });

            setGoals(parsed);

            const savedOptions = Object.keys(parsed).map(key => createOption(key));
            setOptions(prev => {
                const all = [...prev];
                savedOptions.forEach(opt => {
                    if (!all.some(o => o.value === opt.value)) all.push(opt);
                });
                return all;
            });
        };

        loadGoals();
    }, [setOptions, userId]);

    const updateGoals = useCallback(async (
        targetCount: number,
        habitName: string,
        periodType: PeriodType,
        goalYear: number = new Date().getFullYear()
    ) => {
        if (!habitName || !userId) return;

        // Get or create habit
        const { data: habit } = await supabase
            .from('habits')
            .select('id')
            .eq('user_id', userId)
            .eq('name', habitName)
            .maybeSingle();

        let habitId = habit?.id;

        if (!habitId) {
            const { data: newHabit, error } = await supabase
                .from('habits')
                .insert({ user_id: userId, name: habitName })
                .select('id')
                .single();

            if (error || !newHabit) {
                console.error('Failed to create habit:', error);
                return;
            }
            habitId = newHabit.id;
        }

        const { data: upsertedGoal, error: upsertError } = await supabase
            .from('goals')
            .upsert(
                { habit_id: habitId, goal_year: goalYear, period_type: periodType, target_count: targetCount },
                { onConflict: 'habit_id,goal_year,period_type' }
            )
            .select()
            .single();

        if (upsertError) {
            console.error('Failed to upsert goal:', upsertError);
            return;
        }

        setGoals(prev => {
            const habitGoals = prev[habitName] || [];
            const existingIndex = habitGoals.findIndex(
                g => g.goal_year === goalYear && g.period_type === periodType
            );

            const newEntry: GoalData = {
                id: upsertedGoal?.id || '',
                habit_id: habitId!,
                target_count: targetCount,
                goal_year: goalYear,
                period_type: periodType,
                created_at: upsertedGoal?.created_at || new Date().toISOString(),
            };

            const updatedList = existingIndex >= 0
                ? habitGoals.map((g, i) => i === existingIndex ? newEntry : g)
                : [...habitGoals, newEntry];

            return { ...prev, [habitName]: updatedList };
        });
    }, [userId]);

    const deleteGoal = useCallback(async (
        habitName: string,
        periodType: PeriodType,
        goalYear: number = new Date().getFullYear()
    ) => {
        if (!habitName || !userId) return;

        const goalToDelete = goals[habitName]?.find(
            g => g.goal_year === goalYear && g.period_type === periodType
        );
        if (!goalToDelete) return;

        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', goalToDelete.id);

        if (error) {
            console.error('Failed to delete goal:', error);
            return;
        }

        setGoals(prev => {
            const updated = (prev[habitName] || []).filter(
                g => !(g.goal_year === goalYear && g.period_type === periodType)
            );
            if (updated.length === 0) {
                const next = { ...prev };
                delete next[habitName];
                return next;
            }
            return { ...prev, [habitName]: updated };
        });
    }, [userId, goals]);

    return { goals, updateGoals, deleteGoal };
}
