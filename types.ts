export type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type Category = 'Physical' | 'Academic' | 'Coding' | 'Creative' | 'Rest' | 'Logistics';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface ScheduleSlot {
  id: string;
  timeRange: string;
  title: string;
  description?: string;
  category: Category;
  isCompleted: boolean;
  notes?: string; // Extra strategy notes from PDF
}

export interface WeekSchedule {
  [key: string]: ScheduleSlot[];
}

export interface AppState {
  schedule: WeekSchedule;
  lastReset: string; // ISO Date string
}