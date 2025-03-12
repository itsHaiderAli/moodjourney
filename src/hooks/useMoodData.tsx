
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MoodEntry } from "@/types/mood";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, subDays } from "date-fns";
import { toast } from "sonner";

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
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch tags for each mood entry
      const entryIds = data.map(entry => entry.id);
      
      const { data: tagRelations, error: tagRelError } = await supabase
        .from('mood_entry_tags')
        .select('mood_entry_id, tag_id')
        .in('mood_entry_id', entryIds);
        
      if (tagRelError) throw tagRelError;
      
      const tagIds = tagRelations.map(rel => rel.tag_id);
      
      const { data: tags, error: tagsError } = await supabase
        .from('mood_tags')
        .select('*')
        .in('id', tagIds);
        
      if (tagsError) throw tagsError;

      // Add tags to each entry
      const entriesWithTags = data.map(entry => {
        const entryTagIds = tagRelations
          .filter(rel => rel.mood_entry_id === entry.id)
          .map(rel => rel.tag_id);
          
        const entryTags = tags.filter(tag => entryTagIds.includes(tag.id));
        
        return {
          id: entry.id,
          date: format(parseISO(entry.created_at), "MMM dd"),
          mood: entry.intensity,
          energy: entry.energy,
          note: entry.note,
          mood_name: entry.mood,
          tags: entryTags
        };
      });

      setMoodHistory(entriesWithTags);
      updateStats(entriesWithTags);
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
