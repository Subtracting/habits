export interface DayData {
    date: string;
    count: number;
}

export interface DaysState {
    [key: string]: DayData[];
}


