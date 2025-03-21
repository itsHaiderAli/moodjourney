
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Activity, Smile, TrendingUp, Award } from "lucide-react";

interface MoodStatsProps {
  averageMood: number;
  totalEntries: number;
  currentStreak: number;
}

const MoodStats = ({ averageMood, totalEntries, currentStreak }: MoodStatsProps) => {
  // Calculate progress percentages
  const moodProgress = (averageMood / 10) * 100;
  const streakProgress = Math.min(currentStreak * 10, 100); // 10% per day, max 100%
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="hover-scale">
          <CardHeader className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Avg Mood</CardTitle>
            </div>
            <p className="text-2xl font-bold">{averageMood}</p>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-4">
            <Progress value={moodProgress} className="h-1.5" />
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Entries</CardTitle>
            </div>
            <p className="text-2xl font-bold">{totalEntries}</p>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-4">
            <div className="text-xs text-muted-foreground">
              {totalEntries > 0 
                ? `Great job tracking your moods!` 
                : `Start logging your moods`}
            </div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="p-4">
            <div className="flex items-center space-x-2">
              <Smile className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Streak</CardTitle>
            </div>
            <p className="text-2xl font-bold">{currentStreak}</p>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-4">
            <Progress value={streakProgress} className="h-1.5" />
          </CardContent>
        </Card>
      </div>
      
      <Card className="hover-scale">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm">Mood Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="text-sm">
            {averageMood > 7 ? (
              <div className="flex items-center text-green-500">
                <Award className="h-4 w-4 mr-2" />
                <span>Your mood is above average. Keep it up!</span>
              </div>
            ) : averageMood > 5 ? (
              <div className="flex items-center text-amber-500">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Your mood is stable. Consider activities that boost your wellbeing.</span>
              </div>
            ) : (
              <div className="flex items-center text-blue-500">
                <Brain className="h-4 w-4 mr-2" />
                <span>Your mood could use a boost. Try self-care activities.</span>
              </div>
            )}
            
            {currentStreak > 3 && (
              <div className="mt-2 flex items-center text-primary">
                <Award className="h-4 w-4 mr-2" />
                <span>You're on a {currentStreak}-day streak! Consistency is key.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodStats;
