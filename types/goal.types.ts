export interface GoalData {
    year: number;
    goal: number;
}

export interface GoalsState {
    [key: string]: GoalData[];
}


