export type GoalData = {
    id: string;
    habit_id: string;
    target_count: number;
    goal_year: number;
    period_type: 'week' | 'month' | 'year';
    created_at: string;
};

export interface GoalsState {
  [habitName: string]: GoalData[]; 
}
