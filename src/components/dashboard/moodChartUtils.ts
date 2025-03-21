
import { MoodEntry } from "@/types/mood";

export const getFilteredMoodData = (
  moodHistory: MoodEntry[], 
  timeRange: 'all' | '7days' | '30days' | '90days'
): MoodEntry[] => {
  if (timeRange === 'all') return moodHistory;
  
  const now = new Date();
  let daysToSubtract;
  
  switch (timeRange) {
    case '7days':
      daysToSubtract = 7;
      break;
    case '30days':
      daysToSubtract = 30;
      break;
    case '90days':
      daysToSubtract = 90;
      break;
    default:
      daysToSubtract = 7;
  }
  
  const cutoffDate = new Date(now);
  cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract);
  
  return moodHistory.filter(entry => {
    const entryDate = entry.created_at 
      ? new Date(entry.created_at) 
      : new Date(); // Fallback to current date if no created_at
    return entryDate >= cutoffDate;
  });
};
