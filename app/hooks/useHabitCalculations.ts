import { useMemo } from 'react';
import { computeMinMax, calculateWeekDays } from '../utils/habitCalculations';
import type { DaysState } from '@/types/days.types';

export function useHabitCalculations(days: DaysState, selectedOptionValue: string) {
    const minMax = useMemo(() => {
        const data = days[selectedOptionValue] || [];
        return computeMinMax(data);
    }, [days, selectedOptionValue]);

    const weekdaysData = useMemo(() => {
        const data = days[selectedOptionValue] || [];
        return calculateWeekDays(data);
    }, [days, selectedOptionValue]);

    return { minMax, weekdaysData };
}
