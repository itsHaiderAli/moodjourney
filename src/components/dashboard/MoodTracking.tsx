
import { useState } from "react";
import MoodTracker from "./MoodTracker";
import MoodChart from "./MoodChart";
import MoodStats from "./MoodStats";
import { useMoodData } from "@/hooks/useMoodData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PencilLine, ChartBar } from "lucide-react";

const MoodTracking = () => {
  const { 
    moodHistory, 
    loading, 
    averageMood, 
    totalEntries, 
    currentStreak,
    fetchMoodEntries 
  } = useMoodData();
  
  const [activeView, setActiveView] = useState<'track' | 'analyze'>('track');

  // Responsive design - on mobile show either tracking or analysis
  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <Tabs value={activeView} onValueChange={(val) => setActiveView(val as 'track' | 'analyze')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="track" className="flex items-center">
              <PencilLine className="mr-2 h-4 w-4" />
              Log Mood
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex items-center">
              <ChartBar className="mr-2 h-4 w-4" />
              Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="track" className="mt-0">
            <MoodTracker onSubmitSuccess={fetchMoodEntries} />
          </TabsContent>
          
          <TabsContent value="analyze" className="mt-0 space-y-6">
            <MoodChart moodHistory={moodHistory} loading={loading} />
            <MoodStats 
              averageMood={averageMood} 
              totalEntries={totalEntries} 
              currentStreak={currentStreak} 
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Desktop view with side-by-side display */}
      <div className="hidden md:grid gap-6 md:grid-cols-2">
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
    </div>
  );
};

export default MoodTracking;
