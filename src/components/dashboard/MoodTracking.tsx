
import MoodTracker from "./MoodTracker";
import MoodChart from "./MoodChart";
import MoodStats from "./MoodStats";
import { useMoodData } from "@/hooks/useMoodData";

const MoodTracking = () => {
  const { 
    moodHistory, 
    loading, 
    averageMood, 
    totalEntries, 
    currentStreak,
    fetchMoodEntries 
  } = useMoodData();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <MoodTracker onSubmitSuccess={fetchMoodEntries} />

      <div className="space-y-6">
        <MoodChart moodHistory={moodHistory} loading={loading} />
        <MoodStats 
          averageMood={averageMood} 
          totalEntries={totalEntries} 
          currentStreak={currentStreak} 
        />
      </div>
    </div>
  );
};

export default MoodTracking;
