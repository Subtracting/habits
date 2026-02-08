export interface GoalData {
  id: string;
  habit_id: string;
  target_count: number;
  end_date: string; 
  created_at: string;
}

export interface GoalsState {
  [habitName: string]: GoalData[]; 
}
