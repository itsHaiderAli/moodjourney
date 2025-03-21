
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MoodEntry } from "@/types/mood";
import { format, parseISO, subDays } from "date-fns";
import { toast } from "sonner";

// Demo mood data
const demoMoodEntries: MoodEntry[] = [
  {
    id: "1",
    date: format(subDays(new Date(), 0), "MMM dd"),
    mood: 8,
    energy: 7,
    note: "Had a productive day at work",
    mood_name: "happy",
    tags: [{ id: "1", name: "work", category: "activity", user_id: "mock-user-id", created_at: new Date().toISOString() }]
  },
  {
    id: "2",
    date: format(subDays(new Date(), 1), "MMM dd"),
    mood: 6,
    energy: 5,
    note: "Rainy weather, stayed indoors",
    mood_name: "calm",
    tags: [{ id: "2", name: "weather", category: "weather", user_id: "mock-user-id", created_at: new Date().toISOString() }]
  },
  {
    id: "3",
    date: format(subDays(new Date(), 2), "MMM dd"),
    mood: 9,
    energy: 8,
    note: "Great workout and meditation session",
    mood_name: "excited",
    tags: [{ id: "3", name: "exercise", category: "activity", user_id: "mock-user-id", created_at: new Date().toISOString() }]
  },
];

export const useMoodData = () => {
  const { user } = useAuth();
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [averageMood, setAverageMood] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    try {
      setLoading(true);
      
      // Try to get stored mood entries from localStorage
      const storedEntries = localStorage.getItem("moodEntries");
      let entries = storedEntries ? JSON.parse(storedEntries) : demoMoodEntries;
      
      // First time, initialize with demo data and save to localStorage
      if (!storedEntries) {
        localStorage.setItem("moodEntries", JSON.stringify(demoMoodEntries));
      }
      
      setMoodHistory(entries);
      updateStats(entries);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      toast.error("Failed to load mood entries");
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (history: MoodEntry[]) => {
    if (history.length === 0) return;
    
    const avgMood = history.reduce((sum, entry) => sum + entry.mood, 0) / history.length;
    setAverageMood(Number(avgMood.toFixed(1)));
    setTotalEntries(history.length);
    setCurrentStreak(calculateStreak(history));
  };

  const calculateStreak = (history: MoodEntry[]) => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < history.length; i++) {
      if (i === 0 || history[i].date !== format(subDays(today, i), "MMM dd")) {
        break;
      }
      streak++;
    }
    return streak;
  };

  return {
    moodHistory,
    loading,
    averageMood,
    totalEntries,
    currentStreak,
    fetchMoodEntries
  };
};
