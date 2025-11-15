export interface MonthData {
    month: string;
    count: number;
}

export interface MonthState {
    [key: string]: MonthData[];
}


