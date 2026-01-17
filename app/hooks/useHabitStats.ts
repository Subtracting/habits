import { useState, useEffect } from 'react';
import { calculateHabitStats } from '../utils/habitCalculations';
import type { DaysState } from '@/types/days.types';
import type { StatsState } from '@/types/stats.types';

export function useHabitStats(
    days: DaysState,
    selectedOptionValue: string,
    selectedDate: Date
) {
    const [stats, setStats] = useState<StatsState>({});

    useEffect(() => {
        const daysDataForOption = days[selectedOptionValue]?.filter(
            day => day.year === selectedDate.getFullYear()
        ) ?? [];

        if (daysDataForOption.length > 0) {
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
    }, [days, selectedDate, selectedOptionValue]);

    return stats;
}

