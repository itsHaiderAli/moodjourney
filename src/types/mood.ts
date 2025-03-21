
export interface MoodEntry {
  id?: string;
  date: string;
  mood: number;
  energy: number;
  note?: string;
  mood_name?: string;
  tags?: MoodTag[];
  created_at?: string; // Adding this field to fix ExportReports.tsx error
}

export interface MoodTag {
  id: string;
  name: string;
  category: TagCategory;
  user_id: string;
  created_at: string;
}

export type TagCategory = 
  | 'activity' 
  | 'person' 
  | 'location' 
  | 'weather' 
  | 'health' 
  | 'work' 
  | 'social' 
  | 'other';

export interface MoodGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_mood?: number;
  target_energy?: number;
  start_date: string;
  end_date?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  progress?: number;
}

export type MoodName = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'excited' 
  | 'calm'
  | 'anxious'
  | 'tired';
