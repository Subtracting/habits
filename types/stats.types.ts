export interface HabitStats {
    total: number;
    max: number;
    min: number;
    streak: number;
    weekTotal: number;
    monthTotal: number;
}

export interface StatsState {
    [key: string]: HabitStats;
}

