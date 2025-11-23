export interface DayData {
    date: string;
    year: number;
    month: string;
    weekday: number;
    count: number;
}

export interface DaysState {
    [key: string]: DayData[];
}


