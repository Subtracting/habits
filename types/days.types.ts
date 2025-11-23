export interface DayData {
    date: string;
    year: number;
    month: string;
    weekday: string;
    count: number;
}

export interface DaysState {
    [key: string]: DayData[];
}


